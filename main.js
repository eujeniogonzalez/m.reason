const { app, BrowserWindow } = require('electron');
const { DEFAULT_WINDOW_SIZE } = require('./const.js')
const Store = require('./store.js');

const store = new Store({
  configName: 'user-preferences',
  defaults: {
    windowBounds: {
      width: DEFAULT_WINDOW_SIZE.WIDTH,
      height: DEFAULT_WINDOW_SIZE.HEIGHT
    }
  }
});

function createWindow() {
  let { width, height } = store.get('windowBounds');
    
  const mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.setMenu(null);

  mainWindow.webContents.openDevTools();

  mainWindow.loadFile('./src/app.html');

  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds();
    store.set('windowBounds', { width, height });
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

