const { PhotoEditorView } = require('../view/photo-editor-view.js');
const { CropFrameView } = require('../view/crop-frame-view.js');
const { PhotoEditorSourcesView } = require('../view/photo-editor-sources-view.js');
const { PhotoEditorResultView } = require('../view/photo-editor-result-view.js');
const { PhotoEditorEditingAreaView } = require('../view/photo-editor-editing-area-view.js');
const { contentElement } = require('../ui.js');
const { render } = require('../utils/common-utils.js');
const { RENDER_POSITION } = require('../const.js');

// todo Попробовать заменить все параметры функций на объекты

class PhotoEditorPresenter {
  #photoEditorModel = null;
  #photoEditorView = null;
  #photoEditorSourcesView = null;
  #photoEditorResultView = null;
  #photoEditorEditingAreaView = null;

  constructor({ photoEditorModel }) {
    this.#photoEditorModel = photoEditorModel;
    this.#photoEditorResultView = new PhotoEditorResultView({ saveAllCrops: this.#saveAllCrops });
    this.#photoEditorSourcesView = new PhotoEditorSourcesView({ insertSourseImageToBorder: this.#insertSourseImageToBorder });
    this.#photoEditorEditingAreaView = new PhotoEditorEditingAreaView({
      getCropSizeCode: this.#getCropSizeCode,
      changeCropSizeCode: this.#changeCropSizeCode,
      cropFrameView: new CropFrameView({ 
        activateSaveNewCropButton: this.#activateSaveNewCropButton,
        deactivateSaveNewCropButton: this.#deactivateSaveNewCropButton
      }),
      clearSourceItemSelection: this.#photoEditorSourcesView.clearSourceItemSelection,
      insertNewCropToResults: this.#photoEditorResultView.insertNewCropToResults
    });
    this.#photoEditorView = new PhotoEditorView();

    this.#photoEditorModel.addObserver(this.#updateCropSizesSelectorName);
  }

  init = () => {
    render(this.#photoEditorView.element, contentElement);
    render(this.#photoEditorSourcesView.element, this.#photoEditorView.element);
    render(this.#photoEditorEditingAreaView.element, this.#photoEditorView.panelElement);
    render(this.#photoEditorResultView.element, this.#photoEditorView.panelElement, RENDER_POSITION.BEFOREEND);
  };

  #activateSaveNewCropButton = () => {
    this.#photoEditorEditingAreaView.activateSaveNewCropButton();
  };

  #deactivateSaveNewCropButton = () => {
    this.#photoEditorEditingAreaView.deactivateSaveNewCropButton();
  };

  #insertSourseImageToBorder = (imageSrc) => {
    this.#photoEditorEditingAreaView.insertSourseImageToBorder(imageSrc);
  };

  #saveAllCrops = ({ crops, baseName }) => {
    this.#photoEditorModel.saveAllCrops({ crops, baseName });
  };

  #getCropSizeCode = () => {
    return this.#photoEditorModel.getCropSizeCode();
  };

  #changeCropSizeCode = ({ newCropSizeCode }) => {
    this.#photoEditorModel.changeCropSizeCode({ newCropSizeCode });
  };

  #updateCropSizesSelectorName = () => {
    
  };
}

module.exports = { PhotoEditorPresenter };