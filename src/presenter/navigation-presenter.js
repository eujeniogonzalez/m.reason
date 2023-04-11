const { mainElement } = require('../ui.js');
const { NavigationView } = require('../view/navigation-view.js');
const { render } = require('../utils.js');

class NavigationPresenter {
  #mainElement = null;
  #navigationView = null;

  constructor() {
    this.#mainElement = mainElement;
    this.#navigationView = new NavigationView;
  }

  init() {
    render(this.#navigationView.element, this.#mainElement);
  }
}

module.exports = { NavigationPresenter };

