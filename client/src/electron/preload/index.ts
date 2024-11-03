import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

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
      z-index: 9;
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
