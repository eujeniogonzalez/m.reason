const { app, BrowserWindow } = require('electron');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 640,
        height: 480
    });

    mainWindow.webContents.openDevTools();

    mainWindow.loadFile('index.html');
    // mainWindow.loadURL('https://personaltaskmanager.ru/'); For test
}

app.whenReady().then(createWindow);
console.log('tast console');
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