# Sahabat Sehat 🥗 - AI Nutrition Tutor for Coastal Elementary Students

**Sahabat Sehat** adalah aplikasi web edukasi gizi interaktif berbasis Kurikulum Merdeka (PJOK Fase C - Kelas 6 SD) untuk siswa di wilayah pesisir. Aplikasi ini memanfaatkan multimodal Gemini API untuk menganalisis foto tabel Informasi Nilai Gizi pada makanan kemasan, memandu siswa menghitung kekurangan nutrisi secara mandiri, dan memberikan rekomendasi protein dari hasil laut lokal.

Aplikasi ini dibangun dan di-deploy sebagai bagian dari **Cloud Run AI Challenge**.

---

## 🛠️ Tech Stack & Arsitektur

- **AI Model**: Google Gemini API (Multimodal Flash) via Google AI Studio dengan *custom System Instructions*.
- **Hosting & Compute**: Google Cloud Run (Serverless container deployment).
- **Security & Secret Management**: Google Cloud Secret Manager untuk mengamankan `GEMINI_API_KEY`.
- **Database & State**: Cloud Firestore untuk penyimpanan riwayat percakapan (*multi-turn*) dan isolasi data pengguna.
- **Authentication**: Firebase Authentication untuk otentikasi pengguna secara aman.

---

## 🚀 Langkah Deployment (Deployment Steps)

Aplikasi ini di-deploy menggunakan alur terintegrasi Google AI Studio dan Google Cloud Run:

### 1. Konfigurasi di Google AI Studio
1. Buka project prompt **Sahabat Sehat** di Google AI Studio.
2. Pastikan model yang dipilih mendukung input gambar (Gemini Flash) dan teks *System Instructions* telah terpasang.
3. Klik tombol **Publikasikan (Publish)** di kanan atas untuk membuat web app unik dan layanan Cloud Run terkait.

### 2. Pelabelan Layanan di Google Cloud Run (Wajib Challenge)
Agar aplikasi terverifikasi oleh sistem evaluasi otomatis:
1. Buka [Google Cloud Console](https://console.cloud.google.com/) -> Masuk ke menu **Cloud Run**.
2. Pilih layanan `sahabat-sehat`.
3. Klik tombol **Label** di bagian atas tabel layanan.
4. Tambahkan label baru:
   - **Key**: `dev-tutorial`
   - **Value**: `cloud-run-ai-challenge`
5. Klik **Simpan (Save)** untuk menerapkan revisi layanan.

### 3. Keamanan Firestore & Secret Manager
1. Pastikan Firestore Security Rules membatasi akses per user ID:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
