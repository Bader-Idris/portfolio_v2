// vite.config.mts
import { fileURLToPath } from 'url'
import {
  defineConfig,
  loadEnv
} from 'file:///E:/coding_and_programming/portfolio_v2/client/node_modules/vite/dist/node/index.js'
import ElectronPlugin from 'file:///E:/coding_and_programming/portfolio_v2/client/node_modules/vite-plugin-electron/dist/index.mjs'
import RendererPlugin from 'file:///E:/coding_and_programming/portfolio_v2/client/node_modules/vite-plugin-electron-renderer/dist/index.mjs'
import EslintPlugin from 'file:///E:/coding_and_programming/portfolio_v2/client/node_modules/vite-plugin-eslint/dist/index.mjs'
import VueJsx from 'file:///E:/coding_and_programming/portfolio_v2/client/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs'
import Vue from 'file:///E:/coding_and_programming/portfolio_v2/client/node_modules/@vitejs/plugin-vue/dist/index.mjs'
import { rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { builtinModules } from 'module'
import autoprefixer from 'file:///E:/coding_and_programming/portfolio_v2/client/node_modules/autoprefixer/lib/autoprefixer.js'
import postcssPresetEnv from 'file:///E:/coding_and_programming/portfolio_v2/client/node_modules/postcss-preset-env/dist/index.mjs'
import flexbugsFixes from 'file:///E:/coding_and_programming/portfolio_v2/client/node_modules/postcss-flexbugs-fixes/index.js'
import postcssNesting from 'file:///E:/coding_and_programming/portfolio_v2/client/node_modules/postcss-nesting/dist/index.mjs'
import postcssCustomMedia from 'file:///E:/coding_and_programming/portfolio_v2/client/node_modules/postcss-custom-media/dist/index.mjs'
import postcssCustomProperties from 'file:///E:/coding_and_programming/portfolio_v2/client/node_modules/postcss-custom-properties/dist/index.mjs'
import postcssPxToRem from 'file:///E:/coding_and_programming/portfolio_v2/client/node_modules/postcss-pxtorem/index.js'
import VueRouter from 'file:///E:/coding_and_programming/portfolio_v2/client/node_modules/unplugin-vue-router/dist/vite.js'
var __vite_injected_original_import_meta_url =
  'file:///E:/coding_and_programming/portfolio_v2/client/vite.config.mts'
var isDevEnv = process.env.NODE_ENV === 'development'
var vite_config_default = defineConfig(({ mode }) => {
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
    rmSync('dist', { recursive: true, force: true })
  }
  const electronPluginConfigs = [
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
  return {
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
      // BASE_URL: JSON.stringify(isDevEnv ? 'localhost:5173' : 'https://baderidris.com')
      'import.meta.env.BASE_URL': JSON.stringify(
        isDevEnv ? 'http://localhost:5173' : 'https://baderidris.com'
      )
      /*
            define: {
      
          },
            */
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.vue', '.json', '.scss'],
      alias: {
        '@': resolve(dirname(fileURLToPath(__vite_injected_original_import_meta_url)), 'src'),
        '~': resolve(
          dirname(fileURLToPath(__vite_injected_original_import_meta_url)),
          './src/assets/scss'
        )
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
            stage: 3,
            // Stage 3 includes many safe modern CSS features
            features: {
              'nesting-rules': true
            }
          }),
          flexbugsFixes,
          postcssNesting,
          postcssCustomMedia,
          postcssCustomProperties({
            preserve: false
            // Set to false to replace variables with their values
          }),
          postcssPxToRem({
            rootValue: 16,
            unitPrecision: 5,
            propList: ['*']
            // Convert all properties from px to rem
          })
        ]
      }
    }
  }
})
export { vite_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcY29kaW5nX2FuZF9wcm9ncmFtbWluZ1xcXFxwb3J0Zm9saW9fdjJcXFxcY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxjb2RpbmdfYW5kX3Byb2dyYW1taW5nXFxcXHBvcnRmb2xpb192MlxcXFxjbGllbnRcXFxcdml0ZS5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9jb2RpbmdfYW5kX3Byb2dyYW1taW5nL3BvcnRmb2xpb192Mi9jbGllbnQvdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgRWxlY3Ryb25QbHVnaW4sIHsgRWxlY3Ryb25PcHRpb25zIH0gZnJvbSAndml0ZS1wbHVnaW4tZWxlY3Ryb24nXG5pbXBvcnQgUmVuZGVyZXJQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tZWxlY3Ryb24tcmVuZGVyZXInXG5pbXBvcnQgRXNsaW50UGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLWVzbGludCdcbi8vIGltcG9ydCBWdWV0aWZ5UGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZXRpZnknXG5pbXBvcnQgbGVnYWN5IGZyb20gJ0B2aXRlanMvcGx1Z2luLWxlZ2FjeScgLy8gaXQgdXNlcyBiYWJlbCFcbmltcG9ydCBWdWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCBWdWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHsgcm1TeW5jIH0gZnJvbSAnZnMnXG5pbXBvcnQgeyByZXNvbHZlLCBkaXJuYW1lIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGJ1aWx0aW5Nb2R1bGVzIH0gZnJvbSAnbW9kdWxlJ1xuXG4vLyBkb2NzIGh0dHBzOi8vcG9zdGNzcy5vcmcvXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcicgLy8gQWxsb3dzIHRoZSB1c2Ugb2YgbW9kZXJuIENTUyBmZWF0dXJlcyB3aXRoIGF1dG9tYXRpYyBwb2x5ZmlsbHMuXG5pbXBvcnQgcG9zdGNzc1ByZXNldEVudiBmcm9tICdwb3N0Y3NzLXByZXNldC1lbnYnIC8vIEFsbG93cyB0aGUgdXNlIG9mIG1vZGVybiBDU1MgZmVhdHVyZXMgd2l0aCBhdXRvbWF0aWMgcG9seWZpbGxzLlxuaW1wb3J0IGZsZXhidWdzRml4ZXMgZnJvbSAncG9zdGNzcy1mbGV4YnVncy1maXhlcycgLy8gRml4ZXMgY29tbW9uIEZsZXhib3ggbGF5b3V0IGlzc3Vlc1xuaW1wb3J0IHBvc3Rjc3NOZXN0aW5nIGZyb20gJ3Bvc3Rjc3MtbmVzdGluZycgLy8gRW5hYmxlcyBuZXN0aW5nIG9mIENTUyBydWxlcyBzaW1pbGFyIHRvIFNhc3NcbmltcG9ydCBwb3N0Y3NzQ3VzdG9tTWVkaWEgZnJvbSAncG9zdGNzcy1jdXN0b20tbWVkaWEnIC8vICBBbGxvd3MgdGhlIHVzZSBvZiBjdXN0b20gbWVkaWEgcXVlcmllc1xuaW1wb3J0IHBvc3Rjc3NDdXN0b21Qcm9wZXJ0aWVzIGZyb20gJ3Bvc3Rjc3MtY3VzdG9tLXByb3BlcnRpZXMnIC8vIFBvbHlmaWxscyBDU1MgY3VzdG9tIHByb3BlcnRpZXMgKHZhcmlhYmxlcykgZm9yIGJldHRlciBicm93c2VyIGNvbXBhdGliaWxpdHkuXG5pbXBvcnQgcG9zdGNzc1B4VG9SZW0gZnJvbSAncG9zdGNzcy1weHRvcmVtJyAvLyBDb252ZXJ0cyBweCB1bml0cyB0byByZW0sIG1ha2luZyB5b3VyIENTUyByZXNwb25zaXZlLlxuXG5pbXBvcnQgVnVlUm91dGVyIGZyb20gJ3VucGx1Z2luLXZ1ZS1yb3V0ZXIvdml0ZScgLy8gdnVlLXJvdXRlciB0eXBlcywgbXVzdCBiZSBwcmlvciB0byB2dWUgcGx1Z2luXG4vLyBAdHMtaWdub3JlXG4vLyBpbXBvcnQgeyBpc0VsZWN0cm9uIH0gZnJvbSAnLi9zcmMvcm91dGVyJ1xuXG5jb25zdCBpc0RldkVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgcHJvY2Vzcy5lbnYgPSB7XG4gICAgLi4uKGlzRGV2RW52XG4gICAgICA/IHtcbiAgICAgICAgICBFTEVDVFJPTl9FTkFCTEVfTE9HR0lORzogJ3RydWUnLFxuICAgICAgICAgIE5PREVfT1BUSU9OUzogJy0tdHJhY2Utd2FybmluZ3MnXG4gICAgICAgIH1cbiAgICAgIDoge30pLFxuICAgIC4uLnByb2Nlc3MuZW52LFxuICAgIC4uLmxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSlcbiAgfVxuXG4gIC8vIERlbGV0ZSB0aGUgJ2Rpc3QnIGZvbGRlciBvbmx5IGluIHByb2R1Y3Rpb24gbW9kZVxuICBpZiAobW9kZSA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgcm1TeW5jKCdkaXN0JywgeyByZWN1cnNpdmU6IHRydWUsIGZvcmNlOiB0cnVlIH0pXG4gIH1cblxuICBjb25zdCBlbGVjdHJvblBsdWdpbkNvbmZpZ3M6IEVsZWN0cm9uT3B0aW9uc1tdID0gW1xuICAgIHtcbiAgICAgIGVudHJ5OiAnc3JjL2VsZWN0cm9uL21haW4vaW5kZXgudHMnLFxuICAgICAgb25zdGFydCh7IHN0YXJ0dXAgfSkge1xuICAgICAgICBzdGFydHVwKClcbiAgICAgIH0sXG4gICAgICB2aXRlOiB7XG4gICAgICAgIHJvb3Q6IHJlc29sdmUoJy4nKSxcbiAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICBhc3NldHNEaXI6ICcuJyxcbiAgICAgICAgICBvdXREaXI6ICdkaXN0L21haW4nLFxuICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgIGV4dGVybmFsOiBbJ2VsZWN0cm9uJywgLi4uYnVpbHRpbk1vZHVsZXNdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBlbnRyeTogJ3NyYy9lbGVjdHJvbi9wcmVsb2FkL2luZGV4LnRzJyxcbiAgICAgIG9uc3RhcnQoeyByZWxvYWQgfSkge1xuICAgICAgICByZWxvYWQoKVxuICAgICAgfSxcbiAgICAgIHZpdGU6IHtcbiAgICAgICAgcm9vdDogcmVzb2x2ZSgnLicpLFxuICAgICAgICBidWlsZDoge1xuICAgICAgICAgIG91dERpcjogJ2Rpc3QvcHJlbG9hZCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIGlmIChpc0RldkVudikge1xuICAgIGVsZWN0cm9uUGx1Z2luQ29uZmlncy5wdXNoKHtcbiAgICAgIGVudHJ5OiAnc3JjL2VsZWN0cm9uL21haW4vaW5kZXguZGV2LnRzJyxcbiAgICAgIHZpdGU6IHtcbiAgICAgICAgcm9vdDogcmVzb2x2ZSgnLicpLFxuICAgICAgICBidWlsZDoge1xuICAgICAgICAgIG91dERpcjogJ2Rpc3QvbWFpbidcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBwbHVnaW5zID0gW1xuICAgIC8vIERvY3M6IGh0dHBzOi8vZ2l0aHViLmNvbS9wb3N2YS91bnBsdWdpbi12dWUtcm91dGVyXG4gICAgVnVlUm91dGVyKHtcbiAgICAgIC8qIG9wdGlvbnMgKi9cbiAgICB9KSxcbiAgICBWdWUoKSxcbiAgICBWdWVKc3goKSxcbiAgICAvLyBEb2NzOiBodHRwczovL2dpdGh1Yi5jb20vdnVldGlmeWpzL3Z1ZXRpZnktbG9hZGVyXG4gICAgLy8gVnVldGlmeVBsdWdpbih7XG4gICAgLy8gICBhdXRvSW1wb3J0OiB0cnVlXG4gICAgLy8gfSksXG4gICAgLy8gRG9jczogaHR0cHM6Ly9naXRodWIuY29tL2d4bWFyaTAwNy92aXRlLXBsdWdpbi1lc2xpbnRcbiAgICBFc2xpbnRQbHVnaW4oe1xuICAgICAgLy8gZXNsaW50UGF0aDogJy4vZXNsaW50LmNvbmZpZy5qcycsXG4gICAgICAvLyBlc2xpbnQgOS4xNC4wIGlzIGEgcmVhbCBoZWFkYWNoZVxuICAgIH0pLFxuXG4gICAgLy8gRG9jczogaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uLXZpdGUvdml0ZS1wbHVnaW4tZWxlY3Ryb25cbiAgICBFbGVjdHJvblBsdWdpbihlbGVjdHJvblBsdWdpbkNvbmZpZ3MpLFxuICAgIFJlbmRlcmVyUGx1Z2luKClcbiAgICAvLyB7XG4gICAgLy8gICAgbm9kZUludGVncmF0aW9uOiB0cnVlIC8vIHRvIHNraXAgc2VjdXJpdHkgd2l0aCBlbGVjdHJvbiBhbmQgaXBjIHdlIHVzZSB0aGlzXG4gICAgLy8gfVxuICBdXG5cbiAgLy8gaWYgKCFpc0VsZWN0cm9uKSB7XG4gIC8vICAgcGx1Z2lucy5wdXNoKFxuICAvLyAgICAgbGVnYWN5KHtcbiAgLy8gICAgICAgLy8gdGFyZ2V0czogWycuLy5iYWJlbHJjJ10gLy8gVE9ETzogaG93IHRvIHVzZSB0aGUgcGF0aCBvZiAuYmFiZWxyYz8/XG4gIC8vICAgICAgIHRhcmdldHM6ICc+IDAuNSUsIGxhc3QgMiB2ZXJzaW9ucywgRmlyZWZveCBFU1IsIG5vdCBkZWFkJ1xuICAvLyAgICAgfSlcbiAgLy8gICApXG4gIC8vIH1cblxuICByZXR1cm4ge1xuICAgIGRlZmluZToge1xuICAgICAgX19WVUVfSTE4Tl9GVUxMX0lOU1RBTExfXzogdHJ1ZSxcbiAgICAgIF9fVlVFX0kxOE5fTEVHQUNZX0FQSV9fOiBmYWxzZSxcbiAgICAgIF9fSU5UTElGWV9QUk9EX0RFVlRPT0xTX186IGZhbHNlLFxuXG4gICAgICAvLyBCQVNFX1VSTDogSlNPTi5zdHJpbmdpZnkoaXNEZXZFbnYgPyAnbG9jYWxob3N0OjUxNzMnIDogJ2h0dHBzOi8vYmFkZXJpZHJpcy5jb20nKVxuICAgICAgJ2ltcG9ydC5tZXRhLmVudi5CQVNFX1VSTCc6IEpTT04uc3RyaW5naWZ5KFxuICAgICAgICBpc0RldkVudiA/ICdodHRwOi8vbG9jYWxob3N0OjUxNzMnIDogJ2h0dHBzOi8vYmFkZXJpZHJpcy5jb20nXG4gICAgICApXG5cbiAgICAgIC8qXG4gICAgICBkZWZpbmU6IHtcblxuICAgIH0sXG4gICAgICAqL1xuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgZXh0ZW5zaW9uczogWycubWpzJywgJy5qcycsICcudHMnLCAnLnZ1ZScsICcuanNvbicsICcuc2NzcyddLFxuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiByZXNvbHZlKGRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKSwgJ3NyYycpLFxuICAgICAgICAnfic6IHJlc29sdmUoZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpLCAnLi9zcmMvYXNzZXRzL3Njc3MnKVxuICAgICAgfVxuICAgIH0sXG4gICAgYmFzZTogJy4vJyxcbiAgICByb290OiByZXNvbHZlKCcuL3NyYycpLFxuICAgIHB1YmxpY0RpcjogcmVzb2x2ZSgnLi9zcmMvcHVibGljJyksXG4gICAgY2xlYXJTY3JlZW46IGZhbHNlLFxuICAgIGJ1aWxkOiB7XG4gICAgICBzb3VyY2VtYXA6IGlzRGV2RW52LFxuICAgICAgbWluaWZ5OiAhaXNEZXZFbnYsXG4gICAgICBvdXREaXI6IHJlc29sdmUoJy4vZGlzdCcpXG4gICAgfSxcbiAgICBwbHVnaW5zLFxuICAgIGNzczoge1xuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAdXNlIFwiLi9zcmMvYXNzZXRzL3Njc3MvbWFpbi5zY3NzXCIgYXMgKjtgLFxuICAgICAgICAgIHNpbGVuY2VEZXByZWNhdGlvbnM6IFsnbGVnYWN5LWpzLWFwaSddXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwb3N0Y3NzOiB7XG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgYXV0b3ByZWZpeGVyKHtcbiAgICAgICAgICAgIGFkZDogdHJ1ZSxcbiAgICAgICAgICAgIGdyaWQ6ICdzdGFibGUnXG4gICAgICAgICAgfSksXG4gICAgICAgICAgcG9zdGNzc1ByZXNldEVudih7XG4gICAgICAgICAgICBzdGFnZTogMywgLy8gU3RhZ2UgMyBpbmNsdWRlcyBtYW55IHNhZmUgbW9kZXJuIENTUyBmZWF0dXJlc1xuICAgICAgICAgICAgZmVhdHVyZXM6IHtcbiAgICAgICAgICAgICAgJ25lc3RpbmctcnVsZXMnOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSksXG4gICAgICAgICAgZmxleGJ1Z3NGaXhlcyxcbiAgICAgICAgICBwb3N0Y3NzTmVzdGluZyxcbiAgICAgICAgICBwb3N0Y3NzQ3VzdG9tTWVkaWEsXG4gICAgICAgICAgcG9zdGNzc0N1c3RvbVByb3BlcnRpZXMoe1xuICAgICAgICAgICAgcHJlc2VydmU6IGZhbHNlIC8vIFNldCB0byBmYWxzZSB0byByZXBsYWNlIHZhcmlhYmxlcyB3aXRoIHRoZWlyIHZhbHVlc1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIHBvc3Rjc3NQeFRvUmVtKHtcbiAgICAgICAgICAgIHJvb3RWYWx1ZTogMTYsXG4gICAgICAgICAgICB1bml0UHJlY2lzaW9uOiA1LFxuICAgICAgICAgICAgcHJvcExpc3Q6IFsnKiddIC8vIENvbnZlcnQgYWxsIHByb3BlcnRpZXMgZnJvbSBweCB0byByZW1cbiAgICAgICAgICB9KVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVSxTQUFTLHFCQUFxQjtBQUNqVyxTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLG9CQUF5QztBQUNoRCxPQUFPLG9CQUFvQjtBQUMzQixPQUFPLGtCQUFrQjtBQUd6QixPQUFPLFlBQVk7QUFD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
