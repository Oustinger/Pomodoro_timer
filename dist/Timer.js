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
var timeManager = {
  preWork: 1500,
  work: 1500,
  preRelax: 300,
  relax: 300
};

timeManager.longBreak = function () {
  timeManager.preRelax = 900;
  timeManager.relax = 900;
};

timeManager.shortBreak = function () {
  timeManager.preRelax = 300;
  timeManager.relax = 300;
};

var modeMapping = {
  preWork: {
    time: timeManager.work,
    buttons: ['start'],
    bgColor: 'red',
    onPause: null,
    forTimer: false,
    forSkip: null,
    askFinish: false
  },
  work: {
    time: timeManager.work,
    buttons: ['pausePlay', 'finish', 'restart'],
    bgColor: 'red',
    onPause: false,
    forTimer: true,
    forSkip: true,
    askFinish: false
  },
  preRelax: {
    time: timeManager["break"],
    buttons: ['start', 'skip'],
    bgColor: 'green',
    onPause: null,
    forTimer: false,
    forSkip: true,
    askFinish: false
  },
  relax: {
    time: timeManager["break"],
    buttons: ['pausePlay', 'finish', 'restart'],
    bgColor: 'green',
    onPause: false,
    forTimer: true,
    forSkip: true,
    askFinish: false
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

  if (state.modeName === 'work') {
    state.taskIsDone();
    return;
  }

  clearInterval(state.timerRuner);
  setTimeout(function () {
    return updateState(state, getMode(state.modeName, 'next'), 1000);
  });
};

var setTimer = function setTimer(state) {
  return setInterval(timerFunc, 1000, state);
};

var eventButtonsFunctions = {
  start: function start(state) {
    updateState(state, getMode(state.modeName, 'next'));
    state.timerRuner = setTimer(state);
  },
  pausePlay: function pausePlay(state) {
    state.onPause = !state.onPause;

    if (state.onPause) {
      clearInterval(state.timerRuner);
      return;
    }

    state.timerRuner = setTimer(state);
  },
  finish: function finish(state) {
    if (state.modeName === 'work') {
      state.taskIsDone();
      return;
    }

    clearInterval(state.timerRuner);
    updateState(state, getMode(state.modeName, 'next'));
  },
  restart: function restart(state) {
    clearInterval(state.timerRuner);
    updateState(state, getMode(state.modeName, 'prev'));
  },
  skip: function skip(state) {
    clearInterval(state.timerRuner);
    updateState(state, getMode(state.modeName, 'toStart'));
  }
};
var render = {
  bgColor: function bgColor(containers) {
    return containers.forEach(function (container) {
      container.classList.toggle('red');
      container.classList.toggle('green');
    });
  },
  buttons: function buttons(state, container) {
    container.innerHTML = '';
    state.buttons.forEach(function (type) {
      var buttonContainer = document.createElement('button');
      buttonContainer.classList.add(type);
      buttonContainer.dataset.buttonType = type;
      buttonContainer.addEventListener('click', function (_ref3) {
        var target = _ref3.target,
            currentTarget = _ref3.currentTarget;

        if (currentTarget === target) {
          if (type === 'finish') {
            if (state.askFinish) return;
            state.askFinish = true;
            var confirmer = new _ConfirmationYN["default"]();
            var answer = confirmer.ask(target.parentNode);
            watch(answer, 'value', function () {
              confirmer.remove();

              if (answer.value) {
                eventButtonsFunctions[type](state);
              }

              state.askFinish = false;
            });
            return;
          }

          eventButtonsFunctions[type](state);
        }
      });
      container.appendChild(buttonContainer);
    });
  },
  time: function time(_ref4, container) {
    var _time = _ref4.time;
    container.textContent = millisToMinutesAndSeconds(_time);
  },
  pausePlay: function pausePlay(_ref5, container) {
    var onPause = _ref5.onPause;
    if (onPause === null) return;
    var pausePlayButton = container.querySelector('[data-button-type="pausePlay"]');
    pausePlayButton.classList.remove(onPause ? 'pause' : 'play');
    pausePlayButton.classList.add(onPause ? 'play' : 'pause');
  }
};
var state = {};

var init = function init(mainState) {
  var header = document.querySelector('header');
  var timerContainer = document.querySelector('[data-container="timer-container"]');
  var timeZone = document.querySelector('[data-container="time-zone"]');
  var buttonsContainer = document.querySelector('[data-container="buttons"]');
  var elements = {
    header: header,
    timerContainer: timerContainer,
    timeZone: timeZone,
    buttonsContainer: buttonsContainer
  };
  watch(state, 'bgColor', function () {
    return render.bgColor([elements.header, elements.timerContainer]);
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
  clearInterval(state.timerRuner);
  updateState(state, 'work');
  state.timerRuner = setTimer(state);
};

var stop = function stop() {
  clearInterval(state.timerRuner);
  updateState(state, getMode(state.modeName, 'next'));
};

var Timer = {
  init: init,
  run: run,
  stop: stop,
  timeManager: timeManager
};
var _default = Timer;
exports["default"] = _default;
//# sourceMappingURL=Timer.js.map