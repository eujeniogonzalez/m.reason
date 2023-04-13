const { TasksView } = require('../view/tasks-view.js');
const { contentElement } = require('../ui.js');
const { render } = require('../utils');

class TasksPresenter {
  #tasksView = null;

  constructor() {
    this.#tasksView = new TasksView();
  }

  // todo Сделать все init стрелками
  init = () => {
    render(this.#tasksView.element, contentElement);
    this.#tasksView.focuseOnInput();
  };
}

module.exports = { TasksPresenter };