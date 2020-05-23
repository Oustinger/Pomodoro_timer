"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _watchjs = _interopRequireDefault(require("watchjs"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

var watch = _watchjs["default"].watch;
var state = {
  count: 0,
  needLongBreak: false
};

var increase = function increase() {
  state.count += 1;

  if (state.count === 4) {
    state.count = 0;
    state.needLongBreak = true;
  }
};

var decrease = function decrease() {
  state.count -= state.count > 0 ? 1 : 0;
};

var render = function render(elements) {
  elements.quantity.textContent = state.count;
};

var doneTasksCounter = function doneTasksCounter() {
  var elements = {
    quantity: document.querySelector('[data-container="quantity"]'),
    increase: document.querySelector('[data-container="increase"]'),
    decrease: document.querySelector('[data-container="decrease"]')
  };
  watch(state, 'count', function () {
    return render(elements);
  });
  elements.increase.addEventListener('click', increase);
  elements.decrease.addEventListener('click', decrease);
  render(elements);
};

var DoneTasksCounter = {
  init: doneTasksCounter,
  increaseDoneTasks: increase,
  needLongBreak: false
};
watch(state, 'needLongBreak', function () {
  DoneTasksCounter.needLongBreak = state.needLongBreak;
});
var _default = DoneTasksCounter;
exports["default"] = _default;
//# sourceMappingURL=DoneTasksCounter.js.map