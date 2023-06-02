const { ConverterView } = require('../view/converter-view.js');
const { contentElement } = require('../ui.js');
const { render } = require('../utils/common-utils.js');

class ConverterPresenter {
  #converterView = null;

  constructor() {
    this.#converterView = new ConverterView();
  }

  init = () => {
    render(this.#converterView.element, contentElement);
  };
}

module.exports = { ConverterPresenter };