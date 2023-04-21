const { Observable } = require('../observable.js');

class TasksModel extends Observable {
  createTask = (task) => {
    console.log(`model create ${task}`);
  };
}

module.exports = { TasksModel };