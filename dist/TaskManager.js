"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _onChange = _interopRequireDefault(require("on-change"));

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
}

var getElementsIn = function getElementsIn(state, type) {
  var isDone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  switch (type) {
    case 'list':
      {
        return state.lists;
      }

    case 'task':
      {
        return _lodash["default"].concat(state.tasks).filter(function (task) {
          return task.parentList === state.activeList.name && task.isDone === isDone;
        });
      }

    default:
      {
        throw Error("Unknown type in function - \"getElementsIn\": ".concat(type));
      }
  }
};

var getElementById = function getElementById(state, id) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'task';
  return [].concat(_toConsumableArray(getElementsIn(state, type)), _toConsumableArray(getElementsIn(state, type, true))).find(function (task) {
    return task.id === id;
  });
};

var sortByPosition = function sortByPosition(array) {
  return _lodash["default"].concat(array).sort(function (a, b) {
    return a.position - b.position;
  });
};

var sortPositionsAfterRemove = function sortPositionsAfterRemove(state, type, isDone) {
  var sortGroup = getElementsIn(state, type, isDone);
  sortByPosition(sortGroup).reduce(function (accIndex, el) {
    el.position = accIndex;
    return accIndex + 1;
  }, 0);
};

var getPosition = function getPosition(state, type) {
  var isDone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return getElementsIn(state, type, isDone).length;
};

var getSelectedElementId = function getSelectedElementId(state) {
  if (state.activeTaskId !== null) return state.activeTaskId;
  var nextElement = sortByPosition(getElementsIn(state, 'task'))[0];
  return nextElement ? nextElement.id : null;
};

var eventFunctions = {
  lists: {
    select: function select(state, button) {
      var _button$dataset = button.dataset,
          id = _button$dataset.id,
          name = _button$dataset.name;
      state.activeList = {
        id: id,
        name: name
      };
    }
  },
  buttons: {
    replace: function replace(state, button) {
      var replaceType = button.dataset.buttonFunc;
      var taskContainer = button.parentNode.parentNode;
      var _taskContainer$datase = taskContainer.dataset,
          type = _taskContainer$datase.type,
          id = _taskContainer$datase.id;
      var upDownPos = replaceType === 'up' ? -1 : 1;
      var mainElement = getElementById(state, id, type);
      var secondaryElement = getElementsIn(state, type).find(function (task) {
        return task.position === mainElement.position + upDownPos;
      });
      if (!secondaryElement) return;
      mainElement.position += upDownPos;
      secondaryElement.position -= upDownPos;
    },
    startOutOfTurn: function startOutOfTurn(state, button) {
      var taskContainer = button.parentNode.parentNode;
      var id = taskContainer.dataset.id;
      state.activeTaskId = id;
      state.mainState.setValues(id);
    },
    doneUndone: function doneUndone(state, button) {
      var taskContainer = button.parentNode.parentNode;
      var id = taskContainer.dataset.id;
      var task = getElementById(state, id);
      task.isDone = !task.isDone;

      if (task.isDone && getSelectedElementId(state) === id) {
        state.mainState.isDone = !state.mainState.isDone;
      }

      task.position = getPosition(state, 'task', task.isDone);
      sortPositionsAfterRemove(state, 'task', false);
      sortPositionsAfterRemove(state, 'task', true);
    },
    remove: function remove(state, button) {
      var taskContainer = button.parentNode.parentNode;
      var _taskContainer$datase2 = taskContainer.dataset,
          type = _taskContainer$datase2.type,
          id = _taskContainer$datase2.id;
      var typeArea = "".concat(type === 'list' ? 'lists' : 'tasks');
      state[typeArea] = state[typeArea].filter(function (el) {
        return el.id !== id;
      });
      var isDone = type === 'doneTask';
      sortPositionsAfterRemove(state, 'task', isDone);
    }
  }
};
var selectButtons = {
  list: function list(isMutable) {
    return isMutable ? ['up', 'down', 'remove'] : ['up', 'down'];
  },
  task: function task(isActive) {
    return isActive ? ['up', 'down', 'done', 'remove'] : ['up', 'down', 'startOutOfTurn', 'done', 'remove'];
  },
  doneTask: function doneTask() {
    return ['undone', 'remove'];
  }
};

