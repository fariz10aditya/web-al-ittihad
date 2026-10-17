/**
 * MA AL-ITTIHAD TAWANGSARI - ADMIN BACKEND CMS CONTROLLER
 * Full Management System for School Profile, PPDB, News, Extracurriculars, & Contacts
 */

// Storage Keys
const KEYS = {
  AUTH: 'ma_admin_auth',
  PASS: 'ma_admin_password',
  CONFIG: 'ma_site_config',
  PPDB: 'ma_alittihad_all_reg',
  NEWS: 'ma_site_news',
  EKSKUL: 'ma_site_ekskul',
  FAQS: 'ma_site_faqs'
};

// Default Initial Data
const DEFAULT_CONFIG = {
  namaMadrasah: 'MAS AL ITTIHAD',
  namaLengkap: 'MA AL-ITTIHAD TAWANGSARI',
  npsn: '20584241',
  akreditasi: 'B',
  skOperasional: 'MAS/16.0033/2017',
  tmtOperasional: '20-09-2017',
  tahunBerdiriMA: '2000',
  tahunBerdiriPonpes: '1956',
  pendiriMA: 'KH. Albazi Nawawi',
  pendiriPonpes: 'KH. Nawawi Ramli',
  naungan: 'Yayasan Pendidikan Islam dan Sosial (YPIS) & Pondok Pesantren Al-Ittihad',
  kementerian: 'Kementerian Agama Republik Indonesia',
  sambutan: 'MA Al-Ittihad Tawangsari hadir di jantung sejarah Trowulan, Mojokerto, sebagai wadah pendidikan menengah atas yang memadukan keunggulan Kurikulum Nasional, Program Tahfidzul Qur’an, dan pendalaman Kitab Kuning Salaf di lingkungan Pondok Pesantren Al-Ittihad.',
  visi: 'Terwujudnya Generasi Santri yang Qur\'ani, Berakhlakul Karimah, Unggul dalam Prestasi Intelektual, serta Mandiri dalam Berkehidupan Bermasyarakat.',
  misi: [
    'Menyelenggarakan pendidikan Islam yang memadukan kurikulum Kemenag dengan pembelajaran Al-Qur\'an dan kitab kuning.',
    'Membiasakan pengamalan akhlak mulia dan adab santri dalam pergaulan sehari-hari berlandaskan ajaran Ahlussunnah wal Jama\'ah.',
    'Meningkatkan mutu proses belajar mengajar sains, teknologi, dan bahasa asing (Arab & Inggris) secara aktif.',
    'Membekali peserta didik dengan keterampilan hidup (life skills), kewirausahaan kreatif, dan kemandirian mental.'
  ],
  waNumber: '6285706666126',
  email: 'maalit2000@gmail.com',
  alamat: 'Jl. Raden Wijaya No. 105, Dusun Tawangsari, Desa Tawangsari, Kec. Trowulan, Kab. Mojokerto, Jawa Timur 61362',
  jamOperasional: 'Sabtu - Kamis: 07.30 - 14.30 WIB (Jum\'at Libur)',
  mapsLink: 'https://maps.app.goo.gl/MxdgsESSReQPp4oW8',
  lat: '-7.5118452',
  lng: '112.3838882'
};

