# NyawitAI - Plantation Intelligence Platform 🌴

NyawitAI adalah platform intelijen perkebunan kelapa sawit berbasis web yang menyediakan analisis kesehatan pohon secara otomatis menggunakan citra UAV (Unmanned Aerial Vehicle) / Drone. Platform ini memadukan model Machine Learning dengan analisis spasial untuk menghasilkan rekomendasi perawatan dan pemupukan yang presisi (Variable Rate Application - VRA).

## 🚀 Fitur Utama
- **Deteksi Kondisi Pohon (Tree Health Analysis)**: Mengidentifikasi kondisi kelapa sawit (Sehat, Kanopi Kecil, Menguning/Kekurangan Nutrisi, dan Mati/Hilang).
- **VRA Tools & Recommendations**: Memberikan rekomendasi perawatan otomatis berdasarkan tingkat keparahan zona/blok perkebunan.
- **Manajemen Laporan Terpadu**: Pembuatan dan pengunduhan laporan secara otomatis dalam format PDF dan Excel.
- **Notifikasi Real-time**: Menggunakan WebSocket untuk memberikan pembaruan seketika kepada pengguna terkait status analisis citra.
- **Multi-tenant Dashboard**: Panel khusus Admin dan Panel Pengguna biasa dengan pemisahan data yang aman.

## 🛠️ Teknologi yang Digunakan
**Backend:**
- Framework: FastAPI (Python)
- Database Relasional: MySQL (SQLAlchemy ORM, Alembic Migrations)
- In-Memory Cache & Message Broker: Redis
- Autentikasi: JWT (JSON Web Tokens)
- Pengolahan Data Laporan: Pandas, Openpyxl
- Manajemen Package: `uv` (Fast Python Package Installer)

**Frontend:**
- Framework: React 18 dengan Vite
- Bahasa: TypeScript
- Styling: Tailwind CSS & Framer Motion (Animasi)
- State Management & Fetching: React Query / Axios

---

## ⚙️ Persyaratan Sistem (Prerequisites)
Sebelum menjalankan aplikasi, pastikan sistem Anda telah terinstal:
1. **Python 3.10+**
2. **Node.js (v18 atau lebih baru)** & **npm**
3. **MySQL Server** (Bisa menggunakan Laragon / XAMPP)
4. **Redis Server** (Wajib berjalan di background)
5. **Git**

---

## 📂 Cara Instalasi dan Menjalankan Proyek Secara Lokal

Langkah-langkah berikut akan memandu Anda mereplikasi sistem secara penuh di lingkungan lokal (Localhost).

### 1. Kloning Repositori
```bash
git clone https://github.com/capstone-nyawit/capstone-pijak-analisis-sawit.git
cd capstone-pijak-analisis-sawit
```

### 2. Pengaturan Backend (FastAPI)
Buka terminal di folder root (`capstone-projek-pijak`) dan jalankan perintah berikut:

1. **Buat Virtual Environment dan Aktifkan:**
   ```bash
   # Di Windows (Command Prompt/PowerShell)
   python -m venv .venv
   .venv\Scripts\activate
   
   # Di Linux/Mac
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. **Instal Dependensi:**
   Pastikan Anda sudah menginstal `uv` atau gunakan `pip` bawaan.
   ```bash
   pip install -r requirements.txt
   ```

3. **Konfigurasi Environment Variables:**
   - Salin file contoh `.example.env` menjadi `.env`:
     ```bash
     cp .example.env .env
     ```
   - Buka file `.env` dan sesuaikan kredensial koneksi database MySQL, Redis, dan SMTP Email Anda.

4. **Jalankan Migrasi Database (Alembic):**
   Pastikan database MySQL Anda sudah menyala dan telah membuat database sesuai nama di `.env`.
   ```bash
   alembic upgrade head
   ```

5. **Jalankan Server Backend:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *Backend sekarang berjalan di `http://localhost:8000`. Dokumentasi API bisa diakses di `http://localhost:8000/docs`.*

---

### 3. Pengaturan Frontend (React + Vite)
Buka tab terminal baru dan arahkan ke dalam direktori `frontend`:

```bash
cd frontend
```

1. **Instal Dependensi Node Modules:**
   ```bash
   npm install
   ```

2. **Konfigurasi Environment Variables Frontend:**
   - Salin file `.example.env` menjadi `.env`:
     ```bash
     cp .example.env .env
     ```
   - Pastikan URL API di dalamnya mengarah ke backend lokal Anda (`VITE_API_URL=http://localhost:8000/api/v1`).

3. **Jalankan Server Development Frontend:**
   ```bash
   npm run dev
   ```
   *Frontend sekarang berjalan di `http://localhost:5173`. Buka URL tersebut di browser Anda.*

---

## 🧹 Script Bantuan
Jika Anda ingin mereset/mengosongkan seluruh isi database tabel dan isi *cache* Redis (Misal: untuk testing awal), Anda bisa menjalankan skrip berikut di root folder backend:
```bash
.venv\Scripts\python clear_db.py
```
*(Akan muncul konfirmasi prompt keamanan sebelum database dihapus)*

## 📝 Catatan Penting
- Pastikan Redis berjalan di latar belakang (port bawaan: `6379`), jika tidak, proses autentikasi dan WebSocket tidak akan berfungsi.
- Jika Anda menjumpai masalah koneksi CORS, periksa konfigurasi `BACKEND_CORS_ORIGINS` di file `.env` backend Anda.

---
**Dikembangkan oleh Tim Capstone Nyawit**
