const { Observable } = require('../observable.js');
const { ROUTES, ACTIONS } = require('../const.js');

class NavigationModel extends Observable {
  // #currentHash = ROUTES.TASKS.HASH;
  #currentHash = ROUTES.PHOTO_EDITOR.HASH; // todo После завершения работы над редактором вернуть задачи по умолчанию

  get hash() {
    return this.#currentHash;
  }

  set hash(hash) {
    this.#currentHash = hash;

    this._notify(ACTIONS.CHANGE_ROUTE, { hash });
  }
}

module.exports = { NavigationModel };
