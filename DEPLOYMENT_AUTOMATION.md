# 깃허브 코드 업데이트 및 자동 배포 가이드 (Deployment Automation)

본 문서는 비즈렌즈(BIZLENS) 대시보드의 코드 수정 사항을 안전하고 신속하게 깃허브(GitHub) 원격 저장소(`main` 브랜치)에 동기화하고, Vercel 상용 프로덕션 환경에 자동 배포(Auto Deployment)하기 위한 운영 표준 매뉴얼입니다.

---

## 1. 개요 및 운영 원칙

- **저장소 주소**: `https://github.com/jamannim/benchmarking-dashboard.git`
- **배포 브랜치**: `main` (Vercel Production 연동)
- **절대 원칙 (Rule 3 & Rule 6)**:
  1. **빌드 무결성 사전 검증**: 커밋/푸시 전 반드시 `npm run build`를 실행하여 TypeScript 타입 오류 및 Vite 번들링 성공(Exit Code 0)을 검증합니다.
  2. **환경변수 및 토큰 보호**: API 키, 비밀 토큰, 인증 정보는 절대로 깃에 커밋되지 않도록 `.gitignore` 및 Vercel 환경변수 대시보드에서만 관리합니다.
  3. **원클릭 자동 반영**: 사용자가 "깃허브에 반영해줘"라고 요청하면 사전 검증 후 원클릭으로 깃 커밋, 푸시, Vercel 자동 배포가 완료됩니다.

---

## 2. 자동 배포 스크립트 실행 방법

프로젝트 루트의 `scripts/deploy.ps1` 스크립트를 통해 검증 및 배포를 1단계로 실행할 수 있습니다.

### PowerShell 터미널 실행:
```powershell
# 배포 커밋 메시지와 함께 1-단계 자동 배포 실행
.\scripts\deploy.ps1 -Message "fix: Update footer layout and enforce read-only data integrity"
```

### 스크립트 내부 자동화 파이프라인:
1. `npm run build` 실행 ➔ TypeScript 및 번들링 0 errors 확인 (실패 시 배포 자동 중단)
2. `git status` 변경사항 확인 및 불필요한 캐시 배제
3. `git add .` 스테이징
4. `git commit -m "[커밋메시지]"` 생성
5. `git push origin main` 원격 푸시
6. GitHub Push 완료 시 **Vercel GitHub Integration**이 자동으로 감지하여 최신 프로덕션 빌드 & 배포 실행 (약 1분 소요)

---

## 3. 대화창을 통한 AI 어시스턴트 자동 반영 요청 규격

사용자가 코드 수정 후 다음과 같이 한마디만 입력하시면 AI 어시스턴트가 즉시 빌드 검증 후 깃허브 반영을 자동 진행합니다:

> **사용자 요청 예시**:
> - *"이번 수정사항 깃허브에 반영해줘"*
> - *"빌드 확인하고 깃허브에 푸시해줘"*

### AI 어시스턴트 처리 절차:
1. `npm run build` 실행 및 결과 검증 (Exit Code 0 확인)
2. 변경된 파일 목록 및 커밋 메시지 구성
3. `git commit` 및 `git push origin main` 실행
4. Vercel 배포 트리거 상태 및 최신 커밋 해시 보고

---

## 4. 문제 발생 시 비상 롤백 및 동기화

원격 저장소와의 충돌이나 배포 롤백이 필요할 경우:
```powershell
# 최신 원격 변경사항 가져오기
git fetch origin main

# 직전 커밋으로 안전 복구
git reset --soft HEAD~1

# Vercel 특정 배포로 즉시 롤백 (Vercel 대시보드 -> Deployments -> Instant Rollback)
```
