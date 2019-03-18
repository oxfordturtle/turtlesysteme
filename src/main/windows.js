/*
Required by main/index.js; handles window related things.
*/
import { BrowserWindow } from 'electron'

// windows objects
export const windows = {
  system: null,
  settings: null,
  help: null,
  about: null
}

// function to create a window
export const create = (id) => {
  const isDevelopment = process.env.NODE_ENV !== 'production'

  switch (id) {
    // create the main system window
    case 'system':
      windows.system = new BrowserWindow({
        width: 1024,
        height: 700,
        minWidth: 1024,
        minHeight: 700,
        useContentSize: true,
        resizable: true
      })
      break

    // create the settings window
    case 'settings':
      windows.settings = new BrowserWindow({
        width: 500,
        height: 550,
        minWidth: 500,
        minHeight: 550,
        useContentSize: true,
        resizable: true
      })
      break

    // create the help window
    case 'help':
      windows.help = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        useContentSize: true,
        resizable: true
      })
      break

    // create the about window
    case 'about':
      windows.about = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        useContentSize: true,
        resizable: true
      })
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
