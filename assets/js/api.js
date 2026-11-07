/**
 * MA AL-ITTIHAD TAWANGSARI (MALTA) - API CLIENT CONTROLLER
 * Seamless bridge between Frontend, Admin CMS, and Backend REST Server
 */

(function (window) {
  'use strict';

  // Base API configuration
  const API_BASE = '/api';
  const STORAGE_KEYS = {
    AUTH_TOKEN: 'ma_admin_token',
    AUTH_USER: 'ma_admin_user',
    SITE_CONFIG: 'ma_site_config',
    BERITA: 'ma_site_news',
    GALERI: 'ma_site_galeri',
    EKSKUL: 'ma_site_ekskul',
    FAQS: 'ma_site_faqs',
    PPDB: 'ma_alittihad_all_reg'
  };

  let isServerOnline = null;

  async function request(endpoint, options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json'
    };

    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, config);
      isServerOnline = true;
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || `Request failed with status ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      // If server unreachable, mark as offline
      if (err.name === 'TypeError' || err.message.includes('Failed to fetch')) {
        isServerOnline = false;
      }
      throw err;
    }
  }

  const API = {
    // ----------------------------------------------------
    // Server Health Check
    // ----------------------------------------------------
    async checkServerStatus() {
      try {
        const res = await fetch(`${API_BASE}/status`, { method: 'GET', cache: 'no-cache' });
        if (res.ok) {
          isServerOnline = true;
          return { online: true, data: await res.json() };
        }
      } catch (e) {
        isServerOnline = false;
      }
      return { online: false };
    },

    isOnline() {
      return isServerOnline === true;
    },

    // ----------------------------------------------------
    // Authentication
    // ----------------------------------------------------
    async login(username, password) {
      try {
        const data = await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username, password })
        });
        if (data.success && data.token) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
          localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(data.user));
          return { success: true, user: data.user };
        }
        return { success: false, message: data.message || 'Login gagal' };
      } catch (err) {
        // Fallback for offline / demo mode
        if (username === 'admin' && (password === 'alittihad2026' || password === localStorage.getItem('ma_admin_password'))) {
          const mockUser = { username: 'admin', role: 'Super Admin', name: 'Operator MA Al-Ittihad (Offline)' };
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'offline_token_' + Date.now());
          localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(mockUser));
          return { success: true, user: mockUser, offline: true };
        }
        return { success: false, message: err.message || 'Koneksi ke backend gagal' };
      }
    },

    logout() {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      localStorage.removeItem('ma_admin_auth');
    },

    getCurrentUser() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH_USER) || 'null');
      } catch (e) {
        return null;
      }
    },

    isLoggedIn() {
      return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem('ma_admin_auth') === 'true';
    },

    async changePassword(oldPassword, newPassword) {
      try {
        return await request('/auth/change-password', {
          method: 'POST',
          body: JSON.stringify({ oldPassword, newPassword })
        });
      } catch (err) {
        // Fallback offline
        localStorage.setItem('ma_admin_password', newPassword);
        return { success: true, message: 'Password diperbarui (Mode Offline)' };
      }
    },

    // ----------------------------------------------------
    // Unified Site Data Fetch
    // ----------------------------------------------------
    async getSiteData() {
      try {
        const data = await request('/site-data', { method: 'GET' });
        // Cache to localStorage for offline resilience
        if (data.config) localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(data.config));
        if (data.berita) localStorage.setItem(STORAGE_KEYS.BERITA, JSON.stringify(data.berita));
        if (data.galeri) localStorage.setItem(STORAGE_KEYS.GALERI, JSON.stringify(data.galeri));
        if (data.ekskul) localStorage.setItem(STORAGE_KEYS.EKSKUL, JSON.stringify(data.ekskul));
        if (data.faqs) localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(data.faqs));
        return data;
      } catch (err) {
        console.warn('[API] Backend server unreachable, loading from local cache:', err);
        return {
          config: JSON.parse(localStorage.getItem(STORAGE_KEYS.SITE_CONFIG) || '{}'),
          berita: JSON.parse(localStorage.getItem(STORAGE_KEYS.BERITA) || '[]'),
          galeri: JSON.parse(localStorage.getItem(STORAGE_KEYS.GALERI) || '[]'),
          ekskul: JSON.parse(localStorage.getItem(STORAGE_KEYS.EKSKUL) || '[]'),
          faqs: JSON.parse(localStorage.getItem(STORAGE_KEYS.FAQS) || '[]')
        };
      }
    },

    // ----------------------------------------------------
    // Config / School Identity
    // ----------------------------------------------------
    async getConfig() {
      try {
        const cfg = await request('/config', { method: 'GET' });
        localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(cfg));
        return cfg;
      } catch (e) {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.SITE_CONFIG) || '{}');
      }
    },

    async saveConfig(configData) {
      try {
        const res = await request('/config', {
          method: 'POST',
          body: JSON.stringify(configData)
        });
        localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(res.config || configData));
        return res;
      } catch (err) {
        localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(configData));
        return { success: true, config: configData, offline: true };
      }
    },

    // ----------------------------------------------------
    // Berita (News & Achievements) CRUD
    // ----------------------------------------------------
    async getBerita() {
      try {
        const list = await request('/berita', { method: 'GET' });
        localStorage.setItem(STORAGE_KEYS.BERITA, JSON.stringify(list));
        return list;
      } catch (e) {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.BERITA) || '[]');
      }
    },

    async addBerita(item) {
      try {
        const res = await request('/berita', {
          method: 'POST',
          body: JSON.stringify(item)
        });
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.BERITA) || '[]');
        current.unshift(res.item || item);
        localStorage.setItem(STORAGE_KEYS.BERITA, JSON.stringify(current));
        return res;
      } catch (err) {
        item.id = Date.now();
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.BERITA) || '[]');
        current.unshift(item);
        localStorage.setItem(STORAGE_KEYS.BERITA, JSON.stringify(current));
        return { success: true, item, offline: true };
      }
    },

    async updateBerita(id, updateData) {
      try {
        const res = await request(`/berita/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.BERITA) || '[]');
        const idx = current.findIndex(b => b.id === id);
        if (idx !== -1) current[idx] = { ...current[idx], ...updateData };
        localStorage.setItem(STORAGE_KEYS.BERITA, JSON.stringify(current));
        return res;
      } catch (err) {
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.BERITA) || '[]');
        const idx = current.findIndex(b => b.id === id);
        if (idx !== -1) current[idx] = { ...current[idx], ...updateData };
        localStorage.setItem(STORAGE_KEYS.BERITA, JSON.stringify(current));
        return { success: true, item: current[idx], offline: true };
      }
    },

    async deleteBerita(id) {
      try {
        const res = await request(`/berita/${id}`, { method: 'DELETE' });
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.BERITA) || '[]').filter(b => b.id !== id);
        localStorage.setItem(STORAGE_KEYS.BERITA, JSON.stringify(current));
        return res;
      } catch (err) {
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.BERITA) || '[]').filter(b => b.id !== id);
        localStorage.setItem(STORAGE_KEYS.BERITA, JSON.stringify(current));
        return { success: true, offline: true };
      }
    },

    // ----------------------------------------------------
    // Galeri (Photo Gallery) CRUD
    // ----------------------------------------------------
    async getGaleri() {
      try {
        const list = await request('/galeri', { method: 'GET' });
        localStorage.setItem(STORAGE_KEYS.GALERI, JSON.stringify(list));
        return list;
      } catch (e) {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.GALERI) || '[]');
      }
    },

    async addGaleri(item) {
      try {
        const res = await request('/galeri', {
          method: 'POST',
          body: JSON.stringify(item)
        });
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALERI) || '[]');
        current.unshift(res.item || item);
        localStorage.setItem(STORAGE_KEYS.GALERI, JSON.stringify(current));
        return res;
      } catch (err) {
        item.id = Date.now();
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALERI) || '[]');
        current.unshift(item);
        localStorage.setItem(STORAGE_KEYS.GALERI, JSON.stringify(current));
        return { success: true, item, offline: true };
      }
    },

    async updateGaleri(id, updateData) {
      try {
        const res = await request(`/galeri/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALERI) || '[]');
        const idx = current.findIndex(g => g.id === id);
        if (idx !== -1) current[idx] = { ...current[idx], ...updateData };
        localStorage.setItem(STORAGE_KEYS.GALERI, JSON.stringify(current));
        return res;
      } catch (err) {
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALERI) || '[]');
        const idx = current.findIndex(g => g.id === id);
        if (idx !== -1) current[idx] = { ...current[idx], ...updateData };
        localStorage.setItem(STORAGE_KEYS.GALERI, JSON.stringify(current));
        return { success: true, item: current[idx], offline: true };
      }
    },

    async deleteGaleri(id) {
      try {
        const res = await request(`/galeri/${id}`, { method: 'DELETE' });
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALERI) || '[]').filter(g => g.id !== id);
        localStorage.setItem(STORAGE_KEYS.GALERI, JSON.stringify(current));
        return res;
      } catch (err) {
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALERI) || '[]').filter(g => g.id !== id);
        localStorage.setItem(STORAGE_KEYS.GALERI, JSON.stringify(current));
        return { success: true, offline: true };
      }
    },

    // ----------------------------------------------------
    // PPDB Online Applications CRUD
    // ----------------------------------------------------
    async getPpdb() {
      try {
        const list = await request('/ppdb', { method: 'GET' });
        localStorage.setItem(STORAGE_KEYS.PPDB, JSON.stringify(list));
        return list;
      } catch (e) {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PPDB) || '[]');
      }
    },

    async submitPpdb(applicantData) {
      try {
        const res = await request('/ppdb', {
          method: 'POST',
          body: JSON.stringify(applicantData)
        });
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.PPDB) || '[]');
        current.unshift(res.applicant || applicantData);
        localStorage.setItem(STORAGE_KEYS.PPDB, JSON.stringify(current));
        return res;
      } catch (err) {
        // Fallback offline
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.PPDB) || '[]');
        current.unshift(applicantData);
        localStorage.setItem(STORAGE_KEYS.PPDB, JSON.stringify(current));
        return { success: true, applicant: applicantData, offline: true };
      }
    },

    async updatePpdb(regCode, updateData) {
      try {
        const res = await request(`/ppdb/${encodeURIComponent(regCode)}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.PPDB) || '[]');
        const idx = current.findIndex(p => p.regCode === regCode);
        if (idx !== -1) current[idx] = { ...current[idx], ...updateData };
        localStorage.setItem(STORAGE_KEYS.PPDB, JSON.stringify(current));
        return res;
      } catch (err) {
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.PPDB) || '[]');
        const idx = current.findIndex(p => p.regCode === regCode);
        if (idx !== -1) current[idx] = { ...current[idx], ...updateData };
        localStorage.setItem(STORAGE_KEYS.PPDB, JSON.stringify(current));
        return { success: true, applicant: current[idx], offline: true };
      }
    },

    async deletePpdb(regCode) {
      try {
        const res = await request(`/ppdb/${encodeURIComponent(regCode)}`, { method: 'DELETE' });
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.PPDB) || '[]').filter(p => p.regCode !== regCode);
        localStorage.setItem(STORAGE_KEYS.PPDB, JSON.stringify(current));
        return res;
      } catch (err) {
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.PPDB) || '[]').filter(p => p.regCode !== regCode);
        localStorage.setItem(STORAGE_KEYS.PPDB, JSON.stringify(current));
        return { success: true, offline: true };
      }
    },

    // ----------------------------------------------------
    // Image File Upload Handler
    // ----------------------------------------------------
    async uploadImageFile(file) {
      if (!file) throw new Error('File gambar tidak ditemukan');
      if (file.size > 15 * 1024 * 1024) {
        throw new Error('Ukuran file terlalu besar (maksimal 15MB)');
      }

      // Convert file to Base64
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      try {
        const res = await request('/upload', {
          method: 'POST',
          body: JSON.stringify({
            dataUrl: base64Data,
            filename: file.name
          })
        });
        return res;
      } catch (err) {
        console.warn('[API] Upload via server failed, using local Base64 URL fallback:', err);
        return {
          success: true,
          url: base64Data,
          filename: file.name,
          offline: true
        };
      }
    },

    // ----------------------------------------------------
    // Database Backup & Restore
    // ----------------------------------------------------
    async downloadBackup() {
      try {
        window.location.href = `${API_BASE}/backup`;
      } catch (e) {
        const backupData = {
          config: JSON.parse(localStorage.getItem(STORAGE_KEYS.SITE_CONFIG) || '{}'),
          berita: JSON.parse(localStorage.getItem(STORAGE_KEYS.BERITA) || '[]'),
          galeri: JSON.parse(localStorage.getItem(STORAGE_KEYS.GALERI) || '[]'),
          ekskul: JSON.parse(localStorage.getItem(STORAGE_KEYS.EKSKUL) || '[]'),
          faqs: JSON.parse(localStorage.getItem(STORAGE_KEYS.FAQS) || '[]'),
          ppdb: JSON.parse(localStorage.getItem(STORAGE_KEYS.PPDB) || '[]')
        };
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `backup_malta_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
      }
    },

    async restoreBackup(jsonString) {
      const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      try {
        return await request('/restore', {
          method: 'POST',
          body: JSON.stringify(parsed)
        });
      } catch (err) {
        if (parsed.config) localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(parsed.config));
        if (parsed.berita) localStorage.setItem(STORAGE_KEYS.BERITA, JSON.stringify(parsed.berita));
        if (parsed.galeri) localStorage.setItem(STORAGE_KEYS.GALERI, JSON.stringify(parsed.galeri));
        if (parsed.ekskul) localStorage.setItem(STORAGE_KEYS.EKSKUL, JSON.stringify(parsed.ekskul));
        if (parsed.faqs) localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(parsed.faqs));
        if (parsed.ppdb) localStorage.setItem(STORAGE_KEYS.PPDB, JSON.stringify(parsed.ppdb));
        return { success: true, message: 'Data berhasil dipulihkan secara lokal' };
      }
    }
  };

  // Expose to window
  window.API = API;

})(window);
