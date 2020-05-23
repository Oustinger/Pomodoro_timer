"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
} // import WatchJS from 'watchjs';
//
// const { watch } = WatchJS;


var state = {
  activeList: {
    id: null,
    name: ''
  },
  activeTaskId: null,
  lists: [],
  tasks: []
};

var getElementsIn = function getElementsIn(type) {
  var isDone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var result = type === 'list' ? state.lists : state.tasks.filter(function (task) {
    return task.parentList === state.activeList.name && task.isDone === isDone;
  });
  return result;
};

var getElementById = function getElementById(id) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'task';
  return [].concat(_toConsumableArray(getElementsIn(type)), _toConsumableArray(getElementsIn(type, true))).find(function (task) {
    return task.id === id;
  });
};

var getPosition = function getPosition(type) {
  var isDone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return getElementsIn(type, isDone).length;
};

var sortByPosition = function sortByPosition(a, b) {
  return a.position - b.position;
};

var sortPositionsAfterRemove = function sortPositionsAfterRemove(type, isDone) {
  var sortGroup = getElementsIn(type, isDone);
  sortGroup.sort(sortByPosition).reduce(function (accIndex, el) {
    el.position = accIndex;
    return accIndex + 1;
  }, 0);
};

var eventFunctions = {
  lists: {
    select: function select(_ref) {
      var target = _ref.target;
      var _target$dataset = target.dataset,
          id = _target$dataset.id,
          name = _target$dataset.name;
      state.activeList = {
        id: id,
        name: name
      };
      state.render();
    }
  },
  buttons: {
    replace: function replace(_ref2) {
      var target = _ref2.target;
      var replaceType = target.dataset.buttonFunc;
      var _target$parentNode$da = target.parentNode.dataset,
          type = _target$parentNode$da.type,
          id = _target$parentNode$da.id;
      var upDownPos = replaceType === 'up' ? -1 : 1;
      var mainElement = getElementById(id, type);
      var secondaryElement = getElementsIn(type).find(function (task) {
        return task.position === mainElement.position + upDownPos;
      });
      if (!secondaryElement) return;
      mainElement.position += upDownPos;
      secondaryElement.position -= upDownPos;
      state.render();
    },
    startOutOfTurn: function startOutOfTurn(_ref3) {
      var target = _ref3.target;
      var id = target.parentNode.dataset.id;
      state.activeTaskId = id;
      state.mainState.setDefault(false);
      state.render();
    },
    doneUndone: function doneUndone(_ref4) {
      var target = _ref4.target;
      var _target$parentNode$da2 = target.parentNode.dataset,
          type = _target$parentNode$da2.type,
          id = _target$parentNode$da2.id;
      var task = getElementById(id);
      task.isDone = !task.isDone;
      task.position = getPosition(type, task.isDone);
      sortPositionsAfterRemove(type, false);
      sortPositionsAfterRemove(type, true);
      state.render();
    },
    remove: function remove(_ref5) {
      var target = _ref5.target;
      var _target$parentNode$da3 = target.parentNode.dataset,
          type = _target$parentNode$da3.type,
          id = _target$parentNode$da3.id;
      var isDone = getElementById(id, type).isDone;
      var areaName = "".concat(type, "s");
      state[areaName] = state[areaName].filter(function (el) {
        return el.id !== id;
      });
      sortPositionsAfterRemove(type, isDone);
      state.render();
    }
  }
};

var getSelectedElementId = function getSelectedElementId() {
  if (state.activeTaskId !== null) return state.activeTaskId;
  var nextElement = getElementsIn('task').sort(sortByPosition)[0];
  return nextElement ? nextElement.id : null;
};

var selectButtons = {
  list: {
    removeAble: ['up', 'down', 'remove'],
    removeDisable: ['up', 'down']
  },
  task: ['up', 'down', 'startOutOfTurn', 'done', 'remove'],
  doneTask: ['undone', 'remove']
};

