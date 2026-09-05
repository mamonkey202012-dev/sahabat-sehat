# 🐟 Sahabat Sehat — Asisten Belajar Gizi Pesisir Berbasis Multimodal AI

[![Google Cloud Run](https://img.shields.io/badge/Google%20Cloud-Run%20(Serverless)-4285F4?logo=google-cloud&logoColor=white)](https://cloud.google.com/run)
[![Gemini Flash Multimodal](https://img.shields.io/badge/AI-Gemini%20Flash%20Vision-00897B?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Firebase Authentication](https://img.shields.io/badge/Auth-Firebase%20Google%20Sign--In-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Cloud Firestore](https://img.shields.io/badge/Database-Firestore%20RBAC%20Security-FF8F00?logo=firebase&logoColor=white)](https://firebase.google.com/docs/firestore)
[![Kurikulum Merdeka](https://img.shields.io/badge/Kurikulum%20Merdeka-PJOK%20Fase%20C%20Kelas%206-059669)](https://kurikulum.kemdikbud.go.id/)
[![Challenge](https://img.shields.io/badge/Google%20Cloud%20Run-AI%20Challenge%202026-6366F1)](https://cloud.google.com/)

> **Sahabat Sehat** adalah prototipe aplikasi web AI multimodal ramah anak untuk pembelajaran PJOK Kelas 6 SD (Fase C — Kurikulum Merdeka) di kawasan pesisir. Aplikasi ini menggabungkan analisis citra label kemasan via **Gemini Vision**, penalaran defisit gizi mandiri (*scaffolding*), rekomendasi pangan laut lokal, serta portal pemantauan kelas berbasis **Role-Based Access Control (RBAC)** di **Google Cloud Run**.

Proyek ini dibangun dan dideploy untuk **Google Cloud Run AI Challenge** dengan tagar `#AccelerateAIwithCloudRun`.

---

## 📌 Latar Belakang Masalah & Pendekatan Edukasi

Banyak siswa sekolah dasar gemar mengonsumsi makanan ringan kemasan tanpa memahami makna angka pada tabel **Informasi Nilai Gizi**. Pada Capaian Pembelajaran PJOK Fase C (Buku SIBI Kelas 6 SD) dan pedoman *Isi Piringku* Kemenkes, peserta didik diharapkan mampu menganalisis pola makan sehat dan bergizi seimbang.

Di sisi lain, kawasan pesisir Indonesia kaya akan sumber daya hewani laut bernutrisi tinggi (seperti ikan kembung, tongkol, dan cumi) yang sering kali belum dimanfaatkan secara optimal oleh siswa sebagai penyeimbang camilan harian mereka.

**Pendekatan Pedagogis Sahabat Sehat:**
1. **Non-Judgmental Tutor**: AI bertindak sebagai pemandu bersahabat yang tidak mencela atau melarang camilan siswa, melainkan mengajak mereka menjadi "detektif gizi".
2. **Scaffolding Cognition**: Siswa ditantang menghitung selisih defisit nutrisi secara mandiri terhadap patokan ideal 1x makan (~30% Angka Kecukupan Gizi / AKG).
3. **Kontekstualisasi Pangan Lokal**: Mengarahkan pemenuhan gizi melalui pangan laut pesisir yang mudah didapat, murah, dan kaya zat gizi mikro/makro (misalnya kandungan Omega-3 ikan kembung yang melampaui ikan impor).

---

## 🌟 Fitur Utama (Arsitektur Dua Peran)

### 1. Ruang Siswa (Petualang Gizi Cilik)
* **Langkah 1: Input Makanan & Unggah Kemasan**  
  Siswa menuliskan nama makanan (misal: *makanan mi instan*) dan mengunggah foto tabel nilai gizi pada kemasan produk.
* **Langkah 2: Ekstraksi Gizi Multimodal**  
  Gemini Flash API membaca teks gambar secara presisi (OCR Vision) dan membandingkan % AKG (Karbohidrat, Lemak, Natrium, Protein) terhadap ambang batas ideal 30% AKG.
* **Langkah 3: Hitung Defisit Gizi Interaktif (Mandiri)**  
  Siswa diajak berlatih berhitung melalui dialog penalaran AI:  
  $$\text{Kekurangan \%} = \text{Target 30\%} - \text{Kandungan Kemasan \%}$$  
  Sistem memberikan apresiasi langsung (*positive feedback*) begitu siswa berhasil menjawab tepat.
* **Langkah 4: Rekomendasi Pangan Laut & Jurnal Piringku**  
  AI menyajikan 3 alternatif lauk/sayur pesisir lokal (seperti *Ikan Kembung Bakar Segar*, *Tumis Cumi Bumbu Pesisir*, atau *Singkong Kukus*) untuk melengkapi defisit gizi. Siswa menuliskan refleksi dan menyimpannya ke basis data.
* **Dasbor Jurnal Piring Sehatku**  
  Halaman riwayat evaluasi gizi yang tersimpan secara terisolasi per akun siswa di Firestore.
* **Materi Pengayaan Gizi**  
  Infografis Pedoman *Isi Piringku* Kemenkes (1/3 Pokok, 1/3 Sayur, 1/6 Lauk Laut, 1/6 Buah) dan komparasi ilmiah Omega-3 Ikan Kembung (1,86 g) vs Salmon (1,60 g).

---

### 2. Portal Guru & Pembina UKS (Pakar Pemantauan PJOK)
* **Autentikasi Kredensial Pendidik (RBAC)**  
  Akses diproteksi dengan PIN resmi sekolah (`GURU2026`) atau tombol *Masuk Cepat Guru PJOK (Ibu Ratna, S.Pd.)* untuk memastikan akun siswa tidak dapat melihat data agregat kelas.
* **Dasbor Analitik Agregat Nutrisi Kelas**  
  Menampilkan metrik komprehensif: total sesi belajar, rasio partisipasi siswa, identifikasi zat gizi yang paling sering defisit di rombel, serta persentase kepatuhan komplementasi pangan pesisir.
* **Sistem Peringatan Dini (Alert Natrium Tinggi)**  
  Pencatatan otomatis ketika siswa menganalisis camilan dengan kandungan natrium tinggi ($\ge 50\%$ AKG) guna memfasilitasi tindak lanjut pembinaan oleh pihak UKS.
* **Tabel Log Terstruktur Firestore (`nutrition_logs`)**  
  Audit data historis per sesi lengkap dengan bilah pencarian siswa/makanan, filter zat gizi, dan tombol **Ekspor CSV Kelas** untuk pelaporan berkala.

---

## 🛠️ Pemanfaatan Layanan Google Cloud & Firebase

| Layanan | Peran & Implementasi Teknis |
| :--- | :--- |
| **Google Cloud Run** | Menjalankan kontainer aplikasi web (*Vite + Node/TypeScript*) secara *serverless* dengan fitur *autoscaling* cepat, isolasi proses aman, dan diberi label wajib `dev-tutorial=cloud-run-ai-challenge`. |
| **Gemini Flash API** | Mesin pemrosesan citra multimodal untuk mengekstrak informasi tabel nilai gizi dari foto label kemasan secara instan, serta menggerakkan dialog tutor ramah anak dan perumusan rekomendasi kontekstual. |
| **Firebase Authentication** | Menyediakan autentikasi Google Sign-In yang terverifikasi dan aman tanpa perlu mengelola penyimpanan kata sandi manual pada peladen. |
| **Cloud Firestore** | Basis data dokumen NoSQL dengan aturan keamanan tingkat baris (*Row-Level Security / RBAC*) yang memisahkan jurnal privat siswa dengan koleksi pengawasan rombel guru. |
| **Secret Management** | Seluruh variabel kunci rahasia (`GEMINI_API_KEY`, konfigurasi kredensial) disuntikkan secara aman di sisi *backend* Cloud Run tanpa pernah diekspos ke klien. |

---

## 🔒 Konfigurasi Keamanan (Firestore Security Rules)

Aplikasi menerapkan pemisahan hak akses data secara ketat antara akun siswa dan akun pendidik pada berkas `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Default: Tolak seluruh akses yang tidak diotorisasi
    match /{document=**} {
      allow read, write: if false;
    }

    // 1. Isolasi Data Siswa: Hanya pemilik UID yang dapat membaca & menulis jurnalnya sendiri
    match /users/{userId}/food_logs/{logId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 2. Akses Pendidik Terverifikasi (RBAC): Hanya peran guru yang berhak membaca log agregat kelas
    match /nutrition_logs/{logId} {
      allow read: if request.auth != null && request.auth.token.role == 'teacher';
      allow write: if request.auth != null;
    }
  }
}

---

## 📁 Struktur Direktori Repositori

```text
sahabat-sehat/
├── publik/                     # Aset statis dan ikon aplikasi
├── server/                     # Backend API & integrasi layanan Google
│   └── index.ts                # Server handler Cloud Run & endpoint Gemini
├── sumber/                     # Kode antarmuka aplikasi (Frontend UI)
│   ├── components/             # Komponen UI (Formulir, Tabel, Dialog Detektif)
│   ├── lib/                    # Firebase Auth & inisialisasi Firestore
│   ├── App.tsx                 # Routing utama & State Management
│   └── main.tsx                # Entrypoint aplikasi web
├── .env.example                # Contoh format variabel lingkungan (Aman)
├── .gitignore                  # Proteksi berkas sensitif dari pelacakan git
├── firestore.rules             # Aturan keamanan database Firestore (RBAC)
├── package.json                # Dependensi proyek
├── server.ts                   # Entrypoint server Cloud Run
├── tsconfig.json               # Konfigurasi TypeScript
└── vite.config.ts              # Konfigurasi bundling Vite

💻 Menjalankan di Lingkungan Lokal
1. Prasyarat
Node.js (versi 18 ke atas)

Proyek Firebase aktif (Firebase Auth & Firestore diaktifkan)

Kunci API Gemini dari Google AI Studio

2. Kloning & Instalasi
Bash
git clone [https://github.com/mamonkey202012-dev/sahabat-sehat.git](https://github.com/mamonkey202012-dev/sahabat-sehat.git)
cd sahabat-sehat
npm install
3. Konfigurasi Variabel Lingkungan
Salin berkas template lingkungan:

Bash
cp .env.example .env.local
Lengkapi isian pada .env.local:

Cuplikan kode
GEMINI_API_KEY=AIzaSy...
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project-id
VITE_FIREBASE_STORAGE_BUCKET=project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
4. Menjalankan Server Pengembangan
Bash
npm run dev
Aplikasi dapat diakses melalui peramban di http://localhost:5173.

🚀 Panduan Deployment ke Google Cloud Run
Proses peluncuran kontainer aplikasi ke infrastruktur serverless Google Cloud:

Bash
# 1. Konfigurasi Google Cloud Project aktif
gcloud config set project [ID-PROJECT-GCP-ANDA]

# 2. Deploy kontainer dari direktori proyek
gcloud run deploy sahabat-sehat \
  --source . \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="[KUNCI-API-GEMINI-ANDA]"

# 3. Sematkan label resmi untuk Google Cloud Run AI Challenge
gcloud run services update sahabat-sehat \
  --region asia-southeast2 \
  --update-labels dev-tutorial=cloud-run-ai-challenge
Verifikasi Label: Pastikan label dev-tutorial: cloud-run-ai-challenge telah terverifikasi pada panel layanan Cloud Run di Google Cloud Console.

🔑 Kredensial Uji Coba Demo (Bagi Juri & Penguji)
Untuk mengevaluasi seluruh fitur pengawasan guru tanpa registrasi akun baru:

Peran Siswa: Klik kartu Siswa (Kelas 6 SD) > Masuk dengan akun Google.

Peran Guru: Klik kartu Guru / Pembina UKS > Masukkan PIN Otorisasi: GURU2026

(Atau gunakan tombol langsung: Masuk Cepat sebagai Guru PJOK (Ibu Ratna, S.Pd.)).

🔗 Tautan Submisi Proyek
Aplikasi Live di Cloud Run: [https://sahabat-sehat-mamonkey.a.run.app](https://sahabat-sehat-sdn007li.ai.studio)

Dokumentasi & Walkthrough (Google Sites): [https://sites.google.com/view/sahabat-sehat](https://sites.google.com/guru.sd.belajar.id/sahabat-sehat-sdn007li/halaman-muka)

Repositori GitHub: [https://github.com/mamonkey202012-dev/sahabat-sehat](https://github.com/mamonkey202012-dev/sahabat-sehat.git)

Postingan Media Sosial (LinkedIn): [https://www.linkedin.com/in/mamonto-sengkey](https://lnkd.in/p/dXiwSeew)

📄 Lisensi
Didistribusikan di bawah Lisensi MIT. Terbuka dan bebas digunakan untuk kebutuhan peningkatan kualitas pendidikan nutrisi di sekolah dasar pesisir Indonesia.
