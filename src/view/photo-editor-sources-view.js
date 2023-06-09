const { createElement } = require('../utils/common-utils.js');

function createPhotoEditorSourcesTemplate() {
  // todo Избавиться от SVG
  return `
    <div class="photo-editor-sources">
      <label class="photo-editor-upload-sources-label">
        <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none">
          <path d="M4 12H20M12 4V20" stroke="#cccccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <input type="file" id="photo-editor-upload-sources-input" multiple accept=".jpg" />
      </label>
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

class PhotoEditorSourcesView {
  #element = null;
  #sourcesChooserElement = this.element.querySelector('#photo-editor-upload-sources-input');
  #insertSourseImageToBorder = null;

  constructor({ insertSourseImageToBorder }) {
    this.#insertSourseImageToBorder = insertSourseImageToBorder;

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
    this.#element.prepend(createElement(createSourceItemTemplate(src)));
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

  #sourcesElementClickHandler = (e) => {
    switch (true) {
      case e.target.classList.contains('photo-editor-source-item-delete'):
        this.#removeSourceItem(e.target.parentNode);
        break;
      case e.target.classList.contains('photo-editor-source-item-image'):
        if (this.#isSourseItemSelected(e.target.parentNode)) {
          break;
        }

        this.clearSourceItemSelection();
        this.#selectSourseItem(e.target.parentNode);
        this.#insertSourseImageToBorder(e.target.src);
        break;
    }
  };

  #sourcesInputChangeHandler = () => {
    if (!this.#sourcesChooserElement.files.length) return;

    // todo Выделить в отдельный метод
    Array.from(this.#sourcesChooserElement.files).forEach((file) => {
      const reader = new FileReader();

      reader.addEventListener('load', (e) => {
        this.#addSourceItem(e.target.result);
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
}

module.exports = { PhotoEditorSourcesView };