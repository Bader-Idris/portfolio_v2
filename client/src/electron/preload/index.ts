import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

// // Expose window control methods safely
// contextBridge.exposeInMainWorld('windowControls', {
//   minimize: () => ipcRenderer.send('window-control', 'minimize'),
//   maximize: () => ipcRenderer.send('window-control', 'maximize'),
//   close: () => ipcRenderer.send('window-control', 'close'),
// });

// // Dynamically inject HTML and CSS for custom title bar when DOM is ready
// document.addEventListener('DOMContentLoaded', () => {
//   const titleBarHtml = `
//     <div id="title-bar">
//       <div id="title-bar-buttons">
//         <button id="minimize-btn">_</button>
//         <button id="maximize-btn">⬜</button>
//         <button id="close-btn">✕</button>
//       </div>
//       <h1 id="app-title"></h1>
//     </div>
//   `;

//   const styleContent = `
//     #title-bar {
//       height: 50px;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       background-color: transparent;
//       color: #fff;
//       padding: 10px;
//       -webkit-app-region: drag;
//       flex-direction: row-reverse;
//       padding-right: 20px;
//     }
//     #title-bar-buttons {
//       display: flex;
//     }
//     #title-bar-buttons button {
//       background: none;
//       border: none;
//       color: #fff;
//       font-size: 16px;
//       padding: 0 10px;
//       cursor: pointer;
//       -webkit-app-region: no-drag;
//     }
//     #title-bar-buttons button:hover {
//       background-color: #555;
//     }
//   `

//   // Inject styles
//   const styleElement = document.createElement('style');
//   styleElement.innerHTML = styleContent;
//   document.head.appendChild(styleElement);

//   // Inject title bar HTML
//   const titleBarContainer = document.createElement('div');
//   titleBarContainer.innerHTML = titleBarHtml;
//   document.body.insertBefore(titleBarContainer, document.body.firstChild);

//   // Set app name in title bar
//   ipcRenderer.once('app-info', (_, { appName }) => {
//     const titleElement = document.getElementById('app-title');
//     if (titleElement) titleElement.textContent = appName;
//   });

//   // Add event listeners to title bar buttons
//   document.getElementById('minimize-btn')?.addEventListener('click', () => {
//     if (window.windowControls?.minimize) {
//       window.windowControls.minimize();
//     } else {
//       console.error("windowControls.minimize is undefined");
//     }
//   });

//   document.getElementById('maximize-btn')?.addEventListener('click', () => {
//     if (window.windowControls?.maximize) {
//       window.windowControls.maximize();
//     } else {
//       console.error("windowControls.maximize is undefined");
//     }
//   });

//   document.getElementById('close-btn')?.addEventListener('click', () => {
//     if (window.windowControls?.close) {
//       window.windowControls.close();
//     } else {
//       console.error("windowControls.close is undefined");
//     }
//   });
// });

// Whitelist of valid channels used for IPC communication (Send message from Renderer to Main)
const mainAvailChannels: string[] = ['msgRequestGetVersion', 'msgOpenExternalLink', 'msgOpenFile']
const rendererAvailChannels: string[] = []

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  send(channel: string, ...data: any[]): void {
    if (mainAvailChannels.includes(channel)) {
      ipcRenderer.send(channel, ...data)
      if (process.env.NODE_ENV === 'development') {
        console.log({ type: 'send', channel, request: data })
      }
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`)
    }
  },
  on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.on(channel, listener)
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`)
    }
  },
  once(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.once(channel, listener)
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`)
    }
  },
  off(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.off(channel, listener)
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`)
    }
  },
  invoke: async (channel: string, ...data: any[]): Promise<any> => {
    //TODO => was not generated using chatGpt
    if (mainAvailChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, ...data)
      if (process.env.NODE_ENV === 'development') {
        console.log({ type: 'invoke', channel, request: data, result })
      }
      return result
    }

    throw new Error(`Unknown ipc channel name: ${channel}`)
  }
})

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child)
    }
  }
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = 'sk-cube-grid'
  const styleContent = `
    .sk-cube-grid {
      width: 40px;
      height: 40px;
      margin: 100px auto;
    }

    .sk-cube-grid .sk-cube {
      width: 33%;
      height: 33%;
      background-color: #FFF;
      float: left;
      animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
    }
    .sk-cube-grid .sk-cube1 { animation-delay: 0.2s; }
    .sk-cube-grid .sk-cube2 { animation-delay: 0.3s; }
    .sk-cube-grid .sk-cube3 { animation-delay: 0.4s; }
    .sk-cube-grid .sk-cube4 { animation-delay: 0.1s; }
    .sk-cube-grid .sk-cube5 { animation-delay: 0.2s; }
    .sk-cube-grid .sk-cube6 { animation-delay: 0.3s; }
    .sk-cube-grid .sk-cube7 { animation-delay: 0s; }
    .sk-cube-grid .sk-cube8 { animation-delay: 0.1s; }
    .sk-cube-grid .sk-cube9 { animation-delay: 0.2s; }

    @keyframes sk-cubeGridScaleDelay {
      0%, 70%, 100% {
        transform: scale3D(1, 1, 1);
      }
      35% {
        transform: scale3D(0, 0, 1);
      }
    }

    .app-loading-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #001221;
      z-index: 9999;
    }
  `

  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `
    <div class="${className}">
      <div class="sk-cube sk-cube1"></div>
      <div class="sk-cube sk-cube2"></div>
      <div class="sk-cube sk-cube3"></div>
      <div class="sk-cube sk-cube4"></div>
      <div class="sk-cube sk-cube5"></div>
      <div class="sk-cube sk-cube6"></div>
      <div class="sk-cube sk-cube7"></div>
      <div class="sk-cube sk-cube8"></div>
      <div class="sk-cube sk-cube9"></div>
    </div>
  `

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    }
  }
}

// Initialize loading spinner and handle removal
const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 2999)
