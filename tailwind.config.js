/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Pretendard Variable"',
          '"Pretendard"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          '"Helvetica Neue"',
          '"Segoe UI"',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          '"Malgun Gothic"',
          'sans-serif'
        ],
        mono: [
          '"Pretendard Variable"',
          '"Pretendard"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace'
        ]
      },
      colors: {
        dark: {
          950: '#070a12',
          900: '#0d1322',
          850: '#121a2d',
          800: '#17223b',
          700: '#223152',
          600: '#33456c'
        },
        // 3색(파랑, 보라, 빨강) + 1강조색(초록) 단일 규정
        brand: {
          blue: '#38bdf8',       // 기본색 1: 파랑 (웹·기본 데이터)
          purple: '#8133ff',     // 기본색 2: 보라 (앱·전략 지표)
          purpleLight: '#a855f7',
          rose: '#f43f5e',       // 기본색 3: 빨강 (주의·경고·리스크)
          emerald: '#10b981',    // 강조색 1: 초록 (성장·하이라이트)
          cyan: '#38bdf8',       // 파랑 계열 통합
          amber: '#10b981',      // 비규격 색상을 강조 초록으로 일원화
        }
      }
    },
  },
  plugins: [],
}
