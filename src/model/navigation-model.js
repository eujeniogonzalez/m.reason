const { Observable } = require('../observable.js');
const { ROUTES, ACTIONS } = require('../const.js');

class NavigationModel extends Observable {
  #currentHash = ROUTES.DASHBOARD.HASH;

  get hash() {
    return this.#currentHash;
  }

  set hash(hash) {
    this.#currentHash = hash;

    this._notify(ACTIONS.CHANGE_ROUTE, { hash });
  }
}

module.exports = { NavigationModel };
