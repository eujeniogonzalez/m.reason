const { createElement } = require('../utils/common-utils.js');
const { downScaleImage } = require('../utils/downscale-image-utils.js');
const { MESSAGES, PHOTO_SIZE } = require('../const.js');

function createPhotoEditorResultTemplate() {
  return `
    <div class="photo-editor-result">
      <div class="photo-editor-result-container">
        <div class="photo-editor-result-empty">
          ${MESSAGES.CROPS_NOT_CREATED}
        </div>
      </div>
      <div class="photo-editor-editing-area-buttons">
        <button id="clear-editing-area" class="button_cancel" type="button">Очистить холст</button>
        <button id="save-new-crop" class="button_submit" type="button">Создать ракурс</button>
      </div>
    </div>
  `;
}

function createPhotoEditorResultItemTemplate(src) {
  return `
    <div class="photo-editor-result-item">
      <div class="photo-editor-result-item-delete"></div>
      <img class="photo-editor-result-item-image" src="${src}" />
    </div>
  `;
}

function createPhotoEditorResultEmptyTemplate(src) {
  return `
    <div class="photo-editor-result-empty">
      ${MESSAGES.CROPS_NOT_CREATED}
    </div>
  `;
}

class PhotoEditorResultView {
  #element = null;
  #resultContainerElement = null;
  #resultItems = null;

  constructor() {
    this.#resultContainerElement = this.element.querySelector('.photo-editor-result-container');
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(createPhotoEditorResultTemplate());
    }

    return this.#element;
  }

  insertNewCropToResults = ({ sourceSrc, croppedHeight, croppedWidth, croppedTop, croppedLeft }) => {
    const newCropImage = document.createElement('img');
    newCropImage.src = sourceSrc;

    const scale = PHOTO_SIZE.LAMODA.WIDTH / croppedWidth;
    const downScaledImage = downScaleImage(newCropImage, scale, croppedHeight, croppedWidth, croppedLeft, croppedTop).toDataURL('image/jpeg', 1); // todo Заменить на константу
    const resultImage = createElement(createPhotoEditorResultItemTemplate(downScaledImage));

    this.#clearEmptyTemplate();
    this.#resultContainerElement.append(resultImage);
    this.#updateResultItemsElements();
  };

  #clearEmptyTemplate = () => {
    if (this.#resultItems) {
      return;
    }

    this.#resultContainerElement.innerHTML = ''; // todo Заменить на константу
  };

  #updateResultItemsElements = () => {
    this.#resultItems = this.element.querySelectorAll('.photo-editor-result-item');
  };
}

module.exports = { PhotoEditorResultView };
