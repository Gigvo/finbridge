# Finbridge Backend

Backend ada di folder `backend/` (terpisah dari Next.js di `frontend/`).

## Auth (Firebase)

Backend ini pakai **Firebase Auth** (email+password) dan **Firestore** untuk menyimpan profil + mapping `nik`.

- Register: `POST /api/auth/register` dengan `nik`, `email`, `password`
- Login helper: `POST /api/auth/login` dengan `nik` (mengembalikan `email`)
- Me: `GET /api/auth/me` dengan header `Authorization: Bearer <Firebase ID Token>`

Catatan: Verifikasi password dilakukan oleh **Firebase Client SDK** (di frontend), bukan oleh backend.

## Menjalankan

```powershell
cd backend
copy .env.example .env
npm install
npm run dev
```

Default jalan di `http://localhost:4000`.

## Contoh request

## Konfigurasi Firebase Admin

Pilih salah satu:

- Set env var `GOOGLE_APPLICATION_CREDENTIALS` ke path JSON service account, atau
- Isi `.env` dengan `FIREBASE_SERVICE_ACCOUNT_JSON`.

## Contoh request

Register:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"nik\":\"1234567890123456\",\"email\":\"user@example.com\",\"password\":\"password123\"}"
```

Login:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"nik\":\"1234567890123456\"}"

Me (butuh Firebase ID token dari frontend):

```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>"
```
```

## Storage

- Profil user: Firestore collection `users/{uid}`
- Index NIK: Firestore collection `nikIndex/{nik}` -> `{ uid, email, createdAt }`

## Gemini API

Tambahkan `GEMINI_API_KEY` di `.env` backend.

### 1) Ekstrak nilai tagihan dari foto struk

`POST /api/ai/receipt-amount`

Body JSON:

```json
{
  "mimeType": "image/jpeg",
  "imageBase64": "<BASE64_TANPA_PREFIX_DATAURL>",
  "currency": "IDR"
}
```

Response (contoh):

```json
{ "amount": 125000, "currency": "IDR", "confidence": 0.86, "notes": "" }
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
