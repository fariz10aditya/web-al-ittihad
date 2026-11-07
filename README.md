# Website & Backend CMS Resmi MA Al-Ittihad Tawangsari
**Madrasah Aliyah Berbasis Pesantren (MALTA)**  
*YPIS & Pondok Pesantren Al-Ittihad Tawangsari, Trowulan, Kabupaten Mojokerto, Jawa Timur*

---

## 📌 Identitas Resmi Lembaga (Tervalidasi Kemendikdasmen & Kemenag)
- **Nama Satuan Pendidikan:** MAS AL ITTIHAD (MA AL-ITTIHAD TAWANGSARI / MALTA)
- **NPSN:** `20584241` ([Verifikasi Kemendikdasmen](https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/20584241))
- **Status Akreditasi:** B (Badan Akreditasi Nasional - BAN-PDM)
- **SK Izin Operasional:** MAS/16.0033/2017 (TMT: 20 September 2017)
- **Kementerian Pembina:** Kementerian Agama Republik Indonesia (Kemenag)
- **Alamat Kampus:** Jl. Raden Wijaya No. 105, Dusun Tawangsari, Desa Tawangsari, Kec. Trowulan, Kab. Mojokerto, Jawa Timur 61362
- **Titik Koordinat Google Maps:** [-7.5118452, 112.3838882](https://maps.app.goo.gl/MxdgsESSReQPp4oW8)
- **Kontak WhatsApp Resmi:** `0857-0666-6126` (+62 857-0666-6126)
- **Email Resmi:** `maalit2000@gmail.com`
- **Tahun Berdiri:** MA didirikan tahun 2000 oleh Romo KH. Albazi Nawawi di lingkungan Ponpes Al-Ittihad (dirintis sejak 1956 oleh KH. Nawawi Ramli).
- **Tema Desain:** Biru Navy Elegan & Krem Lembut (*Navy Blue & Warm Cream*).

---

## 🚀 Cara Menjalankan Backend Server (1-Klik)

Website ini dilengkapi dengan **Backend Server REST API & Database JSON mandiri (`server.js`)**:
1. Cukup klik ganda (*double click*) file **`start-server.bat`** di folder project.
2. Server backend akan otomatis berjalan di **`http://localhost:3000`** dan langsung membuka Portal Admin di browser Anda!
3. **Akun Login Bawaan Admin:**
   - **Username:** `admin`
   - **Password:** `alittihad2026` *(bisa diganti kapan saja dari dashboard admin)*

---

## 🎛️ Fitur Back-End & CMS (Ubah Isi Website Sesuka Hati)

Melalui Portal Admin (`http://localhost:3000/admin.html`), Anda dapat mengubah seluruh isi website secara langsung:

1. **Pengaturan Profil & Identitas Madrasah:**
   - Ubah Nama Madrasah, NPSN, Akreditasi, SK Izin Operasional, Tahun Berdiri, dan Nama Pendiri.
   - Ubah Teks Sambutan Pimpinan Madrasah, Visi, dan Misi poin demi poin.
2. **Pengaturan Kontak & Google Maps:**
   - Ubah Nomor WhatsApp Hotline resmi, Email, Alamat Lengkap, Jam Kerja Layanan, dan Tautan Google Maps.
3. **Manajemen Berita & Prestasi:**
   - Tambah artikel berita baru lengkap dengan judul, kategori, tanggal, penulis, ringkasan, dan isi lengkap.
   - **Unggah foto sampul langsung** dari komputer/HP Anda dengan preview langsung.
   - Edit atau hapus berita yang sudah terbit.
4. **Manajemen Galeri Foto Asli (MALTA):**
   - Tambah foto kegiatan nyata sekolah/pesantren dengan **unggah file foto langsung**.
   - Berikan kategori filter (*Wisuda & Kelulusan, Kegiatan Santri, Pesantren & Masyayikh, Gebyar Seni & PHBI*), tanggal, dan caption.
   - Edit judul/keterangan foto atau hapus foto dari galeri.
5. **Pendaftar PPDB Online Real-Time:**
   - Setiap siswa yang mendaftar online di `ppdb.html` akan langsung masuk ke tabel database admin.
   - Ubah status pendaftar: `Pending`, `Terverifikasi`, `Diterima`, atau `Ditolak`.
   - Tombol 1-klik kirim pesan konfirmasi ke WhatsApp orang tua/calon siswa.
   - Cetak Kartu Bukti Pendaftaran Resmi.
   - Input pendaftar offline/manual langsung dari meja panitia.
   - **Ekspor data pendaftar ke file Excel / CSV**.
6. **Manajemen Ekstrakurikuler & FAQ:**
   - Tambah atau hapus jenis ekstrakurikuler, jadwal, dan kategori.
   - Tambah atau hapus pertanyaan dan jawaban seputar madrasah dan PPDB.
7. **Cadangan & Pemulihan Data (Backup & Restore):**
   - Download seluruh database website menjadi file `.json` dengan 1 klik.
   - Pulihkan data kapan saja dari file cadangan.

---

## 📂 Struktur File Project

```
web-al-ittihad/
├── api/
│   └── index.js             # Serverless API Handler (Vercel Ready)
├── assets/
│   ├── css/
│   │   └── style.css        # Custom CSS & Islamic Pattern Theme (Navy & Cream)
│   ├── images/
│   │   ├── logo.svg         # Logo Asli Vektor MA Al-Ittihad Tawangsari
│   │   ├── favicon.svg      # Favicon Vektor
│   │   ├── pattern.svg      # Ornamen Geometris Islami
│   │   ├── foto-*.jpg       # Foto-foto Asli Dokumentasi MALTA
│   │   └── uploads/         # Folder Penyimpanan Foto yang Diunggah Admin
│   └── js/
│       ├── api.js           # Client API Connector (Sync Live Server & Local Cache)
│       ├── main.js          # Public Pages Dynamic Controller
│       └── admin.js         # Admin Dashboard & CMS Controller
├── data/
│   └── database.json        # Database Utama (Config, Berita, Galeri, Ekskul, FAQ, PPDB)
├── admin.html               # Halaman Portal Admin & CMS
├── akademik.html            # Halaman Program Peminatan & Kurikulum
├── berita.html              # Halaman Kabar & Prestasi Santri
├── galeri.html              # Halaman Galeri Foto Asli Dokumentasi
├── index.html               # Halaman Beranda Utama
├── kontak.html              # Halaman Kontak & Lokasi Kampus
├── ppdb.html                # Halaman Pendaftaran Siswa Baru Online
├── server.js                # Node.js Native Backend & REST API Server
├── start-server.bat         # Launcher Windows 1-Klik untuk Menjalankan Server
└── vercel.json              # Konfigurasi Deploy Serverless Vercel
```

---

## 🌐 Deploy ke Vercel / Cloud

Project ini sudah dilengkapi dengan:
- `api/index.js` (Serverless Function Handler)
- `vercel.json` (Routing otomatis untuk static files dan API)

Cukup hubungkan repositori ke akun Vercel Anda, dan website serta API-nya akan langsung aktif online!
