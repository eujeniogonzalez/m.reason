const electron = require('electron');
const path = require('path');
const fs = require('fs');
const { FOLDERS } = require('./const.js');

class Store {
  #path = null;
  #data = null;

  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath(FOLDERS.USER_DATA);
    const jsonDatabasePath = path.join(userDataPath, FOLDERS.DATABASE);

    if (!jsonDatabasePath) {
      fs.mkdir(jsonDatabasePath, (err) => {
        if (err) {
            return console.error(err);
        }
      });
    }

    this.#path = path.join(userDataPath, opts.configName + '.json');
    this.#data = parseDataFile(this.#path, opts.defaults);
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
  // console.log(JSON.parse(fs.readFileSync(filePath)));
  try {
    // console.log('uspeh');
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    // console.log('lol');
    return defaults;
  }
}

module.exports = Store;