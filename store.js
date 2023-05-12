const electron = require('electron');
const path = require('path');
const fs = require('fs');
const { FOLDERS, FILES, START_TASK_ID } = require('./src/const.js');

// todo Провести полный рефакторинг Store
// Сделать методы для добавления и удаления данных
// Сделать методы для проверки данных на соответствие структуры (интерфейсы)
// Перенести функцию parseDataFile в тело класса (?)

class Store {
  #path = null;
  #data = null;
  #taskListPath = null;
  #taskList = [];

  constructor(options) {
    const userDataPath = (electron.app || electron.remote.app).getPath(FOLDERS.USER_DATA);
    const jsonDatabasePath = path.join(userDataPath, FOLDERS.DATABASE);

    // todo Сделать функцию по проверке папки на существование
    fs.access(jsonDatabasePath, (err) => {
      if (err && err.code === 'ENOENT') {
        fs.mkdir(jsonDatabasePath, { recursive: true }, (err) => {
          if (err) {
            return console.error(err);
          }
        });
      }
    });

    this.#path = path.join(userDataPath, `${options.configName}.json`);
    this.#data = parseDataFile(this.#path, options.defaults);

    this.#taskListPath = path.join(jsonDatabasePath, `${FILES.TASK_LIST}.json`);
  }
  
  get(key) {
    return this.#data[key];
  }
  
  set(key, val) {
    this.#data[key] = val;

    fs.writeFileSync(this.#path, JSON.stringify(this.#data));
  }

  createTask = (newTaskText) => {
    this.#taskList = this.getTaskList();

    const newTask = {
      id: this.#getFreeTaskId(this.#taskList),
      date: new Date().toLocaleDateString(),
      text: newTaskText,
      isDone: false
    };

    this.#taskList.push(newTask);

    fs.writeFileSync(this.#taskListPath, JSON.stringify(this.#taskList));

    return this.#taskList;
  };

  getTaskList = () => {
    let taskList = [];

    try {
      taskList = JSON.parse(fs.readFileSync(this.#taskListPath));
    } catch(error) {
      fs.writeFileSync(this.#taskListPath, JSON.stringify(taskList));
    }

    return taskList;
  };

  deleteTask = (taskId) => {
    this.#taskList = this.getTaskList();

    this.#taskList.forEach((task, i) => {
      if (task.id === +taskId) {
        this.#taskList.splice(i, 1);
      }
    });

    fs.writeFileSync(this.#taskListPath, JSON.stringify(this.#taskList));

    return this.#taskList;
  };

  changeTaskActivity = (taskId) => {
    this.#taskList = this.getTaskList();

    this.#taskList.forEach((task, i) => {
      if (task.id === +taskId) {
        this.#taskList[i].isDone = !this.#taskList[i].isDone;
      }
    });

    fs.writeFileSync(this.#taskListPath, JSON.stringify(this.#taskList));

    return this.#taskList;
  };

  #getFreeTaskId = (taskList) => {
    const ids = [];
    let freeId = START_TASK_ID;

    if (!taskList.length) {
      return freeId;
    }

    taskList.forEach((task) => ids.push(task.id));

    for (let i = 1; i <= taskList.length + 1; i++) {
      if (!ids.includes(i)) {
        freeId = i;
      }
    }

    return freeId;
  };
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    return defaults;
  }
}

module.exports = Store;