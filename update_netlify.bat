@echo off
chcp 65001 >nul
echo ========================================================
echo   [Netlify] 백지 현상 해결 및 사이트 업데이트 실행
echo ========================================================
echo.
echo 1. 자바스크립트/CSS 경로를 단일 루트(Flat)로 리빌드합니다...
call npm run build
echo.
echo 2. 브라우저에서 [playful-gelato-216fad] 배포 관리 페이지가 열립니다:
echo    https://app.netlify.com/sites/playful-gelato-216fad/deploys
echo.
echo 3. 화면 하단의 점선 박스(Drag and drop your site output folder here)에
echo    함께 열린 [dist] 폴더를 마우스로 끌어다 놓으세요.
echo.
echo    ★ 하위 폴더 경로 오류를 원천 차단하여, 드롭 즉시 백지 현상이 해결됩니다!
echo ========================================================
start https://app.netlify.com/sites/playful-gelato-216fad/deploys
explorer "%~dp0dist"
pause
