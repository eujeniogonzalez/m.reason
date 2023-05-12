const { AddNewTaskView } = require('../view/add-new-task-view.js');
const { render } = require('../utils');
const { contentElement } = require('../ui.js');

class AddNewTaskPresenter {
  #tasksModel = null;
  #tasksElement = null;
  #addNewTaskView = null;

  constructor({ tasksModel }) {
    this.#tasksModel = tasksModel;
    this.#addNewTaskView = new AddNewTaskView({ createNewTask: this.#createNewTask });
  }

  init = () => {
    this.#tasksElement = contentElement.querySelector('.tasks-control');

    render(this.#addNewTaskView.element, this.#tasksElement);
    
    this.#addNewTaskView.focuseOnInput();
  };

  #createNewTask = (newTaskText) => {
    this.#tasksModel.createTask(newTaskText);
  };
}

module.exports = { AddNewTaskPresenter };
