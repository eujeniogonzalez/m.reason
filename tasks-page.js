const { ipcRenderer } = require('electron');
const tasksPageBtn = document.querySelector('.tasks-page-btn');

tasksPageBtn.addEventListener('click', () => {
    ipcRenderer.send('go-to-main-page');
});
