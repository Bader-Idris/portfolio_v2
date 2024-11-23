import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import ElectronPlugin, { ElectronOptions } from 'vite-plugin-electron'
import RendererPlugin from 'vite-plugin-electron-renderer'
import EslintPlugin from 'vite-plugin-eslint'
// import VuetifyPlugin from 'vite-plugin-vuetify'
import legacy from '@vitejs/plugin-legacy' // it uses babel!
import VueJsx from '@vitejs/plugin-vue-jsx'
import Vue from '@vitejs/plugin-vue'
import { rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { builtinModules } from 'module'

// docs https://postcss.org/
import autoprefixer from 'autoprefixer' // Allows the use of modern CSS features with automatic polyfills.
import postcssPresetEnv from 'postcss-preset-env' // Allows the use of modern CSS features with automatic polyfills.
import flexbugsFixes from 'postcss-flexbugs-fixes' // Fixes common Flexbox layout issues
import postcssNesting from 'postcss-nesting' // Enables nesting of CSS rules similar to Sass
import postcssCustomMedia from 'postcss-custom-media' //  Allows the use of custom media queries
import postcssCustomProperties from 'postcss-custom-properties' // Polyfills CSS custom properties (variables) for better browser compatibility.
import postcssPxToRem from 'postcss-pxtorem' // Converts px units to rem, making your CSS responsive.

import VueRouter from 'unplugin-vue-router/vite' // vue-router types, must be prior to vue plugin

function isElectron(): boolean {
  // weird bugs if imported from @/router

  // Renderer process
  if (
    typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    // @ts-ignore
    window.process.type === 'renderer'
  ) {
    return true
  }

  // Main process
  if (
    typeof process !== 'undefined' &&
    typeof process.versions === 'object' &&
    !!process.versions.electron
  ) {
    return true
  }

  // User agent detection if nodeIntegration is set to true
  if (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.indexOf('Electron') >= 0
  ) {
    return true
  }

  return false
}

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

  // Delete the 'dist' folder only in production mode
  if (mode === 'production') {
    rmSync('dist', { recursive: true, force: true })
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

  const plugins = [
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
    EslintPlugin({
      // eslintPath: './eslint.config.js',
      // eslint 9.14.0 is a real headache
    }),

    // Docs: https://github.com/electron-vite/vite-plugin-electron
    ElectronPlugin(electronPluginConfigs),
    RendererPlugin()
    // {
    //    nodeIntegration: true // to skip security with electron and ipc we use this
    // }
  ]

  if (!isElectron) {
    plugins.push(
      legacy({
        // targets: ['./.babelrc'] // TODO: how to use the path of .babelrc??
        targets: '> 0.5%, last 2 versions, Firefox ESR, not dead'
      })
    )
  }

  return {
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,

      // BASE_URL: JSON.stringify(isDevEnv ? 'localhost:5173' : 'https://baderidris.com')
      'import.meta.env.BASE_URL': JSON.stringify(
        isDevEnv ? '' : 'https://baderidris.com' // HSTS header layer requires https only! to function!
      )

      /*
      define: {

    },
      */
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
      outDir: resolve('./dist')
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
            stage: 3, // Stage 3 includes many safe modern CSS features
            features: {
              'nesting-rules': true
            }
          }),
          flexbugsFixes,
          postcssNesting,
          postcssCustomMedia,
          postcssCustomProperties({
            preserve: false // Set to false to replace variables with their values
          }),
          postcssPxToRem({
            rootValue: 16,
            unitPrecision: 5,
            propList: ['*'] // Convert all properties from px to rem
          })
        ]
      }
    }
  }
})
