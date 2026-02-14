# Finbridge Backend

Backend ada di folder `backend/` (terpisah dari Next.js di `frontend/`).

## Firebase

Backend ini memakai **Firebase Admin** untuk verifikasi Firebase ID token yang dikirim frontend.
Autentikasi dilakukan via **Firebase Phone Auth (OTP)** di frontend.

## Menjalankan

```powershell
cd backend
copy .env.example .env
npm install
npm run dev
```

Default jalan di `http://localhost:4010` (lihat `backend/.env`).

## Konfigurasi Firebase Admin

Pilih salah satu:

- Set env var `GOOGLE_APPLICATION_CREDENTIALS` ke path JSON service account, atau
- Isi `.env` dengan `FIREBASE_SERVICE_ACCOUNT_JSON`.

## Gemini API

Tambahkan `GEMINI_API_KEY` di `.env` backend.

### 1) Ekstrak nilai tagihan dari foto struk

`POST /api/ai/receipt-amount`

Endpoint ini:
- menerima gambar (base64 JSON atau upload file form-data),
- mengirim gambar ke Gemini,
- menyimpan hasil `amount` ke Firestore collection `receiptExtractions`,
- mengembalikan `receiptId` + hasil ekstraksi.

Auth: wajib header `Authorization: Bearer <Firebase ID Token>`.

Body JSON:

```json
{
  "mimeType": "image/jpeg",
  "imageBase64": "<BASE64_TANPA_PREFIX_DATAURL>",
  "currency": "IDR"
}
```

Atau multipart/form-data (Postman):
- key `image` (type: File)
- key `currency` (type: Text, optional)

Response (contoh):

```json
{ "receiptId": "abc123", "amount": 125000, "currency": "IDR", "confidence": 0.86, "notes": "" }
```

Catatan: `imageBase64` adalah base64 murni (tanpa `data:image/...;base64,`).

### 2) KPI UMKM dari sinyal non-konvensional

`POST /api/ai/umkm-kpi`

Body JSON (contoh):

```json
{
  "umkm": { "name": "Toko Sumber Rejeki", "sector": "retail" },
  "signals": {
    "bills": { "onTimePaymentRate": 0.92, "avgMonthlyAmount": 3500000 },
    "ewallet": { "monthlyTxCount": 420, "monthlyGmv": 18000000, "chargebackRate": 0.003 },
    "stability": { "revenueVolatility": 0.18 }
  },
  "currency": "IDR"
}
```

## Postman Import

- Import OpenAPI: [docs/openapi.json](docs/openapi.json)
- Import Postman Collection: [docs/postman_collection.json](docs/postman_collection.json)

Set variable `baseUrl` ke `http://localhost:4010` (atau sesuai `PORT`).
