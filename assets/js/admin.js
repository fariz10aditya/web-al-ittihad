/**
 * MA AL-ITTIHAD TAWANGSARI (MALTA) - ADMIN BACKEND CMS CONTROLLER v2.0
 * Fully integrated with Node.js REST API & LocalStorage Fallback Cache
 */

window.AdminCMS = {
  config: {},
  ppdbList: [],
  newsList: [],
  galeriList: [],
  ekskulList: [],
  faqsList: [],
  isServerConnected: false,

  async init() {
    this.checkAuth();
    await this.updateServerStatusBadge();
    await this.loadAllData();
  },

  async updateServerStatusBadge() {
    const badge = document.getElementById('backendStatusIndicator');
    const dot = document.getElementById('backendStatusDot');
    const text = document.getElementById('backendStatusText');

    if (!badge || !dot || !text) return;

    try {
      const res = await window.API.checkServerStatus();
      if (res.online) {
        this.isServerConnected = true;
        dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse';
        text.textContent = '🟢 Backend Online (Database Server)';
        badge.className = 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm';
      } else {
        this.isServerConnected = false;
        dot.className = 'w-2.5 h-2.5 rounded-full bg-amber-500';
        text.textContent = '🟡 Mode Offline (Cache Lokal)';
        badge.className = 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-sm';
      }
    } catch (e) {
      this.isServerConnected = false;
      dot.className = 'w-2.5 h-2.5 rounded-full bg-amber-500';
      text.textContent = '🟡 Mode Offline (Cache Lokal)';
      badge.className = 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-sm';
    }
  },

  async loadAllData() {
    try {
      const siteData = await window.API.getSiteData();
      this.config = siteData.config || {};
      this.newsList = siteData.berita || [];
      this.galeriList = siteData.galeri || [];
      this.ekskulList = siteData.ekskul || [];
      this.faqsList = siteData.faqs || [];

      // Load PPDB list
      this.ppdbList = await window.API.getPpdb();

      this.renderAll();
    } catch (err) {
      console.error('Gagal memuat data dari API:', err);
      this.showToast('Gagal terhubung ke database. Memuat data cache lokal.', 'warning');
    }
  },

  checkAuth() {
    const isAuth = window.API.isLoggedIn();
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');

    if (isAuth) {
      if (loginSection) loginSection.classList.add('hidden');
      if (adminPanel) adminPanel.classList.remove('hidden');
    } else {
      if (loginSection) loginSection.classList.remove('hidden');
      if (adminPanel) adminPanel.classList.add('hidden');
    }
  },

  async login(user, pass) {
    const res = await window.API.login(user, pass);
    if (res.success) {
      this.showToast('Login berhasil! Selamat datang Admin MA Al-Ittihad.', 'success');
      this.checkAuth();
      await this.loadAllData();
      return true;
    } else {
      this.showToast(res.message || 'Username atau password salah.', 'error');
      return false;
    }
  },

  logout() {
    window.API.logout();
    this.showToast('Anda telah keluar dari sesi admin.', 'info');
    this.checkAuth();
  },

  async changePassword(oldPass, newPass, confirmPass) {
    if (!newPass || newPass.length < 6) {
      this.showToast('Password baru minimal 6 karakter!', 'error');
      return false;
    }
    if (newPass !== confirmPass) {
      this.showToast('Konfirmasi password tidak cocok!', 'error');
      return false;
    }

    const res = await window.API.changePassword(oldPass, newPass);
    if (res.success) {
      this.showToast('Password admin berhasil diubah!', 'success');
      return true;
    } else {
      this.showToast(res.message || 'Gagal mengubah password.', 'error');
      return false;
    }
  },

  renderAll() {
    this.renderStats();
    this.renderProfileForm();
    this.renderContactForm();
    this.renderPpdbTable();
    this.renderNewsTable();
    this.renderGaleriGrid();
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

    // Badges in sidebar
    const badgePpdb = document.getElementById('badgePpdbCount');
    if (badgePpdb) badgePpdb.textContent = totalPendaftar;

    const badgeGaleri = document.getElementById('badgeGaleriCount');
    if (badgeGaleri) badgeGaleri.textContent = this.galeriList.length;
  },

  /* ========================================================
     1. MANAJEMEN PPDB ONLINE
     ======================================================== */
  renderPpdbTable(filterStatus = 'all', searchQuery = '') {
    const tbody = document.getElementById('ppdbTableBody');
    if (!tbody) return;

    let items = [...this.ppdbList];

    if (filterStatus !== 'all') {
      items = items.filter(item => (item.status || 'Pending') === filterStatus);
    }

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
            Belum ada data pendaftar yang cocok dengan pencarian / filter.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map((p, idx) => {
      const status = p.status || 'Pending';
      let badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
      if (status === 'Terverifikasi') badgeClass = 'bg-blue-100 text-blue-800 border-blue-300';
      if (status === 'Diterima') badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
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
            <span class="text-[10px] text-brand-800 font-semibold">${p.jalur || 'Reguler'}</span>
          </td>
          <td class="py-3 px-3 text-xs text-slate-600">
            <span class="inline-block text-[11px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              ${p.sistemTinggal ? (p.sistemTinggal.includes('Boarding') ? 'Mukim (Asrama)' : 'Laju') : 'Mukim'}
            </span>
          </td>
          <td class="py-3 px-3 text-xs text-slate-700">
            <div>${p.namaWali || '-'}</div>
            <a href="https://wa.me/${p.noHp ? p.noHp.replace(/[^0-9]/g, '').replace(/^0/, '62') : ''}" target="_blank" class="text-brand-800 font-bold hover:underline flex items-center gap-1 text-[11px]">
              <i class="fa-brands fa-whatsapp text-emerald-600"></i> ${p.noHp || '-'}
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
          <td class="py-3 px-3 text-xs text-right space-x-1 shrink-0">
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

  async changePpdbStatus(regCode, newStatus) {
    const item = this.ppdbList.find(p => p.regCode === regCode);
    if (item) {
      item.status = newStatus;
      await window.API.updatePpdb(regCode, { status: newStatus });
      this.renderStats();
      this.showToast(`Status calon siswa ${item.nama} disimpan: ${newStatus}`, 'success');
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

Kami dari Panitia PPDB *MA AL-ITTIHAD TAWANGSARI (Trowulan - Mojokerto)* mengonfirmasi pendaftaran calon siswa dengan rincian:
• No. Registrasi: *${item.regCode}*
• Peminatan    : *${item.peminatan}*
• Jalur        : *${item.jalur}*
• Status       : *${item.status || 'Terverifikasi'}*

Mohon melengkapi berkas fisik (Fotokopi KK, Akta Kelahiran, dan SKL/Ijazah MTs/SMP terlegalisir) untuk verifikasi di Kantor Sekretariat MA Al-Ittihad Tawangsari.

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

  async deletePpdb(regCode) {
    const item = this.ppdbList.find(p => p.regCode === regCode);
    if (!item) return;

    if (confirm(`Apakah Anda yakin ingin menghapus data calon siswa "${item.nama}"?`)) {
      await window.API.deletePpdb(regCode);
      this.ppdbList = this.ppdbList.filter(p => p.regCode !== regCode);
      this.renderPpdbTable();
      this.renderStats();
      this.showToast('Data pendaftar berhasil dihapus dari database.', 'info');
    }
  },

  async addPpdbManual(data) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regCode = `PPDB-ALIT-${new Date().getFullYear()}-${randomSuffix}`;
    const tanggalDaftar = new Date().toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
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

    const res = await window.API.submitPpdb(newRecord);
    this.ppdbList.unshift(res.applicant || newRecord);
    this.renderPpdbTable();
    this.renderStats();
    this.showToast(`Pendaftar baru ${data.nama} berhasil disimpan ke database.`, 'success');
  },

  exportPpdbCsv() {
    if (this.ppdbList.length === 0) {
      this.showToast('Belum ada data pendaftar untuk diekspor!', 'error');
      return;
    }

    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel
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

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Data_PPDB_MA_Al_Ittihad_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    this.showToast('Data pendaftar berhasil diunduh dalam format Excel/CSV.', 'success');
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

  async saveProfileConfig(formData) {
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

    await window.API.saveConfig(this.config);
    this.showToast('Profil madrasah berhasil disimpan ke server database!', 'success');
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

  async saveContactConfig(formData) {
    this.config.waNumber = formData.get('waNumber').replace(/[^0-9]/g, '');
    this.config.email = formData.get('email');
    this.config.alamat = formData.get('alamat');
    this.config.jamOperasional = formData.get('jamOperasional');
    this.config.mapsLink = formData.get('mapsLink');

    await window.API.saveConfig(this.config);
    this.showToast('Kontak & lokasi berhasil disimpan ke server database!', 'success');
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
          <div class="flex items-center gap-2">
            ${n.image ? `<img src="${n.image}" class="w-10 h-8 object-cover rounded border border-slate-200 shrink-0">` : ''}
            <div>
              <strong class="text-slate-900 block leading-tight">${n.title}</strong>
              <span class="text-[11px] text-slate-500 line-clamp-1">${n.summary || ''}</span>
            </div>
          </div>
        </td>
        <td class="py-3 px-3 text-xs">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cream-100 text-brand-900 border border-cream-300">
            ${n.category || 'Umum'}
          </span>
        </td>
        <td class="py-3 px-3 text-xs text-slate-500">${n.author || 'Admin'}</td>
        <td class="py-3 px-3 text-xs text-right space-x-1 shrink-0">
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

  async addOrUpdateNews(data) {
    if (data.id) {
      await window.API.updateBerita(data.id, data);
      const idx = this.newsList.findIndex(n => n.id == data.id);
      if (idx !== -1) this.newsList[idx] = { ...this.newsList[idx], ...data };
      this.showToast('Berita berhasil diperbarui di server database!', 'success');
    } else {
      const newNews = {
        title: data.title,
        category: data.category,
        date: data.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        author: data.author || 'Humas MA Al-Ittihad',
        image: data.image || 'assets/images/foto-kelulusan-ma.jpg',
        summary: data.summary,
        content: data.content
      };
      const res = await window.API.addBerita(newNews);
      this.newsList.unshift(res.item || newNews);
      this.showToast('Berita baru berhasil diterbitkan!', 'success');
    }

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
    modal.querySelector('[name="author"]').value = item.author || '';
    modal.querySelector('[name="summary"]').value = item.summary || '';
    modal.querySelector('[name="content"]').value = item.content || '';
    modal.querySelector('[name="image"]').value = item.image || '';

    const preview = document.getElementById('newsPreviewImg');
    if (preview) preview.src = item.image || 'assets/images/foto-kelulusan-ma.jpg';

    document.getElementById('newsModalTitle').textContent = 'Edit Berita / Prestasi';
    modal.classList.remove('hidden');
  },

  async deleteNews(id) {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      await window.API.deleteBerita(id);
      this.newsList = this.newsList.filter(n => n.id != id);
      this.renderNewsTable();
      this.renderStats();
      this.showToast('Berita berhasil dihapus.', 'info');
    }
  },

  /* ========================================================
     5. MANAJEMEN GALERI FOTO ASLI
     ======================================================== */
  renderGaleriGrid() {
    const grid = document.getElementById('galeriAdminGrid');
    if (!grid) return;

    if (this.galeriList.length === 0) {
      grid.innerHTML = `<div class="col-span-full text-center py-8 text-slate-400 text-xs">Belum ada foto galeri terpasang.</div>`;
      return;
    }

    const catBadge = {
      'kelulusan': 'Wisuda & Kelulusan',
      'santri': 'Kegiatan Santri',
      'pesantren': 'Pesantren & Masyayikh',
      'kegiatan': 'Gebyar Seni & PHBI'
    };

    grid.innerHTML = this.galeriList.map(g => `
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group">
        <div>
          <div class="relative h-44 overflow-hidden bg-slate-100">
            <img src="${g.image || 'assets/images/foto-gedung-pesantren.jpg'}" alt="${g.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
            <span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-900/85 text-cream-200 backdrop-blur-sm border border-cream-400/30">
              ${catBadge[g.category] || g.category || 'Galeri'}
            </span>
          </div>
          <div class="p-3.5 space-y-1">
            <div class="text-[10px] text-slate-400 font-medium">${g.date || '-'}</div>
            <h4 class="text-xs font-bold text-slate-800 leading-snug line-clamp-2">${g.title}</h4>
            <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">${g.caption || ''}</p>
          </div>
        </div>

        <div class="p-3 pt-0 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
          <span class="text-[10px] text-slate-400 font-mono">ID: ${g.id}</span>
          <div class="space-x-1">
            <button onclick="window.AdminCMS.editGaleriModal(${g.id})" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]">
              <i class="fa-regular fa-pen-to-square mr-1"></i> Edit
            </button>
            <button onclick="window.AdminCMS.deleteGaleri(${g.id})" class="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[11px]">
              <i class="fa-regular fa-trash-can mr-1"></i> Hapus
            </button>
          </div>
        </div>
      </div>
    `).join('');
  },

  async addOrUpdateGaleri(data) {
    if (data.id) {
      await window.API.updateGaleri(data.id, data);
      const idx = this.galeriList.findIndex(g => g.id == data.id);
      if (idx !== -1) this.galeriList[idx] = { ...this.galeriList[idx], ...data };
      this.showToast('Foto galeri berhasil diperbarui di server database!', 'success');
    } else {
      const newGaleri = {
        title: data.title,
        category: data.category || 'kegiatan',
        image: data.image || 'assets/images/foto-wisuda-santri.jpg',
        caption: data.caption || '',
        date: data.date || new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      };
      const res = await window.API.addGaleri(newGaleri);
      this.galeriList.unshift(res.item || newGaleri);
      this.showToast('Foto galeri baru berhasil ditambahkan!', 'success');
    }

    this.renderGaleriGrid();
    this.renderStats();
  },

  editGaleriModal(id) {
    const item = this.galeriList.find(g => g.id == id);
    if (!item) return;

    const modal = document.getElementById('galeriModal');
    if (!modal) return;

    modal.querySelector('[name="id"]').value = item.id;
    modal.querySelector('[name="title"]').value = item.title;
    modal.querySelector('[name="category"]').value = item.category || 'kegiatan';
    modal.querySelector('[name="date"]').value = item.date || '';
    modal.querySelector('[name="caption"]').value = item.caption || '';
    modal.querySelector('[name="image"]').value = item.image || '';

    const preview = document.getElementById('galeriPreviewImg');
    if (preview) preview.src = item.image || 'assets/images/foto-wisuda-santri.jpg';

    document.getElementById('galeriModalTitle').textContent = 'Edit Foto Galeri Asli';
    modal.classList.remove('hidden');
  },

  async deleteGaleri(id) {
    if (confirm('Apakah Anda yakin ingin menghapus foto galeri ini?')) {
      await window.API.deleteGaleri(id);
      this.galeriList = this.galeriList.filter(g => g.id != id);
      this.renderGaleriGrid();
      this.renderStats();
      this.showToast('Foto galeri berhasil dihapus.', 'info');
    }
  },

  /* ========================================================
     6. MANAJEMEN EKSTRAKURIKULER
     ======================================================== */
  renderEkskulTable() {
    const tbody = document.getElementById('ekskulTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.ekskulList.map(e => `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="py-3 px-3 text-xs font-bold text-slate-800">${e.name}</td>
        <td class="py-3 px-3 text-xs">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 border border-slate-200">${e.category || '-'}</span>
        </td>
        <td class="py-3 px-3 text-xs text-slate-600">${e.schedule || '-'}</td>
        <td class="py-3 px-3 text-xs text-right">
          <button onclick="window.AdminCMS.deleteEkskul(${e.id})" class="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join('');
  },

  async addEkskul(data) {
    const item = {
      name: data.name,
      category: data.category,
      schedule: data.schedule || '-',
      desc: data.desc || '-'
    };
    const res = await window.API.addEkskul(item);
    this.ekskulList.push(res.item || item);
    this.renderEkskulTable();
    this.showToast('Ekstrakurikuler berhasil ditambahkan!', 'success');
  },

  async deleteEkskul(id) {
    if (confirm('Hapus kegiatan ekstrakurikuler ini?')) {
      await window.API.deleteEkskul(id);
      this.ekskulList = this.ekskulList.filter(e => e.id != id);
      this.renderEkskulTable();
      this.showToast('Ekstrakurikuler dihapus.', 'info');
    }
  },

  /* ========================================================
     7. MANAJEMEN FAQ / TANYA JAWAB
     ======================================================== */
  renderFaqTable() {
    const tbody = document.getElementById('faqTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.faqsList.map(f => `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="py-3 px-3 text-xs font-bold text-slate-900">${f.q}</td>
        <td class="py-3 px-3 text-xs text-slate-600 leading-relaxed">${f.a}</td>
        <td class="py-3 px-3 text-xs text-right">
          <button onclick="window.AdminCMS.deleteFaq(${f.id})" class="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join('');
  },

  async addFaq(data) {
    const item = { q: data.q, a: data.a };
    const res = await window.API.addFaq(item);
    this.faqsList.push(res.item || item);
    this.renderFaqTable();
    this.showToast('Pertanyaan FAQ berhasil ditambahkan!', 'success');
  },

  async deleteFaq(id) {
    if (confirm('Hapus tanya-jawab FAQ ini?')) {
      await window.API.deleteFaq(id);
      this.faqsList = this.faqsList.filter(f => f.id != id);
      this.renderFaqTable();
      this.showToast('FAQ dihapus.', 'info');
    }
  },

  /* ========================================================
     8. BACKUP & RESTORE
     ======================================================== */
  downloadBackupJson() {
    window.API.downloadBackup();
    this.showToast('File backup database (.json) sedang diunduh.', 'success');
  },

  async restoreBackupJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target.result);
        await window.API.restoreBackup(json);
        this.showToast('Database berhasil dipulihkan dari file backup!', 'success');
        await this.loadAllData();
      } catch (err) {
        this.showToast('File JSON backup tidak valid!', 'error');
      }
    };
    reader.readAsText(file);
  },

  /* ========================================================
     9. TOAST NOTIFICATIONS
     ======================================================== */
  showToast(message, type = 'info') {
    let container = document.getElementById('adminToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'adminToastContainer';
      container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const colors = {
      success: 'bg-emerald-700 text-white shadow-emerald-700/30',
      error: 'bg-red-600 text-white shadow-red-600/30',
      warning: 'bg-amber-600 text-white shadow-amber-600/30',
      info: 'bg-brand-900 text-cream-100 shadow-brand-900/30'
    };

    toast.className = `px-4 py-3 rounded-xl text-xs font-semibold shadow-lg pointer-events-auto transform translate-y-3 opacity-0 transition duration-300 flex items-center gap-2 ${colors[type] || colors.info}`;
    toast.innerHTML = `
      <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info')}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('translate-y-3', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.AdminCMS.init();
});
