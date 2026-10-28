import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import https from 'node:https'
import http from 'node:http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

import { parseHtmlMetadata, getHeuristicMetadata, searchAppMarketsByKeyword } from './src/utils/urlAnalyzer.ts'
import { emailAuthServerPlugin } from './src/server/emailAuthPlugin.ts'
import { snsFeedServerPlugin } from './src/server/snsFeedPlugin.ts'

async function fetchHtmlWithLegacyFallback(targetUrl: string): Promise<{ html: string; redirectUrl: string }> {
  // 1차 시도: 표준 fetch
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)

    const upstreamRes = await fetch(targetUrl, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    })
    clearTimeout(timeout)

    if (upstreamRes.ok) {
      const redirectUrl = upstreamRes.url || targetUrl
      const html = await upstreamRes.text()
      return { html, redirectUrl }
    }
  } catch (_fetchErr) {
    // SSL 핸드셰이크 실패(ERR_SSL_DH_KEY_TOO_SMALL 등) 시 2차 fallback 진행
  }

  // 2차 시도: node:https 레거시 cipher(DEFAULT:@SECLEVEL=0) 및 rejectUnauthorized: false 적용 fallback
  return new Promise((resolve, reject) => {
    function doRequest(currentUrl: string, redirectCount = 0) {
      if (redirectCount > 5) return reject(new Error('Too many redirects'))
      try {
        const parsedUrl = new URL(currentUrl)
        const isHttps = parsedUrl.protocol === 'https:'
        const client = isHttps ? https : http

        const options = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || (isHttps ? 443 : 80),
          path: parsedUrl.pathname + parsedUrl.search,
          method: 'GET',
          rejectUnauthorized: false,
          ciphers: 'DEFAULT:@SECLEVEL=0',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            'Host': parsedUrl.hostname
          }
        }

        const req = client.request(options, (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const nextUrl = new URL(res.headers.location, currentUrl).href
            return doRequest(nextUrl, redirectCount + 1)
          }

          const chunks: Buffer[] = []
          res.on('data', (chunk: Buffer) => chunks.push(chunk))
          res.on('end', () => {
            const buffer = Buffer.concat(chunks)
            const contentType = res.headers['content-type'] || ''
            let encoding = 'utf-8'
            if (/euc-kr|ks_c_5601|ksc5601/i.test(contentType)) {
              encoding = 'euc-kr'
            } else {
              const sample = buffer.subarray(0, 1024).toString('ascii')
              if (/charset=['"]?(euc-kr|ks_c_5601|ksc5601)/i.test(sample)) {
                encoding = 'euc-kr'
              }
            }
            const decoder = new TextDecoder(encoding)
            const html = decoder.decode(buffer)
            resolve({ html, redirectUrl: currentUrl })
          })
        })

        req.on('error', (err) => reject(err))
        req.setTimeout(8000, () => {
          req.destroy()
          reject(new Error('Request timed out'))
        })
        req.end()
      } catch (err) {
        reject(err)
      }
    }

    doRequest(targetUrl)
  })
}

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

          const { html, redirectUrl } = await fetchHtmlWithLegacyFallback(fetchUrl)
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

const BUILD_TIME = Date.now()
const BUILD_VERSION = `v-${BUILD_TIME}`

function versionPlugin(): Plugin {
  return {
    name: 'vite-plugin-version',
    buildStart() {
      const versionData = {
        version: BUILD_VERSION,
        buildTime: BUILD_TIME,
        builtAt: new Date().toISOString()
      }
      try {
        fs.mkdirSync(path.resolve(__dirname, 'public'), { recursive: true })
        fs.writeFileSync(
          path.resolve(__dirname, 'public/version.json'),
          JSON.stringify(versionData, null, 2)
        )
      } catch (e) {
        console.warn('Failed to write public/version.json', e)
      }
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({
          version: BUILD_VERSION,
          buildTime: BUILD_TIME,
          builtAt: new Date().toISOString()
        }, null, 2)
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_BUILD_TIME__: JSON.stringify(BUILD_TIME),
    __APP_VERSION__: JSON.stringify(BUILD_VERSION)
  },
  plugins: [
    react(),
    versionPlugin(),
    copy404Plugin(),
    urlAnalyzerServerPlugin(),
    emailAuthServerPlugin(),
    snsFeedServerPlugin()
  ],
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
