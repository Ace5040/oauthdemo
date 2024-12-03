import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { defineConfig, type UserConfigExport, loadEnv } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
const env = loadEnv('', '');

const devBuild: UserConfigExport = {
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  server: {
    https: true,
    host: 'epcsloc.test',
    strictPort: true,
    port: 9000,
    proxy: {
      '/blitz-public': {
        target: env.VITE_SERVER_URL,
        secure: false,
        changeOrigin: true,
        followRedirects: false,
      },
      '/blitz-internal': {
        target: env.VITE_SERVER_URL,
        secure: false,
        changeOrigin: true,
        followRedirects: false,
      },
      '/api': {
        target: env.VITE_SERVER_URL,
        secure: false,
        changeOrigin: true,
        followRedirects: true,
      }
    }
  },
  base: "/demo",
  plugins: [
    basicSsl({
      name: 'epcsloc.test',
      domains: ['*.epcsloc.test']
    }),
    vue(),
    svgLoader(),
  ],
}

const productionBuild: UserConfigExport = {
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  build: {
    sourcemap: false
  },
  base: "/demo",
  plugins: [
    vue(),
    svgLoader(),
  ],
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === "serve") return devBuild
  else return productionBuild
})
