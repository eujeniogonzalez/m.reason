const { RENDER_POSITION } = require('./const.js');

function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
}

function render(element, container, position = RENDER_POSITION.AFTERBEGIN) {
  container.insertAdjacentElement(position, element);
}

function changeActiveElement(parent, element, className) {
  for (let child of parent.children) {
    child.classList.remove(className);
  }

  element.classList.add(className);
}

function isElementActive(element, className) {
  return element.classList.contains(className);
}

module.exports = { createElement, render, changeActiveElement, isElementActive };