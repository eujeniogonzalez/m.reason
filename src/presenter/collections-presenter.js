const { CollectionsView } = require('../view/collections-view.js');
const { contentElement } = require('../ui.js');
const { render } = require('../utils');

class CollectionsPresenter {
  #collectionsView = null;

  constructor() {
    this.#collectionsView = new CollectionsView();
  }

  init = () => {
    render(this.#collectionsView.element, contentElement);
  };
}

module.exports = { CollectionsPresenter };