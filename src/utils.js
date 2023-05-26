const { RENDER_POSITION } = require('./const.js');

function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
}

function render(element, container, position = RENDER_POSITION.AFTERBEGIN) {
  container.insertAdjacentElement(position, element);
}

function isElementActive(element, className) {
  return element.classList.contains(className);
}

function isLengthCorrect(string, min, max) {
  return (string.length > min && string.length <= max);
}

function getStyle(element, style) {
  return parseInt(window.getComputedStyle(element)[style], 10);
}

function addClass(element, className) {
  element.classList.add(className);
}

function removeClass(element, className) {
  element.classList.remove(className);
}

module.exports = { createElement, render, isElementActive, isLengthCorrect, getStyle, addClass, removeClass };