@echo off
title MA Al-Ittihad Tawangsari - Server Backend & CMS
color 0B
cd /d "%~dp0"

echo =======================================================================
echo   MADRASAH ALIYAH AL-ITTIHAD TAWANGSARI (MALTA)
echo   Pondok Pesantren Al-Ittihad - Trowulan Mojokerto (NPSN: 20584241)
echo   Backend Server & Content Management System (CMS) v2.0
echo =======================================================================
echo.

set NODE_EXEC=node
where node >nul 2>&1
if errorlevel 1 (
  if exist "%APPDATA%\Antigravity\bin\agy-node.cmd" (
    set NODE_EXEC="%APPDATA%\Antigravity\bin\agy-node.cmd"
  ) else if exist "%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe" (
    set ELECTRON_RUN_AS_NODE=1
    set NODE_EXEC="%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe"
  ) else (
    echo [PERINGATAN] Node.js tidak terdeteksi otomatis di sistem.
  )
)

echo [*] Memulai Server Node.js...
echo [*] Website Publik : http://localhost:3000
echo [*] Portal Admin   : http://localhost:3000/admin.html
echo [*] REST API       : http://localhost:3000/api/site-data
echo.
echo Server siap menerima koneksi!
echo =======================================================================
echo.

REM Membuka portal admin di browser secara otomatis
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 1; Start-Process 'http://localhost:3000/admin.html'"

REM Menjalankan server.js
%NODE_EXEC% server.js

pause
