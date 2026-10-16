import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

import { parseHtmlMetadata, getHeuristicMetadata, searchAppMarketsByKeyword } from './src/utils/urlAnalyzer.ts'
import { emailAuthServerPlugin } from './src/server/emailAuthPlugin.ts'

function copy404Plugin(): Plugin {
  return {
    name: 'copy-404-plugin',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist')
      const indexHtml = path.join(distDir, 'index.html')
      const notFoundHtml = path.join(distDir, '404.html')
      if (fs.existsSync(indexHtml)) {
        fs.copyFileSync(indexHtml, notFoundHtml)
      }
    }
  }
}

function urlAnalyzerServerPlugin(): Plugin {
  return {
    name: 'url-analyzer-server-plugin',
    configureServer(server) {
      server.middlewares.use('/api/analyze-target-url', async (req, res) => {
        try {
          const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost:5173'}`)
          const targetUrl = urlObj.searchParams.get('url')

          if (!targetUrl) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ success: false, error: 'URL parameter missing' }))
            return
          }

          let fetchUrl = targetUrl.trim()
          if (!/^https?:\/\//i.test(fetchUrl)) {
            fetchUrl = `https://${fetchUrl}`
          }

          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), 7000)

          const upstreamRes = await fetch(fetchUrl, {
            signal: controller.signal,
            redirect: 'follow',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
            }
          })
          clearTimeout(timeout)

          const redirectUrl = upstreamRes.url || fetchUrl
          const html = await upstreamRes.text()
          const parsed = parseHtmlMetadata(html, fetchUrl, redirectUrl, redirectUrl)

          // 2대 앱 마켓(Google Play & App Store) 실시간 키워드 조회
          if (!parsed.hasApp && parsed.serviceName) {
            try {
              const marketCheck = await searchAppMarketsByKeyword(parsed.serviceName, parsed.domain)
              if (marketCheck.hasApp && marketCheck.appInfo) {
                parsed.hasApp = true
                parsed.appInfo = marketCheck.appInfo
              }
            } catch (appErr) {
              // 스토어 검색 예외 무시
            }
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ success: true, data: parsed }))
        } catch (err: any) {
          const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost:5173'}`)
          const targetUrl = urlObj.searchParams.get('url') || 'target.com'
          const fallback = getHeuristicMetadata(targetUrl)
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ success: true, data: fallback, warning: err?.message }))
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copy404Plugin(), urlAnalyzerServerPlugin(), emailAuthServerPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name]-[hash].js`,
        chunkFileNames: `[name]-[hash].js`,
        assetFileNames: `[name]-[hash].[ext]`
      }
    }
  }
})
