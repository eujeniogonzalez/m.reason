const { createElement } = require('../utils/common-utils.js');
const { 
  MESSAGES,
  PHOTO_LANDSCAPE,
  SYMBOLS,
  PHOTO_SIZE,
  PHOTO_EDITING_MAIN_SIZE,
  ACTIONS
} = require('../const.js');

function createPhotoEditorEditingAreaTemplate() {
  return `
    <div class="photo-editor-editing-area">
      <div class="photo-editor-editing-area-image-container">
        <div class="photo-editor-editing-area-image-border">
          ${MESSAGES.PHOTO_NOT_CHOSEN}
        </div>
      </div>
      <div class="photo-editor-editing-area-buttons">
        <div class="crop-sizes-list crop-sizes-list-hidden">
          ${createImageSizeLabelsTemplate()}
        </div>

        <button id="button-size" class="pseudo-button-size" type="button">
          <span class="pseudo-button-size-name"></span>
          <svg width="10" height="6" xmlns="http://www.w3.org/2000/svg" class="button-size-triangle">
            <polygon points="5,0 9,6 0,6" fill="grey" />
          </svg>
        </button>  
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

function createImageSizeLabelsTemplate() {
  let imageSizeLabelsTemplate = SYMBOLS.EMPTY_STRING;
  let i = 0;

  for (const [key] of Object.entries(PHOTO_SIZE)) {
    imageSizeLabelsTemplate += `
      <label class="crop-sizes-item-label">
        <input class="crop-sizes-item-radio" type="radio" name="cropSizes" value="${key}" ${getCheckedByIndex(i, 0) /* todo Вынести ноль в константы */} />
        ${PHOTO_SIZE[key].NAME} <span class="crop-sizes-item-label-dimensions">(${PHOTO_SIZE[key].WIDTH}x${PHOTO_SIZE[key].HEIGHT})</span>
      </label>
    `;

    i++;
  }

  return imageSizeLabelsTemplate;
}

function getCheckedByIndex(index, value) {
  return index === value && 'checked';
}

class PhotoEditorEditingAreaView {
  #element = null;
  #editingImageSizeInfo = null;
  #cropFrameView = null;
  #clearSourceItemSelection = null;
  #insertNewCropToResults = null;
  #currentSourceImageSrc = null; // todo Не забыть сбросить при очистке editing area
  #editingImageContainerElement = this.element.querySelector('.photo-editor-editing-area-image-container');
  #editingImageBorderElement = this.element.querySelector('.photo-editor-editing-area-image-border');
  #clearImageBorderButton = this.element.querySelector('#clear-editing-area');
  #saveNewCropButton = this.element.querySelector('#save-new-crop');
  #changeCropSizeButton = this.element.querySelector('#button-size');
  #cropSizesListElement = this.element.querySelector('.crop-sizes-list');
  #cropSizesRadioButtonsElements = this.#cropSizesListElement.querySelectorAll('.crop-sizes-item-radio');
  #cropSizesSelectorElement = this.element.querySelector('.pseudo-button-size-name');

  constructor({ 
    cropFrameView, 
    clearSourceItemSelection, 
    insertNewCropToResults,
    getCropSizeCode,
    changeCropSizeCode
  }) {
    this.#cropFrameView = cropFrameView;
    this.#clearSourceItemSelection = clearSourceItemSelection;
    this.#insertNewCropToResults = insertNewCropToResults;

    this.#clearImageBorderButton.addEventListener('click', this.#resetImageBorder); // todo Заме6нить название на хендлер
    this.#saveNewCropButton.addEventListener('click', this.#createNewCrop); // todo Заме6нить название на хендлер
    this.#changeCropSizeButton.addEventListener('click', (e) => { // todo Заменить на хендлер и убрать e
      this.#rotateCropSizeButtonTriangle();
      // todo Вынести в функцию showOrHideCropSizesList
      switch (true) {
        case this.#cropSizesListElement.classList.contains('crop-sizes-list-hidden'):
          this.#cropSizesListElement.classList.remove('crop-sizes-list-hidden');
          this.#cropSizesListElement.classList.add('crop-sizes-list-visible');
          break;
        
        case this.#cropSizesListElement.classList.contains('crop-sizes-list-visible'):
          this.#cropSizesListElement.classList.remove('crop-sizes-list-visible');
          this.#cropSizesListElement.classList.add('crop-sizes-list-hidden');
          break;
      
        default:
          this.#cropSizesListElement.classList.add('crop-sizes-list-hidden');
          break;
      }
    });

    this.#setCropSizesSelectorName(getCropSizeCode());

    this.#cropSizesRadioButtonsElements.forEach((item) => {
      item.addEventListener('change', (e) => { // todo Вынести в хендлер
        const newCropSizeCode = e.target.value;

        changeCropSizeCode({ newCropSizeCode });
      });
    });
    

    this.deactivateSaveNewCropButton();
    this.#deActivateClearEditingAreaButton();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(createPhotoEditorEditingAreaTemplate());
    }

    return this.#element;
  }

  insertSourseImageToBorder = (src) => {
    this.#currentSourceImageSrc = src;

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

  deactivateSaveNewCropButton = () => {
    this.#saveNewCropButton.disabled = true;
    this.#saveNewCropButton.classList.add('save-new-crop-disabled');
  };

  updateCropSizesSelectorName = (action, { updatedCropSizeCode }) => {
    if (action !== ACTIONS.CHANGE_CROP_SIZE_CODE) return;

    this.#cropSizesSelectorElement.innerHTML = PHOTO_SIZE[updatedCropSizeCode].NAME;
  };

  #setCropSizesSelectorName = (cropSizeCode) => {
    this.#cropSizesSelectorElement.innerHTML = PHOTO_SIZE[cropSizeCode].NAME;
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
        // We should round to floor, otherwise getting artefacts on maximum height or width
        cropFrameWidth = Math.floor(scaledHeight * lamodaRatio);
        cropFrameHeight = Math.floor(scaledHeight);
        cropFrameLeft = (this.#editingImageBorderElement.offsetWidth - cropFrameWidth) / 2;
        
        this.#cropFrameView.element.style.height = `${cropFrameHeight}px`;
        this.#cropFrameView.element.style.width = `${cropFrameWidth}px`;
        this.#cropFrameView.element.style.left = `${cropFrameLeft}px`;
        this.#cropFrameView.element.style.top = `0px`;
        break;
    
      case PHOTO_EDITING_MAIN_SIZE.HEIGHT:
        lamodaRatio = PHOTO_SIZE.LAMODA.HEIGHT / PHOTO_SIZE.LAMODA.WIDTH;
        // We should round to floor, otherwise getting artefacts on maximum height or width
        cropFrameWidth = Math.floor(scaledWidth);
        cropFrameHeight = Math.floor(scaledWidth * lamodaRatio);
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
    this.deactivateSaveNewCropButton();
  };

  #createNewCrop = () => {
    const { sourceHeight, sourceWidth, scaledHeight, scaledWidth } = this.#editingImageSizeInfo;
    const { frameHeight, frameWidth, frameTop, frameLeft } = this.#cropFrameView.getFrameInfo();

    const croppedHeight = (sourceHeight / scaledHeight) * frameHeight;
    const croppedWidth = (sourceWidth / scaledWidth) * frameWidth;
    const croppedTop = (sourceHeight / scaledHeight) * frameTop;
    const croppedLeft = (sourceWidth / scaledWidth) * frameLeft;

    const sourceSrc = this.#currentSourceImageSrc;

    this.#insertNewCropToResults({ sourceSrc, croppedHeight, croppedWidth, croppedTop, croppedLeft });
  };

  #rotateCropSizeButtonTriangle = () => {
    switch (true) {
      case this.#changeCropSizeButton.classList.contains('rotate-triangle-from-closed-to-opened'):
        this.#changeCropSizeButton.classList.remove('rotate-triangle-from-closed-to-opened');
        this.#changeCropSizeButton.classList.add('rotate-triangle-from-opened-to-closed');
        break;

      case this.#changeCropSizeButton.classList.contains('rotate-triangle-from-opened-to-closed'):
        this.#changeCropSizeButton.classList.remove('rotate-triangle-from-opened-to-closed');
        this.#changeCropSizeButton.classList.add('rotate-triangle-from-closed-to-opened');
        break;
    
      default:
        this.#changeCropSizeButton.classList.add('rotate-triangle-from-closed-to-opened');
        break;
    }
  };
}

module.exports = { PhotoEditorEditingAreaView };