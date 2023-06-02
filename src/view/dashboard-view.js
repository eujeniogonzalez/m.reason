const { createElement } = require('../utils/common-utils.js');

function createDashboardTemplate() {
  return `
    <div>Дашборд</div>
  `;
}

class DashboardView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(createDashboardTemplate());
    }

    return this.#element;
  }
}

module.exports = { DashboardView };