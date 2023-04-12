const DEFAULT_WINDOW_SIZE = {
  WIDTH: 1200,
  HEIGHT: 800
}

const FOLDERS = {
  USER_DATA: 'userData',
  DATABASE: 'JSON Database'
};

const FILES = {
  PREFERENCES: 'user-preferences'
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
  }
};

module.exports = { DEFAULT_WINDOW_SIZE, FOLDERS, FILES, OPTIONS, RENDER_POSITION, ROUTES };


