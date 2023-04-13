const { createElement } = require('../utils.js');

function createTasksTemplate() {
  return `
    <div class="tasks-control">
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

      <div class="tasks-filter">
        <label class="tasks-filter-is-done">
          <input type="checkbox" class="tasks-filter-is-done-input">
          <div class="tasks-filter-is-done-switcher"></div>
          <div class="tasks-filter-is-done-title">Скрыть выполненные</div>
        </label>
      </div>
    </div>
  `;
}

class TasksView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(createTasksTemplate());
    }

    return this.#element;
  }

  focuseOnInput = () => {
    this.element.querySelector('#new-task-text').focus();
  };
}

module.exports = { TasksView };