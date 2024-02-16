const { createElement } = require('../utils/common-utils.js');

function createLoaderTemplate() {
  return `
    <span class="loader"></span>
  `;
}

class LoaderView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(createLoaderTemplate());
    }

    return this.#element;
  }
}

module.exports = { LoaderView };