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
var timeManager = _Timer["default"].timeManager;
var completeTask = _TaskManager["default"].completeTask;
var increaseDoneTasks = _DoneTasksCounter["default"].increaseDoneTasks;
var state = {
  setDefault: function setDefault() {
    var inTurn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    state.inTurn = inTurn;
    state.isDone = false;
  }
};
watch(state, 'isDone', function () {
  if (state.isDone) {
    completeTask();
    timeManager.shortBreak();
    increaseDoneTasks();
    state.setDefault();
  }
});
watch(state, 'inTurn', function () {
  return state.inTurn ? null : _Timer["default"].run();
});
watch(_DoneTasksCounter["default"], 'needLongBreak', timeManager.longBreak);
state.setDefault();

_TaskManager["default"].init(state);

_Timer["default"].init(state);

_DoneTasksCounter["default"].init();
//# sourceMappingURL=main.js.map