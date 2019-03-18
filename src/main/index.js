/*
the Electron main process

creates the main window and its application menu, and contains functions for creating other windows
(for machine runtime settings and help)

some application menu items send messages to the renderer process using webContents.send; and, in
the other direction, the application menu is set up at the end to syncronize with the application
state (as controlled by the renderer process)
*/
import { app, ipcMain } from 'electron'
import { create, windows } from './windows'
import './menu'

// Setup to create the system window when ready
app.on('ready', () => create('system'))

// Setup to quit when all windows are closed (except on a Mac)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })

// Setup to recreate system window as necessary
app.on('activate', () => { if (windows.system === null) create('system') })

// when the language is changed, the system window will tell us, so we can tell the help window
ipcMain.on('language-changed', (event, language) => {
  if (windows.help) {
    windows.help.webContents.send('set-language', language)
  }
})
