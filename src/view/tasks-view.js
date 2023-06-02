const { createElement } = require('../utils/common-utils.js');

function createTasksTemplate() {
  return `
    <div class="tasks">
      <div class="tasks-control">
        <div class="tasks-filter">
          <label class="tasks-filter-is-done">
            <input type="checkbox" class="tasks-filter-is-done-input">
            <div class="tasks-filter-is-done-switcher"></div>
            <div class="tasks-filter-is-done-title">Скрыть выполненные</div>
          </label>
        </div>
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
}

module.exports = { TasksView };