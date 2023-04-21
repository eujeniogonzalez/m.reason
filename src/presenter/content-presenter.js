const { ACTIONS, ROUTES } = require('../const.js');
const { TasksPresenter } = require('./tasks-presenter.js');
const { ShipmentsPresenter } = require('./shipments-presenter.js');
const { DashboardPresenter } = require('./dashboard-presenter.js');
const { ConverterPresenter } = require('./converter-presenter.js');
const { CollectionsPresenter } = require('./collections-presenter.js');
const { contentElement } = require('../ui.js');

class ContentPresenter {
  #currentRoute = null;
  #tasksPresenter = null;
  #shipmentsPresenter = null;
  #dashboardPresenter = null;
  #converterPresenter = null;
  #collectionsPresenter = null;

  constructor({ navigationModel, tasksModel }) {
    this.#currentRoute = navigationModel.hash;

    this.#tasksPresenter = new TasksPresenter({ tasksModel });
    this.#shipmentsPresenter = new ShipmentsPresenter();
    this.#dashboardPresenter = new DashboardPresenter();
    this.#converterPresenter = new ConverterPresenter();
    this.#collectionsPresenter = new CollectionsPresenter();

    navigationModel.addObserver(this.#changeCurrentRoute);
    navigationModel.addObserver(this.init);
  }

  init = () => {
    this.#clearContent();
    
    switch (this.#currentRoute) {
      case ROUTES.DASHBOARD.HASH:
        this.#dashboardPresenter.init();
        break;
      case ROUTES.COLLECTIONS.HASH:
        this.#collectionsPresenter.init();
        break;
      case ROUTES.CONVERTER.HASH:
        this.#converterPresenter.init();
        break;
      case ROUTES.SHIPMENT.HASH:
        this.#shipmentsPresenter.init();
        break;
      case ROUTES.TASKS.HASH:
        this.#tasksPresenter.init();
        break;
    }
  };

  #changeCurrentRoute = (action, { hash }) => {
    switch (action) {
      case ACTIONS.CHANGE_ROUTE:
        this.#currentRoute = hash;
        break;
    }
  };

  #clearContent = () => {
    contentElement.textContent = '';
  };
}

module.exports = { ContentPresenter };