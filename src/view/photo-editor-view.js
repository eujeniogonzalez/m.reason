const { createElement } = require('../utils.js');

const { MESSAGES, SYMBOLS, PHOTO_LANDSCAPE, PHOTO_SIZE, PHOTO_EDITING_MAIN_SIZE } = require('../const.js');

function createPhotoEditorTemplate() {
  // todo Избавиться от SVG
  return `
    <div class="photo-editor">
      <div class="photo-editor-sources">
        <label class="photo-editor-upload-sources-label">
          <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none">
            <path d="M4 12H20M12 4V20" stroke="#cccccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input type="file" id="photo-editor-upload-sources-input" multiple accept=".jpg" />
        </label>
      </div>
      <div class="photo-editor-panel">
        <div class="photo-editor-editing-area">
          <div class="photo-editor-editing-area-image-container">
            <div class="photo-editor-editing-area-image-border">
              ${MESSAGES.PHOTO_NOT_CHOSEN}
            </div>
          </div>
          <div class="photo-editor-editing-area-buttons">
            <button id="clear-canvas" class="button_cancel" type="button">Очистить холст</button>
            <button id="save-new-crop" class="button_submit" type="button">Создать ракурс</button>
          </div>
        </div>
        <div class="photo-editor-result">
          <div class="photo-editor-result-item"></div>
          <div class="photo-editor-result-item"></div>
          <div class="photo-editor-result-item"></div>
          <div class="photo-editor-result-item"></div>
          <div class="photo-editor-result-item"></div>
          <div class="photo-editor-result-item"></div>
          <div class="photo-editor-result-item"></div>
          <div class="photo-editor-result-item"></div>
          <div class="photo-editor-result-item"></div>
        </div>
      </div>
    </div>
  `;
}

function createSourceItemTemplate(src) {
  return `
    <div class="photo-editor-source-item">
      <div class="photo-editor-source-item-delete"></div>
      <img class="photo-editor-source-item-image" src="${src}" />
    </div>
  `;
}

function createEditingImageTemplate(src) {
  return `
    <img class="photo-editor-editing-image" src="${src}" />
  `;
}

// todo Обработать кейс, когда исходное фото меньше стандартов
class PhotoEditorView {
  #element = null;
  #sourcesChooserElement = this.element.querySelector('#photo-editor-upload-sources-input');
  #sourcesElement = this.element.querySelector('.photo-editor-sources');
  #editingImageContainerElement = this.element.querySelector('.photo-editor-editing-area-image-container');
  #editingImageBorderElement = this.element.querySelector('.photo-editor-editing-area-image-border');
  #clearImageBorderButton = this.element.querySelector('#clear-canvas');
  #cropFrameView = null;

  constructor({ cropFrameView }) {
    this.#cropFrameView = cropFrameView;
    this.#sourcesChooserElement.addEventListener('change', this.#sourcesInputChangeHandler);
    this.#sourcesElement.addEventListener('click', this.#sourcesElementClickHandler);
    this.#clearImageBorderButton.addEventListener('click', this.#resetImageBorder);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(createPhotoEditorTemplate());
    }

