const START_TASK_ID = 1;

const DEFAULT_WINDOW_SIZE = {
  WIDTH: 1200,
  HEIGHT: 800
}

const TASK_LENGTH = {
  MAX: 200,
  MIN: 0
}

const FOLDERS = {
  USER_DATA: 'userData',
  DATABASE: 'JSON Database'
};

const FILES = {
  PREFERENCES: 'user-preferences',
  TASK_LIST: 'task-list'
};

const OPTIONS = {
  WINDOW_BOUNDS: 'windowBounds'
};

const RENDER_POSITION = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const ROUTES = {
  DASHBOARD: {
    HASH: '#dashboard',
    NAME: 'Дашборд'
  },
  SHIPMENT: {
    HASH: '#shipment',
    NAME: 'Поставки'
  },
  CONVERTER: {
    HASH: '#converter',
    NAME: 'Конвертер'
  },
  COLLECTIONS: {
    HASH: '#collections',
    NAME: 'Коллекции'
  },
  TASKS: {
    HASH: '#tasks',
    NAME: 'Задачи'
  }
};

const ACTIONS = {
  CHANGE_ROUTE: 'change-route',
  CREATE_TASK: 'create-task',
  DELETE_TASK: 'delete-task',
  CHANGE_TASK_ACTIVITY: 'change-task-activity'
};

const ACTIVE_ROUTE_CLASS = 'nav-item-active';

const CLOSED_TASK_CLASS = 'closed-task';

const CHANNELS = {
  CREATE_TASK: 'create-task',
  GET_TASK_LIST: 'get-task-list',
  DELETE_TASK: 'delete-task',
  CHANGE_TASK_ACTIVITY: 'change-task-activity'
};

const CLASSES = {
  WRONG_INPUT: 'wrong_input'
};

const SYMBOLS = {
  EMPTY_STRING: ''
};

const LINK_ANCHORS = {
  CLOSE_TASK: 'Закрыть',
  REOPEN_TASK: 'Возобновить'
};

module.exports = {
  DEFAULT_WINDOW_SIZE,
  FOLDERS,
  FILES,
  OPTIONS,
  RENDER_POSITION,
  ROUTES,
  ACTIONS,
  ACTIVE_ROUTE_CLASS,
  CHANNELS,
  TASK_LENGTH,
  CLASSES,
  CLOSED_TASK_CLASS,
  SYMBOLS,
  LINK_ANCHORS,
  START_TASK_ID
};


