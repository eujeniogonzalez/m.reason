const { NavigationModel } = require('./model/navigation-model.js');
const { NavigationPresenter } = require('./presenter/navigation-presenter.js');
const { TitlePresenter } = require('./presenter/title-presenter.js');

const navigationModel = new NavigationModel();
const navigationPresenter = new NavigationPresenter({ navigationModel });
const titlePresenter = new TitlePresenter({ navigationModel });

navigationPresenter.init();
titlePresenter.init();
