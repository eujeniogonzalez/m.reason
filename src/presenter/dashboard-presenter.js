const { DashboardView } = require('../view/dashboard-view.js');
const { contentElement } = require('../ui.js');
const { render } = require('../utils');

class DashboardPresenter {
  #dashboardView = null;

  constructor() {
    this.#dashboardView = new DashboardView();
  }

  init = () => {
    render(this.#dashboardView.element, contentElement);
  };
}

module.exports = { DashboardPresenter };