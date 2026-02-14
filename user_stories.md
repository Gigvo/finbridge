# FinBridge.id - MVP Technical Specification (Hybrid Architecture)

**Version:** 2.0 (AI-Integrated Hybrid Model)  
**Date:** October 2023  
**Status:** Ready for Development  

---

## 🏗 Architecture Overview

Sistem ini menggunakan pendekatan **Hybrid** untuk memisahkan tanggung jawab Frontend dan Backend secara jelas, sesuai persyaratan Hackathon:

1.  **Frontend (Next.js):** Menangani UI, Autentikasi User (via Firebase SDK), dan Upload File fisik (via Firebase Storage).
2.  **Backend (Node.js/Express):** Menangani Logika Bisnis, Integrasi AI (Gemini), dan penulisan data sensitif ke Database.
3.  **Services:**
    * **Auth:** Firebase Authentication.
    * **Database:** Cloud Firestore.
    * **Storage:** Cloud Storage for Firebase.
    * **AI:** Google Gemini API (untuk OCR & Scoring).

---

## 👤 User Stories & Functional Requirements

Berikut adalah daftar fitur dari perspektif pengguna dan endpoint API Backend yang terlibat.

### 1. Registrasi & Sinkronisasi Profil
*Tujuan: Memastikan data user tersimpan di Database Backend setelah login di Frontend.*

**US-01: Sinkronisasi Profil Pengguna**
> "Sebagai **Peminjam**, saya ingin **menyimpan data diri lengkap (Nama, NIK, Lokasi Usaha)** setelah mendaftar, agar profil saya tercatat di sistem backend."

* **Alur Teknis:**
    1.  Frontend melakukan registrasi user menggunakan **Firebase Auth SDK**.
    2.  Setelah sukses, Frontend mendapatkan `idToken` (JWT).
    3.  Frontend mengirim data profil tambahan ke Backend melalui API.
    4.  Backend memvalidasi token dan menyimpan data ke Firestore.
* **Acceptance Criteria:**
    * User berhasil login di aplikasi.
    * Data profil muncul di koleksi Firestore `users`.
* **🔌 API Endpoint:** `POST /api/v1/users/sync`

---

### 2. AI Credit Scoring (Main Process)
*Tujuan: Menggunakan AI untuk membaca bukti keuangan dan memberikan skor kredit.*

**US-02: Upload Bukti & Analisa AI**
> "Sebagai **Peminjam**, saya ingin **mengunggah foto tagihan (Listrik/E-wallet)** dan mendapatkan **hasil analisa otomatis**, agar saya tahu nilai kredit saya tanpa menunggu verifikasi manual."

* **Alur Teknis:**
    1.  User upload foto ke **Firebase Storage** via Frontend (mendapatkan `downloadURL`).
    2.  Frontend memanggil API Backend dengan membawa `downloadURL`.
    3.  Backend mengirim URL gambar ke **Gemini API** dengan prompt khusus.
    4.  Backend menerima hasil ekstraksi (JSON), menghitung skor, dan update Database.
* **Acceptance Criteria:**
    * Gemini berhasil mengekstrak nominal uang dari gambar.
    * Skor kredit user diperbarui di database.
    * Frontend menerima respon berisi skor baru dan rekomendasi.
* **🔌 API Endpoint:** `POST /api/v1/scoring/analyze`

**US-03: Dashboard Skor Kredit**
> "Sebagai **Peminjam**, saya ingin **melihat Skor Kredit dan Level Risiko saya**, agar saya paham posisi keuangan saya."

* **Alur Teknis:**
    * Frontend bisa mengambil data ini secara *real-time* via Firebase SDK (Read-Only) atau request ke Backend (jika perlu data olahan).
* **Acceptance Criteria:**
    * Menampilkan Skor (300-900), Risk Grade (A-E), dan Rekomendasi AI.

---

### 3. Marketplace Pinjaman
*Tujuan: Menghubungkan user yang sudah dinilai dengan mitra keuangan.*

**US-04: Katalog Mitra**
> "Sebagai **Peminjam**, saya ingin **melihat daftar Mitra Keuangan** yang tersedia, agar saya bisa memilih pemberi pinjaman."

