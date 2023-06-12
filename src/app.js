const { NavigationModel } = require('./model/navigation-model.js');
const { TasksModel } = require('./model/tasks-model.js');
const { PhotoEditorModel } = require('./model/photo-editor-model.js');
const { NavigationPresenter } = require('./presenter/navigation-presenter.js');
const { TitlePresenter } = require('./presenter/title-presenter.js');
const { ContentPresenter } = require('./presenter/content-presenter.js');

const navigationModel = new NavigationModel();
const tasksModel = new TasksModel();
const photoEditorModel = new PhotoEditorModel();
const navigationPresenter = new NavigationPresenter({ navigationModel });
const titlePresenter = new TitlePresenter({ navigationModel });
const contentPresenter = new ContentPresenter({ navigationModel, tasksModel, photoEditorModel });

navigationPresenter.init();
titlePresenter.init();
contentPresenter.init();
