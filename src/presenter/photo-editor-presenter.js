const { PhotoEditorView } = require('../view/photo-editor-view.js');
const { CropFrameView } = require('../view/crop-frame-view.js');
const { contentElement } = require('../ui.js');
const { render } = require('../utils');

class PhotoEditorPresenter {
  #photoEditorView = null;

  constructor() {
    this.#photoEditorView = new PhotoEditorView({ cropFrameView: new CropFrameView() });
  }

  init = () => {
    render(this.#photoEditorView.element, contentElement);
  };
}

module.exports = { PhotoEditorPresenter };