* **Alur Teknis:**
    * Frontend meminta daftar mitra aktif ke Backend.
* **🔌 API Endpoint:** `GET /api/v1/partners`

**US-05: Pengajuan Pinjaman (Apply)**
> "Sebagai **Peminjam**, saya ingin **mengajukan pinjaman ke Mitra pilihan**, dengan menyertakan skor kredit saya."

* **Alur Teknis:**
    1.  User memilih mitra dan mengisi formulir pengajuan.
    2.  Frontend mengirim data ke Backend.
    3.  Backend memvalidasi apakah skor user memenuhi syarat mitra tersebut.
    4.  Backend menyimpan pengajuan ke koleksi `loan_applications`.
* **Acceptance Criteria:**
    * Pengajuan tersimpan dengan status `submitted`.
    * Validasi gagal jika skor terlalu rendah.
* **🔌 API Endpoint:** `POST /api/v1/loans/apply`

---

## 📜 API Contract (OpenAPI Specification)

Berikut adalah kontrak komunikasi antara Frontend (Next.js) dan Backend (Express). Frontend wajib menyertakan Header `Authorization: Bearer <firebase_token>` pada setiap request.

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "FinBridge.id API (Hybrid Architecture)",
    "description": "API Specification for FinBridge MVP. Frontend connects to Express Backend via REST, Backend connects to Gemini & Firestore.",
    "version": "2.0.0"
  },
  "servers": [
    {
      "url": "https://<your-cloud-run-url>/api/v1",
      "description": "Production Server (Cloud Run)"
    },
    {
      "url": "http://localhost:8080/api/v1",
      "description": "Local Development"
    }
  ],
  "components": {
    "securitySchemes": {
      "firebaseAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Firebase ID Token sent in Authorization header"
      }
    }
  },
  "paths": {
    "/users/sync": {
      "post": {
        "summary": "Sync User Profile",
        "description": "Save user profile to Firestore after Firebase Auth registration.",
        "security": [{ "firebaseAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["full_name", "nik", "infographic_location"],
                "properties": {
                  "full_name": { "type": "string" },
                  "nik": { "type": "string", "example": "3201123456789000" },
                  "infographic_location": { "type": "string", "example": "Sleman" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Profile synced successfully" },
          "401": { "description": "Unauthorized (Invalid Token)" }
        }
      }
    },
    "/scoring/analyze": {
      "post": {
        "summary": "AI Scoring Analysis (Main Process)",
        "description": "Send image URL to Backend. Backend calls Gemini AI to extract data and calculate score.",
        "security": [{ "firebaseAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["evidence_type", "image_url"],
                "properties": {
                  "evidence_type": { 
                    "type": "string", 
                    "enum": ["electricity_bill", "ewallet_history"] 
                  },
                  "image_url": { 
                    "type": "string", 
                    "description": "Public/Signed URL from Firebase Storage" 
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Analysis successful",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": { "type": "string", "example": "success" },
                    "ai_analysis": {
                      "type": "object",
                      "properties": {
                        "detected_amount": { "type": "number" },
                        "is_valid": { "type": "boolean" }
                      }
                    },
                    "new_credit_score": { "type": "integer", "example": 720 },
                    "risk_grade": { "type": "string", "example": "Low" },
                    "recommendation": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/partners": {
      "get": {
        "summary": "Get Partner Catalog",
        "description": "Retrieve list of active financial partners.",
        "security": [{ "firebaseAuth": [] }],
        "responses": {
          "200": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": { "type": "string" },
                      "name": { "type": "string" },
                      "interest_display": { "type": "string" },
                      "logo_url": { "type": "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/loans/apply": {
      "post": {
        "summary": "Apply for Loan",
        "description": "Submit loan application to a specific partner.",
        "security": [{ "firebaseAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["partner_id", "amount", "tenor"],
                "properties": {
                  "partner_id": { "type": "string" },
                  "amount": { "type": "number", "example": 5000000 },
                  "tenor": { "type": "integer", "example": 6 }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Application submitted" },
          "400": { "description": "Credit score too low or invalid input" }
        }
      }
    }
  }
}
