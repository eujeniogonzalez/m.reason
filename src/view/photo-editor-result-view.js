const { createElement } = require('../utils/common-utils.js');
const { downScaleImage } = require('../utils/downscale-image-utils.js');
const { DragAndDrop } = require('../utils/drag-and-drop-class.js');
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
        <input id="crops-base-name" class="crop-base-name" type="text" placeholder="Метка" minlength="3" maxlength="3">
        <button id="save-all-crops" class="button_submit" type="button">Сохранить ракурсы</button>
      </div>
    </div>
  `;
}

function createPhotoEditorResultItemTemplate(src, index) {
  return `
    <div class="photo-editor-result-item">
      <div class="photo-editor-result-draggable-item" draggable="true" id=item-${index}>
        <div class="photo-editor-result-item-delete"></div>
        <img class="photo-editor-result-item-image" src="${src}" draggable="false" />
      </div>
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
  #resultItemsWrapperElement = null;
  #resultItems = null;
  #dragAndDrop = null;
  #lastDraggableItemIndex = 0; // todo Вынести в константу
  #saveAllCrops = null;

  #resultContainerElement = this.element.querySelector('.photo-editor-result-container');
  #cropsBaseNameElement = this.element.querySelector('#crops-base-name');
  #saveAllCropsButton = this.element.querySelector('#save-all-crops');

  constructor({ saveAllCrops }) {
    this.#saveAllCrops = saveAllCrops;

    this.#resultContainerElement.addEventListener('click', this.#resultContainerElementClickHandler);
    this.#saveAllCropsButton.addEventListener('click', this.#saveAllCropsButtonClickHandler);
    this.#cropsBaseNameElement.addEventListener('input', this.#cropsBaseNameElementInputHandler);

    this.#dragAndDrop = new DragAndDrop({
      draggingClassName: 'dragging', // todo Перенести контейнер сюда
      draggableItemClassName: 'photo-editor-result-draggable-item' // todo Заменить на константы
    });

    this.#deactivateSaveAllCropsButton();
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
    const resultImage = createElement(createPhotoEditorResultItemTemplate(downScaledImage, this.#getDruggableItemIndex()));

    this.#clearEmptyTemplate();
    this.#insertResultItemsWrapperElement();
    this.#resultItemsWrapperElement.append(resultImage);
    this.#updateResultItemsElements();
    this.#updateSaveAllCropsButtonActivity();

    this.#dragAndDrop.updateItems({
      container: this.element,
      items: this.#resultItems,
      draggableItems: this.element.querySelectorAll('.photo-editor-result-draggable-item')
    });
  };

  #getDruggableItemIndex = () => {
    return this.#lastDraggableItemIndex++;
  };

  #clearEmptyTemplate = () => {
    if (this.#resultItems) return;

    this.#resultContainerElement.innerHTML = ''; // todo Заменить на константу
  };

  #insertEmptyTemplate = () => {
    if (this.#resultItems) return;

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
    if (this.#resultItemsWrapperElement) return;

    const resultItemsWrapperElement = createElement(createResultItemsWrapperTemplate());
    
    this.#resultContainerElement.append(resultItemsWrapperElement);
    this.#resultItemsWrapperElement = this.element.querySelector('.photo-editor-result-items-wrapper');
  };

  #removeResultItem = (resultItemElement) => {
    this.#resultItemsWrapperElement.removeChild(resultItemElement);
    this.#updateResultItemsElements();
    this.#updateSaveAllCropsButtonActivity();

    this.#dragAndDrop.updateItems({
      container: this.element,
      items: this.#resultItems,
      draggableItems: this.element.querySelectorAll('.photo-editor-result-draggable-item') // todo Создать функцию по обновлению дрэгабл айтемс
    });
  };

  #activateSaveAllCropsButton = () => {
    this.#saveAllCropsButton.disabled = false;
    this.#saveAllCropsButton.classList.remove('save-all-crops-disabled');
  };

  #deactivateSaveAllCropsButton = () => {
    this.#saveAllCropsButton.disabled = true;
    this.#saveAllCropsButton.classList.add('save-all-crops-disabled');
  };

  #updateSaveAllCropsButtonActivity = () => {
    if (!this.#resultItems || this.#cropsBaseNameElement.value.length < 3) { // todo Вынести в константу
      this.#deactivateSaveAllCropsButton();
    } else {
      this.#activateSaveAllCropsButton();
    }
  };

  #resultContainerElementClickHandler = (e) => {
    switch (true) {
      case e.target.classList.contains('photo-editor-result-item-delete'):
        this.#removeResultItem(e.target.closest('.photo-editor-result-item'));
        this.#insertEmptyTemplate();
        break;
    }
  };

  #saveAllCropsButtonClickHandler = () => {
    const crops = this.element.querySelectorAll('.photo-editor-result-item-image');

    this.#saveAllCrops({ crops, baseName: this.#cropsBaseNameElement.value });
  };

  #cropsBaseNameElementInputHandler = () => {
    this.#updateSaveAllCropsButtonActivity();
  };
}

module.exports = { PhotoEditorResultView };
