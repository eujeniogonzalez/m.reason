const { createElement } = require('../utils.js');
const { MESSAGES, PHOTO_LANDSCAPE, SYMBOLS, PHOTO_SIZE, PHOTO_EDITING_MAIN_SIZE } = require('../const.js');

function createPhotoEditorEditingAreaTemplate() {
  return `
    <div class="photo-editor-editing-area">
      <div class="photo-editor-editing-area-image-container">
        <div class="photo-editor-editing-area-image-border">
          ${MESSAGES.PHOTO_NOT_CHOSEN}
        </div>
      </div>
      <div class="photo-editor-editing-area-buttons">
        <button id="clear-editing-area" class="button_cancel" type="button">Очистить холст</button>
        <button id="save-new-crop" class="button_submit" type="button">Создать ракурс</button>
      </div>
    </div>
  `;
}

function createEditingImageTemplate(src) {
  return `
    <img class="photo-editor-editing-image" src="${src}" />
  `;
}

class PhotoEditorEditingAreaView {
  #element = null;
  #editingImageSizeInfo = null;
  #cropFrameView = null;
  #clearSourceItemSelection = null;
  #insertNewCropToResults = null;
  #editingImageContainerElement = this.element.querySelector('.photo-editor-editing-area-image-container');
  #editingImageBorderElement = this.element.querySelector('.photo-editor-editing-area-image-border');
  #clearImageBorderButton = this.element.querySelector('#clear-editing-area');
  #saveNewCropButton = this.element.querySelector('#save-new-crop');

  constructor({ cropFrameView, clearSourceItemSelection, insertNewCropToResults }) {
    this.#cropFrameView = cropFrameView;
    this.#clearSourceItemSelection = clearSourceItemSelection;
    this.#insertNewCropToResults = insertNewCropToResults;

    this.#clearImageBorderButton.addEventListener('click', this.#resetImageBorder);
    this.#saveNewCropButton.addEventListener('click', this.#createNewCrop);

    this.deActivateSaveNewCropButton();
    this.#deActivateClearEditingAreaButton();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(createPhotoEditorEditingAreaTemplate());
    }

