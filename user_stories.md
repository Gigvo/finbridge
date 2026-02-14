# User Stories & Functional Requirements - FinBridge.id (MVP)

**Version:** 1.0 (Simplified MVP)  
**Database Strategy:** SQLite  
**Integration Strategy:** Manual Verification (Concierge Model)  

---

## 🎭 Actor: Peminjam (Borrower/UMKM)

### 1. Registrasi & Identitas
**US-01: Registrasi Akun**
> "Sebagai **Peminjam**, saya ingin **mendaftar akun menggunakan Email dan NIK**, agar data saya tercatat di sistem."
* **Acceptance Criteria:**
  * User dapat menginput Nama Lengkap, Email, No HP, Password, dan NIK (16 digit).
  * Sistem memvalidasi format email dan panjang NIK (validasi format saja, bukan ke Dukcapil).
  * Akun terbentuk dengan status `account_status: pending`.
* **API Endpoint:** `POST /api/auth/register`

**US-02: Upload Dokumen Identitas**
> "Sebagai **Peminjam**, saya ingin **mengunggah foto KTP dan Selfie**, agar admin dapat memverifikasi keaslian identitas saya."
* **Acceptance Criteria:**
  * User dapat mengunggah 2 file gambar (KTP & Selfie).
  * Sistem menyimpan file di folder lokal server dan path-nya di database.
  * User mendapat notifikasi "Sedang diverifikasi admin".
* **API Endpoint:** `POST /api/user/upload-identity`

---

### 2. Pengumpulan Data Alternatif (Scoring Data)
*Pada fase ini, user mengupload bukti visual, bukan koneksi API.*

**US-03: Upload Bukti Tagihan Utilitas**
> "Sebagai **Peminjam**, saya ingin **mengunggah foto struk/meteran Listrik atau Air**, sebagai bukti pengeluaran rutin."
* **Acceptance Criteria:**
  * User memilih kategori (Listrik/Air).
  * User mengunggah foto bukti bayar.
  * Status data tersimpan sebagai `verification_status: pending`.
* **API Endpoint:** `POST /api/data/upload-evidence` (Category: `electricity_bill`)

**US-04: Upload Bukti Keuangan Digital**
> "Sebagai **Peminjam**, saya ingin **mengunggah screenshot riwayat E-wallet (GoPay/OVO/ShopeePay)**, sebagai bukti cashflow usaha."
* **Acceptance Criteria:**
  * User memilih kategori E-wallet.
  * User mengunggah screenshot halaman profil/riwayat transaksi.
  * User melihat pesan bahwa data akan divalidasi manual dalam 1x24 jam.
* **API Endpoint:** `POST /api/data/upload-evidence` (Category: `ewallet_history`)

---

### 3. Credit Scoring & Dashboard
**US-05: Melihat Skor Kredit**
> "Sebagai **Peminjam**, saya ingin **melihat Skor Kredit dan Level Risiko saya**, setelah data saya diverifikasi admin."
* **Acceptance Criteria:**
  * Jika status verifikasi masih `pending`, skor tidak muncul (tampil pesan "Menunggu Verifikasi").
  * Jika status `verified`, skor (300-900) dan Grade (A-E) ditampilkan.
  * Skor dihitung otomatis berdasarkan angka yang diinput Admin dari bukti foto user.
* **API Endpoint:** `GET /api/scoring/dashboard`

**US-06: Rekomendasi Perbaikan**
> "Sebagai **Peminjam**, saya ingin **mendapat tips cara menaikkan skor**, agar saya bisa mendapatkan akses pinjaman yang lebih baik."
* **Acceptance Criteria:**
  * Menampilkan teks statis atau dinamis sederhana (misal: "Lengkapi bukti pembayaran listrik bulan lalu").
* **API Endpoint:** `GET /api/scoring/dashboard` (field: `recommendations`)

---

### 4. Marketplace Pinjaman
**US-07: Katalog Mitra (Lender)**
> "Sebagai **Peminjam**, saya ingin **melihat daftar Mitra (Koperasi/BPR)** yang tersedia, agar saya bisa memilih pemberi pinjaman yang cocok."
* **Acceptance Criteria:**
  * Menampilkan list mitra (Logo, Nama, Bunga, Syarat).
  * Data mitra diambil dari tabel `partners` di SQLite.
* **API Endpoint:** `GET /api/partners`

**US-08: Pengajuan Minat (Apply)**
> "Sebagai **Peminjam**, saya ingin **mengirimkan profil saya ke Mitra pilihan**, untuk mengajukan pinjaman."
* **Acceptance Criteria:**
  * User memilih Mitra, input Jumlah Pinjaman dan Tenor.
  * User memilih preferensi kontak (WhatsApp/Telepon).
  * Data tersimpan di tabel `loan_applications`.
  * User mendapat notifikasi "Pengajuan terkirim, Mitra akan menghubungi Anda".
* **API Endpoint:** `POST /api/loans/apply`

---

## 👮 Actor: Admin (Back-Office)
*Peran krusial dalam "Concierge MVP"*

### 1. Verifikasi Manual
**US-09: Verifikasi Identitas User**
> "Sebagai **Admin**, saya ingin **melihat foto KTP user dan membandingkannya dengan inputan NIK**, untuk mengaktifkan akun user."
* **Acceptance Criteria:**
  * Admin melihat list user `pending`.
  * Admin bisa klik `Approve` (ubah status jadi `verified`) atau `Reject`.

**US-10: Input Data Keuangan (Data Entry)**
> "Sebagai **Admin**, saya ingin **melihat gambar struk user dan menginput nominal Rupiah-nya**, agar sistem bisa menghitung skor."
* **Acceptance Criteria:**
  * Admin melihat gambar bukti (misal: Screenshot GoPay).
  * Admin mengetik angka (misal: 1.500.000) ke kolom `admin_verified_amount`.
  * Saat Admin menyimpan, status data berubah jadi `verified`.
  * Trigger: Sistem backend otomatis menghitung ulang skor user saat data ini disimpan.

---

## 🤝 Actor: Mitra (Lender)
*Versi MVP: Mitra hanya menerima notifikasi/data, proses lanjut di luar sistem.*

**US-11: Melihat Daftar Pelamar (Leads)**
> "Sebagai **Mitra**, saya ingin **melihat daftar user yang mengajukan pinjaman ke lembaga saya**, lengkap dengan skor kreditnya."
* **Acceptance Criteria:**
  * Mitra melihat tabel berisi: Nama, No HP, Skor FinBridge, Jumlah Pengajuan.
  * Mitra bisa mengubah status aplikasi menjadi `Approved in Principle` atau `Rejected`.
* **API Endpoint:** `GET /api/partner/applications`
