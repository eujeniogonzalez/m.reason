const { createElement, isElementActive } = require('../utils.js');
const { ROUTES } = require('../const.js');

const ACTIVE_ROUTE_CLASS = 'nav-item-active';

function createNavigationTemplate(hash) {
  return `
    <div class="navigation">
      <a href="${ROUTES.DASHBOARD.HASH}" class="nav-item ${ROUTES.DASHBOARD.HASH === hash ? ACTIVE_ROUTE_CLASS : ''}">${ROUTES.DASHBOARD.NAME}</a>
      <a href="${ROUTES.SHIPMENT.HASH}" class="nav-item ${ROUTES.SHIPMENT.HASH === hash ? ACTIVE_ROUTE_CLASS : ''}">${ROUTES.SHIPMENT.NAME}</a>
      <a href="${ROUTES.CONVERTER.HASH}" class="nav-item ${ROUTES.CONVERTER.HASH === hash ? ACTIVE_ROUTE_CLASS : ''}">${ROUTES.CONVERTER.NAME}</a>
      <a href="${ROUTES.COLLECTIONS.HASH}" class="nav-item ${ROUTES.COLLECTIONS.HASH === hash ? ACTIVE_ROUTE_CLASS : ''}">${ROUTES.COLLECTIONS.NAME}</a>
      <a href="${ROUTES.TASKS.HASH}" class="nav-item ${ROUTES.TASKS.HASH === hash ? ACTIVE_ROUTE_CLASS : ''}">${ROUTES.TASKS.NAME}</a>
    </div>
  `;
}

class NavigationView {
  #element = null;
  #onNavigationClick = null;
  #navigationModel = null;

  constructor({ onNavigationClick, navigationModel }) {
    this.#onNavigationClick = onNavigationClick;
    this.#navigationModel = navigationModel;

    this.element.addEventListener('click', this.#navigationClickHandler);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(createNavigationTemplate(this.#navigationModel.hash));
    }

    return this.#element;
  }

  #changeActiveRoute = () => {
    for (let child of this.element.children) {
      child.classList.remove(ACTIVE_ROUTE_CLASS);

      if (child.hash === this.#navigationModel.hash) {
        child.classList.add(ACTIVE_ROUTE_CLASS);
      }
    }
  };

  #navigationClickHandler = (e) => {
    e.preventDefault();

    if (e.target.tagName === 'A' && !isElementActive(e.target, ACTIVE_ROUTE_CLASS)) {
      this.#onNavigationClick({ hash: e.target.hash });

      this.#changeActiveRoute();
    }
  };
}

module.exports = { NavigationView };
