const { AddNewTaskPresenter } = require('./add-new-task-presenter.js');
const { TasksView } = require('../view/tasks-view.js');
const { contentElement } = require('../ui.js');
const { render } = require('../utils');

class TasksPresenter {
  #tasksView = null;
  #addNewTaskPresenter = null;

  constructor({ tasksModel }) {
    this.#tasksView = new TasksView();
    this.#addNewTaskPresenter = new AddNewTaskPresenter({ tasksModel });
  }

  init = () => {
    render(this.#tasksView.element, contentElement);

    this.#addNewTaskPresenter.init();
  };
}

module.exports = { TasksPresenter };