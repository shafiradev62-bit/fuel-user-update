@echo off
echo ========================================
echo FUELFRIENDLY - Mobile Development Setup
echo ========================================
echo.

echo Starting backend server on port 4000...
cd backend
start "Backend Server" cmd /k "npm run dev"

timeout /t 5 /nobreak >nul

echo Starting frontend development server on port 5173...
cd ../frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo DEVELOPMENT SERVERS STARTED
echo ========================================
echo Backend API: http://192.168.0.160:4000
echo Frontend App: http://192.168.0.160:5173
echo Health Check: http://192.168.0.160:4000/api/health
echo.
echo You can now access the app from your mobile device using:
echo http://192.168.0.160:5173
echo.
echo Press any key to exit...
pause >nul