const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { DEFAULT_WINDOW_SIZE, FILES, OPTIONS, CHANNELS } = require('./src/const.js');
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

  console.log(dialog.showOpenDialog({ properties: ['openDirectory'] }).then((res) => console.log(res)));

  mainWindow.webContents.openDevTools();

  mainWindow.loadFile('./src/app.html');

  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds();
    store.set(OPTIONS.WINDOW_BOUNDS, { width, height });
  });

  ipcMain.on(CHANNELS.CREATE_TASK, (event, data) => event.returnValue = store.createTask(data));
  ipcMain.on(CHANNELS.GET_TASK_LIST, (event) => event.returnValue = store.getTaskList());
  ipcMain.on(CHANNELS.DELETE_TASK, (event, taskId) => event.returnValue = store.deleteTask(taskId));
  ipcMain.on(CHANNELS.CHANGE_TASK_ACTIVITY, (event, taskId) => event.returnValue = store.changeTaskActivity(taskId));
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
