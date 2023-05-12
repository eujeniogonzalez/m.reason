const { createElement } = require('../utils.js');
const { CLOSED_TASK_CLASS, SYMBOLS, LINK_ANCHORS } = require('../const.js');

function createTaskListTemplate(taskList) {
  let taskListTemplate;

  return `
    <div class="task-list">
      ${createTaskItemsTemplate(taskList)}
    </div>
  `;
}

function createTaskItemsTemplate(taskList) {
  return taskList.length ?
    taskListTemplate = taskList.map((task) => createTaskItemTemplate(task)).join(SYMBOLS.EMPTY_STRING) :
    taskListTemplate = `<div class="task-list-empty">Нет ни одной задачи</div>`;
}

function createTaskItemTemplate(task) {
  return `
    <div class="task-item">
      <div class="task-item-date">${task.date}</div>
      <div class="task-item-text ${task.isDone ? CLOSED_TASK_CLASS : SYMBOLS.EMPTY_STRING}">${task.text}</div>
      <div class="task-item-close-open">
        <a href="" class="task-item-close-open-link" data-activity-task-id="${task.id}">${task.isDone ? LINK_ANCHORS.REOPEN_TASK : LINK_ANCHORS.CLOSE_TASK}</a>
      </div>
      <div class="task-item-delete">
        <a href="" class="task-item-delete-link" data-delete-task-id="${task.id}">Удалить</a>
      </div>
    </div>
  `;
}

class TaskListView {
  #element = null;
  #taskList = null;
  #deleteTask = null;
  #changeTaskActivity = null;

  constructor({ taskList, deleteTask, changeTaskActivity }) {
    this.#taskList = taskList;
    this.#deleteTask = deleteTask;
    this.#changeTaskActivity = changeTaskActivity;

    this.element.addEventListener('click', this.#taskListClickHandler);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(createTaskListTemplate(this.#taskList));
    }

    return this.#element;
  }

  updateTaskList = ({ taskList }) => {
    this.element.innerHTML = '';
    this.element.innerHTML = createTaskItemsTemplate(taskList);
  };

  #taskListClickHandler = (e) => {
    e.preventDefault();

    switch (true) {
      case (e.target.tagName === 'A' && e.target.dataset.deleteTaskId !== undefined):
        this.#deleteTask({ taskId: e.target.dataset.deleteTaskId });
        break;
      case (e.target.tagName === 'A' && e.target.dataset.activityTaskId !== undefined):
        this.#changeTaskActivity({ taskId: e.target.dataset.activityTaskId });
        break;
    }
  };
}

module.exports = { TaskListView };
