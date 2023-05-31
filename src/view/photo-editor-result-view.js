const { createElement } = require('../utils.js');

function createPhotoEditorResultTemplate() {
  return `
    <div class="photo-editor-result">
      <div class="photo-editor-result-item">Фото 1</div>
      <div class="photo-editor-result-item">Фото 2</div>
      <div class="photo-editor-result-item">Фото 3</div>
      <div class="photo-editor-result-item">Фото 4</div>
      <div class="photo-editor-result-item">Фото 5</div>
      <div class="photo-editor-result-item">Фото 6</div>
      <div class="photo-editor-result-item">Фото 7</div>
      <div class="photo-editor-result-item">Фото 8</div>
      <div class="photo-editor-result-item">Фото 9</div>
    </div>
  `;
}

class PhotoEditorResultView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(createPhotoEditorResultTemplate());
    }

    return this.#element;
  }

  insertNewCropToResults = () => {
    console.log('creating new crop');
  };
}

module.exports = { PhotoEditorResultView };