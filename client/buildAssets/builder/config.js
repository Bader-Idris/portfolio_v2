/* eslint-disable no-template-curly-in-string */

// TODO: check this out https://www.electron.build/configuration.html
const path = require('path')
const dotenv = require('dotenv')
const packageJson = require('../../package.json')

// console.log('Loading .env from:', path.resolve(__dirname, './envs/.env'))
dotenv.config({
  path: path.resolve(__dirname, './envs/.env'),
  debug: true
})

// Get formatted current date
function getLocalTimestamp() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Month is zero-based
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}${month}${day}_${hours}${minutes}`
}

const baseConfig = {
  /*
  configuration.win should be one of these:
  object { additionalCertificateFile?, appId?, artifactName?, asar?, asarUnpack?, azureSignOptions?, certificateFile?,
  certificatePassword?, certificateSha1?, certificateSubjectName?, compression?, cscKeyPassword?, cscLink?, defaultArch?,
  detectUpdateChannel?, disableDefaultIgnoredFiles?, electronLanguages?, electronUpdaterCompatibility?, executableName?,
  extraFiles?, extraResources?, fileAssociations?, files?, forceCodeSigning?, generateUpdatesFilesForAllChannels?, icon?,
  legalTrademarks?, protocols?, publish?, publisherName?, releaseInfo?, requestedExecutionLevel?, rfc3161TimeStampServer?,
  sign?, signAndEditExecutable?, signDlls?, signExts?, signingHashAlgorithms?, signtoolOptions?, target?, timeStampServer?,
  verifyUpdateCodeSignature? } | null
*/

  productName: packageJson.name,
  // afterSign: './createMD5List.js',
  appId: packageJson.appId,
  asar: true,
  // extends: null,
  compression: 'maximum',
  artifactName: `${packageJson.name}_${packageJson.version}_${getLocalTimestamp()}_${process.arch}.exe`,
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
    target: [{ target: 'dmg', arch: ['x64', 'arm64', 'universal'] }]
  },
  dmg: {
    contents: [
      { x: 410, y: 150, type: 'link', path: '/Applications' },
      { x: 130, y: 150, type: 'file' }
    ],
    sign: false
  },
  win: {
    icon: 'buildAssets/resources/icon.ico',

    // sign: './signatures/winSign.js',
    // signingHashAlgorithms: ['sha256'],
    publish: [
      {
        provider: 'github', // must be github | s3 | spaces | generic | custom | keygen | snapStore | bitbucket
        owner: 'Bader-Idris',
        repo: 'Bader-Idris',
        private: true
      }
    ],
    forceCodeSigning: true, // to fill the build if code signing failed or is invalid
    // forceCodeSigning: false,
    // sign: false,
    // "rfc3161TimeStampServer": "http://timestamp.comodoca.com/rfc3161",
    // timeStampServer: 'http://timestamp.comodoca.com',

    // signtoolOptions: {
    //   certificateFile: process.env.WIN_CSC_LINK || 'buildAssets/builder/envs/Cert.pfx',
    //   certificatePassword: process.env.WIN_CSC_KEY_PASSWORD || null,

    publisherName: 'Bader-Idris',
    // },
    target: [
      { target: 'appx', arch: 'x64' },
      { target: 'zip', arch: 'x64' },
      { target: 'portable', arch: 'x64' },
      { target: 'nsis', arch: 'x64' }
    ]
  },
  portable: {
    artifactName: '${productName}_${version}_${arch}_Portable.${ext}'
  },
  nsis: {
    oneClick: true
    /*
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false

    "runAfterFinish": true,
    "menuCategory": true,
    "uninstallDisplayName": "${productName}",
    */
  },
  linux: {
    executableName: packageJson.name.toLowerCase(),
    icon: 'buildAssets/resources',
    category: 'Utility',
    target: [
      { target: 'snap', arch: 'x64' },
      { target: 'deb', arch: 'x64' },
      { target: 'rpm', arch: 'x64' }
      /*
        "tar.bz2",
      "AppImage",
      "deb",
      "freebsd",
      "pacman",
      "rpm",
      "snap"
      */
    ]
    // synopsis: 'Mod Manager',
    // description: 'The elegant, powerful, and open-source mod manager from Nexus Mods.',
    // maintainer: 'Black Tree Gaming Ltd. <support@nexusmods.com> (https://www.nexusmods.com/)',
    // mimeTypes: ['x-scheme-handler/nxm'],
  },
  files: [
    'dist/**/*',
    '!dist/main/index.dev.js',
    '!buildAssets/builder/envs', // important security to hide our certs from third parties, or in the app bundle
    '!docs/**/*',
    '!tests/**/*',
    '!release/**/*',
    '!node_modules/**/*'
  ]

  // check https://raw.githubusercontent.com/electron-userland/electron-builder/master/packages/app-builder-lib/scheme.json
}
baseConfig.copyright = `ⓒ ${new Date().getFullYear()} ${packageJson.author}`

// baseConfig.copyright = `ⓒ ${new Date().getFullYear()} $\{author}`
// baseConfig.files = [
//   /* should/shouldn't be included in electron's build */
//   'dist/**/*',
//   '!dist/main/index.dev.js',
//   '!docs/**/*',
//   '!tests/**/*',
//   '!release/**/*',
//   '!node_modules/**/*'
// ]

// TODO: check this useful notifier repo: https://github.com/mikaelbr/node-notifier

// TODO: check these for electron inspiration:
/*
  https://github.com/Nexus-Mods/Vortex
  https://github.com/Nexus-Mods/Vortex/blob/master/download-codesigntool.ps1

  https://github.com/Nexus-Mods/Vortex/blob/master/createMD5List.js
  https://github.com/Nexus-Mods/Vortex/blob/master/sign.js
  https://github.com/Nexus-Mods/Vortex/blob/master/download-codesigntool.ps1
  https://github.com/Nexus-Mods/Vortex/blob/master/test-codesigntool.ps1
  https://github.com/Nexus-Mods/Vortex/blob/master/download-buildpatchtool.ps1
  https://github.com/Nexus-Mods/Vortex/blob/master/package.json
  https://github.com/Nexus-Mods/Vortex/blob/master/bootstrap.ps1
  https://github.com/Nexus-Mods/Vortex/blob/master/README_OLD.md
  https://github.com/Nexus-Mods/Vortex/blob/master/BuildSubprojects.json

*/

// Notarization script for macOS (if enabled)
if (process.env.MAC_NOTARIZE === 'true') {
  baseConfig.afterSign = './buildAssets/builder/notarize.ts'
}

module.exports = {
  ...baseConfig
}
