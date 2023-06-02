const { AddNewTaskPresenter } = require('./add-new-task-presenter.js');
const { TaskListPresenter } = require('./task-list-presenter.js');
const { TasksView } = require('../view/tasks-view.js');
const { contentElement } = require('../ui.js');
const { render } = require('../utils/common-utils.js');

class TasksPresenter {
  #tasksView = null;
  #addNewTaskPresenter = null;
  #taskListPresenter = null;

  constructor({ tasksModel }) {
    this.#tasksView = new TasksView();
    this.#addNewTaskPresenter = new AddNewTaskPresenter({ tasksModel });
    this.#taskListPresenter = new TaskListPresenter({ tasksModel });
  }

  init = () => {
    render(this.#tasksView.element, contentElement);

    this.#addNewTaskPresenter.init();
    this.#taskListPresenter.init();
  };
}

module.exports = { TasksPresenter };