const { createElement } = require('../utils/common-utils.js');

function createPhotoEditorSourcesTemplate() {
  return `<div class="photo-editor-sources"></div>`;
}

function createPhotoEditorUploadButton() {
  return `
    <label class="photo-editor-upload-sources-label">
      <input type="file" id="photo-editor-upload-sources-input" multiple accept=".jpg" />
    </label>
  `;
}

function createPhotoEditorUploadIcon() {
  return `
    <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none">
      <path d="M4 12H20M12 4V20" stroke="#cccccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

function createPhotoEditorUploadLoader() {
  return `<span class="loader"></span>`;
}

function createSourceItemTemplate(src) {
  return `
    <div class="photo-editor-source-item">
      <div class="photo-editor-source-item-delete"></div>
      <img class="photo-editor-source-item-image" src="${src}" />
    </div>
  `;
}

class PhotoEditorSourcesView {
  #element = null;
  #insertSourseImageToBorder = null;
  #photoEditorUploadButton = null;
  #photoEditorUploadIcon = null;
  #photoEditorUploadLoader = null;
  #sourcesChooserElement = null;

  constructor({ insertSourseImageToBorder }) {
    this.#insertSourseImageToBorder = insertSourseImageToBorder;
    this.#photoEditorUploadButton = createElement(createPhotoEditorUploadButton());
    this.#photoEditorUploadIcon = createElement(createPhotoEditorUploadIcon());
    this.#photoEditorUploadLoader = createElement(createPhotoEditorUploadLoader());
    this.#sourcesChooserElement = this.#photoEditorUploadButton.querySelector('#photo-editor-upload-sources-input');

    this.element.prepend(this.#photoEditorUploadButton);
    this.#photoEditorUploadButton.prepend(this.#photoEditorUploadIcon);

    this.#sourcesChooserElement.addEventListener('change', this.#sourcesInputChangeHandler);
    this.#element.addEventListener('click', this.#sourcesElementClickHandler);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(createPhotoEditorSourcesTemplate());
    }

    return this.#element;
  }

  clearSourceItemSelection = () => {
    const selectedSourseItem = this.#element.querySelector('.photo-editor-source-item-selected');

    if (!selectedSourseItem) return;

    selectedSourseItem.classList.remove('photo-editor-source-item-selected');
  };

  #addSourceItem = (src) => {
    this.#element.append(createElement(createSourceItemTemplate(src)));
  };

  #removeSourceItem = (sourceItemElement) => {
    this.#element.removeChild(sourceItemElement);
  };

  #selectSourseItem = (sourceItemElement) => {
    sourceItemElement.classList.add('photo-editor-source-item-selected');
  };

  #isSourseItemSelected = (sourceItemElement) => {
    return sourceItemElement.classList.contains('photo-editor-source-item-selected');
  };

  #clearFileListSourcesChooser = () => {
    this.#sourcesChooserElement.files = new DataTransfer().files;
  };

  #showLoader = (isLoaderShouldBeShown) => {
    switch (isLoaderShouldBeShown) {
      case true:
        this.#photoEditorUploadButton.removeChild(this.#photoEditorUploadIcon);
        this.#photoEditorUploadButton.prepend(this.#photoEditorUploadLoader);
        break;
    
      case false:
        this.#photoEditorUploadButton.removeChild(this.#photoEditorUploadLoader);
        this.#photoEditorUploadButton.prepend(this.#photoEditorUploadIcon);
        break;
    }
  };

  #disableSourcesChooser = (isSourcesChooserShouldBeShown) => {
    switch (isSourcesChooserShouldBeShown) {
      case false:
        this.#sourcesChooserElement.disabled = false;
        break;
    
      case true:
        this.#sourcesChooserElement.disabled = true;
        break;
    }
  };

  #sourcesElementClickHandler = (e) => {
    switch (true) {
      case e.target.classList.contains('photo-editor-source-item-delete'):
        this.#removeSourceItem(e.target.parentNode);
        break;
      case e.target.classList.contains('photo-editor-source-item-image'):
        if (this.#isSourseItemSelected(e.target.parentNode)) break;

        this.clearSourceItemSelection();
        this.#selectSourseItem(e.target.parentNode);
        this.#insertSourseImageToBorder(e.target.src);
        break;
    }
  };

  #insertSourceItems = (files) => {
    const loadingCount = {
      filesQuantity: this.#sourcesChooserElement.files.length,
      loadedFiles: 0
    };

    files.forEach((file) => {
      const reader = new FileReader();

      reader.addEventListener('load', (e) => {
        this.#addSourceItem(e.target.result);

        loadingCount.loadedFiles++;

        if (loadingCount.loadedFiles !== loadingCount.filesQuantity) return;

        this.#showLoader(false);
        this.#disableSourcesChooser(false);
      });

      reader.readAsDataURL(file);
    });
  };

  #sourcesInputChangeHandler = async () => {
    if (!this.#sourcesChooserElement.files.length) return;

    this.#disableSourcesChooser(true);
    this.#showLoader(true);

    this.#insertSourceItems(Array.from(this.#sourcesChooserElement.files));

    this.#clearFileListSourcesChooser();

    // todo Сделать проверку на правильный тип файла
    // if (file.type && !file.type.startsWith('image/')) {
    //   console.log('File is not an image.', file.type, file);
    //   return;
    // }
  };
}

module.exports = { PhotoEditorSourcesView };
