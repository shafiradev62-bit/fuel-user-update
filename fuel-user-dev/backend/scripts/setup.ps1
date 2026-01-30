# ========================================
# SETUP MESSAGE CENTRAL - STEP BY STEP
# ========================================

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "FUELFRIENDLY - MESSAGE CENTRAL SETUP" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "[!] File .env.local sudah ada!" -ForegroundColor Yellow
    $overwrite = Read-Host "Apakah Anda ingin overwrite? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "[X] Setup dibatalkan" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "STEP 1: MESSAGE CENTRAL CREDENTIALS" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Untuk mendapatkan credentials:" -ForegroundColor Yellow
Write-Host "1. Buka: https://cpaas.messagecentral.com/" -ForegroundColor White
Write-Host "2. Klik Sign Up atau Get Started" -ForegroundColor White
Write-Host "3. Lengkapi registrasi dan verifikasi email" -ForegroundColor White
Write-Host "4. Login ke dashboard" -ForegroundColor White
Write-Host "5. Buka Settings - API Credentials" -ForegroundColor White
Write-Host "6. Copy Customer ID dan API Key" -ForegroundColor White
Write-Host ""

# Open browser
$openBrowser = Read-Host "Buka browser untuk registrasi? (y/n)"
if ($openBrowser -eq "y") {
    Start-Process "https://cpaas.messagecentral.com/"
    Write-Host "[OK] Browser dibuka!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Silakan daftar dan dapatkan credentials..." -ForegroundColor Yellow
    Write-Host "Tekan Enter setelah selesai..." -ForegroundColor Yellow
    Read-Host
}

Write-Host ""
$customerId = Read-Host "Masukkan Customer ID"
$apiKey = Read-Host "Masukkan API Key"

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "STEP 2: FIREBASE CREDENTIALS (OPTIONAL)" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Firebase diperlukan untuk Email/Password dan Google login" -ForegroundColor Yellow
Write-Host "Jika hanya ingin test OTP, bisa skip step ini" -ForegroundColor Yellow
Write-Host ""

$setupFirebase = Read-Host "Setup Firebase sekarang? (y/n)"

$firebaseApiKey = ""
$firebaseAuthDomain = ""
$firebaseProjectId = ""
$firebaseStorageBucket = ""
$firebaseMessagingSenderId = ""
$firebaseAppId = ""
$firebaseMeasurementId = ""

if ($setupFirebase -eq "y") {
    Write-Host ""
    Write-Host "Untuk mendapatkan Firebase config:" -ForegroundColor Yellow
    Write-Host "1. Buka: https://console.firebase.google.com/" -ForegroundColor White
    Write-Host "2. Buat/pilih project" -ForegroundColor White
    Write-Host "3. Buka Project Settings - General" -ForegroundColor White
    Write-Host "4. Scroll ke Your apps - Web app" -ForegroundColor White
    Write-Host "5. Copy config values" -ForegroundColor White
    Write-Host ""
    
    $openFirebase = Read-Host "Buka Firebase Console? (y/n)"
    if ($openFirebase -eq "y") {
        Start-Process "https://console.firebase.google.com/"
        Write-Host "[OK] Browser dibuka!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Tekan Enter setelah siap..." -ForegroundColor Yellow
        Read-Host
    }
    
    Write-Host ""
    $firebaseApiKey = Read-Host "Firebase API Key"
    $firebaseAuthDomain = Read-Host "Firebase Auth Domain"
    $firebaseProjectId = Read-Host "Firebase Project ID"
    $firebaseStorageBucket = Read-Host "Firebase Storage Bucket"
    $firebaseMessagingSenderId = Read-Host "Firebase Messaging Sender ID"
    $firebaseAppId = Read-Host "Firebase App ID"
    $firebaseMeasurementId = Read-Host "Firebase Measurement ID (optional)"
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "STEP 3: MEMBUAT FILE .env.local" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""

# Create .env.local content
$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$envContent = @"
# ========================================
# FUELFRIENDLY - ENVIRONMENT CONFIGURATION
# Generated: $date
# ========================================

# ----------------------------------------
# MESSAGE CENTRAL OTP CONFIGURATION
# ----------------------------------------
VITE_MESSAGE_CENTRAL_CUSTOMER_ID=$customerId
VITE_MESSAGE_CENTRAL_API_KEY=$apiKey

# ----------------------------------------
# RESEND EMAIL SERVICE
# ----------------------------------------
RESEND_API_KEY=$resendApiKey
RESEND_FROM_EMAIL=$resendFromEmail

# ----------------------------------------
# FIREBASE CONFIGURATION
# ----------------------------------------
VITE_FIREBASE_API_KEY=$firebaseApiKey
VITE_FIREBASE_AUTH_DOMAIN=$firebaseAuthDomain
VITE_FIREBASE_PROJECT_ID=$firebaseProjectId
VITE_FIREBASE_STORAGE_BUCKET=$firebaseStorageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=$firebaseMessagingSenderId
VITE_FIREBASE_APP_ID=$firebaseAppId
VITE_FIREBASE_MEASUREMENT_ID=$firebaseMeasurementId
VITE_FIREBASE_VAPID_KEY=

# ----------------------------------------
# GOOGLE OAUTH
# ----------------------------------------
VITE_GOOGLE_CLIENT_ID=

# ----------------------------------------
# API CONFIGURATION
# ----------------------------------------
VITE_API_BASE_URL=https://apidecor.kelolahrd.life
"@

# Write to file
$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "[OK] File .env.local berhasil dibuat!" -ForegroundColor Green
Write-Host ""

Write-Host "==================================" -ForegroundColor Green
Write-Host "STEP 4: RESTART DEV SERVER" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Untuk apply perubahan, restart development server:" -ForegroundColor Yellow
Write-Host "1. Tekan Ctrl+C di terminal yang menjalankan npm run dev" -ForegroundColor White
Write-Host "2. Jalankan ulang: npm run dev" -ForegroundColor White
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "SETUP SELESAI!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Credentials tersimpan di: .env.local" -ForegroundColor Green
Write-Host ""
Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
Write-Host "1. Restart dev server (Ctrl+C lalu npm run dev)" -ForegroundColor White
Write-Host "2. Buka http://localhost:3000" -ForegroundColor White
Write-Host "3. Test OTP login!" -ForegroundColor White
Write-Host ""
Write-Host "Dokumentasi lengkap: MESSAGE_CENTRAL_SETUP.md" -ForegroundColor Cyan
Write-Host ""
