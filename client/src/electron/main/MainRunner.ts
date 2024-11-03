import { app, BrowserWindow, RenderProcessGoneDetails, Menu, Tray } from 'electron'
import Constants from './utils/Constants'
import IPCs from './IPCs'
import menuTemplate from './utils/menu-template'

const exitApp = (mainWindow: BrowserWindow): void => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.hide()
  }
  mainWindow.destroy()
  app.exit()
}

export const createMainWindow = async (mainWindow: BrowserWindow): Promise<BrowserWindow> => {
  mainWindow = new BrowserWindow({
    title: Constants.APP_NAME,
    show: false,
    width: Constants.IS_DEV_ENV ? 1500 : 1200, // Different window size based on environment
    height: 650,
    useContentSize: true,
    // titleBarStyle: 'hidden',
    webPreferences: Constants.DEFAULT_WEB_PREFERENCES
  })

  mainWindow.setMenu(null) // to clear default menu

  const menu = Menu.buildFromTemplate(menuTemplate) // using custom menu
  Menu.setApplicationMenu(menu) // global variable

  // ! Define user tasks for the taskbar context menu

  const userTasks: Electron.Task[] = [
    {
      program: process.execPath, // The path to the Electron executable
      args: [], // Arguments passed to the executable
      title: 'New Window', // Title of the task
      description: 'Open a new window' // Description of the task
      // To specify an icon for the task, uncomment and set the path:
      // iconPath: 'path/to/icon.png'
    }
    // {
    //   program: process.execPath,
    //   args: ['--recently-closed'],
    //   title: 'Recently Closed Windows',
    //   description: 'Reopen recently closed windows'
    // }
  ]

  // Sets the user tasks for Windows and Linux platforms
  app.setUserTasks(userTasks)

  mainWindow.on('close', (event: Event): void => {
    event.preventDefault()
    exitApp(mainWindow)
  })

  mainWindow.webContents.on('did-frame-finish-load', (): void => {
    if (Constants.IS_DEV_ENV) {
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.once('ready-to-show', (): void => {
    mainWindow.setAlwaysOnTop(true) // is this useful for focusing?! along with its  underneath sibling
    mainWindow.show()
    mainWindow.focus()
    mainWindow.setAlwaysOnTop(false)
  })

  // Initialize IPC Communication
  IPCs.initialize()

  if (Constants.IS_DEV_ENV) {
    await mainWindow.loadURL(Constants.APP_INDEX_URL_DEV)
  } else {
    await mainWindow.loadFile(Constants.APP_INDEX_URL_PROD)
  }

  return mainWindow
}

// Create error window when the renderer crashes
export const createErrorWindow = async (
  errorWindow: BrowserWindow,
  mainWindow: BrowserWindow,
  details?: RenderProcessGoneDetails
): Promise<BrowserWindow> => {
  if (!Constants.IS_DEV_ENV) {
    mainWindow?.hide()
  }

  errorWindow = new BrowserWindow({
    title: Constants.APP_NAME,
    show: false,
    resizable: Constants.IS_DEV_ENV,
    webPreferences: Constants.DEFAULT_WEB_PREFERENCES
  })

  errorWindow.setMenu(null)

  if (Constants.IS_DEV_ENV) {
    await errorWindow.loadURL(`${Constants.APP_INDEX_URL_DEV}#/error`)
  } else {
    await errorWindow.loadFile(Constants.APP_INDEX_URL_PROD, { hash: 'error' })
  }

  errorWindow.on('ready-to-show', (): void => {
    if (!Constants.IS_DEV_ENV && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.destroy()
    }
    errorWindow.show()
    errorWindow.focus()
  })

  errorWindow.webContents.on('did-frame-finish-load', (): void => {
    if (Constants.IS_DEV_ENV) {
      errorWindow.webContents.openDevTools()
    }
  })

  return errorWindow
}

/*


let tray: Tray | null = null

// Create the system tray
const createTray = () => {
  tray = new Tray('../../../buildAssets/resources/icon.png'); // Path to your tray icon
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        } else {
          createMainWindow();
        }
      },
    },
    {
      label: 'Settings',
      click: () => {
        // Open settings window or perform another action
      },
    },
    {
      label: 'Exit',
      click: () => {
        exitApp(mainWindow!); // Ensure mainWindow is not null
      },
    },
  ]);

  tray.setToolTip(Constants.APP_NAME); // Tooltip for the tray icon
  tray.setContextMenu(contextMenu); // Set the context menu for the tray

  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    } else {
      createMainWindow();
    }
  });
};

// Initialize the tray when the app is ready
app.on('ready', () => {
  createTray();
});

*/
