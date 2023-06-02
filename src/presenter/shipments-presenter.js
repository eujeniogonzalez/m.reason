const { ShipmentsView } = require('../view/shipments-view.js');
const { contentElement } = require('../ui.js');
const { render } = require('../utils/common-utils.js');

class ShipmentsPresenter {
  #shipmentsView = null;

  constructor() {
    this.#shipmentsView = new ShipmentsView();
  }

  init = () => {
    render(this.#shipmentsView.element, contentElement);
  };
}

module.exports = { ShipmentsPresenter };