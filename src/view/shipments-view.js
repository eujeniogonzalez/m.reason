const { createElement } = require('../utils/common-utils.js');

function createShipmentsTemplate() {
  return `
    <div>Поставки</div>
  `;
}

class ShipmentsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(createShipmentsTemplate());
    }

    return this.#element;
  }
}

module.exports = { ShipmentsView };