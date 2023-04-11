const { createElement, changeActiveElement } = require('../utils.js');
const { ROUTES } = require('../const.js');

function createNavigationTemplate() {
  return `
    <div class="navigation">
      <a href="#${ROUTES.DASHBOARD.HASH}" class="nav-item nav-item-active">${ROUTES.DASHBOARD.NAME}</a>
      <a href="#${ROUTES.SHIPMENT.HASH}" class="nav-item">${ROUTES.SHIPMENT.NAME}</a>
      <a href="#${ROUTES.CONVERTER.HASH}" class="nav-item">${ROUTES.CONVERTER.NAME}</a>
      <a href="#${ROUTES.COLLECTIONS.HASH}" class="nav-item">${ROUTES.COLLECTIONS.NAME}</a>
    </div>
  `;
}

class NavigationView {
  #element = null;

  constructor() {
    this.element.addEventListener('click', this.#navigationClickHandler);
  }

  get template() {
    return createNavigationTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  #navigationClickHandler = (e) => {
    e.preventDefault();

    if (e.target.tagName === 'A') {
      changeActiveElement(this.#element, e.target, 'nav-item-active');
    }
  };
}

module.exports = { NavigationView };
