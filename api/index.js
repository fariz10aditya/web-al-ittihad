const fs = require('fs');
const path = require('path');
const url = require('url');

// Database resolution (supports local dev & Vercel serverless environment)
const DB_FILE = path.join(process.cwd(), 'data', 'database.json');
const TMP_DB = path.join('/tmp', 'database.json');
let memoryDB = null;

function readDB() {
  if (memoryDB) return memoryDB;
  try {
    if (fs.existsSync(TMP_DB)) {
      memoryDB = JSON.parse(fs.readFileSync(TMP_DB, 'utf-8'));
      return memoryDB;
    }
    if (fs.existsSync(DB_FILE)) {
      memoryDB = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      return memoryDB;
    }
  } catch (e) {}
  return {};
}

function writeDB(data) {
  memoryDB = data;
  try {
    if (fs.existsSync(path.dirname(DB_FILE))) {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
  } catch (e) {}
  try {
    fs.writeFileSync(TMP_DB, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
  return true;
}

function sendJSON(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // CORS
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // Normalize path if /api prefix is stripped or kept
  if (!pathname.startsWith('/api')) {
    pathname = '/api' + pathname;
  }

  try {
    const db = readDB();

    // 1. Status
    if (pathname === '/api/status' && method === 'GET') {
      return sendJSON(res, 200, {
        status: 'online',
        server: 'MA Al-Ittihad Serverless API (Vercel Ready)',
        time: new Date().toISOString()
      });
    }

    // 2. Auth Login
    if (pathname === '/api/auth/login' && method === 'POST') {
      const { username, password } = await parseJSONBody(req);
      const users = db.users || [];
      const found = users.find(u => u.username === username && u.password === password);
      if (found) {
        const token = 'token_' + Date.now();
        return sendJSON(res, 200, {
          success: true,
          token,
          user: { username: found.username, role: found.role, name: found.name }
        });
      }
      return sendJSON(res, 401, { success: false, message: 'Username atau Password salah!' });
    }

    // 3. Site Data
    if (pathname === '/api/site-data' && method === 'GET') {
      return sendJSON(res, 200, {
        config: db.config || {},
        berita: db.berita || [],
        galeri: db.galeri || [],
        ekskul: db.ekskul || [],
        faqs: db.faqs || []
      });
    }

    // 4. Config
    if (pathname === '/api/config') {
      if (method === 'GET') return sendJSON(res, 200, db.config || {});
      if (method === 'POST') {
        const updated = await parseJSONBody(req);
        db.config = { ...db.config, ...updated };
        writeDB(db);
        return sendJSON(res, 200, { success: true, config: db.config });
      }
    }

    // 5. Berita
    if (pathname === '/api/berita') {
      if (method === 'GET') return sendJSON(res, 200, db.berita || []);
      if (method === 'POST') {
        const item = await parseJSONBody(req);
        item.id = item.id || Date.now();
        if (!db.berita) db.berita = [];
        db.berita.unshift(item);
        writeDB(db);
        return sendJSON(res, 201, { success: true, item });
      }
    }

    if (pathname.startsWith('/api/berita/')) {
      const id = parseInt(pathname.replace('/api/berita/', ''), 10);
      if (method === 'PUT') {
        const update = await parseJSONBody(req);
        const idx = (db.berita || []).findIndex(b => b.id === id);
        if (idx === -1) return sendJSON(res, 404, { success: false, message: 'Berita tidak ditemukan' });
        db.berita[idx] = { ...db.berita[idx], ...update, id };
        writeDB(db);
        return sendJSON(res, 200, { success: true, item: db.berita[idx] });
      }
      if (method === 'DELETE') {
        db.berita = (db.berita || []).filter(b => b.id !== id);
        writeDB(db);
        return sendJSON(res, 200, { success: true });
      }
    }

    // 6. Galeri
    if (pathname === '/api/galeri') {
      if (method === 'GET') return sendJSON(res, 200, db.galeri || []);
      if (method === 'POST') {
        const item = await parseJSONBody(req);
        item.id = item.id || Date.now();
        if (!db.galeri) db.galeri = [];
        db.galeri.unshift(item);
        writeDB(db);
        return sendJSON(res, 201, { success: true, item });
      }
    }

    if (pathname.startsWith('/api/galeri/')) {
      const id = parseInt(pathname.replace('/api/galeri/', ''), 10);
      if (method === 'PUT') {
        const update = await parseJSONBody(req);
        const idx = (db.galeri || []).findIndex(g => g.id === id);
        if (idx === -1) return sendJSON(res, 404, { success: false, message: 'Foto tidak ditemukan' });
        db.galeri[idx] = { ...db.galeri[idx], ...update, id };
        writeDB(db);
        return sendJSON(res, 200, { success: true, item: db.galeri[idx] });
      }
      if (method === 'DELETE') {
        db.galeri = (db.galeri || []).filter(g => g.id !== id);
        writeDB(db);
        return sendJSON(res, 200, { success: true });
      }
    }

    // 7. PPDB
    if (pathname === '/api/ppdb') {
      if (method === 'GET') return sendJSON(res, 200, db.ppdb || []);
      if (method === 'POST') {
        const applicant = await parseJSONBody(req);
        if (!applicant.regCode) {
          applicant.regCode = `PPDB-ALIT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        if (!applicant.tanggalDaftar) {
          applicant.tanggalDaftar = new Date().toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          });
        }
        applicant.status = applicant.status || 'Pending';
        if (!db.ppdb) db.ppdb = [];
        db.ppdb.unshift(applicant);
        writeDB(db);
        return sendJSON(res, 201, { success: true, applicant });
      }
    }

    if (pathname.startsWith('/api/ppdb/')) {
      const regCode = decodeURIComponent(pathname.replace('/api/ppdb/', ''));
      if (method === 'PUT') {
        const update = await parseJSONBody(req);
        const idx = (db.ppdb || []).findIndex(p => p.regCode === regCode);
        if (idx === -1) return sendJSON(res, 404, { success: false, message: 'Pendaftar tidak ditemukan' });
        db.ppdb[idx] = { ...db.ppdb[idx], ...update, regCode };
        writeDB(db);
        return sendJSON(res, 200, { success: true, applicant: db.ppdb[idx] });
      }
      if (method === 'DELETE') {
        db.ppdb = (db.ppdb || []).filter(p => p.regCode !== regCode);
        writeDB(db);
        return sendJSON(res, 200, { success: true });
      }
    }

    // 8. Upload Base64 Data URL
    if (pathname === '/api/upload' && method === 'POST') {
      const { dataUrl, filename } = await parseJSONBody(req);
      if (!dataUrl) return sendJSON(res, 400, { success: false, message: 'Data URL required' });
      return sendJSON(res, 200, {
        success: true,
        url: dataUrl, // In serverless cloud, returns the responsive Base64/Data URL
        filename: filename || 'upload.jpg'
      });
    }

    // 9. Backup
    if (pathname === '/api/backup' && method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="backup_malta_${new Date().toISOString().slice(0, 10)}.json"`
      });
      return res.end(JSON.stringify(db, null, 2));
    }

    return sendJSON(res, 404, { success: false, message: 'Endpoint tidak ditemukan' });

  } catch (err) {
    return sendJSON(res, 500, { success: false, message: err.message });
  }
};
