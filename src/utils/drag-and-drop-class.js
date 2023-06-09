class DragAndDrop {
  #container = null;
  #items = null;
  #draggableItems = null;
  #draggingClassName = null;
  #draggableItemClassName = null;

  #dragOverItem = null;
  #notDraggingItems = null;
  #firstExcludedIndex = null;
  #currentExcludedIndex = null;

  constructor({ draggingClassName, draggableItemClassName }) {
    this.#draggingClassName = draggingClassName;
    this.#draggableItemClassName = draggableItemClassName;
  }

  updateItems = ({ container, items, draggableItems }) => {
    if (!items) return;

    this.#container = container;
    this.#items = items;
    this.#draggableItems = draggableItems;

    for (let i = 0; i < this.#items.length; i++) {
      this.#draggableItems[i].addEventListener('dragstart', this.#draggableItemDragStartHandler);
      this.#draggableItems[i].addEventListener('dragend', this.#draggableItemDragEndHandler);
  
      this.#items[i].addEventListener('dragover', this.#itemDragOverHandler);
      this.#items[i].addEventListener('drop', this.#itemDropHandler);
    }
  };

  #rerenderItems = (excludedIndex) => {
    if (excludedIndex === -1) return;

    this.#items.forEach((item, i) => {
      if (excludedIndex === i) return;

      if (item.firstElementChild && !this.#isElementDragging(item.firstElementChild)) {
        item.removeChild(item.firstElementChild);
      }

      switch (true) {
        case i < excludedIndex:
          item.append(this.#notDraggingItems[i]);
          break;
        case i > excludedIndex:
          item.append(this.#notDraggingItems[i - 1]);
          break;
      }
    });
  };

  #isElementDragging = (element) => {
    return element.classList.contains(this.#draggingClassName);
  };

  #resetDragData = () => {
    this.#dragOverItem = null;
    this.#notDraggingItems = null;
    this.#firstExcludedIndex = null;
    this.#currentExcludedIndex = null;
  };

  #fixItemsSize = () => {
    this.#items.forEach((item) => {
      const styles = window.getComputedStyle(item);
      const width = styles.width;
      const height = styles.height;

      item.style.width = width;
      item.style.height = height;
    });
  };

  #getCurrentExcludedIndex = (items, dragOverItem) => {
    return items.indexOf(dragOverItem) === -1 ? items.indexOf(dragOverItem.parentNode) : items.indexOf(dragOverItem);
  };

  #draggableItemDragStartHandler = (e) => {
    this.#fixItemsSize();

    e.dataTransfer.setData('id', e.target.id);

    setTimeout(() => e.target.classList.add(this.#draggingClassName), 0);
  };

  #draggableItemDragEndHandler = (e) => {
    const dropEffect = e.dataTransfer.dropEffect;

    if (dropEffect === 'none') {
      this.#rerenderItems(this.#firstExcludedIndex);
    }

    e.target.classList.remove(this.#draggingClassName);

    this.#resetDragData();
  };

  #itemDragOverHandler = (e) => {
    e.preventDefault();

    if (this.#dragOverItem === e.target) return;

    this.#dragOverItem = e.target;

    this.#notDraggingItems = Array.from(this.#container.querySelectorAll(`.${this.#draggableItemClassName}:not(.${this.#draggingClassName})`));

    this.#currentExcludedIndex = this.#getCurrentExcludedIndex(Array.from(this.#items), this.#dragOverItem);

    if (this.#firstExcludedIndex === null && this.#currentExcludedIndex !== -1) {
      this.#firstExcludedIndex = this.#currentExcludedIndex;
    }

    this.#rerenderItems(this.#currentExcludedIndex);
  };

  #itemDropHandler = (e) => {
    const itemId = e.dataTransfer.getData('id');
    const draggingElement = this.#container.querySelector(`#${itemId}`);

    e.target.append(draggingElement);

    this.#resetDragData();
  };
}

module.exports = { DragAndDrop };

