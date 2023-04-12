const { createElement } = require('../utils.js');

function createTitleTemplate(title) {
  return `
    <div class="title">${title}</div>
  `;
}

class TitleView {
  #element = null;
  #title = null;

  constructor({ title }) {
    this.#title = title;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(createTitleTemplate(this.#title));
    }

    return this.#element;
  }

  changeTitle = (title) => {
    this.element.textContent = title;
  };
}

module.exports = { TitleView };