const DEFAULT_NEWS = [
  {
    id: 1,
    title: 'Siswa MA Al-Ittihad Tawangsari Raih Juara Lomba Cipta Menu Kuliner Masak Ikan Tingkat Kabupaten Mojokerto',
    category: 'Prestasi',
    date: '10 Februari 2026',
    author: 'Humas MA Al-Ittihad',
    summary: 'Tim santri vokasi tata boga MA Al-Ittihad berhasil mengharumkan madrasah dengan kreasi kuliner olahan ikan bergizi tinggi dan inovatif.',
    content: 'Prestasi membanggakan kembali diraih santri MA Al-Ittihad Tawangsari dalam ajang Lomba Cipta Menu Masak Ikan tingkat Kabupaten Mojokerto. Melalui bimbingan instruktur vokasi tata boga dan kewirausahaan madrasah, para santri mampu menyajikan menu inovatif kaya gizi yang memikat dewan juri.'
  },
  {
    id: 2,
    title: 'Santri MA Al-Ittihad Sabet Juara Lomba Menulis Puisi Pelajar Tingkat Kabupaten',
    category: 'Sastra & Seni',
    date: '28 Januari 2026',
    author: 'Sanggar Sastra Al-Ittihad',
    summary: 'Karya sastra puitis santri yang mengangkat kearifan lokal Trowulan dan kecintaan pada Rasulullah SAW sukses memukau dewan juri se-Mojokerto.',
    content: 'Bakat kepenulisan santri MA Al-Ittihad kembali terbukti. Lewat puisi bertajuk kemuliaan akhlak dan jejak peradaban sejarah Nusantara, santri berhasil merebut gelar juara dalam ajang lomba penulisan puisi tingkat Kabupaten Mojokerto.'
  },
  {
    id: 3,
    title: 'Haflah Khotmil Qur\'an & Wisuda Tahfidz Santri Pondok Pesantren Al-Ittihad',
    category: 'Tahfidz & Diniyah',
    date: '15 Januari 2026',
    author: 'Pengasuh Tahfidz',
    summary: 'Momen sakral pengukuhan santri penghafal Al-Qur\'an dan kelulusan santri diniyah disaksikan masyayikh dan wali santri.',
    content: 'Sebanyak puluhan santri MA dan Pondok Pesantren Al-Ittihad dikukuhkan dalam acara Haflah Khotmil Qur\'an dan Wisuda Tahfidz. Suasana haru dan khidmat menyelimuti saat para santri membacakan ayat suci dan menerima syahadah kelulusan.'
  },
  {
    id: 4,
    title: 'Kelancaran Pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK) di Lab Madrasah',
    category: 'Akademik',
    date: '05 Desember 2025',
    author: 'Tim IT Madrasah',
    summary: 'Pelaksanaan ANBK dan Asesmen Bakat Minat berjalan tertib dan sukses dengan fasilitas komputer dan internet berkecepatan tinggi.',
    content: 'Didukung sarana laboratorium komputer yang representatif, seluruh siswa peserta ANBK MA Al-Ittihad Tawangsari dapat mengerjakan soal asesmen dengan lancar tanpa hambatan teknis jaringan.'
  }
];

const DEFAULT_EKSKUL = [
  { id: 1, name: 'Seni Rebana / Hadrah Banjari', category: 'Keagamaan', schedule: 'Senin & Kamis malam', desc: 'Pelatihan vokal sholawat dan ketukan rebana klasik kontemporer.' },
  { id: 2, name: 'Pimpinan Komisariat IPNU - IPPNU', category: 'Organisasi', schedule: 'Sabtu siang', desc: 'Kaderisasi kepemimpinan pelajar Nahdliyyin dan musyawarah keorganisasian.' },
  { id: 3, name: 'Gerakan Pramuka Gugus Depan', category: 'Organisasi', schedule: 'Jum\'at sore', desc: 'Pendidikan kepanduan, kedisiplinan, pioneering, dan survival kemah santri.' },
  { id: 4, name: 'Qira\'ah & Tilawatil Qur\'an', category: 'Keagamaan', schedule: 'Selasa sore', desc: 'Bimbingan lagu maqam tilawah untuk persiapan ajang MTQ kabupaten/provinsi.' },
  { id: 5, name: 'Teater Pelajar & Cipta Puisi', category: 'Seni', schedule: 'Rabu sore', desc: 'Latihan seni peran sastra, deklamasi puisi, dan penulisan karya kreatif.' },
  { id: 6, name: 'Futsal & Bola Voli Santri', category: 'Olahraga', schedule: 'Ahad pagi & sore', desc: 'Kebugaran jasmani dan pembinaan tim olahraga untuk Liga Santri Mojokerto.' },
  { id: 7, name: 'Kreasi Kuliner & Tata Boga', category: 'Vokasi', schedule: 'Sabtu pagi', desc: 'Pelatihan pengolahan pangan bernilai ekonomi dan resep inovasi.' },
  { id: 8, name: 'Laboratorium IT & Desain Grafis', category: 'Vokasi', schedule: 'Rabu sore', desc: 'Penguasaan aplikasi perkantoran, desain grafis, dan fotografi madrasah.' }
];

