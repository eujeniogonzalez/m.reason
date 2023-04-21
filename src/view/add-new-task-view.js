const { createElement } = require('../utils.js');

function createAddNewTaskTemplate() {
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
          class="new-task-submit input_submit"
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

    // todo Сделать проверку на пустоту и максимальное заполнение

    this.#createNewTask();
  };
}

module.exports = { AddNewTaskView };
