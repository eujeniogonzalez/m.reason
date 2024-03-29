const { mainElement } = require('../ui.js');
const { NavigationView } = require('../view/navigation-view.js');
const { render } = require('../utils/common-utils.js');

class NavigationPresenter {
  #mainElement = null;
  #navigationModel = null;
  #navigationView = null;

  constructor({ navigationModel }) {
    this.#mainElement = mainElement;
    this.#navigationModel = navigationModel;
    this.#navigationView = new NavigationView({ onNavigationClick: this.#onNavigationClick, navigationModel });
  }

  init = () => {
    render(this.#navigationView.element, this.#mainElement);
  };

  // todo Заменить название на navigationClickHandler
  #onNavigationClick = ({ hash }) => {
    this.#navigationModel.hash = hash;
  };
}

module.exports = { NavigationPresenter };

