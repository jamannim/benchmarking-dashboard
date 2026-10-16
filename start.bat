@echo off
chcp 65001 > nul
title 나마네카드 서비스 트래커 (NAMANE Card Service Tracker)
echo ===================================================================
echo   [NAMANE Tracker] 나마네카드 서비스 트래커 대시보드 구동 중...
echo ===================================================================
echo.
echo 브라우저에서 대시보드가 자동으로 열립니다.
echo 트래커를 종료하시려면 이 창을 닫아주세요.
echo.

cd /d "%~dp0"
call npm run dev -- --open

pause
