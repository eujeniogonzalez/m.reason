const { createElement } = require('../utils/common-utils.js');

function createConverterTemplate() {
  return `
    <div>Конвертер</div>
  `;
}

class ConverterView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(createConverterTemplate());
    }

    return this.#element;
  }
}

module.exports = { ConverterView };