"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _watchjs = _interopRequireDefault(require("watchjs"));

var _ConfirmationYN = _interopRequireDefault(require("./classes/ConfirmationYN"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var watch = _watchjs["default"].watch;

var emptyFunc = function emptyFunc() {};

var askConfirmYN = function askConfirmYN(parentElem, onYes, onNo) {
  for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  var confirmContainer = new _ConfirmationYN["default"]();
  watch(confirmContainer.answer, 'value', function () {
    confirmContainer.remove();
    return confirmContainer.answer.value ? onYes.apply(void 0, args) : onNo.apply(void 0, args);
  });
  confirmContainer.ask(parentElem);
};

var timeManager = {
  preWork: 5,
  work: 5,
  preRelax: 5,
  relax: 5
};

timeManager.longBreak = function () {
  timeManager.preRelax = 10;
  timeManager.relax = 10;
};

timeManager.shortBreak = function () {
  timeManager.preRelax = 5;
  timeManager.relax = 5;
};

var modeMapping = {
  preWork: {
    time: timeManager.work,
    buttons: ['start'],
    bgColor: 'red',
    onPause: null,
    forTimer: false,
    forSkip: null
  },
  work: {
    time: timeManager.work,
    buttons: ['pausePlay', 'finish', 'restart', 'stop'],
    bgColor: 'red',
    onPause: false,
    forTimer: true,
    forSkip: true
  },
  preRelax: {
    time: timeManager["break"],
    buttons: ['start', 'skip'],
    bgColor: 'blue',
    onPause: null,
    forTimer: false,
    forSkip: true
  },
  relax: {
    time: timeManager["break"],
    buttons: ['pausePlay', 'finish', 'restart'],
    bgColor: 'blue',
    onPause: false,
    forTimer: true,
    forSkip: true
  }
};

var millisToMinutesAndSeconds = function millisToMinutesAndSeconds(time) {
  var minutes = Math.floor(time / 60);
  var seconds = time - minutes * 60;
  return "".concat(minutes, ":").concat(seconds < 10 ? '0' : '').concat(seconds);
};

var updateState = function updateState(state, modeName) {
  modeMapping[modeName].time = timeManager[modeName];
  var entries = Object.entries(_objectSpread(_objectSpread({}, state), {}, {
    modeName: modeName
  }, modeMapping[modeName]));
  entries.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    state[key] = value;
  });
};

var getMode = function getMode(current, operation) {
  var modes = ['preWork', 'work', 'preRelax', 'relax'];
  var currentId = modes.indexOf(current);
  var newId;

  switch (operation) {
    case 'next':
      newId = modes[currentId + 1] ? currentId + 1 : 0;
      break;

    case 'prev':
      newId = currentId - 1;
      break;

    case 'toStart':
      newId = 0;
      break;

    default:
      throw new Error("Unknown operation: ".concat(operation));
  }

  return modes[newId];
};

var timerFunc = function timerFunc(state) {
  if (state.time !== 0) {
    state.time -= 1;
    return;
  }

  state.time = 0;
  if (state.modeName === 'work') state.taskIsDone();
  clearInterval(state.timerRuner);
  setTimeout(function () {
    return updateState(state, getMode(state.modeName, 'next'), 1000);
  });
};

var setTimer = function setTimer() {
  return setInterval(timerFunc, 1000, state);
};

var eventButtonsFunctions = {
  start: function start(state) {
    updateState(state, getMode(state.modeName, 'next'));
    state.timerRuner = setTimer();
  },
  pausePlay: function pausePlay(state) {
    state.onPause = !state.onPause;

    if (state.onPause) {
      clearInterval(state.timerRuner);
      return;
    }

    state.timerRuner = setTimer();
  },
  finish: function finish(state) {
    if (state.modeName === 'work') state.taskIsDone();
    clearInterval(state.timerRuner);
    updateState(state, getMode(state.modeName, 'next'));
  },
  restart: function restart(state) {
    clearInterval(state.timerRuner);
    updateState(state, getMode(state.modeName, 'prev'));
  },
  stop: function stop(state) {
    clearInterval(state.timerRuner);
    updateState(state, getMode(state.modeName, 'toStart'));
  },
  skip: function skip(state) {
    clearInterval(state.timerRuner);
    updateState(state, getMode(state.modeName, 'toStart'));
  }
};
var render = {
  bgColor: function bgColor(_ref3, container) {
    var color = _ref3.color;
    return container.setAttribute('bgColor', "".concat(color));
  },
  buttons: function buttons(state, container) {
    container.innerHTML = '';
    state.buttons.forEach(function (type) {
      var buttonContainer = document.createElement('button');
      buttonContainer.dataset.buttonType = type;
      buttonContainer.textContent = type;
      buttonContainer.addEventListener('click', function (_ref4) {
        var target = _ref4.target;

        if (type === 'stop') {
          askConfirmYN(target, eventButtonsFunctions[type], emptyFunc, state);
          return;
        }

        eventButtonsFunctions[type](state);
      });
      container.appendChild(buttonContainer);
    });
  },
  time: function time(_ref5, container) {
    var _time = _ref5.time;
    container.textContent = millisToMinutesAndSeconds(_time);
  },
  pausePlay: function pausePlay(_ref6, container) {
    var onPause = _ref6.onPause;
    if (onPause === null) return;
    var pausePlayButton = container.querySelector('[data-button-type="pausePlay"]');
    pausePlayButton.textContent = onPause ? 'resume' : 'pause';
  }
};
var state = {};

var init = function init(mainState) {
  var timerContainer = document.querySelector('[data-container="timer"]');
  var timeZone = document.querySelector('[data-container="time-zone"]');
  var buttonsContainer = document.querySelector('[data-container="buttons"]');
  var elements = {
    timerContainer: timerContainer,
    timeZone: timeZone,
    buttonsContainer: buttonsContainer
  };
  watch(state, 'bgColor', function () {
    return render.bgColor(state, elements.timerContainer);
  });
  watch(state, 'buttons', function () {
    return render.buttons(state, elements.buttonsContainer);
  });
  watch(state, 'time', function () {
    return render.time(state, elements.timeZone);
  });
  watch(state, 'onPause', function () {
    return render.pausePlay(state, elements.buttonsContainer);
  });
  updateState(state, 'preWork');

  state.taskIsDone = function () {
    mainState.isDone = !mainState.isDone;
  };
};

var run = function run() {
  updateState(state, 'work');
  state.timerRuner = setTimer();
};

var Timer = {
  init: init,
  run: run,
  timeManager: timeManager
};
var _default = Timer;
exports["default"] = _default;
//# sourceMappingURL=Timer.js.map