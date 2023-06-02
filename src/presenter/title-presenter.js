const { headerElement } = require('../ui.js');
const { TitleView } = require('../view/title-view.js');
const { render } = require('../utils/common-utils.js');
const { ROUTES, RENDER_POSITION, ACTIONS } = require('../const.js');

class TitlePresenter {
  #headerElement = null;
  #navigationModel = null;
  #titleView = null;

  constructor({ navigationModel }) {
    this.#headerElement = headerElement;
    this.#navigationModel = navigationModel;
    this.#titleView = new TitleView({ title: this.#getTitle(this.#navigationModel.hash) });

    this.#navigationModel.addObserver(this.#changetitle);
  }

  init = () => {
    render(this.#titleView.element, this.#headerElement, RENDER_POSITION.BEFOREEND);
  };

  #getTitle = (hash) => {
    const route = Object.keys(ROUTES).find((route) => ROUTES[route].HASH === hash);
  
    return ROUTES[route].NAME;
  }

  #changetitle = (action, { hash }) => {
    switch (action) {
      case ACTIONS.CHANGE_ROUTE:
        this.#titleView.changeTitle(this.#getTitle(hash));
        break;
    }
  };
}

module.exports = { TitlePresenter };
