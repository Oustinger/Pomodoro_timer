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
  console.log('updateState', modeName, modeMapping[modeName].time);
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
  state.timerRuner = setTimer();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2pzU3JjL3NjcmlwdHMvVGltZXIuanMiXSwibmFtZXMiOlsid2F0Y2giLCJXYXRjaEpTIiwidGltZU1hbmFnZXIiLCJwcmVXb3JrIiwid29yayIsInByZVJlbGF4IiwicmVsYXgiLCJsb25nQnJlYWsiLCJzaG9ydEJyZWFrIiwibW9kZU1hcHBpbmciLCJ0aW1lIiwiYnV0dG9ucyIsImJnQ29sb3IiLCJvblBhdXNlIiwiZm9yVGltZXIiLCJmb3JTa2lwIiwiYXNrRmluaXNoIiwibWlsbGlzVG9NaW51dGVzQW5kU2Vjb25kcyIsIm1pbnV0ZXMiLCJNYXRoIiwiZmxvb3IiLCJzZWNvbmRzIiwidXBkYXRlU3RhdGUiLCJzdGF0ZSIsIm1vZGVOYW1lIiwiZW50cmllcyIsIk9iamVjdCIsImZvckVhY2giLCJrZXkiLCJ2YWx1ZSIsImNvbnNvbGUiLCJsb2ciLCJnZXRNb2RlIiwiY3VycmVudCIsIm9wZXJhdGlvbiIsIm1vZGVzIiwiY3VycmVudElkIiwiaW5kZXhPZiIsIm5ld0lkIiwiRXJyb3IiLCJ0aW1lckZ1bmMiLCJ0YXNrSXNEb25lIiwiY2xlYXJJbnRlcnZhbCIsInRpbWVyUnVuZXIiLCJzZXRUaW1lb3V0Iiwic2V0VGltZXIiLCJzZXRJbnRlcnZhbCIsImV2ZW50QnV0dG9uc0Z1bmN0aW9ucyIsInN0YXJ0IiwicGF1c2VQbGF5IiwiZmluaXNoIiwicmVzdGFydCIsInNraXAiLCJyZW5kZXIiLCJjb250YWluZXJzIiwiY29udGFpbmVyIiwiY2xhc3NMaXN0IiwidG9nZ2xlIiwiaW5uZXJIVE1MIiwidHlwZSIsImJ1dHRvbkNvbnRhaW5lciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImFkZCIsImRhdGFzZXQiLCJidXR0b25UeXBlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJjb25maXJtZXIiLCJDb25maXJtYXRpb25ZTiIsImFuc3dlciIsImFzayIsInBhcmVudE5vZGUiLCJyZW1vdmUiLCJhcHBlbmRDaGlsZCIsInRleHRDb250ZW50IiwicGF1c2VQbGF5QnV0dG9uIiwicXVlcnlTZWxlY3RvciIsImluaXQiLCJtYWluU3RhdGUiLCJoZWFkZXIiLCJ0aW1lckNvbnRhaW5lciIsInRpbWVab25lIiwiYnV0dG9uc0NvbnRhaW5lciIsImVsZW1lbnRzIiwiaXNEb25lIiwicnVuIiwic3RvcCIsIlRpbWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFUUEsSyxHQUFVQyxtQixDQUFWRCxLO0FBRVIsSUFBTUUsV0FBVyxHQUFHO0FBQ2xCQyxFQUFBQSxPQUFPLEVBQUUsSUFEUztBQUVsQkMsRUFBQUEsSUFBSSxFQUFFLElBRlk7QUFHbEJDLEVBQUFBLFFBQVEsRUFBRSxHQUhRO0FBSWxCQyxFQUFBQSxLQUFLLEVBQUU7QUFKVyxDQUFwQjs7QUFNQUosV0FBVyxDQUFDSyxTQUFaLEdBQXdCLFlBQU07QUFDNUJMLEVBQUFBLFdBQVcsQ0FBQ0csUUFBWixHQUF1QixHQUF2QjtBQUNBSCxFQUFBQSxXQUFXLENBQUNJLEtBQVosR0FBb0IsR0FBcEI7QUFDRCxDQUhEOztBQUlBSixXQUFXLENBQUNNLFVBQVosR0FBeUIsWUFBTTtBQUM3Qk4sRUFBQUEsV0FBVyxDQUFDRyxRQUFaLEdBQXVCLEdBQXZCO0FBQ0FILEVBQUFBLFdBQVcsQ0FBQ0ksS0FBWixHQUFvQixHQUFwQjtBQUNELENBSEQ7O0FBS0EsSUFBTUcsV0FBVyxHQUFHO0FBQ2xCTixFQUFBQSxPQUFPLEVBQUU7QUFDUE8sSUFBQUEsSUFBSSxFQUFFUixXQUFXLENBQUNFLElBRFg7QUFFUE8sSUFBQUEsT0FBTyxFQUFFLENBQUMsT0FBRCxDQUZGO0FBR1BDLElBQUFBLE9BQU8sRUFBRSxLQUhGO0FBSVBDLElBQUFBLE9BQU8sRUFBRSxJQUpGO0FBS1BDLElBQUFBLFFBQVEsRUFBRSxLQUxIO0FBTVBDLElBQUFBLE9BQU8sRUFBRSxJQU5GO0FBT1BDLElBQUFBLFNBQVMsRUFBRTtBQVBKLEdBRFM7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LCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgV2F0Y2hKUyBmcm9tICd3YXRjaGpzJztcclxuaW1wb3J0IENvbmZpcm1hdGlvbllOIGZyb20gJy4vY2xhc3Nlcy9Db25maXJtYXRpb25ZTic7XHJcblxyXG5jb25zdCB7IHdhdGNoIH0gPSBXYXRjaEpTO1xyXG5cclxuY29uc3QgdGltZU1hbmFnZXIgPSB7XHJcbiAgcHJlV29yazogMTUwMCxcclxuICB3b3JrOiAxNTAwLFxyXG4gIHByZVJlbGF4OiAzMDAsXHJcbiAgcmVsYXg6IDMwMCxcclxufTtcclxudGltZU1hbmFnZXIubG9uZ0JyZWFrID0gKCkgPT4ge1xyXG4gIHRpbWVNYW5hZ2VyLnByZVJlbGF4ID0gOTAwO1xyXG4gIHRpbWVNYW5hZ2VyLnJlbGF4ID0gOTAwO1xyXG59O1xyXG50aW1lTWFuYWdlci5zaG9ydEJyZWFrID0gKCkgPT4ge1xyXG4gIHRpbWVNYW5hZ2VyLnByZVJlbGF4ID0gMzAwO1xyXG4gIHRpbWVNYW5hZ2VyLnJlbGF4ID0gMzAwO1xyXG59O1xyXG5cclxuY29uc3QgbW9kZU1hcHBpbmcgPSB7XHJcbiAgcHJlV29yazoge1xyXG4gICAgdGltZTogdGltZU1hbmFnZXIud29yayxcclxuICAgIGJ1dHRvbnM6IFsnc3RhcnQnXSxcclxuICAgIGJnQ29sb3I6ICdyZWQnLFxyXG4gICAgb25QYXVzZTogbnVsbCxcclxuICAgIGZvclRpbWVyOiBmYWxzZSxcclxuICAgIGZvclNraXA6IG51bGwsXHJcbiAgICBhc2tGaW5pc2g6IGZhbHNlLFxyXG4gIH0sXHJcbiAgd29yazoge1xyXG4gICAgdGltZTogdGltZU1hbmFnZXIud29yayxcclxuICAgIGJ1dHRvbnM6IFsncGF1c2VQbGF5JywgJ2ZpbmlzaCcsICdyZXN0YXJ0J10sXHJcbiAgICBiZ0NvbG9yOiAncmVkJyxcclxuICAgIG9uUGF1c2U6IGZhbHNlLFxyXG4gICAgZm9yVGltZXI6IHRydWUsXHJcbiAgICBmb3JTa2lwOiB0cnVlLFxyXG4gICAgYXNrRmluaXNoOiBmYWxzZSxcclxuICB9LFxyXG4gIHByZVJlbGF4OiB7XHJcbiAgICB0aW1lOiB0aW1lTWFuYWdlci5icmVhayxcclxuICAgIGJ1dHRvbnM6IFsnc3RhcnQnLCAnc2tpcCddLFxyXG4gICAgYmdDb2xvcjogJ2dyZWVuJyxcclxuICAgIG9uUGF1c2U6IG51bGwsXHJcbiAgICBmb3JUaW1lcjogZmFsc2UsXHJcbiAgICBmb3JTa2lwOiB0cnVlLFxyXG4gICAgYXNrRmluaXNoOiBmYWxzZSxcclxuICB9LFxyXG4gIHJlbGF4OiB7XHJcbiAgICB0aW1lOiB0aW1lTWFuYWdlci5icmVhayxcclxuICAgIGJ1dHRvbnM6IFsncGF1c2VQbGF5JywgJ2ZpbmlzaCcsICdyZXN0YXJ0J10sXHJcbiAgICBiZ0NvbG9yOiAnZ3JlZW4nLFxyXG4gICAgb25QYXVzZTogZmFsc2UsXHJcbiAgICBmb3JUaW1lcjogdHJ1ZSxcclxuICAgIGZvclNraXA6IHRydWUsXHJcbiAgICBhc2tGaW5pc2g6IGZhbHNlLFxyXG4gIH0sXHJcbn07XHJcblxyXG5jb25zdCBtaWxsaXNUb01pbnV0ZXNBbmRTZWNvbmRzID0gKHRpbWUpID0+IHtcclxuICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcih0aW1lIC8gNjApO1xyXG4gIGNvbnN0IHNlY29uZHMgPSB0aW1lIC0gbWludXRlcyAqIDYwO1xyXG4gIHJldHVybiBgJHttaW51dGVzfToke3NlY29uZHMgPCAxMCA/ICcwJyA6ICcnfSR7c2Vjb25kc31gO1xyXG59O1xyXG5cclxuY29uc3QgdXBkYXRlU3RhdGUgPSAoc3RhdGUsIG1vZGVOYW1lKSA9PiB7XHJcbiAgbW9kZU1hcHBpbmdbbW9kZU5hbWVdLnRpbWUgPSB0aW1lTWFuYWdlclttb2RlTmFtZV07XHJcbiAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKHsgLi4uc3RhdGUsIG1vZGVOYW1lLCAuLi5tb2RlTWFwcGluZ1ttb2RlTmFtZV0gfSk7XHJcbiAgZW50cmllcy5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcclxuICAgIHN0YXRlW2tleV0gPSB2YWx1ZTtcclxuICB9KTtcclxuICBjb25zb2xlLmxvZygndXBkYXRlU3RhdGUnLCBtb2RlTmFtZSwgbW9kZU1hcHBpbmdbbW9kZU5hbWVdLnRpbWUpO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0TW9kZSA9IChjdXJyZW50LCBvcGVyYXRpb24pID0+IHtcclxuICBjb25zdCBtb2RlcyA9IFsncHJlV29yaycsICd3b3JrJywgJ3ByZVJlbGF4JywgJ3JlbGF4J107XHJcbiAgY29uc3QgY3VycmVudElkID0gbW9kZXMuaW5kZXhPZihjdXJyZW50KTtcclxuICBsZXQgbmV3SWQ7XHJcbiAgc3dpdGNoIChvcGVyYXRpb24pIHtcclxuICAgIGNhc2UgJ25leHQnOlxyXG4gICAgICBuZXdJZCA9IChtb2Rlc1tjdXJyZW50SWQgKyAxXSA/IGN1cnJlbnRJZCArIDEgOiAwKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdwcmV2JzpcclxuICAgICAgbmV3SWQgPSBjdXJyZW50SWQgLSAxO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ3RvU3RhcnQnOlxyXG4gICAgICBuZXdJZCA9IDA7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIG9wZXJhdGlvbjogJHtvcGVyYXRpb259YCk7XHJcbiAgfVxyXG4gIHJldHVybiBtb2Rlc1tuZXdJZF07XHJcbn07XHJcblxyXG5jb25zdCB0aW1lckZ1bmMgPSAoc3RhdGUpID0+IHtcclxuICBpZiAoc3RhdGUudGltZSAhPT0gMCkge1xyXG4gICAgc3RhdGUudGltZSAtPSAxO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBzdGF0ZS50aW1lID0gMDtcclxuICBpZiAoc3RhdGUubW9kZU5hbWUgPT09ICd3b3JrJykgc3RhdGUudGFza0lzRG9uZSgpO1xyXG4gIGNsZWFySW50ZXJ2YWwoc3RhdGUudGltZXJSdW5lcik7XHJcbiAgc2V0VGltZW91dCgoKSA9PiB1cGRhdGVTdGF0ZShzdGF0ZSwgZ2V0TW9kZShzdGF0ZS5tb2RlTmFtZSwgJ25leHQnKSwgMTAwMCkpO1xyXG59O1xyXG5cclxuY29uc3Qgc2V0VGltZXIgPSAoKSA9PiBzZXRJbnRlcnZhbCh0aW1lckZ1bmMsIDEwMDAsIHN0YXRlKTtcclxuXHJcbmNvbnN0IGV2ZW50QnV0dG9uc0Z1bmN0aW9ucyA9IHtcclxuICBzdGFydDogKHN0YXRlKSA9PiB7XHJcbiAgICB1cGRhdGVTdGF0ZShzdGF0ZSwgZ2V0TW9kZShzdGF0ZS5tb2RlTmFtZSwgJ25leHQnKSk7XHJcbiAgICBzdGF0ZS50aW1lclJ1bmVyID0gc2V0VGltZXIoKTtcclxuICB9LFxyXG4gIHBhdXNlUGxheTogKHN0YXRlKSA9PiB7XHJcbiAgICBzdGF0ZS5vblBhdXNlID0gIXN0YXRlLm9uUGF1c2U7XHJcbiAgICBpZiAoc3RhdGUub25QYXVzZSkge1xyXG4gICAgICBjbGVhckludGVydmFsKHN0YXRlLnRpbWVyUnVuZXIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBzdGF0ZS50aW1lclJ1bmVyID0gc2V0VGltZXIoKTtcclxuICB9LFxyXG4gIGZpbmlzaDogKHN0YXRlKSA9PiB7XHJcbiAgICBpZiAoc3RhdGUubW9kZU5hbWUgPT09ICd3b3JrJykge1xyXG4gICAgICBzdGF0ZS50YXNrSXNEb25lKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNsZWFySW50ZXJ2YWwoc3RhdGUudGltZXJSdW5lcik7XHJcbiAgICB1cGRhdGVTdGF0ZShzdGF0ZSwgZ2V0TW9kZShzdGF0ZS5tb2RlTmFtZSwgJ25leHQnKSk7XHJcbiAgfSxcclxuICByZXN0YXJ0OiAoc3RhdGUpID0+IHtcclxuICAgIGNsZWFySW50ZXJ2YWwoc3RhdGUudGltZXJSdW5lcik7XHJcbiAgICB1cGRhdGVTdGF0ZShzdGF0ZSwgZ2V0TW9kZShzdGF0ZS5tb2RlTmFtZSwgJ3ByZXYnKSk7XHJcbiAgfSxcclxuICBza2lwOiAoc3RhdGUpID0+IHtcclxuICAgIGNsZWFySW50ZXJ2YWwoc3RhdGUudGltZXJSdW5lcik7XHJcbiAgICB1cGRhdGVTdGF0ZShzdGF0ZSwgZ2V0TW9kZShzdGF0ZS5tb2RlTmFtZSwgJ3RvU3RhcnQnKSk7XHJcbiAgfSxcclxufTtcclxuXHJcbmNvbnN0IHJlbmRlciA9IHtcclxuICBiZ0NvbG9yOiAoY29udGFpbmVycykgPT4gY29udGFpbmVycy5mb3JFYWNoKChjb250YWluZXIpID0+IHtcclxuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QudG9nZ2xlKCdyZWQnKTtcclxuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QudG9nZ2xlKCdncmVlbicpO1xyXG4gIH0pLFxyXG4gIGJ1dHRvbnM6IChzdGF0ZSwgY29udGFpbmVyKSA9PiB7XHJcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgICBzdGF0ZS5idXR0b25zLmZvckVhY2goKHR5cGUpID0+IHtcclxuICAgICAgY29uc3QgYnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgIGJ1dHRvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHR5cGUpO1xyXG4gICAgICBidXR0b25Db250YWluZXIuZGF0YXNldC5idXR0b25UeXBlID0gdHlwZTtcclxuICAgICAgYnV0dG9uQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKHsgdGFyZ2V0LCBjdXJyZW50VGFyZ2V0IH0pID0+IHtcclxuICAgICAgICBpZiAoY3VycmVudFRhcmdldCA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ2ZpbmlzaCcpIHtcclxuICAgICAgICAgICAgaWYgKHN0YXRlLmFza0ZpbmlzaCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBzdGF0ZS5hc2tGaW5pc2ggPSB0cnVlO1xyXG4gICAgICAgICAgICBjb25zdCBjb25maXJtZXIgPSBuZXcgQ29uZmlybWF0aW9uWU4oKTtcclxuICAgICAgICAgICAgY29uc3QgYW5zd2VyID0gY29uZmlybWVyLmFzayh0YXJnZXQucGFyZW50Tm9kZSk7XHJcbiAgICAgICAgICAgIHdhdGNoKGFuc3dlciwgJ3ZhbHVlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbmZpcm1lci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICBpZiAoYW5zd2VyLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudEJ1dHRvbnNGdW5jdGlvbnNbdHlwZV0oc3RhdGUpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBzdGF0ZS5hc2tGaW5pc2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGV2ZW50QnV0dG9uc0Z1bmN0aW9uc1t0eXBlXShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbkNvbnRhaW5lcik7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIHRpbWU6ICh7IHRpbWUgfSwgY29udGFpbmVyKSA9PiB7XHJcbiAgICBjb250YWluZXIudGV4dENvbnRlbnQgPSBtaWxsaXNUb01pbnV0ZXNBbmRTZWNvbmRzKHRpbWUpO1xyXG4gIH0sXHJcbiAgcGF1c2VQbGF5OiAoeyBvblBhdXNlIH0sIGNvbnRhaW5lcikgPT4ge1xyXG4gICAgaWYgKG9uUGF1c2UgPT09IG51bGwpIHJldHVybjtcclxuICAgIGNvbnN0IHBhdXNlUGxheUJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1idXR0b24tdHlwZT1cInBhdXNlUGxheVwiXScpO1xyXG4gICAgcGF1c2VQbGF5QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUob25QYXVzZSA/ICdwYXVzZScgOiAncGxheScpO1xyXG4gICAgcGF1c2VQbGF5QnV0dG9uLmNsYXNzTGlzdC5hZGQob25QYXVzZSA/ICdwbGF5JyA6ICdwYXVzZScpO1xyXG4gIH0sXHJcbn07XHJcblxyXG5jb25zdCBzdGF0ZSA9IHt9O1xyXG5cclxuY29uc3QgaW5pdCA9IChtYWluU3RhdGUpID0+IHtcclxuICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkZXInKTtcclxuICBjb25zdCB0aW1lckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNvbnRhaW5lcj1cInRpbWVyLWNvbnRhaW5lclwiXScpO1xyXG4gIGNvbnN0IHRpbWVab25lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtY29udGFpbmVyPVwidGltZS16b25lXCJdJyk7XHJcbiAgY29uc3QgYnV0dG9uc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNvbnRhaW5lcj1cImJ1dHRvbnNcIl0nKTtcclxuXHJcbiAgY29uc3QgZWxlbWVudHMgPSB7IGhlYWRlciwgdGltZXJDb250YWluZXIsIHRpbWVab25lLCBidXR0b25zQ29udGFpbmVyIH07XHJcblxyXG4gIHdhdGNoKHN0YXRlLCAnYmdDb2xvcicsICgpID0+IHJlbmRlci5iZ0NvbG9yKFtlbGVtZW50cy5oZWFkZXIsIGVsZW1lbnRzLnRpbWVyQ29udGFpbmVyXSkpO1xyXG4gIHdhdGNoKHN0YXRlLCAnYnV0dG9ucycsICgpID0+IHJlbmRlci5idXR0b25zKHN0YXRlLCBlbGVtZW50cy5idXR0b25zQ29udGFpbmVyKSk7XHJcbiAgd2F0Y2goc3RhdGUsICd0aW1lJywgKCkgPT4gcmVuZGVyLnRpbWUoc3RhdGUsIGVsZW1lbnRzLnRpbWVab25lKSk7XHJcbiAgd2F0Y2goc3RhdGUsICdvblBhdXNlJywgKCkgPT4gcmVuZGVyLnBhdXNlUGxheShzdGF0ZSwgZWxlbWVudHMuYnV0dG9uc0NvbnRhaW5lcikpO1xyXG5cclxuICB1cGRhdGVTdGF0ZShzdGF0ZSwgJ3ByZVdvcmsnKTtcclxuXHJcbiAgc3RhdGUudGFza0lzRG9uZSA9ICgpID0+IHtcclxuICAgIG1haW5TdGF0ZS5pc0RvbmUgPSAhbWFpblN0YXRlLmlzRG9uZTtcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3QgcnVuID0gKCkgPT4ge1xyXG4gIGNsZWFySW50ZXJ2YWwoc3RhdGUudGltZXJSdW5lcik7XHJcbiAgdXBkYXRlU3RhdGUoc3RhdGUsICd3b3JrJyk7XHJcbiAgc3RhdGUudGltZXJSdW5lciA9IHNldFRpbWVyKCk7XHJcbn07XHJcbmNvbnN0IHN0b3AgPSAoKSA9PiB7XHJcbiAgY2xlYXJJbnRlcnZhbChzdGF0ZS50aW1lclJ1bmVyKTtcclxuICB1cGRhdGVTdGF0ZShzdGF0ZSwgZ2V0TW9kZShzdGF0ZS5tb2RlTmFtZSwgJ25leHQnKSk7XHJcbn1cclxuXHJcbmNvbnN0IFRpbWVyID0geyBpbml0LCBydW4sIHN0b3AsIHRpbWVNYW5hZ2VyIH07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUaW1lcjtcclxuIl19