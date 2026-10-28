import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initChunkErrorRecovery } from './utils/chunkErrorRecovery.ts'

// 구버전 청크 로드 실패 시 자동 캐시 파기 및 최신 페이지 리셋 인터셉터 가동
initChunkErrorRecovery()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
