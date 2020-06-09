"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _watchjs = _interopRequireDefault(require("watchjs"));

var _ConfirmationYN = _interopRequireDefault(require("./classes/ConfirmationYN"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2pzU3JjL3NjcmlwdHMvVGltZXIuanMiXSwibmFtZXMiOlsid2F0Y2giLCJXYXRjaEpTIiwidGltZU1hbmFnZXIiLCJwcmVXb3JrIiwid29yayIsInByZVJlbGF4IiwicmVsYXgiLCJsb25nQnJlYWsiLCJzaG9ydEJyZWFrIiwibW9kZU1hcHBpbmciLCJ0aW1lIiwiYnV0dG9ucyIsImJnQ29sb3IiLCJvblBhdXNlIiwiZm9yVGltZXIiLCJmb3JTa2lwIiwiYXNrRmluaXNoIiwibWlsbGlzVG9NaW51dGVzQW5kU2Vjb25kcyIsIm1pbnV0ZXMiLCJNYXRoIiwiZmxvb3IiLCJzZWNvbmRzIiwidXBkYXRlU3RhdGUiLCJzdGF0ZSIsIm1vZGVOYW1lIiwiZW50cmllcyIsIk9iamVjdCIsImZvckVhY2giLCJrZXkiLCJ2YWx1ZSIsImdldE1vZGUiLCJjdXJyZW50Iiwib3BlcmF0aW9uIiwibW9kZXMiLCJjdXJyZW50SWQiLCJpbmRleE9mIiwibmV3SWQiLCJFcnJvciIsInRpbWVyRnVuYyIsInRhc2tJc0RvbmUiLCJjbGVhckludGVydmFsIiwidGltZXJSdW5lciIsInNldFRpbWVvdXQiLCJzZXRUaW1lciIsInNldEludGVydmFsIiwiZXZlbnRCdXR0b25zRnVuY3Rpb25zIiwic3RhcnQiLCJwYXVzZVBsYXkiLCJmaW5pc2giLCJyZXN0YXJ0Iiwic2tpcCIsInJlbmRlciIsImNvbnRhaW5lcnMiLCJjb250YWluZXIiLCJjbGFzc0xpc3QiLCJ0b2dnbGUiLCJpbm5lckhUTUwiLCJ0eXBlIiwiYnV0dG9uQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYWRkIiwiZGF0YXNldCIsImJ1dHRvblR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwidGFyZ2V0IiwiY3VycmVudFRhcmdldCIsImNvbmZpcm1lciIsIkNvbmZpcm1hdGlvbllOIiwiYW5zd2VyIiwiYXNrIiwicGFyZW50Tm9kZSIsInJlbW92ZSIsImFwcGVuZENoaWxkIiwidGV4dENvbnRlbnQiLCJwYXVzZVBsYXlCdXR0b24iLCJxdWVyeVNlbGVjdG9yIiwiaW5pdCIsIm1haW5TdGF0ZSIsImhlYWRlciIsInRpbWVyQ29udGFpbmVyIiwidGltZVpvbmUiLCJidXR0b25zQ29udGFpbmVyIiwiZWxlbWVudHMiLCJpc0RvbmUiLCJydW4iLCJzdG9wIiwiVGltZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVRQSxLLEdBQVVDLG1CLENBQVZELEs7QUFFUixJQUFNRSxXQUFXLEdBQUc7QUFDbEJDLEVBQUFBLE9BQU8sRUFBRSxJQURTO0FBRWxCQyxFQUFBQSxJQUFJLEVBQUUsSUFGWTtBQUdsQkMsRUFBQUEsUUFBUSxFQUFFLEdBSFE7QUFJbEJDLEVBQUFBLEtBQUssRUFBRTtBQUpXLENBQXBCOztBQU1BSixXQUFXLENBQUNLLFNBQVosR0FBd0IsWUFBTTtBQUM1QkwsRUFBQUEsV0FBVyxDQUFDRyxRQUFaLEdBQXVCLEdBQXZCO0FBQ0FILEVBQUFBLFdBQVcsQ0FBQ0ksS0FBWixHQUFvQixHQUFwQjtBQUNELENBSEQ7O0FBSUFKLFdBQVcsQ0FBQ00sVUFBWixHQUF5QixZQUFNO0FBQzdCTixFQUFBQSxXQUFXLENBQUNHLFFBQVosR0FBdUIsR0FBdkI7QUFDQUgsRUFBQUEsV0FBVyxDQUFDSSxLQUFaLEdBQW9CLEdBQXBCO0FBQ0QsQ0FIRDs7QUFLQSxJQUFNRyxXQUFXLEdBQUc7QUFDbEJOLEVBQUFBLE9BQU8sRUFBRTtBQUNQTyxJQUFBQSxJQUFJLEVBQUVSLFdBQVcsQ0FBQ0UsSUFEWDtBQUVQTyxJQUFBQSxPQUFPLEVBQUUsQ0FBQyxPQUFELENBRkY7QUFHUEMsSUFBQUEsT0FBTyxFQUFFLEtBSEY7QUFJUEMsSUFBQUEsT0FBTyxFQUFFLElBSkY7QUFLUEMsSUFBQUEsUUFBUSxFQUFFLEtBTEg7QUFNUEMsSUFBQUEsT0FBTyxFQUFFLElBTkY7QUFPUEMsSUFBQUEsU0FBUyxFQUFFO0FBUEosR0FEUztBQVVsQlosRUFBQUEsSUFBSSxFQUFFO0FBQ0pNLElBQUFBLElBQUksRUFBRVIsV0FBVyxDQUFDRSxJQURkO0FBRUpPLElBQUFBLE9BQU8sRUFBRSxDQUFDLFdBQUQsRUFBYyxRQUFkLEVBQXdCLFNBQXhCLENBRkw7QUFHSkMsSUFBQUEsT0FBTyxFQUFFLEtBSEw7QUFJSkMsSUFBQUEsT0FBTyxFQUFFLEtBSkw7QUFLSkMsSUFBQUEsUUFBUSxFQUFFLElBTE47QUFNSkMsSUFBQUEsT0FBTyxFQUFFLElBTkw7QUFPSkMsSUFBQUEsU0FBUyxFQUFFO0FBUFAsR0FWWTtBQW1CbEJYLEVBQUFBLFFBQVEsRUFBRTtBQUNSSyxJQUFBQSxJQUFJLEVBQUVSLFdBQVcsU0FEVDtBQUVSUyxJQUFBQSxPQUFPLEVBQUUsQ0FBQyxPQUFELEVBQVUsTUFBVixDQUZEO0FBR1JDLElBQUFBLE9BQU8sRUFBRSxPQUhEO0FBSVJDLElBQUFBLE9BQU8sRUFBRSxJQUpEO0FBS1JDLElBQUFBLFFBQVEsRUFBRSxLQUxGO0FBTVJDLElBQUFBLE9BQU8sRUFBRSxJQU5EO0FBT1JDLElBQUFBLFNBQVMsRUFBRTtBQVBILEdBbkJRO0FBNEJsQlYsRUFBQUEsS0FBSyxFQUFFO0FBQ0xJLElBQUFBLElBQUksRUFBRVIsV0FBVyxTQURaO0FBRUxTLElBQUFBLE9BQU8sRUFBRSxDQUFDLFdBQUQsRUFBYyxRQUFkLEVBQXdCLFNBQXhCLENBRko7QUFHTEMsSUFBQUEsT0FBTyxFQUFFLE9BSEo7QUFJTEMsSUFBQUEsT0FBTyxFQUFFLEtBSko7QUFLTEMsSUFBQUEsUUFBUSxFQUFFLElBTEw7QUFNTEMsSUFBQUEsT0FBTyxFQUFFLElBTko7QUFPTEMsSUFBQUEsU0FBUyxFQUFFO0FBUE47QUE1QlcsQ0FBcEI7O0FBdUNBLElBQU1DLHlCQUF5QixHQUFHLFNBQTVCQSx5QkFBNEIsQ0FBQ1AsSUFBRCxFQUFVO0FBQzFDLE1BQU1RLE9BQU8sR0FBR0MsSUFBSSxDQUFDQyxLQUFMLENBQVdWLElBQUksR0FBRyxFQUFsQixDQUFoQjtBQUNBLE1BQU1XLE9BQU8sR0FBR1gsSUFBSSxHQUFHUSxPQUFPLEdBQUcsRUFBakM7QUFDQSxtQkFBVUEsT0FBVixjQUFxQkcsT0FBTyxHQUFHLEVBQVYsR0FBZSxHQUFmLEdBQXFCLEVBQTFDLFNBQStDQSxPQUEvQztBQUNELENBSkQ7O0FBTUEsSUFBTUMsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQ0MsS0FBRCxFQUFRQyxRQUFSLEVBQXFCO0FBQ3ZDZixFQUFBQSxXQUFXLENBQUNlLFFBQUQsQ0FBWCxDQUFzQmQsSUFBdEIsR0FBNkJSLFdBQVcsQ0FBQ3NCLFFBQUQsQ0FBeEM7QUFDQSxNQUFNQyxPQUFPLEdBQUdDLE1BQU0sQ0FBQ0QsT0FBUCxpQ0FBb0JGLEtBQXBCO0FBQTJCQyxJQUFBQSxRQUFRLEVBQVJBO0FBQTNCLEtBQXdDZixXQUFXLENBQUNlLFFBQUQsQ0FBbkQsRUFBaEI7QUFDQUMsRUFBQUEsT0FBTyxDQUFDRSxPQUFSLENBQWdCLGdCQUFrQjtBQUFBO0FBQUEsUUFBaEJDLEdBQWdCO0FBQUEsUUFBWEMsS0FBVzs7QUFDaENOLElBQUFBLEtBQUssQ0FBQ0ssR0FBRCxDQUFMLEdBQWFDLEtBQWI7QUFDRCxHQUZEO0FBR0QsQ0FORDs7QUFRQSxJQUFNQyxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFDQyxPQUFELEVBQVVDLFNBQVYsRUFBd0I7QUFDdEMsTUFBTUMsS0FBSyxHQUFHLENBQUMsU0FBRCxFQUFZLE1BQVosRUFBb0IsVUFBcEIsRUFBZ0MsT0FBaEMsQ0FBZDtBQUNBLE1BQU1DLFNBQVMsR0FBR0QsS0FBSyxDQUFDRSxPQUFOLENBQWNKLE9BQWQsQ0FBbEI7QUFDQSxNQUFJSyxLQUFKOztBQUNBLFVBQVFKLFNBQVI7QUFDRSxTQUFLLE1BQUw7QUFDRUksTUFBQUEsS0FBSyxHQUFJSCxLQUFLLENBQUNDLFNBQVMsR0FBRyxDQUFiLENBQUwsR0FBdUJBLFNBQVMsR0FBRyxDQUFuQyxHQUF1QyxDQUFoRDtBQUNBOztBQUNGLFNBQUssTUFBTDtBQUNFRSxNQUFBQSxLQUFLLEdBQUdGLFNBQVMsR0FBRyxDQUFwQjtBQUNBOztBQUNGLFNBQUssU0FBTDtBQUNFRSxNQUFBQSxLQUFLLEdBQUcsQ0FBUjtBQUNBOztBQUNGO0FBQ0UsWUFBTSxJQUFJQyxLQUFKLDhCQUFnQ0wsU0FBaEMsRUFBTjtBQVhKOztBQWFBLFNBQU9DLEtBQUssQ0FBQ0csS0FBRCxDQUFaO0FBQ0QsQ0FsQkQ7O0FBb0JBLElBQU1FLFNBQVMsR0FBRyxTQUFaQSxTQUFZLENBQUNmLEtBQUQsRUFBVztBQUMzQixNQUFJQSxLQUFLLENBQUNiLElBQU4sS0FBZSxDQUFuQixFQUFzQjtBQUNwQmEsSUFBQUEsS0FBSyxDQUFDYixJQUFOLElBQWMsQ0FBZDtBQUNBO0FBQ0Q7O0FBQ0RhLEVBQUFBLEtBQUssQ0FBQ2IsSUFBTixHQUFhLENBQWI7O0FBQ0EsTUFBSWEsS0FBSyxDQUFDQyxRQUFOLEtBQW1CLE1BQXZCLEVBQStCO0FBQzdCRCxJQUFBQSxLQUFLLENBQUNnQixVQUFOO0FBQ0E7QUFDRDs7QUFDREMsRUFBQUEsYUFBYSxDQUFDakIsS0FBSyxDQUFDa0IsVUFBUCxDQUFiO0FBQ0FDLEVBQUFBLFVBQVUsQ0FBQztBQUFBLFdBQU1wQixXQUFXLENBQUNDLEtBQUQsRUFBUU8sT0FBTyxDQUFDUCxLQUFLLENBQUNDLFFBQVAsRUFBaUIsTUFBakIsQ0FBZixFQUF5QyxJQUF6QyxDQUFqQjtBQUFBLEdBQUQsQ0FBVjtBQUNELENBWkQ7O0FBY0EsSUFBTW1CLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQUNwQixLQUFEO0FBQUEsU0FBV3FCLFdBQVcsQ0FBQ04sU0FBRCxFQUFZLElBQVosRUFBa0JmLEtBQWxCLENBQXRCO0FBQUEsQ0FBakI7O0FBRUEsSUFBTXNCLHFCQUFxQixHQUFHO0FBQzVCQyxFQUFBQSxLQUFLLEVBQUUsZUFBQ3ZCLEtBQUQsRUFBVztBQUNoQkQsSUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVFPLE9BQU8sQ0FBQ1AsS0FBSyxDQUFDQyxRQUFQLEVBQWlCLE1BQWpCLENBQWYsQ0FBWDtBQUNBRCxJQUFBQSxLQUFLLENBQUNrQixVQUFOLEdBQW1CRSxRQUFRLENBQUNwQixLQUFELENBQTNCO0FBQ0QsR0FKMkI7QUFLNUJ3QixFQUFBQSxTQUFTLEVBQUUsbUJBQUN4QixLQUFELEVBQVc7QUFDcEJBLElBQUFBLEtBQUssQ0FBQ1YsT0FBTixHQUFnQixDQUFDVSxLQUFLLENBQUNWLE9BQXZCOztBQUNBLFFBQUlVLEtBQUssQ0FBQ1YsT0FBVixFQUFtQjtBQUNqQjJCLE1BQUFBLGFBQWEsQ0FBQ2pCLEtBQUssQ0FBQ2tCLFVBQVAsQ0FBYjtBQUNBO0FBQ0Q7O0FBQ0RsQixJQUFBQSxLQUFLLENBQUNrQixVQUFOLEdBQW1CRSxRQUFRLENBQUNwQixLQUFELENBQTNCO0FBQ0QsR0FaMkI7QUFhNUJ5QixFQUFBQSxNQUFNLEVBQUUsZ0JBQUN6QixLQUFELEVBQVc7QUFDakIsUUFBSUEsS0FBSyxDQUFDQyxRQUFOLEtBQW1CLE1BQXZCLEVBQStCO0FBQzdCRCxNQUFBQSxLQUFLLENBQUNnQixVQUFOO0FBQ0E7QUFDRDs7QUFDREMsSUFBQUEsYUFBYSxDQUFDakIsS0FBSyxDQUFDa0IsVUFBUCxDQUFiO0FBQ0FuQixJQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUU8sT0FBTyxDQUFDUCxLQUFLLENBQUNDLFFBQVAsRUFBaUIsTUFBakIsQ0FBZixDQUFYO0FBQ0QsR0FwQjJCO0FBcUI1QnlCLEVBQUFBLE9BQU8sRUFBRSxpQkFBQzFCLEtBQUQsRUFBVztBQUNsQmlCLElBQUFBLGFBQWEsQ0FBQ2pCLEtBQUssQ0FBQ2tCLFVBQVAsQ0FBYjtBQUNBbkIsSUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVFPLE9BQU8sQ0FBQ1AsS0FBSyxDQUFDQyxRQUFQLEVBQWlCLE1BQWpCLENBQWYsQ0FBWDtBQUNELEdBeEIyQjtBQXlCNUIwQixFQUFBQSxJQUFJLEVBQUUsY0FBQzNCLEtBQUQsRUFBVztBQUNmaUIsSUFBQUEsYUFBYSxDQUFDakIsS0FBSyxDQUFDa0IsVUFBUCxDQUFiO0FBQ0FuQixJQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUU8sT0FBTyxDQUFDUCxLQUFLLENBQUNDLFFBQVAsRUFBaUIsU0FBakIsQ0FBZixDQUFYO0FBQ0Q7QUE1QjJCLENBQTlCO0FBK0JBLElBQU0yQixNQUFNLEdBQUc7QUFDYnZDLEVBQUFBLE9BQU8sRUFBRSxpQkFBQ3dDLFVBQUQ7QUFBQSxXQUFnQkEsVUFBVSxDQUFDekIsT0FBWCxDQUFtQixVQUFDMEIsU0FBRCxFQUFlO0FBQ3pEQSxNQUFBQSxTQUFTLENBQUNDLFNBQVYsQ0FBb0JDLE1BQXBCLENBQTJCLEtBQTNCO0FBQ0FGLE1BQUFBLFNBQVMsQ0FBQ0MsU0FBVixDQUFvQkMsTUFBcEIsQ0FBMkIsT0FBM0I7QUFDRCxLQUh3QixDQUFoQjtBQUFBLEdBREk7QUFLYjVDLEVBQUFBLE9BQU8sRUFBRSxpQkFBQ1ksS0FBRCxFQUFROEIsU0FBUixFQUFzQjtBQUM3QkEsSUFBQUEsU0FBUyxDQUFDRyxTQUFWLEdBQXNCLEVBQXRCO0FBQ0FqQyxJQUFBQSxLQUFLLENBQUNaLE9BQU4sQ0FBY2dCLE9BQWQsQ0FBc0IsVUFBQzhCLElBQUQsRUFBVTtBQUM5QixVQUFNQyxlQUFlLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixRQUF2QixDQUF4QjtBQUNBRixNQUFBQSxlQUFlLENBQUNKLFNBQWhCLENBQTBCTyxHQUExQixDQUE4QkosSUFBOUI7QUFDQUMsTUFBQUEsZUFBZSxDQUFDSSxPQUFoQixDQUF3QkMsVUFBeEIsR0FBcUNOLElBQXJDO0FBQ0FDLE1BQUFBLGVBQWUsQ0FBQ00sZ0JBQWhCLENBQWlDLE9BQWpDLEVBQTBDLGlCQUErQjtBQUFBLFlBQTVCQyxNQUE0QixTQUE1QkEsTUFBNEI7QUFBQSxZQUFwQkMsYUFBb0IsU0FBcEJBLGFBQW9COztBQUN2RSxZQUFJQSxhQUFhLEtBQUtELE1BQXRCLEVBQThCO0FBQzVCLGNBQUlSLElBQUksS0FBSyxRQUFiLEVBQXVCO0FBQ3JCLGdCQUFJbEMsS0FBSyxDQUFDUCxTQUFWLEVBQXFCO0FBQ3JCTyxZQUFBQSxLQUFLLENBQUNQLFNBQU4sR0FBa0IsSUFBbEI7QUFDQSxnQkFBTW1ELFNBQVMsR0FBRyxJQUFJQywwQkFBSixFQUFsQjtBQUNBLGdCQUFNQyxNQUFNLEdBQUdGLFNBQVMsQ0FBQ0csR0FBVixDQUFjTCxNQUFNLENBQUNNLFVBQXJCLENBQWY7QUFDQXZFLFlBQUFBLEtBQUssQ0FBQ3FFLE1BQUQsRUFBUyxPQUFULEVBQWtCLFlBQU07QUFDM0JGLGNBQUFBLFNBQVMsQ0FBQ0ssTUFBVjs7QUFDQSxrQkFBSUgsTUFBTSxDQUFDeEMsS0FBWCxFQUFrQjtBQUNoQmdCLGdCQUFBQSxxQkFBcUIsQ0FBQ1ksSUFBRCxDQUFyQixDQUE0QmxDLEtBQTVCO0FBQ0Q7O0FBQ0RBLGNBQUFBLEtBQUssQ0FBQ1AsU0FBTixHQUFrQixLQUFsQjtBQUNELGFBTkksQ0FBTDtBQU9BO0FBQ0Q7O0FBQ0Q2QixVQUFBQSxxQkFBcUIsQ0FBQ1ksSUFBRCxDQUFyQixDQUE0QmxDLEtBQTVCO0FBQ0Q7QUFDRixPQWxCRDtBQW1CQThCLE1BQUFBLFNBQVMsQ0FBQ29CLFdBQVYsQ0FBc0JmLGVBQXRCO0FBQ0QsS0F4QkQ7QUF5QkQsR0FoQ1k7QUFpQ2JoRCxFQUFBQSxJQUFJLEVBQUUscUJBQVcyQyxTQUFYLEVBQXlCO0FBQUEsUUFBdEIzQyxLQUFzQixTQUF0QkEsSUFBc0I7QUFDN0IyQyxJQUFBQSxTQUFTLENBQUNxQixXQUFWLEdBQXdCekQseUJBQXlCLENBQUNQLEtBQUQsQ0FBakQ7QUFDRCxHQW5DWTtBQW9DYnFDLEVBQUFBLFNBQVMsRUFBRSwwQkFBY00sU0FBZCxFQUE0QjtBQUFBLFFBQXpCeEMsT0FBeUIsU0FBekJBLE9BQXlCO0FBQ3JDLFFBQUlBLE9BQU8sS0FBSyxJQUFoQixFQUFzQjtBQUN0QixRQUFNOEQsZUFBZSxHQUFHdEIsU0FBUyxDQUFDdUIsYUFBVixDQUF3QixnQ0FBeEIsQ0FBeEI7QUFDQUQsSUFBQUEsZUFBZSxDQUFDckIsU0FBaEIsQ0FBMEJrQixNQUExQixDQUFpQzNELE9BQU8sR0FBRyxPQUFILEdBQWEsTUFBckQ7QUFDQThELElBQUFBLGVBQWUsQ0FBQ3JCLFNBQWhCLENBQTBCTyxHQUExQixDQUE4QmhELE9BQU8sR0FBRyxNQUFILEdBQVksT0FBakQ7QUFDRDtBQXpDWSxDQUFmO0FBNENBLElBQU1VLEtBQUssR0FBRyxFQUFkOztBQUVBLElBQU1zRCxJQUFJLEdBQUcsU0FBUEEsSUFBTyxDQUFDQyxTQUFELEVBQWU7QUFDMUIsTUFBTUMsTUFBTSxHQUFHcEIsUUFBUSxDQUFDaUIsYUFBVCxDQUF1QixRQUF2QixDQUFmO0FBQ0EsTUFBTUksY0FBYyxHQUFHckIsUUFBUSxDQUFDaUIsYUFBVCxDQUF1QixvQ0FBdkIsQ0FBdkI7QUFDQSxNQUFNSyxRQUFRLEdBQUd0QixRQUFRLENBQUNpQixhQUFULENBQXVCLDhCQUF2QixDQUFqQjtBQUNBLE1BQU1NLGdCQUFnQixHQUFHdkIsUUFBUSxDQUFDaUIsYUFBVCxDQUF1Qiw0QkFBdkIsQ0FBekI7QUFFQSxNQUFNTyxRQUFRLEdBQUc7QUFDZkosSUFBQUEsTUFBTSxFQUFOQSxNQURlO0FBRWZDLElBQUFBLGNBQWMsRUFBZEEsY0FGZTtBQUdmQyxJQUFBQSxRQUFRLEVBQVJBLFFBSGU7QUFJZkMsSUFBQUEsZ0JBQWdCLEVBQWhCQTtBQUplLEdBQWpCO0FBT0FsRixFQUFBQSxLQUFLLENBQUN1QixLQUFELEVBQVEsU0FBUixFQUFtQjtBQUFBLFdBQU00QixNQUFNLENBQUN2QyxPQUFQLENBQWUsQ0FBQ3VFLFFBQVEsQ0FBQ0osTUFBVixFQUFrQkksUUFBUSxDQUFDSCxjQUEzQixDQUFmLENBQU47QUFBQSxHQUFuQixDQUFMO0FBQ0FoRixFQUFBQSxLQUFLLENBQUN1QixLQUFELEVBQVEsU0FBUixFQUFtQjtBQUFBLFdBQU00QixNQUFNLENBQUN4QyxPQUFQLENBQWVZLEtBQWYsRUFBc0I0RCxRQUFRLENBQUNELGdCQUEvQixDQUFOO0FBQUEsR0FBbkIsQ0FBTDtBQUNBbEYsRUFBQUEsS0FBSyxDQUFDdUIsS0FBRCxFQUFRLE1BQVIsRUFBZ0I7QUFBQSxXQUFNNEIsTUFBTSxDQUFDekMsSUFBUCxDQUFZYSxLQUFaLEVBQW1CNEQsUUFBUSxDQUFDRixRQUE1QixDQUFOO0FBQUEsR0FBaEIsQ0FBTDtBQUNBakYsRUFBQUEsS0FBSyxDQUFDdUIsS0FBRCxFQUFRLFNBQVIsRUFBbUI7QUFBQSxXQUFNNEIsTUFBTSxDQUFDSixTQUFQLENBQWlCeEIsS0FBakIsRUFBd0I0RCxRQUFRLENBQUNELGdCQUFqQyxDQUFOO0FBQUEsR0FBbkIsQ0FBTDtBQUVBNUQsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVEsU0FBUixDQUFYOztBQUVBQSxFQUFBQSxLQUFLLENBQUNnQixVQUFOLEdBQW1CLFlBQU07QUFDdkJ1QyxJQUFBQSxTQUFTLENBQUNNLE1BQVYsR0FBbUIsQ0FBQ04sU0FBUyxDQUFDTSxNQUE5QjtBQUNELEdBRkQ7QUFHRCxDQXZCRDs7QUF5QkEsSUFBTUMsR0FBRyxHQUFHLFNBQU5BLEdBQU0sR0FBTTtBQUNoQjdDLEVBQUFBLGFBQWEsQ0FBQ2pCLEtBQUssQ0FBQ2tCLFVBQVAsQ0FBYjtBQUNBbkIsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVEsTUFBUixDQUFYO0FBQ0FBLEVBQUFBLEtBQUssQ0FBQ2tCLFVBQU4sR0FBbUJFLFFBQVEsQ0FBQ3BCLEtBQUQsQ0FBM0I7QUFDRCxDQUpEOztBQUtBLElBQU0rRCxJQUFJLEdBQUcsU0FBUEEsSUFBTyxHQUFNO0FBQ2pCOUMsRUFBQUEsYUFBYSxDQUFDakIsS0FBSyxDQUFDa0IsVUFBUCxDQUFiO0FBQ0FuQixFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUU8sT0FBTyxDQUFDUCxLQUFLLENBQUNDLFFBQVAsRUFBaUIsTUFBakIsQ0FBZixDQUFYO0FBQ0QsQ0FIRDs7QUFLQSxJQUFNK0QsS0FBSyxHQUFHO0FBQ1pWLEVBQUFBLElBQUksRUFBSkEsSUFEWTtBQUNOUSxFQUFBQSxHQUFHLEVBQUhBLEdBRE07QUFDREMsRUFBQUEsSUFBSSxFQUFKQSxJQURDO0FBQ0twRixFQUFBQSxXQUFXLEVBQVhBO0FBREwsQ0FBZDtlQUllcUYsSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBXYXRjaEpTIGZyb20gJ3dhdGNoanMnO1xyXG5pbXBvcnQgQ29uZmlybWF0aW9uWU4gZnJvbSAnLi9jbGFzc2VzL0NvbmZpcm1hdGlvbllOJztcclxuXHJcbmNvbnN0IHsgd2F0Y2ggfSA9IFdhdGNoSlM7XHJcblxyXG5jb25zdCB0aW1lTWFuYWdlciA9IHtcclxuICBwcmVXb3JrOiAxNTAwLFxyXG4gIHdvcms6IDE1MDAsXHJcbiAgcHJlUmVsYXg6IDMwMCxcclxuICByZWxheDogMzAwLFxyXG59O1xyXG50aW1lTWFuYWdlci5sb25nQnJlYWsgPSAoKSA9PiB7XHJcbiAgdGltZU1hbmFnZXIucHJlUmVsYXggPSA5MDA7XHJcbiAgdGltZU1hbmFnZXIucmVsYXggPSA5MDA7XHJcbn07XHJcbnRpbWVNYW5hZ2VyLnNob3J0QnJlYWsgPSAoKSA9PiB7XHJcbiAgdGltZU1hbmFnZXIucHJlUmVsYXggPSAzMDA7XHJcbiAgdGltZU1hbmFnZXIucmVsYXggPSAzMDA7XHJcbn07XHJcblxyXG5jb25zdCBtb2RlTWFwcGluZyA9IHtcclxuICBwcmVXb3JrOiB7XHJcbiAgICB0aW1lOiB0aW1lTWFuYWdlci53b3JrLFxyXG4gICAgYnV0dG9uczogWydzdGFydCddLFxyXG4gICAgYmdDb2xvcjogJ3JlZCcsXHJcbiAgICBvblBhdXNlOiBudWxsLFxyXG4gICAgZm9yVGltZXI6IGZhbHNlLFxyXG4gICAgZm9yU2tpcDogbnVsbCxcclxuICAgIGFza0ZpbmlzaDogZmFsc2UsXHJcbiAgfSxcclxuICB3b3JrOiB7XHJcbiAgICB0aW1lOiB0aW1lTWFuYWdlci53b3JrLFxyXG4gICAgYnV0dG9uczogWydwYXVzZVBsYXknLCAnZmluaXNoJywgJ3Jlc3RhcnQnXSxcclxuICAgIGJnQ29sb3I6ICdyZWQnLFxyXG4gICAgb25QYXVzZTogZmFsc2UsXHJcbiAgICBmb3JUaW1lcjogdHJ1ZSxcclxuICAgIGZvclNraXA6IHRydWUsXHJcbiAgICBhc2tGaW5pc2g6IGZhbHNlLFxyXG4gIH0sXHJcbiAgcHJlUmVsYXg6IHtcclxuICAgIHRpbWU6IHRpbWVNYW5hZ2VyLmJyZWFrLFxyXG4gICAgYnV0dG9uczogWydzdGFydCcsICdza2lwJ10sXHJcbiAgICBiZ0NvbG9yOiAnZ3JlZW4nLFxyXG4gICAgb25QYXVzZTogbnVsbCxcclxuICAgIGZvclRpbWVyOiBmYWxzZSxcclxuICAgIGZvclNraXA6IHRydWUsXHJcbiAgICBhc2tGaW5pc2g6IGZhbHNlLFxyXG4gIH0sXHJcbiAgcmVsYXg6IHtcclxuICAgIHRpbWU6IHRpbWVNYW5hZ2VyLmJyZWFrLFxyXG4gICAgYnV0dG9uczogWydwYXVzZVBsYXknLCAnZmluaXNoJywgJ3Jlc3RhcnQnXSxcclxuICAgIGJnQ29sb3I6ICdncmVlbicsXHJcbiAgICBvblBhdXNlOiBmYWxzZSxcclxuICAgIGZvclRpbWVyOiB0cnVlLFxyXG4gICAgZm9yU2tpcDogdHJ1ZSxcclxuICAgIGFza0ZpbmlzaDogZmFsc2UsXHJcbiAgfSxcclxufTtcclxuXHJcbmNvbnN0IG1pbGxpc1RvTWludXRlc0FuZFNlY29uZHMgPSAodGltZSkgPT4ge1xyXG4gIGNvbnN0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHRpbWUgLyA2MCk7XHJcbiAgY29uc3Qgc2Vjb25kcyA9IHRpbWUgLSBtaW51dGVzICogNjA7XHJcbiAgcmV0dXJuIGAke21pbnV0ZXN9OiR7c2Vjb25kcyA8IDEwID8gJzAnIDogJyd9JHtzZWNvbmRzfWA7XHJcbn07XHJcblxyXG5jb25zdCB1cGRhdGVTdGF0ZSA9IChzdGF0ZSwgbW9kZU5hbWUpID0+IHtcclxuICBtb2RlTWFwcGluZ1ttb2RlTmFtZV0udGltZSA9IHRpbWVNYW5hZ2VyW21vZGVOYW1lXTtcclxuICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMoeyAuLi5zdGF0ZSwgbW9kZU5hbWUsIC4uLm1vZGVNYXBwaW5nW21vZGVOYW1lXSB9KTtcclxuICBlbnRyaWVzLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgc3RhdGVba2V5XSA9IHZhbHVlO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0TW9kZSA9IChjdXJyZW50LCBvcGVyYXRpb24pID0+IHtcclxuICBjb25zdCBtb2RlcyA9IFsncHJlV29yaycsICd3b3JrJywgJ3ByZVJlbGF4JywgJ3JlbGF4J107XHJcbiAgY29uc3QgY3VycmVudElkID0gbW9kZXMuaW5kZXhPZihjdXJyZW50KTtcclxuICBsZXQgbmV3SWQ7XHJcbiAgc3dpdGNoIChvcGVyYXRpb24pIHtcclxuICAgIGNhc2UgJ25leHQnOlxyXG4gICAgICBuZXdJZCA9IChtb2Rlc1tjdXJyZW50SWQgKyAxXSA/IGN1cnJlbnRJZCArIDEgOiAwKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdwcmV2JzpcclxuICAgICAgbmV3SWQgPSBjdXJyZW50SWQgLSAxO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ3RvU3RhcnQnOlxyXG4gICAgICBuZXdJZCA9IDA7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIG9wZXJhdGlvbjogJHtvcGVyYXRpb259YCk7XHJcbiAgfVxyXG4gIHJldHVybiBtb2Rlc1tuZXdJZF07XHJcbn07XHJcblxyXG5jb25zdCB0aW1lckZ1bmMgPSAoc3RhdGUpID0+IHtcclxuICBpZiAoc3RhdGUudGltZSAhPT0gMCkge1xyXG4gICAgc3RhdGUudGltZSAtPSAxO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBzdGF0ZS50aW1lID0gMDtcclxuICBpZiAoc3RhdGUubW9kZU5hbWUgPT09ICd3b3JrJykge1xyXG4gICAgc3RhdGUudGFza0lzRG9uZSgpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBjbGVhckludGVydmFsKHN0YXRlLnRpbWVyUnVuZXIpO1xyXG4gIHNldFRpbWVvdXQoKCkgPT4gdXBkYXRlU3RhdGUoc3RhdGUsIGdldE1vZGUoc3RhdGUubW9kZU5hbWUsICduZXh0JyksIDEwMDApKTtcclxufTtcclxuXHJcbmNvbnN0IHNldFRpbWVyID0gKHN0YXRlKSA9PiBzZXRJbnRlcnZhbCh0aW1lckZ1bmMsIDEwMDAsIHN0YXRlKTtcclxuXHJcbmNvbnN0IGV2ZW50QnV0dG9uc0Z1bmN0aW9ucyA9IHtcclxuICBzdGFydDogKHN0YXRlKSA9PiB7XHJcbiAgICB1cGRhdGVTdGF0ZShzdGF0ZSwgZ2V0TW9kZShzdGF0ZS5tb2RlTmFtZSwgJ25leHQnKSk7XHJcbiAgICBzdGF0ZS50aW1lclJ1bmVyID0gc2V0VGltZXIoc3RhdGUpO1xyXG4gIH0sXHJcbiAgcGF1c2VQbGF5OiAoc3RhdGUpID0+IHtcclxuICAgIHN0YXRlLm9uUGF1c2UgPSAhc3RhdGUub25QYXVzZTtcclxuICAgIGlmIChzdGF0ZS5vblBhdXNlKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwoc3RhdGUudGltZXJSdW5lcik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHN0YXRlLnRpbWVyUnVuZXIgPSBzZXRUaW1lcihzdGF0ZSk7XHJcbiAgfSxcclxuICBmaW5pc2g6IChzdGF0ZSkgPT4ge1xyXG4gICAgaWYgKHN0YXRlLm1vZGVOYW1lID09PSAnd29yaycpIHtcclxuICAgICAgc3RhdGUudGFza0lzRG9uZSgpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjbGVhckludGVydmFsKHN0YXRlLnRpbWVyUnVuZXIpO1xyXG4gICAgdXBkYXRlU3RhdGUoc3RhdGUsIGdldE1vZGUoc3RhdGUubW9kZU5hbWUsICduZXh0JykpO1xyXG4gIH0sXHJcbiAgcmVzdGFydDogKHN0YXRlKSA9PiB7XHJcbiAgICBjbGVhckludGVydmFsKHN0YXRlLnRpbWVyUnVuZXIpO1xyXG4gICAgdXBkYXRlU3RhdGUoc3RhdGUsIGdldE1vZGUoc3RhdGUubW9kZU5hbWUsICdwcmV2JykpO1xyXG4gIH0sXHJcbiAgc2tpcDogKHN0YXRlKSA9PiB7XHJcbiAgICBjbGVhckludGVydmFsKHN0YXRlLnRpbWVyUnVuZXIpO1xyXG4gICAgdXBkYXRlU3RhdGUoc3RhdGUsIGdldE1vZGUoc3RhdGUubW9kZU5hbWUsICd0b1N0YXJ0JykpO1xyXG4gIH0sXHJcbn07XHJcblxyXG5jb25zdCByZW5kZXIgPSB7XHJcbiAgYmdDb2xvcjogKGNvbnRhaW5lcnMpID0+IGNvbnRhaW5lcnMuZm9yRWFjaCgoY29udGFpbmVyKSA9PiB7XHJcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LnRvZ2dsZSgncmVkJyk7XHJcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LnRvZ2dsZSgnZ3JlZW4nKTtcclxuICB9KSxcclxuICBidXR0b25zOiAoc3RhdGUsIGNvbnRhaW5lcikgPT4ge1xyXG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xyXG4gICAgc3RhdGUuYnV0dG9ucy5mb3JFYWNoKCh0eXBlKSA9PiB7XHJcbiAgICAgIGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICBidXR0b25Db250YWluZXIuY2xhc3NMaXN0LmFkZCh0eXBlKTtcclxuICAgICAgYnV0dG9uQ29udGFpbmVyLmRhdGFzZXQuYnV0dG9uVHlwZSA9IHR5cGU7XHJcbiAgICAgIGJ1dHRvbkNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICh7IHRhcmdldCwgY3VycmVudFRhcmdldCB9KSA9PiB7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRUYXJnZXQgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgaWYgKHR5cGUgPT09ICdmaW5pc2gnKSB7XHJcbiAgICAgICAgICAgIGlmIChzdGF0ZS5hc2tGaW5pc2gpIHJldHVybjtcclxuICAgICAgICAgICAgc3RhdGUuYXNrRmluaXNoID0gdHJ1ZTtcclxuICAgICAgICAgICAgY29uc3QgY29uZmlybWVyID0gbmV3IENvbmZpcm1hdGlvbllOKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuc3dlciA9IGNvbmZpcm1lci5hc2sodGFyZ2V0LnBhcmVudE5vZGUpO1xyXG4gICAgICAgICAgICB3YXRjaChhbnN3ZXIsICd2YWx1ZScsICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25maXJtZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgaWYgKGFuc3dlci52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRCdXR0b25zRnVuY3Rpb25zW3R5cGVdKHN0YXRlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgc3RhdGUuYXNrRmluaXNoID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBldmVudEJ1dHRvbnNGdW5jdGlvbnNbdHlwZV0oc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b25Db250YWluZXIpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICB0aW1lOiAoeyB0aW1lIH0sIGNvbnRhaW5lcikgPT4ge1xyXG4gICAgY29udGFpbmVyLnRleHRDb250ZW50ID0gbWlsbGlzVG9NaW51dGVzQW5kU2Vjb25kcyh0aW1lKTtcclxuICB9LFxyXG4gIHBhdXNlUGxheTogKHsgb25QYXVzZSB9LCBjb250YWluZXIpID0+IHtcclxuICAgIGlmIChvblBhdXNlID09PSBudWxsKSByZXR1cm47XHJcbiAgICBjb25zdCBwYXVzZVBsYXlCdXR0b24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2RhdGEtYnV0dG9uLXR5cGU9XCJwYXVzZVBsYXlcIl0nKTtcclxuICAgIHBhdXNlUGxheUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKG9uUGF1c2UgPyAncGF1c2UnIDogJ3BsYXknKTtcclxuICAgIHBhdXNlUGxheUJ1dHRvbi5jbGFzc0xpc3QuYWRkKG9uUGF1c2UgPyAncGxheScgOiAncGF1c2UnKTtcclxuICB9LFxyXG59O1xyXG5cclxuY29uc3Qgc3RhdGUgPSB7fTtcclxuXHJcbmNvbnN0IGluaXQgPSAobWFpblN0YXRlKSA9PiB7XHJcbiAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZGVyJyk7XHJcbiAgY29uc3QgdGltZXJDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1jb250YWluZXI9XCJ0aW1lci1jb250YWluZXJcIl0nKTtcclxuICBjb25zdCB0aW1lWm9uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNvbnRhaW5lcj1cInRpbWUtem9uZVwiXScpO1xyXG4gIGNvbnN0IGJ1dHRvbnNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1jb250YWluZXI9XCJidXR0b25zXCJdJyk7XHJcblxyXG4gIGNvbnN0IGVsZW1lbnRzID0ge1xyXG4gICAgaGVhZGVyLFxyXG4gICAgdGltZXJDb250YWluZXIsXHJcbiAgICB0aW1lWm9uZSxcclxuICAgIGJ1dHRvbnNDb250YWluZXIsXHJcbiAgfTtcclxuXHJcbiAgd2F0Y2goc3RhdGUsICdiZ0NvbG9yJywgKCkgPT4gcmVuZGVyLmJnQ29sb3IoW2VsZW1lbnRzLmhlYWRlciwgZWxlbWVudHMudGltZXJDb250YWluZXJdKSk7XHJcbiAgd2F0Y2goc3RhdGUsICdidXR0b25zJywgKCkgPT4gcmVuZGVyLmJ1dHRvbnMoc3RhdGUsIGVsZW1lbnRzLmJ1dHRvbnNDb250YWluZXIpKTtcclxuICB3YXRjaChzdGF0ZSwgJ3RpbWUnLCAoKSA9PiByZW5kZXIudGltZShzdGF0ZSwgZWxlbWVudHMudGltZVpvbmUpKTtcclxuICB3YXRjaChzdGF0ZSwgJ29uUGF1c2UnLCAoKSA9PiByZW5kZXIucGF1c2VQbGF5KHN0YXRlLCBlbGVtZW50cy5idXR0b25zQ29udGFpbmVyKSk7XHJcblxyXG4gIHVwZGF0ZVN0YXRlKHN0YXRlLCAncHJlV29yaycpO1xyXG5cclxuICBzdGF0ZS50YXNrSXNEb25lID0gKCkgPT4ge1xyXG4gICAgbWFpblN0YXRlLmlzRG9uZSA9ICFtYWluU3RhdGUuaXNEb25lO1xyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBydW4gPSAoKSA9PiB7XHJcbiAgY2xlYXJJbnRlcnZhbChzdGF0ZS50aW1lclJ1bmVyKTtcclxuICB1cGRhdGVTdGF0ZShzdGF0ZSwgJ3dvcmsnKTtcclxuICBzdGF0ZS50aW1lclJ1bmVyID0gc2V0VGltZXIoc3RhdGUpO1xyXG59O1xyXG5jb25zdCBzdG9wID0gKCkgPT4ge1xyXG4gIGNsZWFySW50ZXJ2YWwoc3RhdGUudGltZXJSdW5lcik7XHJcbiAgdXBkYXRlU3RhdGUoc3RhdGUsIGdldE1vZGUoc3RhdGUubW9kZU5hbWUsICduZXh0JykpO1xyXG59O1xyXG5cclxuY29uc3QgVGltZXIgPSB7XHJcbiAgaW5pdCwgcnVuLCBzdG9wLCB0aW1lTWFuYWdlcixcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRpbWVyO1xyXG4iXX0=