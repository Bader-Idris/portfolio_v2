import { app, WebContents, RenderProcessGoneDetails } from 'electron'
import Constants from './utils/Constants'
import { createMainWindow, createErrorWindow } from './MainRunner'

// Declare windows
let mainWindow
let errorWindow

app.on('ready', async () => {
  if (Constants.IS_DEV_ENV) {
    import('./index.dev') // Load development-specific settings
  }

  mainWindow = await createMainWindow(mainWindow) // Create main window
})

app.on('activate', async () => {
  if (!mainWindow) {
    mainWindow = await createMainWindow(mainWindow)
  }
})

app.on('window-all-closed', () => {
  mainWindow = null
  errorWindow = null

  if (!Constants.IS_MAC) {
    app.quit()
  }
})

app.on(
  'render-process-gone',
  (event: Event, webContents: WebContents, details: RenderProcessGoneDetails) => {
    errorWindow = createErrorWindow(errorWindow, mainWindow, details) // Create error window on renderer crash
  }
)

process.on('uncaughtException', () => {
  errorWindow = createErrorWindow(errorWindow, mainWindow) // Handle uncaught exceptions
})
