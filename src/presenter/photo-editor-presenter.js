const { PhotoEditorView } = require('../view/photo-editor-view.js');
const { CropFrameView } = require('../view/crop-frame-view.js');
const { contentElement } = require('../ui.js');
const { render } = require('../utils');

class PhotoEditorPresenter {
  #photoEditorView = null;

  constructor() {
    this.#photoEditorView = new PhotoEditorView({ 
      cropFrameView: new CropFrameView({ 
        activateSaveNewCropButton: this.#activateSaveNewCropButton,
        deActivateSaveNewCropButton: this.#deActivateSaveNewCropButton
      }) 
    });
  }

  init = () => {
    render(this.#photoEditorView.element, contentElement);
  };

  #activateSaveNewCropButton = () => {
    this.#photoEditorView.activateSaveNewCropButton();
  };

  #deActivateSaveNewCropButton = () => {
    this.#photoEditorView.deActivateSaveNewCropButton();
  };
}

module.exports = { PhotoEditorPresenter };