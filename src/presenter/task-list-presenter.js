const { TaskListView } = require('../view/task-list-view.js');
const { render } = require('../utils');
const { contentElement } = require('../ui.js');
const { RENDER_POSITION, ACTIONS } = require('../const.js');

class TaskListPresenter {
  #tasksElement = null;
  #taskListView = null;
  #taskModel = null;

  constructor({ tasksModel }) {
    this.#taskModel = tasksModel;
    this.#taskListView = new TaskListView({ 
      taskList: tasksModel.getTaskList(),
      deleteTask: this.#deleteTask,
      changeTaskActivity: this.#changeTaskActivity
    });

    tasksModel.addObserver(this.#updateTaskList);
  }

  init = () => {
    this.#tasksElement = contentElement.querySelector('.tasks');

    render(this.#taskListView.element, this.#tasksElement, RENDER_POSITION.BEFOREEND);
  };

  #updateTaskList = (action, { taskList }) => {
    switch (action) {
      case ACTIONS.CREATE_TASK:
        this.#taskListView.updateTaskList({ taskList });
        break;
      
      case ACTIONS.DELETE_TASK:
        this.#taskListView.updateTaskList({ taskList });
        break;

      case ACTIONS.CHANGE_TASK_ACTIVITY:
        this.#taskListView.updateTaskList({ taskList });
        break;
    }
    };

  #deleteTask = ({ taskId }) => this.#taskModel.deleteTask({ taskId });

  #changeTaskActivity = ({ taskId }) => {this.#taskModel.changeTaskActivity({ taskId })};
}

module.exports = { TaskListPresenter };