var render = function render(elements) {
  var ulForLists = document.createElement('ul');
  state.lists.sort(sortByPosition).forEach(function (_ref6) {
    var id = _ref6.id,
        name = _ref6.name,
        mutability = _ref6.mutability;
    var li = document.createElement('li');
    li.dataset.type = 'list';
    li.dataset.id = id;
    li.dataset.name = name;
    if (id === state.activeList.id) li.classList.add('selected');
    li.textContent = name;
    li.addEventListener('click', eventFunctions.lists.select);
    var liButtons = elements.buttons.filter(function (_ref7) {
      var type = _ref7.type;
      return selectButtons.list[mutability].includes(type);
    }).map(function (_ref8) {
      var button = _ref8.button;
      return button.cloneNode(true);
    }).map(function (button) {
      button.addEventListener('click', eventFunctions.buttons[button.dataset.buttonType]);
      return button;
    });
    li.append.apply(li, _toConsumableArray(liButtons));
    ulForLists.appendChild(li);
  });
  elements.lists.innerHTML = '';
  elements.lists.appendChild(ulForLists);
  var ulForTasks = document.createElement('ul');
  getElementsIn('task', false).sort(sortByPosition).forEach(function (_ref9) {
    var id = _ref9.id,
        name = _ref9.name;
    var li = document.createElement('li');
    li.dataset.id = id;
    if (id === getSelectedElementId()) li.classList.add('selected');
    li.textContent = name;
    li.dataset.type = 'task';
    var liButtons = elements.buttons.filter(function (_ref10) {
      var type = _ref10.type;
      return selectButtons.task.includes(type);
    }).map(function (_ref11) {
      var button = _ref11.button;
      return button.cloneNode(true);
    }).map(function (button) {
      button.addEventListener('click', eventFunctions.buttons[button.dataset.buttonType]);
      return button;
    });
    li.append.apply(li, _toConsumableArray(liButtons));
    ulForTasks.appendChild(li);
  });
  elements.tasks.innerHTML = '';
  elements.tasks.appendChild(ulForTasks);
  var ulForDoneTasks = document.createElement('ul');
  getElementsIn('task', true).sort(sortByPosition).forEach(function (_ref12) {
    var id = _ref12.id,
        name = _ref12.name;
    var li = document.createElement('li');
    li.dataset.id = id;
    li.textContent = name;
    li.dataset.type = 'doneTask';
    var liButtons = elements.buttons.filter(function (_ref13) {
      var type = _ref13.type;
      return selectButtons.doneTask.includes(type);
    }).map(function (_ref14) {
      var button = _ref14.button;
      return button.cloneNode(true);
    }).map(function (button) {
      button.addEventListener('click', eventFunctions.buttons[button.dataset.buttonType]);
      return button;
    });
    li.append.apply(li, _toConsumableArray(liButtons));
    ulForDoneTasks.appendChild(li);
  });
  elements.doneTasks.innerHTML = '';
  elements.doneTasks.appendChild(ulForDoneTasks);
  elements.listForm.reset();
  elements.taskForm.reset();
};

var init = function init(mainState) {
  var upButton = document.createElement('button');
  upButton.dataset.buttonType = 'replace';
  upButton.dataset.buttonFunc = 'up';
  upButton.textContent = 'up';
  var downButton = document.createElement('button');
  downButton.dataset.buttonType = 'replace';
  downButton.dataset.buttonFunc = 'down';
  downButton.textContent = 'down';
  var startOutOfTurnButton = document.createElement('button');
  startOutOfTurnButton.dataset.buttonType = 'startOutOfTurn';
  startOutOfTurnButton.textContent = 'start now';
  var doneButton = document.createElement('button');
  doneButton.dataset.buttonType = 'doneUndone';
  doneButton.textContent = 'done';
  var undoneButton = document.createElement('button');
  undoneButton.dataset.buttonType = 'doneUndone';
  undoneButton.textContent = 'undone';
  var removeButton = document.createElement('button');
  removeButton.dataset.buttonType = 'remove';
  removeButton.textContent = 'remove';
  var buttons = [{
    type: 'up',
    button: upButton
  }, {
    type: 'down',
    button: downButton
  }, {
    type: 'startOutOfTurn',
    button: startOutOfTurnButton
  }, {
    type: 'done',
    button: doneButton
  }, {
    type: 'undone',
    button: undoneButton
  }, {
    type: 'remove',
    button: removeButton
  }];
  var elements = {
    lists: document.querySelector('[data-container="lists"]'),
    listForm: document.querySelector('[data-container="new-list-form"]'),
    tasks: document.querySelector('[data-container="tasks"]'),
    doneTasks: document.querySelector('[data-container="done-tasks"]'),
    taskForm: document.querySelector('[data-container="new-task-form"]'),
    selectedTask: document.querySelector('[data-container="selected-task"]'),
    buttons: buttons
  };
  elements.listForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    var value = formData.get('name');

    if (value !== '' && !state.lists[value]) {
      state.lists.push({
        id: _lodash["default"].uniqueId(),
        name: value,
        position: getPosition('list'),
        mutability: 'removeAble'
      });
    }

    state.render();
  });
  elements.taskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    var value = formData.get('name');

    if (value !== '' && !state.tasks[value]) {
      var task = {
        id: _lodash["default"].uniqueId(),
        parentList: state.activeList.name,
        name: value,
        position: getPosition('task'),
        isDone: false
      };
      state.tasks.push(task);
      state.render();
    }
  });
  state.mainState = mainState;

  state.render = function () {
    return render(elements);
  };

  var generalList = {
    id: _lodash["default"].uniqueId(),
    name: 'General',
    position: getPosition('list'),
    mutability: 'removeDisable'
  };
  state.lists.push(generalList);
  state.activeList = {
    id: generalList.id,
    name: generalList.name
  };
  state.render();
};

var completeTask = function completeTask() {
  var id = getSelectedElementId();
  if (id === null) return;
  var task = getElementById(id);
  task.isDone = !task.isDone;
  state.activeTaskId = null;
  state.render();
};

var _default = {
  init: init,
  completeTask: completeTask
};
exports["default"] = _default;
//# sourceMappingURL=TaskManager.js.map