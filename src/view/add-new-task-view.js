const { createElement, isLengthCorrect } = require('../utils.js');
const { TASK_LENGTH, CLASSES, SYMBOLS } = require('../const.js');

function createAddNewTaskTemplate() {
  // todo Выровнять в один ряд все view
  return `
    <div class="new-task-form-container">
      <form class="new-task-form">
        <input
          id="new-task-text"
          class="new-task-text input_text"
          type="text"
          placeholder="Новая задача"
          autocomplete="off"
        />
        <button
          id="new-task-submit"
          class="new-task-submit button_submit"
          type="submit"
        >
          Создать задачу
        </button>
      </form>
    </div>
  `;
}

class AddNewTaskView {
  #element = null;
  #createNewTask = null;
  #newTaskInput = this.element.querySelector('#new-task-text');
  #newTaskSubmit = this.element.querySelector('#new-task-submit');

  constructor({ createNewTask }) {
    this.#createNewTask = createNewTask;

    this.#newTaskSubmit.addEventListener('click', this.#newTaskSubmitClickHandler);
    this.#newTaskInput.addEventListener('input', this.#resetWrongInputClassHandler);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(createAddNewTaskTemplate());
    }

    return this.#element;
  }

  focuseOnInput = () => {
    this.#newTaskInput.focus();
  };

  #newTaskSubmitClickHandler = (e) => {
    e.preventDefault();

    this.focuseOnInput();

    if (!isLengthCorrect(this.#newTaskInput.value, TASK_LENGTH.MIN, TASK_LENGTH.MAX)) {
      this.#newTaskInput.classList.add(CLASSES.WRONG_INPUT);

      return;
    }

    this.#createNewTask(this.#newTaskInput.value);
    this.#clearInput();
  };

  #resetWrongInputClassHandler = () => {
    this.#newTaskInput.classList.remove(CLASSES.WRONG_INPUT);
  };

  #clearInput = () => {
    this.#newTaskInput.value = SYMBOLS.EMPTY_STRING;
  };
}

module.exports = { AddNewTaskView };
