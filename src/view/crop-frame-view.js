const { createElement, getStyle, addClass, removeClass } = require('../utils/common-utils.js');
const { FRAME_MOVING_DIRECTION, PHOTO_SIZE, MOVING_FRAME_BORDER } = require('../const.js');

function createCropFrameTemplate() {
  return `
    <div class="photo-editor-crop-frame">
      <div class="photo-editor-crop-frame-top-border"></div>
      <div class="photo-editor-crop-frame-bottom-border"></div>
    </div>
  `;
}

class CropFrameView {
  #element = null;
  #frameElement = this.element;
  #framePositionTop = null;
  #framePositionBottom = null;
  #framePositionLeft = null;
  #framePositionRight = null;
  #isFrameMoving = false;
  #mouseMoveStartX = null;
  #mouseMoveStartY = null;
  #mouseMoveCurrentX = null;
  #mouseMoveCurrentY = null;
  #borderTop = this.element.querySelector('.photo-editor-crop-frame-top-border');
  #isBorderTopMoving = false;
  #borderBottom = this.element.querySelector('.photo-editor-crop-frame-bottom-border');
  #isBorderBottomMoving = false;
  #frameHeight = null;
  #frameWidth = null;
  #minFrameHeight = null;
  #minFrameWidth = null;
  #isCropFrameSizeValid = true;
  #activateSaveNewCropButton = null;
  #deActivateSaveNewCropButton = null;

  constructor({ activateSaveNewCropButton, deActivateSaveNewCropButton }) {
    this.#activateSaveNewCropButton = activateSaveNewCropButton;
    this.#deActivateSaveNewCropButton = deActivateSaveNewCropButton;

    this.#frameElement.addEventListener('mousedown', this.#frameMouseDownHandler);
    this.#frameElement.addEventListener('mousemove', this.#frameMouseMoveHandler);
    this.#frameElement.addEventListener('mouseleave', this.#frameMouseUpHandler);
    this.#frameElement.addEventListener('mouseup', this.#frameMouseUpHandler);

    this.#borderTop.addEventListener('mousedown', this.#borderTopMouseDownHandler);
    this.#borderTop.addEventListener('mousemove', this.#borderTopMouseMoveHandler);
    this.#borderTop.addEventListener('mouseleave', this.#borderTopMouseUpHandler);
    this.#borderTop.addEventListener('mouseup', this.#borderTopMouseUpHandler);

    this.#borderBottom.addEventListener('mousedown', this.#borderBottomMouseDownHandler);
    this.#borderBottom.addEventListener('mousemove', this.#borderBottomMouseMoveHandler);
    this.#borderBottom.addEventListener('mouseleave', this.#borderBottomMouseUpHandler);
    this.#borderBottom.addEventListener('mouseup', this.#borderBottomMouseUpHandler);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(createCropFrameTemplate());
    }