var putButtons = function putButtons(state, elementType, _ref) {
  var buttons = _ref.buttons;
  var option = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  return buttons.filter(function (_ref2) {
    var type = _ref2.type;
    return selectButtons[elementType](option).includes(type);
  }).map(function (_ref3) {
    var button = _ref3.button;
    return button.cloneNode(true);
  }).map(function (button) {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      eventFunctions.buttons[button.dataset.buttonType](state, e.target);
    });
    return button;
  });
};

var resetInputs = function resetInputs(elements) {
  elements.listForm.reset();
  elements.taskForm.reset();
};

var renderLists = function renderLists(state, elements) {
  var ulForLists = document.createElement('ul');
  sortByPosition(getElementsIn(state, 'list')).forEach(function (_ref4) {
    var id = _ref4.id,
        name = _ref4.name,
        isMutable = _ref4.isMutable;
    var li = document.createElement('li');
    li.dataset.type = 'list';
    li.dataset.id = id;
    li.dataset.name = name;
    var text = document.createElement('p');
    text.textContent = name;
    li.addEventListener('click', function (_ref5) {
      var target = _ref5.target,
          currentTarget = _ref5.currentTarget;
      if (currentTarget === target || text === target) eventFunctions.lists.select(state, li);
    });
    var allButtons = putButtons(state, 'list', elements, isMutable);
    var replaceButt = document.createElement('div');
    replaceButt.classList.add('replaceContainer');
    replaceButt.append.apply(replaceButt, _toConsumableArray(allButtons.filter(function (b) {
      return b.dataset.buttonType === 'replace';
    })));

    if (id === state.activeList.id) {
      li.classList.add('active');
      li.append(replaceButt, text);
    } else if (!isMutable) {
      li.append(replaceButt, text);
    } else {
      var removeButt = document.createElement('div');
      removeButt.classList.add('removeContainer');
      removeButt.appendChild(allButtons.find(function (b) {
        return b.dataset.buttonType === 'remove';
      }));
      li.append(replaceButt, text, removeButt);
    }

    ulForLists.appendChild(li);
  });
  elements.lists.innerHTML = '';
  elements.lists.appendChild(ulForLists);
  resetInputs(elements);
};

var renderTasks = function renderTasks(state, elements) {
  var ulForTasks = document.createElement('ul');
  sortByPosition(getElementsIn(state, 'task', false)).forEach(function (_ref6) {
    var id = _ref6.id,
        name = _ref6.name;
    var li = document.createElement('li');
    li.dataset.id = id;
    li.dataset.type = 'task';
    var isActive = id === getSelectedElementId(state);

    if (isActive) {
      li.classList.add('active');
    }

    var text = document.createElement('p');
    text.textContent = name;
    var allButtons = putButtons(state, 'task', elements, isActive);
    var replaceButt = document.createElement('div');
    replaceButt.classList.add('replaceContainer');
    replaceButt.append.apply(replaceButt, _toConsumableArray(allButtons.filter(function (b) {
      return b.dataset.buttonType === 'replace';
    })));
    var removeButt = document.createElement('div');
    removeButt.classList.add('removeContainer');
    removeButt.appendChild(allButtons.find(function (b) {
      return b.dataset.buttonType === 'remove';
    }));
    var otherButt = document.createElement('div');
    otherButt.classList.add('otherContainer');
    otherButt.append.apply(otherButt, _toConsumableArray(allButtons.filter(function (b) {
      return b.dataset.buttonType !== 'replace' && b.dataset.buttonType !== 'remove';
    })));
    li.append(replaceButt, text, otherButt, removeButt);
    ulForTasks.appendChild(li);
  });
  elements.tasks.innerHTML = '';

  if (ulForTasks.innerHTML !== '') {
    elements.tasks.appendChild(ulForTasks);
  } else {
    elements.tasks.appendChild(elements.taskPrompt);
  }

  var ulForDoneTasks = document.createElement('ul');
  sortByPosition(getElementsIn(state, 'task', true)).forEach(function (_ref7) {
    var id = _ref7.id,
        name = _ref7.name;
    var li = document.createElement('li');
    li.dataset.id = id;
    li.dataset.type = 'doneTask';
    var text = document.createElement('p');
    text.textContent = name;
    var allButtons = putButtons(state, 'doneTask', elements);
    var removeButt = document.createElement('div');
    removeButt.classList.add('removeContainer');
    removeButt.appendChild(allButtons.find(function (b) {
      return b.dataset.buttonType === 'remove';
    }));
    var undoneButt = document.createElement('div');
    undoneButt.classList.add('undoneContainer');
    undoneButt.appendChild(allButtons.find(function (b) {
      return b.dataset.buttonType === 'doneUndone';
    }));
    li.append(undoneButt, text, removeButt);
    ulForDoneTasks.appendChild(li);
  });
  elements.doneTasks.innerHTML = '';

  if (ulForDoneTasks.innerHTML !== '') {
    elements.doneTasks.appendChild(ulForDoneTasks);
  } else {
    elements.doneTasks.appendChild(elements.doneTaskPrompt);
  }

  resetInputs(elements);
};