const DEFAULT_FAQS = [
  { id: 1, q: 'Apakah santri MA Al-Ittihad wajib mondok / tinggal di asrama?', a: 'Tidak wajib. MA Al-Ittihad menyediakan dua sistem: Boarding (Santri Mukim di asrama pesantren Al-Ittihad) dan Non-Boarding (Siswa laju/pulang-pergi dari rumah).' },
  { id: 2, q: 'Apakah ijazah MA Al-Ittihad diakui untuk masuk PTN favorit?', a: 'Sangat diakui! MA Al-Ittihad memiliki NPSN resmi 20584241, Terakreditasi B oleh BAN-PDM Kemenag. Lulusan berhak mendaftar SNBP, SNBT, SPAN-PTKIN, dan beasiswa internasional seperti Universitas Al-Azhar Kairo.' },
  { id: 3, q: 'Apa saja berkas persyaratan yang harus disiapkan untuk PPDB?', a: 'Fotokopi KK, Akta Kelahiran, Ijazah/SKL MTs/SMP terlegalisir, pas foto 3x4 (3 lembar), bukti registrasi online, dan piagam prestasi (jika ada).' },
  { id: 4, q: 'Apakah ada beasiswa untuk anak yatim atau penghafal Al-Qur\'an?', a: 'Ya, tersedia beasiswa tahfidz Al-Qur\'an (keringanan biaya sesuai juz hafalan), beasiswa prestasi juara kelas/lomba, dan santunan pendidikan santri yatim dhuafa dari YPIS Al-Ittihad.' }
];

// Helper to Load & Save to LocalStorage
function getStored(key, defaultVal) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Error saving to storage:', e);
  }
}