    return this.#element;
  }

  setMinCropFrameSize = ({ sourceHeight, sourceWidth, scaledHeight, scaledWidth }) => {
    const heightScale = sourceHeight / scaledHeight;
    const widthScale = sourceWidth / scaledWidth;

    this.#minFrameHeight = PHOTO_SIZE.LAMODA.HEIGHT / heightScale;
    this.#minFrameWidth = PHOTO_SIZE.LAMODA.WIDTH / widthScale;
  };

  removeCropFrameNotValidClass = () => {
    removeClass(this.#frameElement, 'photo-editor-crop-frame-not-valid');
  };

  getFrameInfo = () => {
    return {
      frameHeight: this.#frameElement.offsetHeight,
      frameWidth: this.#frameElement.offsetWidth,
      frameTop: getStyle(this.#frameElement, 'top'),
      frameLeft: getStyle(this.#frameElement, 'left')
    };
  };

  #validateCropFrameSize = ({ newFrameHeight, newFrameWidth }) => {
    this.#isCropFrameSizeValid = (newFrameHeight < this.#minFrameHeight || newFrameWidth < this.#minFrameWidth) ? false : true;
  };

  #controlCropFrameSize = ({ newFrameHeight, newFrameWidth }) => {
    const oldCropFrameSizeValid = this.#isCropFrameSizeValid;

    this.#validateCropFrameSize({ newFrameHeight, newFrameWidth });

    if (oldCropFrameSizeValid === this.#isCropFrameSizeValid) {
      return;
    }

    switch (this.#isCropFrameSizeValid) {
      case true:
        removeClass(this.#frameElement, 'photo-editor-crop-frame-not-valid');
        this.#activateSaveNewCropButton();
        break;
    
      case false:
        addClass(this.#frameElement, 'photo-editor-crop-frame-not-valid');
        this.#deActivateSaveNewCropButton();
        break;
    }
  };

  #setMovingValues = ({ e, movingFrameBorder }) => {
    this.#frameHeight = this.#frameElement.offsetHeight;
    this.#frameWidth = this.#frameElement.offsetWidth;
    this.#mouseMoveStartY = e.clientY;
    
    switch (movingFrameBorder) {
      case MOVING_FRAME_BORDER.TOP:
        this.#framePositionTop = getStyle(this.#frameElement, 'top');
        this.#framePositionRight = getStyle(this.#frameElement, 'right');
        this.#isBorderTopMoving = true;    
        break;
    
      case MOVING_FRAME_BORDER.BOTTOM:
        this.#framePositionBottom = getStyle(this.#frameElement, 'bottom');
        this.#framePositionLeft = getStyle(this.#frameElement, 'left');
        this.#isBorderBottomMoving = true;
        break;
    }
  };

  #resetMovingValues = () => {
    this.#framePositionTop = null;
    this.#framePositionBottom = null;
    this.#framePositionLeft = null;
    this.#framePositionRight = null;
    this.#isFrameMoving = false;
    this.#mouseMoveStartX = null;
    this.#mouseMoveStartY = null;
    this.#mouseMoveCurrentX = null;
    this.#mouseMoveCurrentY = null;
    this.#isBorderTopMoving = false;
    this.#isBorderBottomMoving = false;
    this.#frameHeight = null;
    this.#frameWidth = null;
  };

  #getCurrentFrameSize = ({ e, movingFrameBorder }) => {
    let maxframeHeight, maxFrameWidth, newFrameHeight, newFrameWidth, newFrameTop, newFrameLeft;

    this.#mouseMoveCurrentY = e.clientY;

    const lamodaRatio = PHOTO_SIZE.LAMODA.WIDTH / PHOTO_SIZE.LAMODA.HEIGHT;
    const mouseMoveDiffY = this.#mouseMoveCurrentY - this.#mouseMoveStartY;

    switch (movingFrameBorder) {
      case MOVING_FRAME_BORDER.TOP:
        maxframeHeight = this.#frameHeight + this.#framePositionTop;
        maxFrameWidth = this.#frameWidth + this.#framePositionRight;
        newFrameHeight = this.#frameHeight - mouseMoveDiffY;
        newFrameWidth = newFrameHeight * lamodaRatio;
        newFrameTop = this.#framePositionTop + mouseMoveDiffY;        
        break;
    
      case MOVING_FRAME_BORDER.BOTTOM:
        maxframeHeight = this.#frameHeight + this.#framePositionBottom;
        maxFrameWidth = this.#frameWidth + this.#framePositionLeft;
        newFrameHeight = this.#frameHeight + mouseMoveDiffY;
        newFrameWidth = newFrameHeight * lamodaRatio;
        newFrameLeft = this.#framePositionLeft - (newFrameWidth - this.#frameWidth);
        break;
    }

    return { newFrameTop, newFrameLeft, newFrameHeight, newFrameWidth, maxframeHeight, maxFrameWidth };
  };

  #getCurrentFramePosition = ({ frameElement, mouseMoveCurrent, mouseMoveStart, currentPosition, direction }) => {
    let containerSize, frameSize, positionMax, mouseMoveDiff, position;

    switch (direction) {
      case FRAME_MOVING_DIRECTION.HORIZONTAL:
        containerSize = frameElement.parentNode.offsetWidth;
        frameSize = frameElement.offsetWidth;
        positionMax = containerSize - frameSize;
        mouseMoveDiff = mouseMoveCurrent - mouseMoveStart;
        break;
    
      case FRAME_MOVING_DIRECTION.VERTICAL:
        containerSize = frameElement.parentNode.offsetHeight;
        frameSize = frameElement.offsetHeight;
        positionMax = containerSize - frameSize;
        mouseMoveDiff = mouseMoveCurrent - mouseMoveStart;
        break;
    }

    position = currentPosition + mouseMoveDiff;

    switch (true) {
      case position > positionMax:
        position = positionMax;
        break;

      case position < 0:
        position = 0;
        break;
    }

    return position;
  };

  /* Frame moving (start) */
  #frameMouseDownHandler = (e) => {
    this.#framePositionLeft = getStyle(this.#frameElement, 'left');
    this.#framePositionTop = getStyle(this.#frameElement, 'top');
    this.#mouseMoveStartX = e.clientX;
    this.#mouseMoveStartY = e.clientY;
    this.#isFrameMoving = true;
  };

  #frameMouseMoveHandler = (e) => {
    if (!this.#isFrameMoving) {
      return;
    }

    this.#mouseMoveCurrentX = e.clientX;
    this.#mouseMoveCurrentY = e.clientY;

    const newFrameLeft = this.#getCurrentFramePosition({
      frameElement: this.#frameElement,
      mouseMoveCurrent: this.#mouseMoveCurrentX,
      mouseMoveStart: this.#mouseMoveStartX,
      currentPosition: this.#framePositionLeft,
      direction: FRAME_MOVING_DIRECTION.HORIZONTAL
    });

    const newFrameTop = this.#getCurrentFramePosition({
      frameElement: this.#frameElement,
      mouseMoveCurrent: this.#mouseMoveCurrentY,
      mouseMoveStart: this.#mouseMoveStartY,
      currentPosition: this.#framePositionTop,
      direction: FRAME_MOVING_DIRECTION.VERTICAL
    });

    this.#frameElement.style.left = `${newFrameLeft}px`;
    this.#frameElement.style.top = `${newFrameTop}px`;
  };

  #frameMouseUpHandler = () => {
    if (!this.#isFrameMoving) {
      return;
    }

    this.#resetMovingValues();
  };
  /* Frame moving (end) */

  /* Border Top moving (start) */
  #borderTopMouseDownHandler = (e) => {
    e.stopPropagation();

    this.#setMovingValues({ e, movingFrameBorder: MOVING_FRAME_BORDER.TOP});
  };

  #borderTopMouseMoveHandler = (e) => {
    if (!this.#isBorderTopMoving) {
      return;
    }

    let { 
      newFrameTop, 
      newFrameHeight, 
      newFrameWidth, 
      maxframeHeight, 
      maxFrameWidth 
    } = this.#getCurrentFrameSize({ e, movingFrameBorder: MOVING_FRAME_BORDER.TOP });

    switch (true) {
      case newFrameTop < 0:
        this.#isBorderTopMoving = false;
        newFrameTop = 0;
        return;
    
      case newFrameHeight > maxframeHeight:
        newFrameHeight = maxframeHeight;
        return;

      case newFrameWidth > maxFrameWidth:
        return;
    }

    this.#frameElement.style.top = `${newFrameTop}px`;
    this.#frameElement.style.height = `${newFrameHeight}px`;
    this.#frameElement.style.width = `${newFrameWidth}px`;

    this.#controlCropFrameSize({ newFrameHeight, newFrameWidth });
  };

  #borderTopMouseUpHandler = (e) => {
    if (!this.#isBorderTopMoving) {
      return;
    }

    this.#resetMovingValues();
  };
  /* Border Top moving (end) */

  /* Border Bottom moving (start) */
  #borderBottomMouseDownHandler = (e) => {
    e.stopPropagation();

    this.#setMovingValues({ e, movingFrameBorder: MOVING_FRAME_BORDER.BOTTOM});
  };

  #borderBottomMouseMoveHandler = (e) => {
    if (!this.#isBorderBottomMoving) {
      return;
    }

    let { 
      newFrameLeft, 
      newFrameHeight, 
      newFrameWidth, 
      maxframeHeight, 
      maxFrameWidth 
    } = this.#getCurrentFrameSize({ e, movingFrameBorder: MOVING_FRAME_BORDER.BOTTOM });

    switch (true) {
      case newFrameHeight > maxframeHeight:
        return;
    
      case newFrameWidth > maxFrameWidth:
        return;
    }

    this.#frameElement.style.left = `${newFrameLeft}px`;
    this.#frameElement.style.height = `${newFrameHeight}px`;
    this.#frameElement.style.width = `${newFrameWidth}px`;

    this.#controlCropFrameSize({ newFrameHeight, newFrameWidth });
  };

  #borderBottomMouseUpHandler = (e) => {
    if (!this.#isBorderBottomMoving) {
      return;
    }

    this.#resetMovingValues();
  };
  /* Border Top moving (end) */
}

module.exports = { CropFrameView };
