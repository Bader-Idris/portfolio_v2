/* eslint-disable no-template-curly-in-string */

// TODO: check this out https://www.electron.build/configuration.html
const dotenv = require('dotenv')
const packageJson = require('../../package.json')

dotenv.config()

const baseConfig = {
  productName: packageJson.name,
  appId: packageJson.appId,
  // appId: "com.example.app"
  asar: true,
  extends: null,
  compression: 'maximum',
  artifactName: '${productName} ${version}_${arch}.${ext}',
  directories: {
    output: './release/${version}'
  },
  mac: {
    bundleVersion: '1.0',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    notarize: process.env.MAC_NOTARIZE === 'true', // ! Enables notarization conditionally
    icon: 'buildAssets/resources/icon.icns',
    type: 'distribution',
    identity: process.env.MAC_CODE_SIGN_IDENTITY || null, // ! For macOS signing
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64', 'universal']
      }
    ]
  },
  dmg: {
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications'
      },
      {
        x: 130,
        y: 150,
        type: 'file'
      }
    ],
    sign: false
  },
  win: {
    icon: 'buildAssets/resources/icon.ico',
    certificateFile: process.env.WIN_CSC_LINK, // ! Path to .pfx file for Windows
    certificatePassword: process.env.WIN_CSC_KEY_PASSWORD, // ! Password for Windows certificate
    target: [
      {
        target: 'appx', // ? requires certificate
        arch: 'x64'
      },
      {
        target: 'zip',
        arch: 'x64'
      },
      {
        target: 'portable',
        arch: 'x64'
      },
      {
        target: 'nsis', // ? requires certificate
        arch: 'x64'
      }
    ]
  },
  portable: {
    artifactName: '${productName} ${version}_${arch} Portable.${ext}'
  },
  nsis: {
    oneClick: true
    /*
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false
    */
  },
  linux: {
    executableName: packageJson.name.toLowerCase(),
    icon: 'buildAssets/resources',
    category: 'Utility',
    target: [
      {
        target: 'snap',
        arch: 'x64'
      },
      {
        target: 'deb',
        arch: 'x64'
      },
      {
        target: 'rpm',
        arch: 'x64'
      }
    ]
  }

  // check https://raw.githubusercontent.com/electron-userland/electron-builder/master/packages/app-builder-lib/scheme.json
}

baseConfig.copyright = `ⓒ ${new Date().getFullYear()} $\{author}`
baseConfig.files = [
  /* should/shouldn't be included in electron's build */
  'dist/**/*',
  '!dist/main/index.dev.js',
  '!docs/**/*',
  '!tests/**/*',
  '!release/**/*',
  '!node_modules/**/*'
]

// Notarization script for macOS (if enabled)
if (process.env.MAC_NOTARIZE === 'true') {
  baseConfig.afterSign = './buildAssets/builder/notarize.ts'
}

module.exports = {
  ...baseConfig
}
