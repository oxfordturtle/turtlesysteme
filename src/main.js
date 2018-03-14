/**
 * entry point for electron
 */
const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron');
const fs = require('fs');
const examples = require('./examples/examples');

// set to false when building
const development = true;

// Keep global references of the window objects to avoid garbage collection
let systemWindow;
let settingsWindow;
let helpWindow;
let aboutWindow;

// function for creating windows
const createWindow = (width, height, page, showMenu, resizable) => {
  const window = new BrowserWindow({
    width,
    height,
    minWidth: width,
    minHeight: height,
    useContentSize: true,
    resizable,
  });
  const url = development
    ? 'http://localhost:9000/'
    : `file://${__dirname}/../dist/electron/index.html`;
  window.page = page;
  window.loadURL(url);
  if (!showMenu) window.setMenu(null);
  return window;
};

// function for creating the (main) system window
const createSystemWindow = () => {
  systemWindow = createWindow(1024, 700, 'system', true, true);
  systemWindow.on('closed', () => { systemWindow = null; });
};

// function for creating the settings window
const createSettingsWindow = () => {
  settingsWindow = createWindow(500, 580, 'settings', false, false);
  settingsWindow.on('closed', () => { settingsWindow = null; });
};

// function for creating the help window
const createHelpWindow = () => {
  helpWindow = createWindow(800, 600, 'help', false, false);
  helpWindow.on('closed', () => { helpWindow = null; });
};

// function for creating the about window
const createAboutWindow = () => {
  aboutWindow = createWindow(800, 600, 'about', false, false);
  aboutWindow.on('closed', () => { aboutWindow = null; });
};

// functions called by the menu items
const sendToSystem = (signal, data) => {
  systemWindow.webContents.send(signal, data);
};

const openProgram = () => {
  dialog.showOpenDialog(
    {
      properties: ['openFile'],
      filters: [
        { name: 'Turtle Graphics BASIC', extensions: ['tgb'] },
        { name: 'Turtle Graphics Pascal', extensions: ['tgp'] },
        { name: 'Turtle Graphics Python', extensions: ['tgy'] },
        { name: 'Turtle Graphics Export Format', extensions: ['tgx'] },
      ],
    },
    (files) => {
      if (files && files[0]) {
        fs.readFile(files[0], 'utf8', (err, content) => {
          sendToSystem('set-file', { filename: files[0], content });
        });
      }
    },
  );
};

const showHelpWindow = () => {
  if (helpWindow) {
    helpWindow.focus();
  } else {
    createHelpWindow();
  }
};

const showAboutWindow = () => {
  if (aboutWindow) {
    aboutWindow.focus();
  } else {
    createAboutWindow();
  }
};

const showSettingsWindow = () => {
  if (settingsWindow) {
    settingsWindow.focus();
  } else {
    createSettingsWindow();
  }
};

// menu templates
const systemMenu = {
  label: 'LANGUAGE',
  submenu: [
    { type: 'radio', label: 'Turtle BASIC', click: sendToSystem.bind(null, 'set-language', 'BASIC') },
    { type: 'radio', label: 'Turtle Pascal', click: sendToSystem.bind(null, 'set-language', 'Pascal') },
    { type: 'radio', label: 'Turtle Python', click: sendToSystem.bind(null, 'set-language', 'Python') },
  ],
};

const fileMenu = {
  label: 'File',
  submenu: [
    { label: 'New program', click: sendToSystem.bind(null, 'new-program') },
    { label: 'Open program', click: openProgram },
    { label: 'Save program', click: sendToSystem.bind(null, 'save-program') },
    { label: 'Save as...', click: sendToSystem.bind(null, 'save-program-as') },
    { label: 'Close program', click: sendToSystem.bind(null, 'new-program') },
  ],
};

const editMenu = {
  label: 'Edit',
  submenu: [
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
  ],
};

const optionsMenu = {
  label: 'Options',
  submenu: [
    { type: 'checkbox', label: 'Show canvas on run', click: sendToSystem.bind(null, 'toggle-show-canvas') },
    { type: 'checkbox', label: 'Show output on write', click: sendToSystem.bind(null, 'toggle-show-output') },
    { type: 'checkbox', label: 'Show memory on dump', click: sendToSystem.bind(null, 'toggle-show-memory') },
    { type: 'separator' },
    { label: 'More machine options', click: showSettingsWindow },
  ],
};

const exampleMenu = example =>
  ({ label: example.name, click: sendToSystem.bind(null, 'set-example', example.id) });

const exampleGroupMenu = exampleGroup =>
  ({ label: `${exampleGroup.index}. ${exampleGroup.title}`, submenu: exampleGroup.examples.map(exampleMenu) });

const helpMenu = {
  role: 'help',
  submenu: [
    { label: 'Language Guide', click: showHelpWindow },
    { label: 'About', click: showAboutWindow },
    { type: 'separator' },
    { label: 'Illustrative Examples', submenu: examples.help.map(exampleGroupMenu) },
    { label: 'CSAC Examples', submenu: examples.csac.map(exampleGroupMenu) },
  ],
};

const debugMenu = {
  label: 'DEBUG',
  submenu: [
    { role: 'reload' },
    { role: 'forcereload' },
    { role: 'toggledevtools' },
  ],
};

const menu = development
  ? Menu.buildFromTemplate([systemMenu, fileMenu, editMenu, optionsMenu, helpMenu, debugMenu])
  : Menu.buildFromTemplate([systemMenu, fileMenu, editMenu, optionsMenu, helpMenu]);

// Setup to quit when all windows are closed (except on a Mac)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

// Setup to recreate systemWindow as necessary
app.on('activate', () => { if (systemWindow === null) createSystemWindow(); });

// Get started and add the system menu
app.on('ready', createSystemWindow);
Menu.setApplicationMenu(menu);

// when the renderer is loaded, it will tell us about the local storage
ipcMain.on('language', (event, language) => {
  const index = { BASIC: 0, Pascal: 1, Python: 2 };
  menu.items[0].submenu.items[index[language]].checked = true;
});

ipcMain.on('version', (event, version) => {
  const index = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4];
  menu.items[0].submenu.items[index[version]].checked = true;
});

ipcMain.on('compile-first', (event, compileFirst) => {
  menu.items[3].submenu.items[0].checked = compileFirst;
});

ipcMain.on('show-canvas', (event, showCanvas) => {
  menu.items[3].submenu.items[2].checked = showCanvas;
});

ipcMain.on('show-output', (event, showOutput) => {
  menu.items[3].submenu.items[3].checked = showOutput;
});

ipcMain.on('show-memory', (event, showMemory) => {
  menu.items[3].submenu.items[4].checked = showMemory;
});

// when the language is changed, the system window will tell us, so we can tell the help window
ipcMain.on('language-changed', (event, language) => {
  if (helpWindow) {
    helpWindow.webContents.send('set-language', language);
  }
});