// Global CMS App State
window.AdminCMS = {
  config: null,
  ppdbList: [],
  newsList: [],
  ekskulList: [],
  faqsList: [],

  init() {
    // Initialize or hydrate data from localStorage
    this.config = getStored(KEYS.CONFIG, DEFAULT_CONFIG);
    this.ppdbList = getStored(KEYS.PPDB, []);
    this.newsList = getStored(KEYS.NEWS, DEFAULT_NEWS);
    this.ekskulList = getStored(KEYS.EKSKUL, DEFAULT_EKSKUL);
    this.faqsList = getStored(KEYS.FAQS, DEFAULT_FAQS);

    // Save defaults if first time
    if (!localStorage.getItem(KEYS.CONFIG)) setStored(KEYS.CONFIG, this.config);
    if (!localStorage.getItem(KEYS.NEWS)) setStored(KEYS.NEWS, this.newsList);
    if (!localStorage.getItem(KEYS.EKSKUL)) setStored(KEYS.EKSKUL, this.ekskulList);
    if (!localStorage.getItem(KEYS.FAQS)) setStored(KEYS.FAQS, this.faqsList);

    // Check Authentication
    this.checkAuth();
  },

  checkAuth() {
    const isAuth = localStorage.getItem(KEYS.AUTH) === 'true';
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');

    if (isAuth) {
      if (loginSection) loginSection.classList.add('hidden');
      if (adminPanel) adminPanel.classList.remove('hidden');
      this.renderAll();
    } else {
      if (loginSection) loginSection.classList.remove('hidden');
      if (adminPanel) adminPanel.classList.add('hidden');
    }
  },

  login(user, pass) {
    const currentPass = localStorage.getItem(KEYS.PASS) || 'alittihad2026';
    if (user.trim() === 'admin' && pass === currentPass) {
      localStorage.setItem(KEYS.AUTH, 'true');
      this.showToast('Login berhasil! Selamat datang Admin MA Al-Ittihad.', 'success');
      this.checkAuth();
      return true;
    } else {
      this.showToast('Username atau password keliru. Default: admin / alittihad2026', 'error');
      return false;
    }
  },

  logout() {
    localStorage.removeItem(KEYS.AUTH);
    this.showToast('Anda telah keluar dari sesi admin.', 'info');
    this.checkAuth();
  },

  changePassword(oldPass, newPass, confirmPass) {
    const currentPass = localStorage.getItem(KEYS.PASS) || 'alittihad2026';
    if (oldPass !== currentPass) {
      this.showToast('Password lama tidak cocok!', 'error');
      return false;
    }
    if (!newPass || newPass.length < 6) {
      this.showToast('Password baru minimal 6 karakter!', 'error');
      return false;
    }
    if (newPass !== confirmPass) {
      this.showToast('Konfirmasi password tidak cocok!', 'error');
      return false;
    }

    localStorage.setItem(KEYS.PASS, newPass);
    this.showToast('Password berhasil diperbarui!', 'success');
    return true;
  },

  renderAll() {
    this.renderStats();
    this.renderProfileForm();
    this.renderContactForm();
    this.renderPpdbTable();
    this.renderNewsTable();
    this.renderEkskulTable();
    this.renderFaqTable();
  },

  renderStats() {
    const totalPendaftar = this.ppdbList.length;
    const verified = this.ppdbList.filter(p => p.status === 'Terverifikasi' || p.status === 'Diterima').length;
    const pending = this.ppdbList.filter(p => !p.status || p.status === 'Pending').length;

    const elTotal = document.getElementById('statTotalPpdb');
    const elVerified = document.getElementById('statVerifiedPpdb');
    const elPending = document.getElementById('statPendingPpdb');
    const elNews = document.getElementById('statTotalNews');

    if (elTotal) elTotal.textContent = totalPendaftar;
    if (elVerified) elVerified.textContent = verified;
    if (elPending) elPending.textContent = pending;
    if (elNews) elNews.textContent = this.newsList.length;
  },

  /* ========================================================
     1. MANAJEMEN PPDB ONLINE
     ======================================================== */
  renderPpdbTable(filterStatus = 'all', searchQuery = '') {
    const tbody = document.getElementById('ppdbTableBody');
    if (!tbody) return;

    let items = [...this.ppdbList];

    // Filter status
    if (filterStatus !== 'all') {
      items = items.filter(item => (item.status || 'Pending') === filterStatus);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => 
        (item.nama && item.nama.toLowerCase().includes(q)) ||
        (item.regCode && item.regCode.toLowerCase().includes(q)) ||
        (item.asalSekolah && item.asalSekolah.toLowerCase().includes(q))
      );
    }

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-8 text-slate-400 text-xs">
            <i class="fa-solid fa-inbox text-2xl block mb-2 text-slate-300"></i>
            Belum ada data pendaftar yang cocok dengan filter.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map((p, idx) => {
      const status = p.status || 'Pending';
      let badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
      if (status === 'Terverifikasi') badgeClass = 'bg-blue-100 text-blue-800 border-blue-300';
      if (status === 'Diterima') badgeClass = 'bg-brand-100 text-brand-900 border-brand-300';
      if (status === 'Ditolak') badgeClass = 'bg-red-100 text-red-800 border-red-300';

      return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100">
          <td class="py-3 px-3 text-xs font-mono font-bold text-brand-900">
            ${p.regCode || 'REG-' + (idx + 1)}
            <span class="block text-[10px] text-slate-400 font-sans font-normal">${p.tanggalDaftar || '-'}</span>
          </td>
          <td class="py-3 px-3">
            <strong class="text-xs text-slate-900 block">${p.nama || '-'}</strong>
            <span class="text-[11px] text-slate-500">${p.jenisKelamin || 'Laki-laki'}</span>
          </td>
          <td class="py-3 px-3 text-xs text-slate-700">
            ${p.asalSekolah || '-'}
          </td>
          <td class="py-3 px-3 text-xs">
            <span class="font-bold text-slate-800 block">${p.peminatan || 'MIPA'}</span>
            <span class="text-[10px] text-brand-800">${p.jalur || 'Reguler'}</span>
          </td>
          <td class="py-3 px-3 text-xs text-slate-600">
            <span class="inline-block text-[11px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              ${p.sistemTinggal ? (p.sistemTinggal.includes('Boarding') ? 'Mukim (Boarding)' : 'Laju (Non-Boarding)') : 'Mukim'}
            </span>
          </td>
          <td class="py-3 px-3 text-xs text-slate-700">
            <div>${p.namaWali || '-'}</div>
            <a href="https://wa.me/${p.noHp ? p.noHp.replace(/^0/, '62') : ''}" target="_blank" class="text-brand-800 font-bold hover:underline flex items-center gap-1 text-[11px]">
              <i class="fa-brands fa-whatsapp text-gold-500"></i> ${p.noHp || '-'}
            </a>
          </td>
          <td class="py-3 px-3 text-xs">
            <select onchange="window.AdminCMS.changePpdbStatus('${p.regCode}', this.value)" 
                    class="text-[11px] font-semibold px-2 py-1 rounded-lg border ${badgeClass} outline-none cursor-pointer">
              <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>⏳ Pending</option>
              <option value="Terverifikasi" ${status === 'Terverifikasi' ? 'selected' : ''}>🔍 Terverifikasi</option>
              <option value="Diterima" ${status === 'Diterima' ? 'selected' : ''}>✅ Diterima</option>
              <option value="Ditolak" ${status === 'Ditolak' ? 'selected' : ''}>❌ Ditolak</option>
            </select>
          </td>
          <td class="py-3 px-3 text-xs text-right space-x-1">
            <button onclick="window.AdminCMS.chatPpdbWa('${p.regCode}')" title="Kirim Chat WA Konfirmasi" class="p-1.5 rounded-lg bg-cream-100 text-brand-800 hover:bg-cream-200 border border-cream-300">
              <i class="fa-brands fa-whatsapp"></i>
            </button>
            <button onclick="window.AdminCMS.printPpdbSlip('${p.regCode}')" title="Cetak Kartu Registrasi" class="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300">
              <i class="fa-solid fa-print"></i>
            </button>
            <button onclick="window.AdminCMS.deletePpdb('${p.regCode}')" title="Hapus Data Pendaftar" class="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  changePpdbStatus(regCode, newStatus) {
    const item = this.ppdbList.find(p => p.regCode === regCode);
    if (item) {
      item.status = newStatus;
      setStored(KEYS.PPDB, this.ppdbList);
      this.renderStats();
      this.showToast(`Status calon siswa ${item.nama} diubah menjadi: ${newStatus}`, 'success');
    }
  },

  chatPpdbWa(regCode) {
    const item = this.ppdbList.find(p => p.regCode === regCode);
    if (!item || !item.noHp) {
      this.showToast('Nomor WhatsApp pendaftar tidak ditemukan!', 'error');
      return;
    }
    const cleanPhone = item.noHp.replace(/[^0-9]/g, '').replace(/^0/, '62');
    const text = 
`Assalamu'alaikum Wr. Wb.
Yth. Bapak/Ibu Wali Santri dari *${item.nama}*,

Kami dari Panitia PPDB *MA AL-ITTIHAD TAWANGSARI (Trowulan - Mojokerto)* mengonfirmasi pendaftaran dengan:
• No. Registrasi: *${item.regCode}*
• Jurusan       : *${item.peminatan}*
• Status        : *${item.status || 'Terverifikasi'}*

Mohon mempersiapkan kelengkapan berkas fisik (Fotokopi KK, Akta Kelahiran, dan SKL MTs/SMP) untuk diverifikasi di Kantor Sekretariat MA Al-Ittihad.

Wassalamu'alaikum Wr. Wb.
_Panitia PPDB MA Al-Ittihad Tawangsari_`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  },

  printPpdbSlip(regCode) {
    const item = this.ppdbList.find(p => p.regCode === regCode);
    if (!item) return;

    localStorage.setItem('ma_alittihad_last_reg', JSON.stringify(item));
    if (window.printRegistrationCard) {
      window.printRegistrationCard();
    } else {
      window.print();
    }
  },

  deletePpdb(regCode) {
    const item = this.ppdbList.find(p => p.regCode === regCode);
    if (!item) return;

    if (confirm(`Apakah Anda yakin ingin menghapus data calon siswa "${item.nama}"?`)) {
      this.ppdbList = this.ppdbList.filter(p => p.regCode !== regCode);
      setStored(KEYS.PPDB, this.ppdbList);
      this.renderPpdbTable();
      this.renderStats();
      this.showToast('Data pendaftar berhasil dihapus.', 'info');
    }
  },

  addPpdbManual(data) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regCode = `PPDB-ALIT-${new Date().getFullYear()}-${randomSuffix}`;
    const tanggalDaftar = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const newRecord = {
      regCode,
      tanggalDaftar,
      nama: data.nama,
      nisn: data.nisn || '-',
      nik: data.nik || '-',
      jenisKelamin: data.jenisKelamin || 'Laki-laki',
      asalSekolah: data.asalSekolah,
      peminatan: data.peminatan || 'MIPA',
      jalur: data.jalur || 'Reguler',
      sistemTinggal: data.sistemTinggal || 'Boarding (Asrama Pesantren)',
      namaWali: data.namaWali,
      noHp: data.noHp,
      alamat: data.alamat,
      status: 'Terverifikasi'
    };

    this.ppdbList.unshift(newRecord);
    setStored(KEYS.PPDB, this.ppdbList);
    this.renderPpdbTable();
    this.renderStats();
    this.showToast(`Pendaftar baru ${data.nama} berhasil ditambahkan manual.`, 'success');
  },

  exportPpdbCsv() {
    if (this.ppdbList.length === 0) {
      this.showToast('Belum ada data pendaftar untuk diexport!', 'error');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "No Registrasi,Tanggal,Nama Siswa,Jenis Kelamin,NISN,Asal Sekolah,Peminatan,Jalur,Status Asrama,Nama Wali,No HP,Alamat,Status\n";

    this.ppdbList.forEach(p => {
      const row = [
        `"${p.regCode || ''}"`,
        `"${p.tanggalDaftar || ''}"`,
        `"${p.nama || ''}"`,
        `"${p.jenisKelamin || ''}"`,
        `"${p.nisn || ''}"`,
        `"${p.asalSekolah || ''}"`,
        `"${p.peminatan || ''}"`,
        `"${p.jalur || ''}"`,
        `"${p.sistemTinggal || ''}"`,
        `"${p.namaWali || ''}"`,
        `"${p.noHp || ''}"`,
        `"${(p.alamat || '').replace(/"/g, '""')}"`,
        `"${p.status || 'Pending'}"`
      ];
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_PPDB_MA_Al_Ittihad_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('Data pendaftar berhasil di-download ke format CSV / Excel.', 'success');
  },

  /* ========================================================
     2. MANAJEMEN PROFIL & IDENTITAS MADRASAH
     ======================================================== */
  renderProfileForm() {
    const f = document.getElementById('profileConfigForm');
    if (!f) return;

    f.querySelector('[name="namaMadrasah"]').value = this.config.namaMadrasah || '';
    f.querySelector('[name="namaLengkap"]').value = this.config.namaLengkap || '';
    f.querySelector('[name="npsn"]').value = this.config.npsn || '';
    f.querySelector('[name="akreditasi"]').value = this.config.akreditasi || '';
    f.querySelector('[name="skOperasional"]').value = this.config.skOperasional || '';
    f.querySelector('[name="tahunBerdiriMA"]').value = this.config.tahunBerdiriMA || '';
    f.querySelector('[name="pendiriMA"]').value = this.config.pendiriMA || '';
    f.querySelector('[name="sambutan"]').value = this.config.sambutan || '';
    f.querySelector('[name="visi"]').value = this.config.visi || '';
    f.querySelector('[name="misi"]').value = (this.config.misi || []).join('\n');
  },

  saveProfileConfig(formData) {
    this.config.namaMadrasah = formData.get('namaMadrasah');
    this.config.namaLengkap = formData.get('namaLengkap');
    this.config.npsn = formData.get('npsn');
    this.config.akreditasi = formData.get('akreditasi');
    this.config.skOperasional = formData.get('skOperasional');
    this.config.tahunBerdiriMA = formData.get('tahunBerdiriMA');
    this.config.pendiriMA = formData.get('pendiriMA');
    this.config.sambutan = formData.get('sambutan');
    this.config.visi = formData.get('visi');
    this.config.misi = formData.get('misi').split('\n').filter(line => line.trim().length > 0);

    setStored(KEYS.CONFIG, this.config);
    this.showToast('Profil madrasah berhasil diperbarui!', 'success');
  },

  /* ========================================================
     3. MANAJEMEN KONTAK & LOKASI
     ======================================================== */
  renderContactForm() {
    const f = document.getElementById('contactConfigForm');
    if (!f) return;

    f.querySelector('[name="waNumber"]').value = this.config.waNumber || '';
    f.querySelector('[name="email"]').value = this.config.email || '';
    f.querySelector('[name="alamat"]').value = this.config.alamat || '';
    f.querySelector('[name="jamOperasional"]').value = this.config.jamOperasional || '';
    f.querySelector('[name="mapsLink"]').value = this.config.mapsLink || '';
  },

  saveContactConfig(formData) {
    this.config.waNumber = formData.get('waNumber').replace(/[^0-9]/g, '');
    this.config.email = formData.get('email');
    this.config.alamat = formData.get('alamat');
    this.config.jamOperasional = formData.get('jamOperasional');
    this.config.mapsLink = formData.get('mapsLink');

    setStored(KEYS.CONFIG, this.config);
    this.showToast('Kontak & lokasi berhasil diperbarui!', 'success');
  },

  /* ========================================================
     4. MANAJEMEN BERITA & PRESTASI
     ======================================================== */
  renderNewsTable() {
    const tbody = document.getElementById('newsTableBody');
    if (!tbody) return;

    if (this.newsList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-400 text-xs">Belum ada berita terbit.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.newsList.map(n => `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="py-3 px-3 text-xs text-slate-500 font-mono">${n.date || '-'}</td>
        <td class="py-3 px-3 text-xs">
          <strong class="text-slate-900 block">${n.title}</strong>
          <span class="text-[11px] text-slate-500 line-clamp-1">${n.summary || ''}</span>
        </td>
        <td class="py-3 px-3 text-xs">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cream-100 text-brand-900 border border-cream-300">
            ${n.category || 'Umum'}
          </span>
        </td>
        <td class="py-3 px-3 text-xs text-slate-500">${n.author || 'Admin'}</td>
        <td class="py-3 px-3 text-xs text-right space-x-1">
          <button onclick="window.AdminCMS.editNewsModal(${n.id})" class="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button onclick="window.AdminCMS.deleteNews(${n.id})" class="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join('');
  },

  addOrUpdateNews(data) {
    if (data.id) {
      // Edit existing
      const idx = this.newsList.findIndex(n => n.id == data.id);
      if (idx !== -1) {
        this.newsList[idx] = { ...this.newsList[idx], ...data };
        this.showToast('Berita berhasil diperbarui!', 'success');
      }
    } else {
      // Create new
      const newNews = {
        id: Date.now(),
        title: data.title,
        category: data.category,
        date: data.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        author: data.author || 'Humas MA Al-Ittihad',
        summary: data.summary,
        content: data.content
      };
      this.newsList.unshift(newNews);
      this.showToast('Berita baru berhasil ditambahkan!', 'success');
    }

    setStored(KEYS.NEWS, this.newsList);
    this.renderNewsTable();
    this.renderStats();
  },

  editNewsModal(id) {
    const item = this.newsList.find(n => n.id == id);
    if (!item) return;

    const modal = document.getElementById('newsModal');
    if (!modal) return;

    modal.querySelector('[name="id"]').value = item.id;
    modal.querySelector('[name="title"]').value = item.title;
    modal.querySelector('[name="category"]').value = item.category;
    modal.querySelector('[name="summary"]').value = item.summary;
    modal.querySelector('[name="content"]').value = item.content;

    document.getElementById('newsModalTitle').textContent = 'Edit Berita / Prestasi';
    modal.classList.remove('hidden');
  },

  deleteNews(id) {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      this.newsList = this.newsList.filter(n => n.id != id);
      setStored(KEYS.NEWS, this.newsList);
      this.renderNewsTable();
      this.renderStats();
      this.showToast('Berita berhasil dihapus.', 'info');
    }
  },

  /* ========================================================
     5. MANAJEMEN EKSTRAKURIKULER
     ======================================================== */
  renderEkskulTable() {
    const tbody = document.getElementById('ekskulTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.ekskulList.map(e => `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="py-3 px-3 text-xs font-bold text-slate-800">${e.name}</td>
        <td class="py-3 px-3 text-xs">
          <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
            ${e.category}
          </span>
        </td>
        <td class="py-3 px-3 text-xs text-slate-500">${e.schedule || '-'}</td>
        <td class="py-3 px-3 text-xs text-slate-600">${e.desc || '-'}</td>
        <td class="py-3 px-3 text-xs text-right">
          <button onclick="window.AdminCMS.deleteEkskul(${e.id})" class="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join('');
  },

  addEkskul(data) {
    const newE = {
      id: Date.now(),
      name: data.name,
      category: data.category,
      schedule: data.schedule,
      desc: data.desc
    };
    this.ekskulList.push(newE);
    setStored(KEYS.EKSKUL, this.ekskulList);
    this.renderEkskulTable();
    this.showToast(`Ekstrakurikuler ${data.name} berhasil ditambahkan!`, 'success');
  },

  deleteEkskul(id) {
    if (confirm('Hapus kegiatan ekstrakurikuler ini?')) {
      this.ekskulList = this.ekskulList.filter(e => e.id != id);
      setStored(KEYS.EKSKUL, this.ekskulList);
      this.renderEkskulTable();
      this.showToast('Ekstrakurikuler berhasil dihapus.', 'info');
    }
  },

  /* ========================================================
     6. MANAJEMEN FAQ
     ======================================================== */
  renderFaqTable() {
    const tbody = document.getElementById('faqTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.faqsList.map(f => `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="py-3 px-3 text-xs font-bold text-slate-900">${f.q}</td>
        <td class="py-3 px-3 text-xs text-slate-600">${f.a}</td>
        <td class="py-3 px-3 text-xs text-right">
          <button onclick="window.AdminCMS.deleteFaq(${f.id})" class="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join('');
  },

  addFaq(data) {
    const newF = {
      id: Date.now(),
      q: data.q,
      a: data.a
    };
    this.faqsList.push(newF);
    setStored(KEYS.FAQS, this.faqsList);
    this.renderFaqTable();
    this.showToast('Pertanyaan FAQ berhasil ditambahkan!', 'success');
  },

  deleteFaq(id) {
    if (confirm('Hapus pertanyaan FAQ ini?')) {
      this.faqsList = this.faqsList.filter(f => f.id != id);
      setStored(KEYS.FAQS, this.faqsList);
      this.renderFaqTable();
      this.showToast('FAQ berhasil dihapus.', 'info');
    }
  },

  /* ========================================================
     7. BACKUP & RESTORE DATA (JSON)
     ======================================================== */
  downloadBackupJson() {
    const fullBackup = {
      app: 'MA_AL_ITTIHAD_CMS_BACKUP',
      exportedAt: new Date().toISOString(),
      config: this.config,
      ppdbList: this.ppdbList,
      newsList: this.newsList,
      ekskulList: this.ekskulList,
      faqsList: this.faqsList
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `Backup_MA_Al_Ittihad_${new Date().toISOString().slice(0,10)}.json`);
    dlAnchorElem.click();
    this.showToast('File backup sistem (.json) berhasil di-download.', 'success');
  },

  restoreBackupJson(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.config) setStored(KEYS.CONFIG, parsed.config);
        if (parsed.ppdbList) setStored(KEYS.PPDB, parsed.ppdbList);
        if (parsed.newsList) setStored(KEYS.NEWS, parsed.newsList);
        if (parsed.ekskulList) setStored(KEYS.EKSKUL, parsed.ekskulList);
        if (parsed.faqsList) setStored(KEYS.FAQS, parsed.faqsList);

        this.init();
        this.showToast('Restore data berhasil dari file cadangan!', 'success');
      } catch (err) {
        this.showToast('Format file JSON cadangan tidak valid!', 'error');
      }
    };
    reader.readAsText(file);
  },

  resetDefaults() {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset konfigurasi ke data bawaan awal? Data pendaftar PPDB tidak akan terhapus.')) {
      setStored(KEYS.CONFIG, DEFAULT_CONFIG);
      setStored(KEYS.NEWS, DEFAULT_NEWS);
      setStored(KEYS.EKSKUL, DEFAULT_EKSKUL);
      setStored(KEYS.FAQS, DEFAULT_FAQS);
      this.init();
      this.showToast('Pengaturan berhasil direset ke standar awal.', 'info');
    }
  },

  /* Toast Notification */
  showToast(message, type = 'info') {
    let container = document.getElementById('adminToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'adminToastContainer';
      container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    let bg = 'bg-slate-900 text-white';
    let icon = 'fa-circle-info';
    if (type === 'success') {
      bg = 'bg-brand-900 text-cream-100 shadow-brand-900/30';
      icon = 'fa-circle-check';
    } else if (type === 'error') {
      bg = 'bg-red-700 text-white shadow-red-700/30';
      icon = 'fa-circle-exclamation';
    }

    toast.className = `${bg} px-4 py-3 rounded-xl shadow-xl text-xs flex items-center gap-2.5 transition transform translate-y-2 opacity-0 duration-300`;
    toast.innerHTML = `<i class="fa-solid ${icon} text-base"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

// Initialize when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  window.AdminCMS.init();
});
