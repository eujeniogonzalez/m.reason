const { ipcRenderer } = require('electron');
const mainPageBtn = document.querySelector('.main-page-btn');
const { req } = require('./req.js');

req();

mainPageBtn.addEventListener('click', () => {
    ipcRenderer.send('go-to-tasks-page');
});


