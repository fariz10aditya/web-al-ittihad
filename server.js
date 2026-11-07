/**
 * MA AL-ITTIHAD TAWANGSARI (MALTA) - BACKEND SERVER
 * NPSN: 20584241 | Trowulan, Mojokerto
 * 
 * Native Node.js Web Server & REST API CMS
 * Zero external dependencies required - Runs out of the box!
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'database.json');
const UPLOAD_DIR = path.join(__dirname, 'assets', 'images', 'uploads');

// Ensure directories exist
if (!fs.existsSync(path.dirname(DB_FILE))) fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// MIME types map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8'
};

// Database Helpers
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) return {};
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[DB Error] Failed to read database:', err);
    return {};
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[DB Error] Failed to write database:', err);
    return false;
  }
}

// Response Helpers
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
      if (body.length > 25 * 1024 * 1024) { // 25MB max
        req.destroy();
        reject(new Error('Payload too large'));
      }
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

function parseRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// Server Dispatcher
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsedUrl.pathname);
  const method = req.method.toUpperCase();

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // ----------------------------------------------------
  // REST API ROUTING (/api/...)
  // ----------------------------------------------------
  if (pathname.startsWith('/api/')) {
    try {
      const db = readDB();

      // 1. Health Status
      if (pathname === '/api/status' && method === 'GET') {
        return sendJSON(res, 200, {
          status: 'online',
          server: 'MA Al-Ittihad Tawangsari Backend Server v2.0',
          time: new Date().toISOString(),
          uptime: process.uptime()
        });
      }

      // 2. Auth Login
      if (pathname === '/api/auth/login' && method === 'POST') {
        const { username, password } = await parseJSONBody(req);
        const users = db.users || [];
        const found = users.find(u => u.username === username && u.password === password);
        if (found) {
          const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substring(2);
          return sendJSON(res, 200, {
            success: true,
            token,
            user: { username: found.username, role: found.role, name: found.name }
          });
        }
        return sendJSON(res, 401, { success: false, message: 'Username atau Password salah!' });
      }

      // 3. Change Password
      if (pathname === '/api/auth/change-password' && method === 'POST') {
        const { username, oldPassword, newPassword } = await parseJSONBody(req);
        const users = db.users || [];
        const user = users.find(u => u.username === (username || 'admin'));
        if (!user || user.password !== oldPassword) {
          return sendJSON(res, 400, { success: false, message: 'Password lama tidak cocok!' });
        }
        user.password = newPassword;
        writeDB(db);
        return sendJSON(res, 200, { success: true, message: 'Password berhasil diubah!' });
      }

      // 4. Get All Public Site Data
      if (pathname === '/api/site-data' && method === 'GET') {
        return sendJSON(res, 200, {
          config: db.config || {},
          berita: db.berita || [],
          galeri: db.galeri || [],
          ekskul: db.ekskul || [],
          faqs: db.faqs || []
        });
      }

      // 5. Config / Site Settings (GET & POST)
      if (pathname === '/api/config') {
        if (method === 'GET') {
          return sendJSON(res, 200, db.config || {});
        }
        if (method === 'POST') {
          const updated = await parseJSONBody(req);
          db.config = { ...db.config, ...updated };
          writeDB(db);
          return sendJSON(res, 200, { success: true, config: db.config });
        }
      }

      // 6. Berita CRUD
      if (pathname === '/api/berita') {
        if (method === 'GET') {
          return sendJSON(res, 200, db.berita || []);
        }
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
          return sendJSON(res, 200, { success: true, message: 'Berita berhasil dihapus' });
        }
      }

      // 7. Galeri CRUD
      if (pathname === '/api/galeri') {
        if (method === 'GET') {
          return sendJSON(res, 200, db.galeri || []);
        }
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
          if (idx === -1) return sendJSON(res, 404, { success: false, message: 'Foto galeri tidak ditemukan' });
          db.galeri[idx] = { ...db.galeri[idx], ...update, id };
          writeDB(db);
          return sendJSON(res, 200, { success: true, item: db.galeri[idx] });
        }
        if (method === 'DELETE') {
          db.galeri = (db.galeri || []).filter(g => g.id !== id);
          writeDB(db);
          return sendJSON(res, 200, { success: true, message: 'Foto galeri berhasil dihapus' });
        }
      }

      // 8. Ekskul CRUD
      if (pathname === '/api/ekskul') {
        if (method === 'GET') {
          return sendJSON(res, 200, db.ekskul || []);
        }
        if (method === 'POST') {
          const item = await parseJSONBody(req);
          item.id = item.id || Date.now();
          if (!db.ekskul) db.ekskul = [];
          db.ekskul.push(item);
          writeDB(db);
          return sendJSON(res, 201, { success: true, item });
        }
      }

      if (pathname.startsWith('/api/ekskul/')) {
        const id = parseInt(pathname.replace('/api/ekskul/', ''), 10);
        if (method === 'DELETE') {
          db.ekskul = (db.ekskul || []).filter(e => e.id !== id);
          writeDB(db);
          return sendJSON(res, 200, { success: true });
        }
      }

      // 9. FAQs CRUD
      if (pathname === '/api/faqs') {
        if (method === 'GET') {
          return sendJSON(res, 200, db.faqs || []);
        }
        if (method === 'POST') {
          const item = await parseJSONBody(req);
          item.id = item.id || Date.now();
          if (!db.faqs) db.faqs = [];
          db.faqs.push(item);
          writeDB(db);
          return sendJSON(res, 201, { success: true, item });
        }
      }

      if (pathname.startsWith('/api/faqs/')) {
        const id = parseInt(pathname.replace('/api/faqs/', ''), 10);
        if (method === 'DELETE') {
          db.faqs = (db.faqs || []).filter(f => f.id !== id);
          writeDB(db);
          return sendJSON(res, 200, { success: true });
        }
      }

      // 10. PPDB Applications CRUD
      if (pathname === '/api/ppdb') {
        if (method === 'GET') {
          return sendJSON(res, 200, db.ppdb || []);
        }
        if (method === 'POST') {
          const applicant = await parseJSONBody(req);
          if (!applicant.regCode) {
            const random = Math.floor(1000 + Math.random() * 9000);
            applicant.regCode = `PPDB-ALIT-${new Date().getFullYear()}-${random}`;
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
        const regCode = pathname.replace('/api/ppdb/', '');
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
          return sendJSON(res, 200, { success: true, message: 'Data pendaftar berhasil dihapus' });
        }
      }

      // 11. Image Upload Endpoint (Supports Base64 or Multipart)
      if (pathname === '/api/upload' && method === 'POST') {
        const contentType = req.headers['content-type'] || '';
        
        // Base64 JSON upload
        if (contentType.includes('application/json')) {
          const { dataUrl, filename } = await parseJSONBody(req);
          if (!dataUrl) return sendJSON(res, 400, { success: false, message: 'Data URL wajib dikirim' });

          const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (!matches || matches.length !== 3) {
            return sendJSON(res, 400, { success: false, message: 'Format Base64 tidak valid' });
          }

          const mimeType = matches[1];
          const extMap = {
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp',
            'image/svg+xml': '.svg',
            'image/gif': '.gif'
          };
          const ext = extMap[mimeType] || '.jpg';
          const cleanName = (filename || 'foto').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
          const finalFilename = `upload_${Date.now()}_${cleanName}${ext}`;
          const filePath = path.join(UPLOAD_DIR, finalFilename);

          fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
          return sendJSON(res, 200, {
            success: true,
            url: `assets/images/uploads/${finalFilename}`,
            filename: finalFilename
          });
        }

        // Binary / Multipart fallback
        const rawBuffer = await parseRawBody(req);
        const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
        if (boundaryMatch) {
          const boundary = boundaryMatch[1] || boundaryMatch[2];
          const parts = rawBuffer.toString('binary').split('--' + boundary);
          for (const part of parts) {
            if (part.includes('filename="')) {
              const filenameMatch = part.match(/filename="([^"]+)"/);
              const originalFilename = filenameMatch ? filenameMatch[1] : 'upload.jpg';
              const ext = path.extname(originalFilename).toLowerCase() || '.jpg';
              const cleanName = path.basename(originalFilename, ext).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
              const finalFilename = `upload_${Date.now()}_${cleanName}${ext}`;
              const fileDataStart = part.indexOf('\r\n\r\n') + 4;
              const fileDataEnd = part.lastIndexOf('\r\n');
              const fileBinary = part.substring(fileDataStart, fileDataEnd);
              
              const targetPath = path.join(UPLOAD_DIR, finalFilename);
              fs.writeFileSync(targetPath, Buffer.from(fileBinary, 'binary'));

              return sendJSON(res, 200, {
                success: true,
                url: `assets/images/uploads/${finalFilename}`,
                filename: finalFilename
              });
            }
          }
        }

        return sendJSON(res, 400, { success: false, message: 'Tidak ada file yang berhasil diunggah' });
      }

      // 12. Backup Database
      if (pathname === '/api/backup' && method === 'GET') {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="backup_malta_${new Date().toISOString().slice(0, 10)}.json"`
        });
        return res.end(JSON.stringify(db, null, 2));
      }

      // 13. Restore Database
      if (pathname === '/api/restore' && method === 'POST') {
        const payload = await parseJSONBody(req);
        if (!payload.config) {
          return sendJSON(res, 400, { success: false, message: 'Format backup JSON tidak valid' });
        }
        writeDB(payload);
        return sendJSON(res, 200, { success: true, message: 'Database berhasil dipulihkan' });
      }

      // Unknown API route
      return sendJSON(res, 404, { success: false, message: 'API Endpoint tidak ditemukan' });

    } catch (err) {
      console.error('[API Server Error]', err);
      return sendJSON(res, 500, { success: false, message: err.message || 'Internal server error' });
    }
  }

  // ----------------------------------------------------
  // STATIC FILE SERVING
  // ----------------------------------------------------
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  let filePath = path.join(__dirname, safePath);

  // Security check: ensure path is within __dirname
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Access Denied');
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If extensionless, try appending .html
      if (!path.extname(filePath)) {
        const withHtml = filePath + '.html';
        if (fs.existsSync(withHtml)) {
          filePath = withHtml;
        } else {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          return res.end(`
            <!DOCTYPE html>
            <html lang="id">
            <head><meta charset="UTF-8"><title>404 Halaman Tidak Ditemukan</title></head>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h1>404 - Halaman Tidak Ditemukan</h1>
              <p>Halaman atau file <code>${pathname}</code> tidak ditemukan di server.</p>
              <a href="/">Kembali ke Beranda</a>
            </body>
            </html>
          `);
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('File Not Found');
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Stream the file
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

// Start listening
server.listen(PORT, () => {
  console.log('================================================================');
  console.log(`  MA AL-ITTIHAD TAWANGSARI (MALTA) - BACKEND & CMS SERVER ONLINE`);
  console.log(`  Website URL : http://localhost:${PORT}`);
  console.log(`  Admin Panel : http://localhost:${PORT}/admin.html`);
  console.log(`  REST API    : http://localhost:${PORT}/api/site-data`);
  console.log('================================================================');
});
