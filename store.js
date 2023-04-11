const electron = require('electron');
const path = require('path');
const fs = require('fs');
const { FOLDERS } = require('./const.js');

class Store {
  #path = null;
  #data = null;

  constructor(options) {
    const userDataPath = (electron.app || electron.remote.app).getPath(FOLDERS.USER_DATA);
    const jsonDatabasePath = path.join(userDataPath, FOLDERS.DATABASE);

    if (!jsonDatabasePath) {
      fs.mkdir(jsonDatabasePath, (err) => {
        if (err) {
            return console.error(err);
        }
      });
    }

    this.#path = path.join(userDataPath, `${options.configName}.json`);
    this.#data = parseDataFile(this.#path, options.defaults);
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