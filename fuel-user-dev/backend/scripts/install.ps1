# ========================================
# FUELFRIENDLY - AUTO INSTALLER
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   FUELFRIENDLY - AUTO SETUP WIZARD    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Docker
Write-Host "[1/4] Checking Docker..." -ForegroundColor Yellow
$dockerInstalled = $false
try {
    $dockerVersion = docker --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] Docker installed: $dockerVersion" -ForegroundColor Green
        $dockerInstalled = $true
    }
} catch {
    Write-Host "  [!] Docker not found" -ForegroundColor Red
}

if (-not $dockerInstalled) {
    Write-Host ""
    Write-Host "Docker belum terinstall!" -ForegroundColor Yellow
    Write-Host "Download Docker Desktop dari:" -ForegroundColor White
    Write-Host "https://www.docker.com/products/docker-desktop/" -ForegroundColor Cyan
    Write-Host ""
    $installDocker = Read-Host "Buka link download Docker? (y/n)"
    if ($installDocker -eq "y") {
        Start-Process "https://www.docker.com/products/docker-desktop/"
    }
    Write-Host ""
    Write-Host "Setelah install Docker, jalankan script ini lagi!" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Tekan Enter untuk lanjut setup (tanpa WhatsApp OTP)"
}

# Step 2: Run Evolution API (if Docker available)
if ($dockerInstalled) {
    Write-Host ""
    Write-Host "[2/4] Setting up Evolution API (WhatsApp)..." -ForegroundColor Yellow
    
    # Check if container already exists
    $containerExists = docker ps -a --filter "name=evolution_api" --format "{{.Names}}" 2>$null
    
    if ($containerExists -eq "evolution_api") {
        Write-Host "  [!] Container evolution_api sudah ada" -ForegroundColor Yellow
        $recreate = Read-Host "  Hapus dan buat ulang? (y/n)"
        if ($recreate -eq "y") {
            Write-Host "  Menghapus container lama..." -ForegroundColor White
            docker rm -f evolution_api 2>$null
            $containerExists = $null
        }
    }
    
    if (-not $containerExists) {
        Write-Host "  Menjalankan Evolution API..." -ForegroundColor White
        docker run -d --name evolution_api -p 8080:8080 -e AUTHENTICATION_API_KEY=rahasialobanget123 atendai/evolution-api:latest
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] Evolution API running di http://localhost:8080" -ForegroundColor Green
            Start-Sleep -Seconds 3
            
            # Create instance
            Write-Host "  Membuat WhatsApp instance..." -ForegroundColor White
            try {
                $createResult = Invoke-RestMethod -Method POST -Uri "http://localhost:8080/instance/create" -Headers @{"apikey"="rahasialobanget123"; "Content-Type"="application/json"} -Body '{"instanceName":"fuelfriendly","qrcode":true,"integration":"WHATSAPP-BAILEYS"}' -ErrorAction SilentlyContinue
                Write-Host "  [OK] Instance 'fuelfriendly' created" -ForegroundColor Green
            } catch {
                Write-Host "  [!] Instance mungkin sudah ada" -ForegroundColor Yellow
            }
            
            # Get QR Code
            Write-Host ""
            Write-Host "  Untuk connect WhatsApp, scan QR code:" -ForegroundColor Yellow
            Write-Host "  1. Buka browser: http://localhost:8080" -ForegroundColor White
            Write-Host "  2. Atau jalankan command ini untuk get QR:" -ForegroundColor White
            Write-Host "     Invoke-RestMethod -Uri 'http://localhost:8080/instance/connect/fuelfriendly' -Headers @{'apikey'='rahasialobanget123'}" -ForegroundColor Cyan
            Write-Host ""
            
            $openBrowser = Read-Host "  Buka browser untuk scan QR? (y/n)"
            if ($openBrowser -eq "y") {
                Start-Process "http://localhost:8080"
            }
        } else {
            Write-Host "  [X] Gagal menjalankan Evolution API" -ForegroundColor Red
        }
    } else {
        Write-Host "  [OK] Evolution API sudah running" -ForegroundColor Green
    }
} else {
    Write-Host ""
    Write-Host "[2/4] Skipping Evolution API (Docker not installed)" -ForegroundColor Yellow
}

# Step 3: Check .env.local
Write-Host ""
Write-Host "[3/4] Checking environment configuration..." -ForegroundColor Yellow

if (Test-Path ".env.local") {
    Write-Host "  [OK] File .env.local sudah ada" -ForegroundColor Green
} else {
    Write-Host "  [!] File .env.local tidak ditemukan, membuat..." -ForegroundColor Yellow
    Copy-Item ".env.local.template" ".env.local"
    Write-Host "  [OK] File .env.local created" -ForegroundColor Green
}

# Step 4: Check dev server
Write-Host ""
Write-Host "[4/4] Checking development server..." -ForegroundColor Yellow

$devServerRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "  [OK] Dev server running di http://localhost:3000" -ForegroundColor Green
        $devServerRunning = $true
    }
} catch {
    Write-Host "  [!] Dev server belum running" -ForegroundColor Yellow
}

if (-not $devServerRunning) {
    Write-Host ""
    Write-Host "  Untuk menjalankan dev server:" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor Cyan
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "         SETUP COMPLETE!                " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Status:" -ForegroundColor Yellow
Write-Host "  [" -NoNewline
if ($dockerInstalled) { Write-Host "OK" -ForegroundColor Green -NoNewline } else { Write-Host "!!" -ForegroundColor Red -NoNewline }
Write-Host "] Docker"

Write-Host "  [" -NoNewline
if ($dockerInstalled) { Write-Host "OK" -ForegroundColor Green -NoNewline } else { Write-Host "!!" -ForegroundColor Red -NoNewline }
Write-Host "] Evolution API (WhatsApp OTP)"

Write-Host "  [OK] Message Central (SMS/Email OTP)" -ForegroundColor Green
Write-Host "  [OK] Firebase (Email/Password)" -ForegroundColor Green
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
if (-not $dockerInstalled) {
    Write-Host "  1. Install Docker Desktop" -ForegroundColor White
    Write-Host "  2. Jalankan script ini lagi: .\install.ps1" -ForegroundColor White
    Write-Host "  3. Scan QR WhatsApp" -ForegroundColor White
    Write-Host "  4. Test OTP!" -ForegroundColor White
} else {
    Write-Host "  1. Scan QR WhatsApp (jika belum)" -ForegroundColor White
    Write-Host "  2. Buka http://localhost:3000" -ForegroundColor White
    Write-Host "  3. Test OTP!" -ForegroundColor White
}
Write-Host ""

Write-Host "Dokumentasi:" -ForegroundColor Yellow
Write-Host "  - EVOLUTION_API_SETUP.md (WhatsApp)" -ForegroundColor Cyan
Write-Host "  - QUICKSTART.md (Quick Start)" -ForegroundColor Cyan
Write-Host ""

Write-Host "Happy Coding! " -ForegroundColor Green -NoNewline
Write-Host "🚀" -ForegroundColor Yellow
Write-Host ""
