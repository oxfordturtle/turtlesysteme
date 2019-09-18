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
const browserWindow = (title, width, height) =>
  new BrowserWindow({
    title,
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
  switch (id) {
    // create the main system window
    case 'system':
      windows.system = browserWindow('Turtle System E', 1024, 700)
      break

    // create the settings window
    case 'settings':
      windows.settings = browserWindow('Machine Options', 500, 550)
      break

    // create the help window
    case 'help':
      windows.help = browserWindow('Language Guide', 900, 600)
      break

    // create the about window
    case 'about':
      windows.about = browserWindow('About', 900, 600)
      break
  }

  // set page
  if (process.env.NODE_ENV !== 'production') {
    windows[id].loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
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
