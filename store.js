const electron = require('electron');
const path = require('path');
const fs = require('fs');

// todo Вынести системные пути в конастанты


class Store {
  #path = null;
  #data = null;

  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    const jsondatabasePath = path.join(userDataPath, 'JSON Database');

    // todo Вынести в отдельную функцию
    if (!jsondatabasePath) {
      fs.mkdir(jsondatabasePath, (err) => {
        if (err) {
            return console.error(err);
        }
      });
    }

    this.#path = path.join(userDataPath, opts.configName + '.json');
    this.#data = parseDataFile(this.path, opts.defaults);
  }
  
  get(key) {
    return this.#data[key];
  }
  
  set(key, val) {
    this.#data[key] = val;

    fs.writeFileSync(this.#path, JSON.stringify(this.#data));
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    return defaults;
  }
}

module.exports = Store;