var render = {
  lists: renderLists,
  tasks: renderTasks,
  all: function all(state, elements) {
    renderLists(state, elements);
    renderTasks(state, elements);
  }
};

var createButtonsModels = function createButtonsModels() {
  var upButton = document.createElement('button');
  upButton.classList.add('up');
  upButton.dataset.buttonType = 'replace';
  upButton.dataset.buttonFunc = 'up';
  var downButton = document.createElement('button');
  downButton.classList.add('down');
  downButton.dataset.buttonType = 'replace';
  downButton.dataset.buttonFunc = 'down';
  var startOutOfTurnButton = document.createElement('button');
  startOutOfTurnButton.classList.add('startOutOfTurn');
  startOutOfTurnButton.dataset.buttonType = 'startOutOfTurn';
  var doneButton = document.createElement('button');
  doneButton.classList.add('done');
  doneButton.dataset.buttonType = 'doneUndone';
  var undoneButton = document.createElement('button');
  undoneButton.classList.add('undone');
  undoneButton.dataset.buttonType = 'doneUndone';
  var removeButton = document.createElement('button');
  removeButton.classList.add('remove');
  removeButton.dataset.buttonType = 'remove';
  return [{
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
};

var elements = {
  lists: document.querySelector('[data-container="lists"]'),
  listForm: document.querySelector('[data-container="new-list-form"]'),
  tasks: document.querySelector('[data-container="tasks"]'),
  taskPrompt: document.querySelector('[data-container="tasks-prompt"]'),
  taskForm: document.querySelector('[data-container="new-task-form"]'),
  doneTasks: document.querySelector('[data-container="done-tasks"]'),
  doneTaskPrompt: document.querySelector('[data-container="done-tasks-prompt"]'),
  selectedTask: document.querySelector('[data-container="selected-task"]'),
  buttons: createButtonsModels()
};
var state = (0, _onChange["default"])({
  activeList: {
    id: null,
    name: ''
  },
  activeTaskId: null,
  lists: [],
  tasks: []
}, function (path) {
  path === 'activeList' ? render.all(this, elements) : null;
  path === 'activeTaskId' ? render.tasks(this, elements) : null;
  path.includes('lists') ? render.lists(this, elements) : null;
  path.includes('tasks') ? render.tasks(this, elements) : null;
});

var init = function init(mainState) {
  state.mainState = mainState;
  elements.listForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    var value = formData.get('name');

    if (value !== '') {
      state.lists.push({
        id: _lodash["default"].uniqueId(),
        name: value,
        position: getPosition(state, 'list'),
        isMutable: true
      });
    }
  });
  elements.taskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    var value = formData.get('name');

    if (value !== '') {
      var task = {
        id: _lodash["default"].uniqueId(),
        parentList: state.activeList.name,
        name: value,
        position: getPosition(state, 'task'),
        isDone: false
      };
      state.tasks.push(task);
    }
  });
  var generalList = {
    id: _lodash["default"].uniqueId(),
    name: 'General',
    position: getPosition(state, 'list'),
    isMutable: false
  };
  state.activeList = {
    id: generalList.id,
    name: generalList.name
  };
  state.lists.push(generalList);
};

var completeTask = function completeTask() {
  var id = getSelectedElementId(state);
  if (id === null) return;
  var task = getElementById(state, id);
  task.isDone = true;
  state.activeTaskId = null;
};

var TaskManager = {
  init: init,
  completeTask: completeTask
};
var _default = TaskManager;
exports["default"] = _default;
//# sourceMappingURL=TaskManager.js.map