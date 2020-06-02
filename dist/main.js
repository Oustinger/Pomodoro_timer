"use strict";

var _watchjs = _interopRequireDefault(require("watchjs"));

var _Timer = _interopRequireDefault(require("./scripts/Timer"));

var _DoneTasksCounter = _interopRequireDefault(require("./scripts/DoneTasksCounter"));

var _TaskManager = _interopRequireDefault(require("./scripts/TaskManager"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

var watch = _watchjs["default"].watch;
var state = {
  setValues: function setValues() {
    var outOfTurn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    state.outOfTurn = outOfTurn;
    state.isDone = false;
  }
};
watch(state, 'isDone', function () {
  if (state.isDone) {
    _Timer["default"].timeManager.shortBreak();

    _DoneTasksCounter["default"].increaseDoneTasks();

    _Timer["default"].stop();

    _TaskManager["default"].completeTask();

    state.setValues();
  }
});
watch(state, 'outOfTurn', function () {
  return state.outOfTurn ? _Timer["default"].run() : null;
});
watch(_DoneTasksCounter["default"], 'needLongBreak', function () {
  return _DoneTasksCounter["default"].needLongBreak ? _Timer["default"].timeManager.longBreak() : null;
});
state.setValues();

_TaskManager["default"].init(state);

_Timer["default"].init(state);

_DoneTasksCounter["default"].init();
//# sourceMappingURL=main.js.map