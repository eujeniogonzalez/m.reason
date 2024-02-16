const { ipcRenderer } = require('electron');
const { Observable } = require('../observable.js');
const { CHANNELS, PHOTO_SIZE, ACTIONS } = require('../const.js');

class PhotoEditorModel extends Observable {
  #cropSizeCode = null;

  constructor() {
    super();

    this.#cropSizeCode = this.#getStartCropSizeCode();
  }

  saveAllCrops = ({ crops, baseName }) => {
    let cropsSrc = [];

    Array.from(crops).forEach((crop) => {
      cropsSrc.push(crop.src);
    });

    ipcRenderer.sendSync(CHANNELS.SAVE_ALL_CROPPED_IMAGES, { cropsSrc, baseName });
  };

  getCropSizeCode = () => {
    return this.#cropSizeCode;
  };

  changeCropSizeCode = ({ newCropSizeCode }) => {
    this.#cropSizeCode = newCropSizeCode;

    this._notify(ACTIONS.CHANGE_CROP_SIZE_CODE, { updatedCropSizeCode: this.#cropSizeCode });
  };

  #getStartCropSizeCode = () => Object.keys(PHOTO_SIZE)[0];
}

module.exports = { PhotoEditorModel };
