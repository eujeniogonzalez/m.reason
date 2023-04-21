const { app, BrowserWindow } = require('electron');
const { DEFAULT_WINDOW_SIZE, FILES, OPTIONS } = require('./src/const.js');
const Store = require('./store.js');

const store = new Store({
  configName: FILES.PREFERENCES,
  defaults: {
    windowBounds: {
      width: DEFAULT_WINDOW_SIZE.WIDTH,
      height: DEFAULT_WINDOW_SIZE.HEIGHT
    }
  }
});

function createWindow() {
  let { width, height } = store.get(OPTIONS.WINDOW_BOUNDS);
    
  const mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // mainWindow.setMenu(null); // Удаляем меню браузера

  mainWindow.webContents.openDevTools();

  mainWindow.loadFile('./src/app.html');

  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds();
    store.set(OPTIONS.WINDOW_BOUNDS, { width, height });
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

