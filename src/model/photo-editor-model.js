const { ipcRenderer } = require('electron');
const { Observable } = require('../observable.js');
const { CHANNELS, ACTIONS } = require('../const.js');

class PhotoEditorModel extends Observable {
  constructor() {
    super();
  }

  saveAllCrops({ crops, baseName }) {
    let cropsSrc = [];

    Array.from(crops).forEach((crop) => {
      cropsSrc.push(crop.src);
    });

    // console.log(baseName);

    // console.log(crops[0].src.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/));
    // console.log(crops[1].src.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/));

    ipcRenderer.sendSync(CHANNELS.SAVE_ALL_CROPPED_IMAGES, { cropsSrc, baseName });
    
    // this._notify(ACTIONS.CHANGE_ROUTE, { hash });
  }
}

module.exports = { PhotoEditorModel };
