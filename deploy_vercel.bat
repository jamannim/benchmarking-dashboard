@echo off
chcp 65001 >nul
echo ========================================================
echo   [Vercel] 프로덕션 최신 빌드 및 배포 자동 실행
echo ========================================================
echo.
cd /d "%~dp0"
echo 1. 최신 소스코드 및 SPA 라우팅 설정 빌드를 시작합니다...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo [오류] 빌드에 실패했습니다. 코드를 확인해주세요.
  pause
  exit /b %ERRORLEVEL%
)
echo.
echo 2. Vercel 프로덕션 배포를 진행합니다...
echo.
call npx vercel --prod
echo.
echo ========================================================
echo 배포 완료! 
echo https://benchmarking-dashboard-one.vercel.app/Sales 등
echo 모든 서브 경로로 직접 접속해도 오류 없이 정상 동작합니다.
echo ========================================================
pause
