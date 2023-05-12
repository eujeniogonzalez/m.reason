const { ipcRenderer } = require('electron');
const { Observable } = require('../observable.js');
const { CHANNELS, ACTIONS } = require('../const.js');

class TasksModel extends Observable {
  #tasks = null;

  constructor() {
    super();

    this.#tasks = ipcRenderer.sendSync(CHANNELS.GET_TASK_LIST);
  }

  getTaskList = () => this.#tasks.reverse();

  createTask = (newTaskText) => {
    this.#tasks = ipcRenderer.sendSync(CHANNELS.CREATE_TASK, newTaskText);

    this._notify(ACTIONS.CREATE_TASK, { taskList: this.getTaskList() });
  };

  deleteTask = ({ taskId }) => {
    this.#tasks = ipcRenderer.sendSync(CHANNELS.DELETE_TASK, taskId);

    this._notify(ACTIONS.DELETE_TASK, { taskList: this.getTaskList() });
  };

  changeTaskActivity = ({ taskId }) => {
    this.#tasks = ipcRenderer.sendSync(CHANNELS.CHANGE_TASK_ACTIVITY, taskId);

    this._notify(ACTIONS.CHANGE_TASK_ACTIVITY, { taskList: this.getTaskList() });
  };
}

module.exports = { TasksModel };