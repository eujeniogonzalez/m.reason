const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('./store.js');

const store = new Store({
    configName: 'user-preferences',
    defaults: {
      windowBounds: { width: 100, height: 50 }
    }
});

function createWindow() {
    let { width, height } = store.get('windowBounds');
    
    const mainWindow = new BrowserWindow({
        width,
        height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.webContents.openDevTools();

    mainWindow.loadFile('main-page.html');

    ipcMain.on('go-to-tasks-page', () => {
        mainWindow.loadFile('tasks-page.html');
    });

    ipcMain.on('go-to-main-page', () => {
        mainWindow.loadFile('main-page.html');
    });

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

