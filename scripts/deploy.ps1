# BIZLENS GitHub Code Sync & Deployment Automation Script
param(
    [string]$Message = "feat: Update application features and data consistency"
)

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " [BIZLENS] Starting Automated Build & GitHub Deploy" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# 1. Build Verification
Write-Host "`n1. Running build verification (tsc -b && vite build)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Build failed! Deployment aborted to protect production." -ForegroundColor Red
    exit 1
}
Write-Host "[SUCCESS] Build verified with 0 errors!" -ForegroundColor Green

# 2. Git Status Check
Write-Host "`n2. Checking git status..." -ForegroundColor Yellow
git status --short

# 3. Git Staging & Commit
Write-Host "`n3. Staging and committing changes..." -ForegroundColor Yellow
git add .
git commit -m "$Message"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[INFO] Nothing to commit or commit failed." -ForegroundColor Gray
}

# 4. Git Push
Write-Host "`n4. Pushing to GitHub main branch..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Push to GitHub failed! Please check network or git credentials." -ForegroundColor Red
    exit 1
}

Write-Host "`n====================================================" -ForegroundColor Green
Write-Host " [SUCCESS] GitHub code sync complete!" -ForegroundColor Green
Write-Host " Vercel auto-deployment will finish in ~1 minute." -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
