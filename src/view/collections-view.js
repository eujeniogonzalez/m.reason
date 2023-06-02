const { createElement } = require('../utils/common-utils.js');

function createCollectionsTemplate() {
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

class CollectionsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(createCollectionsTemplate());
    }

    return this.#element;
  }
}

module.exports = { CollectionsView };