    return this.#element;
  }

  insertSourseImageToBorder = (src) => {
    const imageElement = createElement(createEditingImageTemplate(src));
    const size = this.#getEditingImageSizeInfo(imageElement);

    this.#clearImageBorder();

    imageElement.height = size.scaledHeight; // todo Подумать, можно ли применить деструктуризацию
    imageElement.width = size.scaledWidth;

    this.#editingImageBorderElement.append(imageElement);
    this.#insertCropFrameToBorder(size);

    this.activateSaveNewCropButton();
    this.#activateClearEditingAreaButton();
  };

  activateSaveNewCropButton = () => {
    this.#saveNewCropButton.disabled = false;
    this.#saveNewCropButton.classList.remove('save-new-crop-disabled');
  };

  deActivateSaveNewCropButton = () => {
    this.#saveNewCropButton.disabled = true;
    this.#saveNewCropButton.classList.add('save-new-crop-disabled');
  };

  #activateClearEditingAreaButton = () => {
    this.#clearImageBorderButton.disabled = false;
    this.#clearImageBorderButton.classList.remove('clear-editing-area-disabled');
  };

  #deActivateClearEditingAreaButton = () => {
    this.#clearImageBorderButton.disabled = true;
    this.#clearImageBorderButton.classList.add('clear-editing-area-disabled');
  };

  #getEditingImageSizeInfo = (imageElement) => {
    const innerPadding = parseInt(window.getComputedStyle(this.#editingImageContainerElement, null).getPropertyValue('padding'), 10); // todo Заменить на utils
    const sourceHeight = imageElement.height;
    const sourceWidth = imageElement.width;
    const editingAreaHeight = this.#editingImageContainerElement.offsetHeight - innerPadding * 2;
    const editingAreaWidth = this.#editingImageContainerElement.offsetWidth - innerPadding * 2;
    const landscape = imageElement.width <= imageElement.height ? PHOTO_LANDSCAPE.VERTICAL : PHOTO_LANDSCAPE.HORIZONTAL;
    let sourceRatio, scaledHeight, scaledWidth;

    switch (landscape) {
      case PHOTO_LANDSCAPE.HORIZONTAL:
        sourceRatio = imageElement.height / imageElement.width;

        if (editingAreaWidth * sourceRatio >= editingAreaHeight) {
          scaledWidth = editingAreaHeight / sourceRatio;
          scaledHeight = editingAreaHeight;
        } else {
          scaledWidth = editingAreaWidth;
          scaledHeight = editingAreaWidth * sourceRatio;
        }
        break;
      case PHOTO_LANDSCAPE.VERTICAL:
        sourceRatio = imageElement.width / imageElement.height;

        if (editingAreaHeight * sourceRatio > editingAreaWidth) {
          scaledHeight = editingAreaWidth / sourceRatio;
          scaledWidth = editingAreaWidth;
        } else {
          scaledHeight = editingAreaHeight;
          scaledWidth = editingAreaHeight * sourceRatio;
        }
        break;
    }

    this.#editingImageSizeInfo = { 
      sourceHeight, 
      sourceWidth, 
      sourceRatio, 
      scaledHeight, 
      scaledWidth, 
      editingAreaHeight, 
      editingAreaWidth 
    };

    return this.#editingImageSizeInfo; // todo Сбросить this.#editingImageSizeInfo после очистки поля редактирования
  };

  #getImageMainSize = (width, height) => {
    let mainSize;

    if (width / height >= PHOTO_SIZE.LAMODA.WIDTH / PHOTO_SIZE.LAMODA.HEIGHT) {
      mainSize = PHOTO_EDITING_MAIN_SIZE.WIDTH;
    } else {
      mainSize = PHOTO_EDITING_MAIN_SIZE.HEIGHT;
    }

    return mainSize;
  };

  #insertCropFrameToBorder = (size) => {
    const { scaledHeight, scaledWidth, sourceHeight, sourceWidth } = size;
    const mainSize = this.#getImageMainSize(scaledWidth, scaledHeight);
    let lamodaRatio, cropFrameWidth, cropFrameHeight, cropFrameLeft, cropFrameTop;

    switch (mainSize) {
      case PHOTO_EDITING_MAIN_SIZE.WIDTH:
        lamodaRatio = PHOTO_SIZE.LAMODA.WIDTH / PHOTO_SIZE.LAMODA.HEIGHT;
        cropFrameWidth = scaledHeight * lamodaRatio;
        cropFrameHeight = scaledHeight;
        cropFrameLeft = (this.#editingImageBorderElement.offsetWidth - cropFrameWidth) / 2;
        
        this.#cropFrameView.element.style.height = `${cropFrameHeight}px`;
        this.#cropFrameView.element.style.width = `${cropFrameWidth}px`;
        this.#cropFrameView.element.style.left = `${cropFrameLeft}px`;
        this.#cropFrameView.element.style.top = `0px`;
        break;
    
      case PHOTO_EDITING_MAIN_SIZE.HEIGHT:
        lamodaRatio = PHOTO_SIZE.LAMODA.HEIGHT / PHOTO_SIZE.LAMODA.WIDTH;
        cropFrameWidth = scaledWidth;
        cropFrameHeight = scaledWidth * lamodaRatio;
        cropFrameTop = (this.#editingImageBorderElement.offsetHeight - cropFrameHeight) / 2;

        this.#cropFrameView.element.style.height = `${cropFrameHeight}px`;
        this.#cropFrameView.element.style.width = `${cropFrameWidth}px`;
        this.#cropFrameView.element.style.left = `0px`;
        this.#cropFrameView.element.style.top = `${cropFrameTop}px`;
        break;
    }

    this.#cropFrameView.setMinCropFrameSize({ sourceHeight, sourceWidth, scaledHeight, scaledWidth });
    this.#cropFrameView.removeCropFrameNotValidClass();
    this.#editingImageBorderElement.append(this.#cropFrameView.element);
  };

  #clearImageBorder = () => {
    this.#editingImageBorderElement.innerHTML = SYMBOLS.EMPTY_STRING;
  };

  #resetImageBorder = () => {
    this.#editingImageBorderElement.innerHTML = MESSAGES.PHOTO_NOT_CHOSEN;
    this.#clearSourceItemSelection();
    this.#deActivateClearEditingAreaButton();
    this.deActivateSaveNewCropButton();
  };

  #createNewCrop = () => {
    const { sourceHeight, sourceWidth, scaledHeight, scaledWidth } = this.#editingImageSizeInfo;
    const { frameHeight, frameWidth, frameTop, frameLeft } = this.#cropFrameView.getFrameInfo();

    // console.log(sourceHeight, sourceWidth, scaledHeight, scaledWidth);
    // console.log(frameHeight, frameWidth, frameTop, frameLeft);

    // console.log(sourceHeight / scaledHeight);
    // console.log(sourceWidth / scaledWidth);

    // Src оригинала

    this.#insertNewCropToResults();
  };
}

module.exports = { PhotoEditorEditingAreaView };