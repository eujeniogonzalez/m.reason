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

// todo Сократить названия вспомогательных функций

function createResultEmptyTemplate() {
  return `
    <div class="photo-editor-result-empty">
      ${MESSAGES.CROPS_NOT_CREATED}
    </div>
  `;
}

function createResultItemsWrapperTemplate() {
  return `
    <div class="photo-editor-result-items-wrapper"></div>
  `;
}

class PhotoEditorResultView {
  #element = null;
  #resultContainerElement = null;
  #resultItemsWrapperElement = null;
  #resultItems = null;

  constructor() {
    this.#resultContainerElement = this.element.querySelector('.photo-editor-result-container');

    this.#resultContainerElement.addEventListener('click', this.#resultContainerElementClickHandler);
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
    this.#insertResultItemsWrapperElement();
    this.#resultItemsWrapperElement.append(resultImage);
    this.#updateResultItemsElements();
  };

  #clearEmptyTemplate = () => {
    if (this.#resultItems) {
      return;
    }

    this.#resultContainerElement.innerHTML = ''; // todo Заменить на константу
  };

  #insertEmptyTemplate = () => {
    if (this.#resultItems) {
      return;
    }

    const emptyTemplate = createElement(createResultEmptyTemplate())

    this.#resultContainerElement.innerHTML = ''; // todo Заменить на константу
    this.#resultItemsWrapperElement = null;

    this.#resultContainerElement.append(emptyTemplate);
  };

  #updateResultItemsElements = () => {
    const resultItems = this.element.querySelectorAll('.photo-editor-result-item');
    this.#resultItems = resultItems.length ? resultItems : null;
  };

  #insertResultItemsWrapperElement = () => {
    if (this.#resultItemsWrapperElement) {
      return;
    }

    const resultItemsWrapperElement = createElement(createResultItemsWrapperTemplate());
    
    this.#resultContainerElement.append(resultItemsWrapperElement);
    this.#resultItemsWrapperElement = this.element.querySelector('.photo-editor-result-items-wrapper');
  };

  #removeResultItem = (resultItemElement) => {
    this.#resultItemsWrapperElement.removeChild(resultItemElement);
    this.#updateResultItemsElements();
  };

  #resultContainerElementClickHandler = (e) => {
    switch (true) {
      case e.target.classList.contains('photo-editor-result-item-delete'):
        this.#removeResultItem(e.target.parentNode);
        this.#insertEmptyTemplate();
        break;
    }
  };
}

module.exports = { PhotoEditorResultView };
