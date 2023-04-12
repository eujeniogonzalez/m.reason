const { createElement } = require('../utils.js');

function createCollectionsListTemplate() {
  return `
    <div class="collections">
      <div class="collection add-collection">
        <img src="./assets/images/icon-plus-gray-64x64.png">
      </div>
      <div class="collection">Лето 2023</div>
      <div class="collection">Весна 2023</div>
      <div class="collection">Новый год 2023</div>
      <div class="collection">Зима 2023</div>
      <div class="collection">Осень 2022</div>
    </div>
  `;
}

class CollectionsListView {
  #element = null;

  constructor({ onNavigationClick }) {
    this.#onNavigationClick = onNavigationClick;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(createCollectionsListTemplate());
    }

    return this.#element;
  }
}

module.exports = { CollectionsListView };
