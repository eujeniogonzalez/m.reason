const { createElement } = require('../utils/common-utils.js');

function createPhotoEditorTemplate() {
  return `
    <div class="photo-editor">
      <div class="photo-editor-panel"></div>
    </div>
  `;
}

class PhotoEditorView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(createPhotoEditorTemplate());
    }

    return this.#element;
  }

  get panelElement() {
    return this.#element.querySelector('.photo-editor-panel');
  }
}

module.exports = { PhotoEditorView };