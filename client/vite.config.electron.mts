import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import ElectronPlugin, { ElectronOptions } from 'vite-plugin-electron'
import RendererPlugin from 'vite-plugin-electron-renderer'
import EslintPlugin from 'vite-plugin-eslint'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Vue from '@vitejs/plugin-vue'
import { rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { builtinModules } from 'module'

import autoprefixer from 'autoprefixer'
import postcssPresetEnv from 'postcss-preset-env'
import flexbugsFixes from 'postcss-flexbugs-fixes'
import postcssNesting from 'postcss-nesting'
import postcssCustomMedia from 'postcss-custom-media'
import postcssCustomProperties from 'postcss-custom-properties'
import postcssPxToRem from 'postcss-pxtorem'

import VueRouter from 'unplugin-vue-router/vite'
const isDevEnv = process.env.NODE_ENV === 'development'

export default defineConfig(({ mode }) => {
  process.env = {
    ...(isDevEnv
      ? {
          ELECTRON_ENABLE_LOGGING: 'true',
          NODE_OPTIONS: '--trace-warnings'
        }
      : {}),
    ...process.env,
    ...loadEnv(mode, process.cwd())
  }

  if (mode === 'production') {
    rmSync('dist-electron', { recursive: true, force: true })
  }

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
          outDir: 'dist-electron/main',
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
          outDir: 'dist-electron/preload'
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
          outDir: 'dist-electron/main'
        }
      }
    })
  }

  const plugins = [
    VueRouter({}),
    Vue(),
    VueJsx(),
    EslintPlugin({}),
    // Docs: https://github.com/electron-vite/vite-plugin-electron
    ElectronPlugin(electronPluginConfigs),
    RendererPlugin()
    // {
    //    nodeIntegration: true // to skip security with electron and ipc we use this
    // }
  ]

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
      outDir: resolve('./dist-electron')
    },
    plugins,
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
            grid: 'stable'
          }),
          postcssPresetEnv({
            stage: 3,
            features: {
              'nesting-rules': true
            }
          }),
          flexbugsFixes,
          postcssNesting,
          postcssCustomMedia,
          postcssCustomProperties({
            preserve: false
          }),
          postcssPxToRem({
            rootValue: 16,
            unitPrecision: 5,
            propList: ['*']
          })
        ]
      }
    }
  }
})
