import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import ElectronPlugin, { ElectronOptions } from 'vite-plugin-electron'
import RendererPlugin from 'vite-plugin-electron-renderer'
import EslintPlugin from 'vite-plugin-eslint'
// import VuetifyPlugin from 'vite-plugin-vuetify'
import babel from 'vite-plugin-babel'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Vue from '@vitejs/plugin-vue'
import { rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { builtinModules } from 'module'

import autoprefixer from 'autoprefixer'
// this pkg is to handle types with vue router, should be prior to vue plugin
import VueRouter from 'unplugin-vue-router/vite'

const isDevEnv = process.env.NODE_ENV === 'development'

export default defineConfig(({ mode }) => {
  process.env = {
    ...(isDevEnv
      ? {
          ELECTRON_ENABLE_LOGGING: 'true'
        }
      : {}),
    ...process.env,
    ...loadEnv(mode, process.cwd())
  }

  rmSync('dist', { recursive: true, force: true })

  const electronPluginConfigs: ElectronOptions[] = [
    {
      entry: 'src/electron/main/index.ts',
      onstart({ startup }) {
        startup()
      },
      vite: {
        root: resolve('.'),
        build: {
          assetsDir: '.',
          outDir: 'dist/main',
          rollupOptions: {
            external: ['electron', ...builtinModules]
          }
        }
      }
    },
    {
      entry: 'src/electron/preload/index.ts',
      onstart({ reload }) {
        reload()
      },
      vite: {
        root: resolve('.'),
        build: {
          outDir: 'dist/preload'
        }
      }
    }
  ]

  if (isDevEnv) {
    electronPluginConfigs.push({
      entry: 'src/electron/main/index.dev.ts',
      vite: {
        root: resolve('.'),
        build: {
          outDir: 'dist/main'
        }
      }
    })
  }

  return {
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.vue', '.json', '.scss'],
      alias: {
        '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
        // scss alias
        '~': resolve(dirname(fileURLToPath(import.meta.url)), './src/assets/scss')
      }
    },
    base: './',
    root: resolve('./src'),
    publicDir: resolve('./src/public'),
    clearScreen: false,
    build: {
      sourcemap: isDevEnv,
      minify: !isDevEnv,
      outDir: resolve('./dist')
    },
    plugins: [
      // Docs: https://github.com/posva/unplugin-vue-router
      VueRouter({
        /* options */
      }),
      Vue(),
      VueJsx(),
      // Docs: https://github.com/vuetifyjs/vuetify-loader
      // VuetifyPlugin({
      //   autoImport: true
      // }),
      // Docs: https://github.com/gxmari007/vite-plugin-eslint
      EslintPlugin(),
      babel({
        babelConfig: true
      }),
      // Docs: https://github.com/electron-vite/vite-plugin-electron
      ElectronPlugin(electronPluginConfigs),
      RendererPlugin({
        // nodeIntegration: true // to skip security with electron and ipc we use this
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/assets/scss/main.scss" as *;`,
          silenceDeprecations: ['legacy-js-api']
        }
      },
      postcss: {
        plugins: [
          // @ts-ignore
          autoprefixer({
            add: true,
            grid: 'stable',
            flexbox: true,
            cascade: false
            // overrideBrowserslist: [ // ai says it'll automaticall check for .browserslistrc file
            //   'defaults and fully supports es6-module',
            //   'maintained node versions'
            // ]
          })
        ]
      }
    }
  }
})
