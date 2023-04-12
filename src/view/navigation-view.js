const { createElement, changeActiveElement, isElementActive } = require('../utils.js');
const { ROUTES } = require('../const.js');

function createNavigationTemplate() {
  return `
    <div class="navigation">
      <a href="${ROUTES.DASHBOARD.HASH}" class="nav-item nav-item-active">${ROUTES.DASHBOARD.NAME}</a>
      <a href="${ROUTES.SHIPMENT.HASH}" class="nav-item">${ROUTES.SHIPMENT.NAME}</a>
      <a href="${ROUTES.CONVERTER.HASH}" class="nav-item">${ROUTES.CONVERTER.NAME}</a>
      <a href="${ROUTES.COLLECTIONS.HASH}" class="nav-item">${ROUTES.COLLECTIONS.NAME}</a>
      <a href="${ROUTES.TASKS.HASH}" class="nav-item">${ROUTES.TASKS.NAME}</a>
    </div>
  `;
}

class NavigationView {
  #element = null;
  #onNavigationClick = null;

  constructor({ onNavigationClick }) {
    this.#onNavigationClick = onNavigationClick;

    this.element.addEventListener('click', this.#navigationClickHandler);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(createNavigationTemplate());
    }

    return this.#element;
  }

  #navigationClickHandler = (e) => {
    e.preventDefault();

    if (e.target.tagName === 'A' && !isElementActive(e.target, 'nav-item-active')) {
      changeActiveElement(this.#element, e.target, 'nav-item-active');

      this.#onNavigationClick({ hash: e.target.hash });
    }
  };
}

module.exports = { NavigationView };