    return this.#element;
  }

  #sourcesInputChangeHandler = () => {
    if (!this.#sourcesChooserElement.files.length) {
      return;
    }

    // todo Выделить в отдельный метод
    Array.from(this.#sourcesChooserElement.files).forEach((file) => {
      const reader = new FileReader();

      reader.addEventListener('load', (e) => {
        this.#addSourceImageToTemplate(e.target.result);
      });
      reader.readAsDataURL(file);
    });

    this.#clearFileListSourcesChooser();

    // todo Сделать проверку на правильный тип файла
    // if (file.type && !file.type.startsWith('image/')) {
    //   console.log('File is not an image.', file.type, file);
    //   return;
    // }

    // console.log('Работаем с выбранными файлами');
    // console.log(this.#fileChooserElement.files);
  };

  #addSourceImageToTemplate = (src) => {
    this.#sourcesElement.prepend(createElement(createSourceItemTemplate(src)));
  };

  #sourcesElementClickHandler = (e) => {
    switch (true) {
      case e.target.classList.contains('photo-editor-source-item-delete'):
        this.#removeSourceItem(e.target.parentNode);
        break;
      case e.target.classList.contains('photo-editor-source-item-image'):
        if (this.#isSourseItemSelected(e.target.parentNode)) {
          break;
        }

        this.#clearSourceItemSelection();
        this.#selectSourseItem(e.target.parentNode);
        this.#insertSourseImageToBorder(e.target.src);
        break;
    }
  };

  #removeSourceItem = (sourceItemElement) => {
    this.#sourcesElement.removeChild(sourceItemElement);
  };

  #clearFileListSourcesChooser = () => {
    this.#sourcesChooserElement.files = new DataTransfer().files;
  };

  #selectSourseItem = (sourceItemElement) => {
    sourceItemElement.classList.add('photo-editor-source-item-selected');
  };

  #isSourseItemSelected = (sourceItemElement) => {
    return sourceItemElement.classList.contains('photo-editor-source-item-selected');
  };

  #clearSourceItemSelection = () => {
    const selectedSourseItem = this.#sourcesElement.querySelector('.photo-editor-source-item-selected');

    if (!selectedSourseItem) {
      return;
    }

    selectedSourseItem.classList.remove('photo-editor-source-item-selected');
  };

  #insertSourseImageToBorder = (src) => {
    const imageElement = createElement(createEditingImageTemplate(src));
    const size = this.#getEditingImageSizeInfo(imageElement);

    this.#clearImageBorder();

    imageElement.height = size.scaledHeight; // todo Подумать, можно ли применить деструктуризацию
    imageElement.width = size.scaledWidth;

    this.#editingImageBorderElement.append(imageElement);
    this.#insertCropFrameToBorder(size);
  };

  #clearImageBorder = () => {
    this.#editingImageBorderElement.innerHTML = SYMBOLS.EMPTY_STRING;
  };

  #resetImageBorder = () => {
    this.#editingImageBorderElement.innerHTML = MESSAGES.PHOTO_NOT_CHOSEN;
    this.#clearSourceItemSelection();
  };

  #getEditingImageSizeInfo = (imageElement) => {
    const innerPadding = parseInt(window.getComputedStyle(this.#editingImageContainerElement, null).getPropertyValue('padding'), 10); // todo Заменить на utils
    const sourceHeight = imageElement.height;
    const sourceWidth = imageElement.width;
    const editingAreaHeight = this.#editingImageContainerElement.offsetHeight - innerPadding * 2;
    const editingAreaWidth = this.#editingImageContainerElement.offsetWidth - innerPadding * 2;
    const landscape = imageElement.width <= imageElement.height ? PHOTO_LANDSCAPE.VERTICAL : PHOTO_LANDSCAPE.HORIZONTAL;
    let sourceRatio, scaledHeight, scaledWidth, mainSize;

    switch (landscape) {
      case PHOTO_LANDSCAPE.HORIZONTAL:
        sourceRatio = imageElement.height / imageElement.width;

        if (editingAreaWidth * sourceRatio >= editingAreaHeight) {
          scaledWidth = editingAreaHeight / sourceRatio;
          scaledHeight = editingAreaHeight;
          mainSize = PHOTO_EDITING_MAIN_SIZE.HEIGHT;
        } else {
          scaledWidth = editingAreaWidth;
          scaledHeight = editingAreaWidth * sourceRatio;
          mainSize = PHOTO_EDITING_MAIN_SIZE.WIDTH;
        }
        break;
      case PHOTO_LANDSCAPE.VERTICAL:
        sourceRatio = imageElement.width / imageElement.height;

        if (editingAreaHeight * sourceRatio > editingAreaWidth) {
          scaledHeight = editingAreaWidth / sourceRatio;
          scaledWidth = editingAreaWidth;
          mainSize = PHOTO_EDITING_MAIN_SIZE.WIDTH;
        } else {
          scaledHeight = editingAreaHeight;
          scaledWidth = editingAreaHeight * sourceRatio;
          mainSize = PHOTO_EDITING_MAIN_SIZE.HEIGHT;
        }
        break;
    }

    return { mainSize, sourceHeight, sourceWidth, sourceRatio, scaledHeight, scaledWidth, editingAreaHeight, editingAreaWidth };
  };

  #insertCropFrameToBorder = (size) => {
    const { mainSize, scaledHeight, scaledWidth, editingAreaHeight, editingAreaWidth, sourceHeight, sourceWidth } = size;
    let lamodaRatio, cropFrameWidth, cropFrameHeight, cropFrameLeft, cropFrameTop;

    switch (mainSize) {
      case PHOTO_EDITING_MAIN_SIZE.WIDTH:
        lamodaRatio = PHOTO_SIZE.LAMODA.WIDTH / PHOTO_SIZE.LAMODA.HEIGHT;
        cropFrameWidth = scaledHeight * lamodaRatio;
        cropFrameHeight = scaledHeight;
        cropFrameLeft = (editingAreaWidth - cropFrameWidth) / 2;
        
        this.#cropFrameView.element.style.height = `${cropFrameHeight}px`;
        this.#cropFrameView.element.style.width = `${cropFrameWidth}px`;
        this.#cropFrameView.element.style.left = `${cropFrameLeft}px`;
        this.#cropFrameView.element.style.top = `0px`;
        break;
    
      case PHOTO_EDITING_MAIN_SIZE.HEIGHT:
        lamodaRatio = PHOTO_SIZE.LAMODA.HEIGHT / PHOTO_SIZE.LAMODA.WIDTH;
        cropFrameWidth = scaledWidth;
        cropFrameHeight = scaledWidth * lamodaRatio;
        cropFrameTop = (editingAreaHeight - cropFrameHeight) / 2;

        this.#cropFrameView.element.style.height = `${cropFrameHeight}px`;
        this.#cropFrameView.element.style.width = `${cropFrameWidth}px`;
        this.#cropFrameView.element.style.left = `0px`;
        this.#cropFrameView.element.style.top = `${cropFrameTop}px`;
        break;
    }

    this.#cropFrameView.setMinCropFrameSize({ sourceHeight, sourceWidth, scaledHeight, scaledWidth });
    this.#editingImageBorderElement.append(this.#cropFrameView.element);
  };
}

module.exports = { PhotoEditorView };