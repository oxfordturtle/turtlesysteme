/*
Required by main/index.js; handles window related things.
*/
import { BrowserWindow } from 'electron'
import path from 'path'

// windows objects
export const windows = {
  system: null,
  settings: null,
  help: null,
  about: null
}

// function to create a new browser window
const browserWindow = (width, height) =>
  new BrowserWindow({
    width,
    height,
    minWidth: width,
    minHeight: height,
    useContentSize: true,
    resizable: true,
    webPreferences: { nodeIntegration: true },
    icon: path.join(__dirname, 'assets/png/64x64.png')
  })

// function to create a window
export const create = (id) => {
  const isDevelopment = process.env.NODE_ENV !== 'production'

  switch (id) {
    // create the main system window
    case 'system':
      windows.system = browserWindow(1024, 700)
      break

    // create the settings window
    case 'settings':
      windows.settings = browserWindow(500, 550)
      break

    // create the help window
    case 'help':
      windows.help = browserWindow(900, 600)
      break

    // create the about window
    case 'about':
      windows.about = browserWindow(900, 600)
      break
  }

  // set page and open dev tools in development
  if (isDevelopment) {
    windows[id].loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    if (id === 'system') windows.system.webContents.openDevTools()
  } else {
    windows[id].loadFile('index.html')
  }

  // disable menu for all except the main system page
  if (id !== 'system') windows[id].setMenu(null)

  // set some page globals for use inside the renderer
  windows[id].page = id
  windows[id].electron = true
  windows[id].version = process.env.npm_package_version

  // clenaup
  windows[id].on('closed', () => { windows[id] = null })
}

// function to show a window
export const show = (id) => {
  if (windows[id]) {
    windows[id].focus()
  } else {
    create(id)
  }
}
