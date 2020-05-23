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
  console.log('longBreak', timeManager.relax);
};

timeManager.shortBreak = function () {
  console.log('shortBreak');
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
  console.log('modeMapping: ', modeMapping[modeName].time);
  var entries = Object.entries(_objectSpread(_objectSpread({}, state), {}, {
    modeName: modeName
  }, modeMapping[modeName]));
  entries.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    state[key] = value;
  });
  console.log('new-timer-state', state.modeName, state.time, modeMapping[modeName].time);
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
  console.log('time: ', state.time);

  if (state.time !== 0) {
    state.time -= 1;
    return;
  }

  state.time = 0;
  console.log('time 0:');
  if (state.modeName === 'work') state.taskIsDone();
  clearInterval(state.timerRuner); // updateState(state, getMode(state.modeName, 'next'));

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
    console.log('render time: ', _time);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2pzU3JjL3NjcmlwdHMvVGltZXIuanMiXSwibmFtZXMiOlsid2F0Y2giLCJXYXRjaEpTIiwiZW1wdHlGdW5jIiwiYXNrQ29uZmlybVlOIiwicGFyZW50RWxlbSIsIm9uWWVzIiwib25ObyIsImFyZ3MiLCJjb25maXJtQ29udGFpbmVyIiwiQ29uZmlybWF0aW9uWU4iLCJhbnN3ZXIiLCJyZW1vdmUiLCJ2YWx1ZSIsImFzayIsInRpbWVNYW5hZ2VyIiwicHJlV29yayIsIndvcmsiLCJwcmVSZWxheCIsInJlbGF4IiwibG9uZ0JyZWFrIiwiY29uc29sZSIsImxvZyIsInNob3J0QnJlYWsiLCJtb2RlTWFwcGluZyIsInRpbWUiLCJidXR0b25zIiwiYmdDb2xvciIsIm9uUGF1c2UiLCJmb3JUaW1lciIsImZvclNraXAiLCJtaWxsaXNUb01pbnV0ZXNBbmRTZWNvbmRzIiwibWludXRlcyIsIk1hdGgiLCJmbG9vciIsInNlY29uZHMiLCJ1cGRhdGVTdGF0ZSIsInN0YXRlIiwibW9kZU5hbWUiLCJlbnRyaWVzIiwiT2JqZWN0IiwiZm9yRWFjaCIsImtleSIsImdldE1vZGUiLCJjdXJyZW50Iiwib3BlcmF0aW9uIiwibW9kZXMiLCJjdXJyZW50SWQiLCJpbmRleE9mIiwibmV3SWQiLCJFcnJvciIsInRpbWVyRnVuYyIsInRhc2tJc0RvbmUiLCJjbGVhckludGVydmFsIiwidGltZXJSdW5lciIsInNldFRpbWVvdXQiLCJzZXRUaW1lciIsInNldEludGVydmFsIiwiZXZlbnRCdXR0b25zRnVuY3Rpb25zIiwic3RhcnQiLCJwYXVzZVBsYXkiLCJmaW5pc2giLCJyZXN0YXJ0Iiwic3RvcCIsInNraXAiLCJyZW5kZXIiLCJjb250YWluZXIiLCJjb2xvciIsInNldEF0dHJpYnV0ZSIsImlubmVySFRNTCIsInR5cGUiLCJidXR0b25Db250YWluZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJkYXRhc2V0IiwiYnV0dG9uVHlwZSIsInRleHRDb250ZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInRhcmdldCIsImFwcGVuZENoaWxkIiwicGF1c2VQbGF5QnV0dG9uIiwicXVlcnlTZWxlY3RvciIsImluaXQiLCJtYWluU3RhdGUiLCJ0aW1lckNvbnRhaW5lciIsInRpbWVab25lIiwiYnV0dG9uc0NvbnRhaW5lciIsImVsZW1lbnRzIiwiaXNEb25lIiwicnVuIiwiVGltZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVRQSxLLEdBQVVDLG1CLENBQVZELEs7O0FBRVIsSUFBTUUsU0FBUyxHQUFHLFNBQVpBLFNBQVksR0FBTSxDQUFFLENBQTFCOztBQUVBLElBQU1DLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUNDLFVBQUQsRUFBYUMsS0FBYixFQUFvQkMsSUFBcEIsRUFBc0M7QUFBQSxvQ0FBVEMsSUFBUztBQUFUQSxJQUFBQSxJQUFTO0FBQUE7O0FBQ3pELE1BQU1DLGdCQUFnQixHQUFHLElBQUlDLDBCQUFKLEVBQXpCO0FBQ0FULEVBQUFBLEtBQUssQ0FBQ1EsZ0JBQWdCLENBQUNFLE1BQWxCLEVBQTBCLE9BQTFCLEVBQW1DLFlBQU07QUFDNUNGLElBQUFBLGdCQUFnQixDQUFDRyxNQUFqQjtBQUNBLFdBQVFILGdCQUFnQixDQUFDRSxNQUFqQixDQUF3QkUsS0FBeEIsR0FBZ0NQLEtBQUssTUFBTCxTQUFTRSxJQUFULENBQWhDLEdBQWlERCxJQUFJLE1BQUosU0FBUUMsSUFBUixDQUF6RDtBQUNELEdBSEksQ0FBTDtBQUlBQyxFQUFBQSxnQkFBZ0IsQ0FBQ0ssR0FBakIsQ0FBcUJULFVBQXJCO0FBQ0QsQ0FQRDs7QUFTQSxJQUFNVSxXQUFXLEdBQUc7QUFDbEJDLEVBQUFBLE9BQU8sRUFBRSxDQURTO0FBRWxCQyxFQUFBQSxJQUFJLEVBQUUsQ0FGWTtBQUdsQkMsRUFBQUEsUUFBUSxFQUFFLENBSFE7QUFJbEJDLEVBQUFBLEtBQUssRUFBRTtBQUpXLENBQXBCOztBQU1BSixXQUFXLENBQUNLLFNBQVosR0FB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bm8tY29uc29sZSAqL1xyXG5cclxuaW1wb3J0IFdhdGNoSlMgZnJvbSAnd2F0Y2hqcyc7XHJcbmltcG9ydCBDb25maXJtYXRpb25ZTiBmcm9tICcuL2NsYXNzZXMvQ29uZmlybWF0aW9uWU4nO1xyXG5cclxuY29uc3QgeyB3YXRjaCB9ID0gV2F0Y2hKUztcclxuXHJcbmNvbnN0IGVtcHR5RnVuYyA9ICgpID0+IHt9O1xyXG5cclxuY29uc3QgYXNrQ29uZmlybVlOID0gKHBhcmVudEVsZW0sIG9uWWVzLCBvbk5vLCAuLi5hcmdzKSA9PiB7XHJcbiAgY29uc3QgY29uZmlybUNvbnRhaW5lciA9IG5ldyBDb25maXJtYXRpb25ZTigpO1xyXG4gIHdhdGNoKGNvbmZpcm1Db250YWluZXIuYW5zd2VyLCAndmFsdWUnLCAoKSA9PiB7XHJcbiAgICBjb25maXJtQ29udGFpbmVyLnJlbW92ZSgpO1xyXG4gICAgcmV0dXJuIChjb25maXJtQ29udGFpbmVyLmFuc3dlci52YWx1ZSA/IG9uWWVzKC4uLmFyZ3MpIDogb25ObyguLi5hcmdzKSk7XHJcbiAgfSk7XHJcbiAgY29uZmlybUNvbnRhaW5lci5hc2socGFyZW50RWxlbSk7XHJcbn07XHJcblxyXG5jb25zdCB0aW1lTWFuYWdlciA9IHtcclxuICBwcmVXb3JrOiA1LFxyXG4gIHdvcms6IDUsXHJcbiAgcHJlUmVsYXg6IDUsXHJcbiAgcmVsYXg6IDUsXHJcbn07XHJcbnRpbWVNYW5hZ2VyLmxvbmdCcmVhayA9ICgpID0+IHtcclxuICB0aW1lTWFuYWdlci5wcmVSZWxheCA9IDEwO1xyXG4gIHRpbWVNYW5hZ2VyLnJlbGF4ID0gMTA7XHJcbiAgY29uc29sZS5sb2coJ2xvbmdCcmVhaycsIHRpbWVNYW5hZ2VyLnJlbGF4KTtcclxufTtcclxudGltZU1hbmFnZXIuc2hvcnRCcmVhayA9ICgpID0+IHtcclxuICBjb25zb2xlLmxvZygnc2hvcnRCcmVhaycpO1xyXG4gIHRpbWVNYW5hZ2VyLnByZVJlbGF4ID0gNTtcclxuICB0aW1lTWFuYWdlci5yZWxheCA9IDU7XHJcbn07XHJcblxyXG5jb25zdCBtb2RlTWFwcGluZyA9IHtcclxuICBwcmVXb3JrOiB7XHJcbiAgICB0aW1lOiB0aW1lTWFuYWdlci53b3JrLFxyXG4gICAgYnV0dG9uczogWydzdGFydCddLFxyXG4gICAgYmdDb2xvcjogJ3JlZCcsXHJcbiAgICBvblBhdXNlOiBudWxsLFxyXG4gICAgZm9yVGltZXI6IGZhbHNlLFxyXG4gICAgZm9yU2tpcDogbnVsbCxcclxuICB9LFxyXG4gIHdvcms6IHtcclxuICAgIHRpbWU6IHRpbWVNYW5hZ2VyLndvcmssXHJcbiAgICBidXR0b25zOiBbJ3BhdXNlUGxheScsICdmaW5pc2gnLCAncmVzdGFydCcsICdzdG9wJ10sXHJcbiAgICBiZ0NvbG9yOiAncmVkJyxcclxuICAgIG9uUGF1c2U6IGZhbHNlLFxyXG4gICAgZm9yVGltZXI6IHRydWUsXHJcbiAgICBmb3JTa2lwOiB0cnVlLFxyXG4gIH0sXHJcbiAgcHJlUmVsYXg6IHtcclxuICAgIHRpbWU6IHRpbWVNYW5hZ2VyLmJyZWFrLFxyXG4gICAgYnV0dG9uczogWydzdGFydCcsICdza2lwJ10sXHJcbiAgICBiZ0NvbG9yOiAnYmx1ZScsXHJcbiAgICBvblBhdXNlOiBudWxsLFxyXG4gICAgZm9yVGltZXI6IGZhbHNlLFxyXG4gICAgZm9yU2tpcDogdHJ1ZSxcclxuICB9LFxyXG4gIHJlbGF4OiB7XHJcbiAgICB0aW1lOiB0aW1lTWFuYWdlci5icmVhayxcclxuICAgIGJ1dHRvbnM6IFsncGF1c2VQbGF5JywgJ2ZpbmlzaCcsICdyZXN0YXJ0J10sXHJcbiAgICBiZ0NvbG9yOiAnYmx1ZScsXHJcbiAgICBvblBhdXNlOiBmYWxzZSxcclxuICAgIGZvclRpbWVyOiB0cnVlLFxyXG4gICAgZm9yU2tpcDogdHJ1ZSxcclxuICB9LFxyXG59O1xyXG5cclxuY29uc3QgbWlsbGlzVG9NaW51dGVzQW5kU2Vjb25kcyA9ICh0aW1lKSA9PiB7XHJcbiAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IodGltZSAvIDYwKTtcclxuICBjb25zdCBzZWNvbmRzID0gdGltZSAtIG1pbnV0ZXMgKiA2MDtcclxuICByZXR1cm4gYCR7bWludXRlc306JHtzZWNvbmRzIDwgMTAgPyAnMCcgOiAnJ30ke3NlY29uZHN9YDtcclxufTtcclxuXHJcbmNvbnN0IHVwZGF0ZVN0YXRlID0gKHN0YXRlLCBtb2RlTmFtZSkgPT4ge1xyXG4gIG1vZGVNYXBwaW5nW21vZGVOYW1lXS50aW1lID0gdGltZU1hbmFnZXJbbW9kZU5hbWVdO1xyXG4gIGNvbnNvbGUubG9nKCdtb2RlTWFwcGluZzogJywgbW9kZU1hcHBpbmdbbW9kZU5hbWVdLnRpbWUpO1xyXG4gIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyh7IC4uLnN0YXRlLCBtb2RlTmFtZSwgLi4ubW9kZU1hcHBpbmdbbW9kZU5hbWVdIH0pO1xyXG4gIGVudHJpZXMuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICBzdGF0ZVtrZXldID0gdmFsdWU7XHJcbiAgfSk7XHJcbiAgY29uc29sZS5sb2coJ25ldy10aW1lci1zdGF0ZScsIHN0YXRlLm1vZGVOYW1lLCBzdGF0ZS50aW1lLCBtb2RlTWFwcGluZ1ttb2RlTmFtZV0udGltZSk7XHJcbn07XHJcblxyXG5jb25zdCBnZXRNb2RlID0gKGN1cnJlbnQsIG9wZXJhdGlvbikgPT4ge1xyXG4gIGNvbnN0IG1vZGVzID0gWydwcmVXb3JrJywgJ3dvcmsnLCAncHJlUmVsYXgnLCAncmVsYXgnXTtcclxuICBjb25zdCBjdXJyZW50SWQgPSBtb2Rlcy5pbmRleE9mKGN1cnJlbnQpO1xyXG4gIGxldCBuZXdJZDtcclxuICBzd2l0Y2ggKG9wZXJhdGlvbikge1xyXG4gICAgY2FzZSAnbmV4dCc6XHJcbiAgICAgIG5ld0lkID0gKG1vZGVzW2N1cnJlbnRJZCArIDFdID8gY3VycmVudElkICsgMSA6IDApO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ3ByZXYnOlxyXG4gICAgICBuZXdJZCA9IGN1cnJlbnRJZCAtIDE7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAndG9TdGFydCc6XHJcbiAgICAgIG5ld0lkID0gMDtcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gb3BlcmF0aW9uOiAke29wZXJhdGlvbn1gKTtcclxuICB9XHJcbiAgcmV0dXJuIG1vZGVzW25ld0lkXTtcclxufTtcclxuXHJcbmNvbnN0IHRpbWVyRnVuYyA9IChzdGF0ZSkgPT4ge1xyXG4gIGNvbnNvbGUubG9nKCd0aW1lOiAnLCBzdGF0ZS50aW1lKTtcclxuICBpZiAoc3RhdGUudGltZSAhPT0gMCkge1xyXG4gICAgc3RhdGUudGltZSAtPSAxO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBzdGF0ZS50aW1lID0gMDtcclxuICBjb25zb2xlLmxvZygndGltZSAwOicpO1xyXG4gIGlmIChzdGF0ZS5tb2RlTmFtZSA9PT0gJ3dvcmsnKSBzdGF0ZS50YXNrSXNEb25lKCk7XHJcbiAgY2xlYXJJbnRlcnZhbChzdGF0ZS50aW1lclJ1bmVyKTtcclxuICAvLyB1cGRhdGVTdGF0ZShzdGF0ZSwgZ2V0TW9kZShzdGF0ZS5tb2RlTmFtZSwgJ25leHQnKSk7XHJcbiAgc2V0VGltZW91dCgoKSA9PiB1cGRhdGVTdGF0ZShzdGF0ZSwgZ2V0TW9kZShzdGF0ZS5tb2RlTmFtZSwgJ25leHQnKSwgMTAwMCkpO1xyXG59O1xyXG5cclxuY29uc3Qgc2V0VGltZXIgPSAoKSA9PiBzZXRJbnRlcnZhbCh0aW1lckZ1bmMsIDEwMDAsIHN0YXRlKTtcclxuXHJcbmNvbnN0IGV2ZW50QnV0dG9uc0Z1bmN0aW9ucyA9IHtcclxuICBzdGFydDogKHN0YXRlKSA9PiB7XHJcbiAgICB1cGRhdGVTdGF0ZShzdGF0ZSwgZ2V0TW9kZShzdGF0ZS5tb2RlTmFtZSwgJ25leHQnKSk7XHJcbiAgICBzdGF0ZS50aW1lclJ1bmVyID0gc2V0VGltZXIoKTtcclxuICB9LFxyXG4gIHBhdXNlUGxheTogKHN0YXRlKSA9PiB7XHJcbiAgICBzdGF0ZS5vblBhdXNlID0gIXN0YXRlLm9uUGF1c2U7XHJcbiAgICBpZiAoc3RhdGUub25QYXVzZSkge1xyXG4gICAgICBjbGVhckludGVydmFsKHN0YXRlLnRpbWVyUnVuZXIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBzdGF0ZS50aW1lclJ1bmVyID0gc2V0VGltZXIoKTtcclxuICB9LFxyXG4gIGZpbmlzaDogKHN0YXRlKSA9PiB7XHJcbiAgICBpZiAoc3RhdGUubW9kZU5hbWUgPT09ICd3b3JrJykgc3RhdGUudGFza0lzRG9uZSgpO1xyXG4gICAgY2xlYXJJbnRlcnZhbChzdGF0ZS50aW1lclJ1bmVyKTtcclxuICAgIHVwZGF0ZVN0YXRlKHN0YXRlLCBnZXRNb2RlKHN0YXRlLm1vZGVOYW1lLCAnbmV4dCcpKTtcclxuICB9LFxyXG4gIHJlc3RhcnQ6IChzdGF0ZSkgPT4ge1xyXG4gICAgY2xlYXJJbnRlcnZhbChzdGF0ZS50aW1lclJ1bmVyKTtcclxuICAgIHVwZGF0ZVN0YXRlKHN0YXRlLCBnZXRNb2RlKHN0YXRlLm1vZGVOYW1lLCAncHJldicpKTtcclxuICB9LFxyXG4gIHN0b3A6IChzdGF0ZSkgPT4ge1xyXG4gICAgY2xlYXJJbnRlcnZhbChzdGF0ZS50aW1lclJ1bmVyKTtcclxuICAgIHVwZGF0ZVN0YXRlKHN0YXRlLCBnZXRNb2RlKHN0YXRlLm1vZGVOYW1lLCAndG9TdGFydCcpKTtcclxuICB9LFxyXG4gIHNraXA6IChzdGF0ZSkgPT4ge1xyXG4gICAgY2xlYXJJbnRlcnZhbChzdGF0ZS50aW1lclJ1bmVyKTtcclxuICAgIHVwZGF0ZVN0YXRlKHN0YXRlLCBnZXRNb2RlKHN0YXRlLm1vZGVOYW1lLCAndG9TdGFydCcpKTtcclxuICB9LFxyXG59O1xyXG5cclxuY29uc3QgcmVuZGVyID0ge1xyXG4gIGJnQ29sb3I6ICh7IGNvbG9yIH0sIGNvbnRhaW5lcikgPT4gY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnYmdDb2xvcicsIGAke2NvbG9yfWApLFxyXG4gIGJ1dHRvbnM6IChzdGF0ZSwgY29udGFpbmVyKSA9PiB7XHJcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgICBzdGF0ZS5idXR0b25zLmZvckVhY2goKHR5cGUpID0+IHtcclxuICAgICAgY29uc3QgYnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgIGJ1dHRvbkNvbnRhaW5lci5kYXRhc2V0LmJ1dHRvblR5cGUgPSB0eXBlO1xyXG4gICAgICBidXR0b25Db250YWluZXIudGV4dENvbnRlbnQgPSB0eXBlO1xyXG4gICAgICBidXR0b25Db250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoeyB0YXJnZXQgfSkgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlID09PSAnc3RvcCcpIHtcclxuICAgICAgICAgIGFza0NvbmZpcm1ZTih0YXJnZXQsIGV2ZW50QnV0dG9uc0Z1bmN0aW9uc1t0eXBlXSwgZW1wdHlGdW5jLCBzdGF0ZSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGV2ZW50QnV0dG9uc0Z1bmN0aW9uc1t0eXBlXShzdGF0ZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uQ29udGFpbmVyKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgdGltZTogKHsgdGltZSB9LCBjb250YWluZXIpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdyZW5kZXIgdGltZTogJywgdGltZSk7XHJcbiAgICBjb250YWluZXIudGV4dENvbnRlbnQgPSBtaWxsaXNUb01pbnV0ZXNBbmRTZWNvbmRzKHRpbWUpO1xyXG4gIH0sXHJcbiAgcGF1c2VQbGF5OiAoeyBvblBhdXNlIH0sIGNvbnRhaW5lcikgPT4ge1xyXG4gICAgaWYgKG9uUGF1c2UgPT09IG51bGwpIHJldHVybjtcclxuICAgIGNvbnN0IHBhdXNlUGxheUJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1idXR0b24tdHlwZT1cInBhdXNlUGxheVwiXScpO1xyXG4gICAgcGF1c2VQbGF5QnV0dG9uLnRleHRDb250ZW50ID0gKG9uUGF1c2UgPyAncmVzdW1lJyA6ICdwYXVzZScpO1xyXG4gIH0sXHJcbn07XHJcblxyXG5jb25zdCBzdGF0ZSA9IHt9O1xyXG5cclxuY29uc3QgaW5pdCA9IChtYWluU3RhdGUpID0+IHtcclxuICBjb25zdCB0aW1lckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNvbnRhaW5lcj1cInRpbWVyXCJdJyk7XHJcbiAgY29uc3QgdGltZVpvbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1jb250YWluZXI9XCJ0aW1lLXpvbmVcIl0nKTtcclxuICBjb25zdCBidXR0b25zQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtY29udGFpbmVyPVwiYnV0dG9uc1wiXScpO1xyXG5cclxuICBjb25zdCBlbGVtZW50cyA9IHsgdGltZXJDb250YWluZXIsIHRpbWVab25lLCBidXR0b25zQ29udGFpbmVyIH07XHJcblxyXG4gIHdhdGNoKHN0YXRlLCAnYmdDb2xvcicsICgpID0+IHJlbmRlci5iZ0NvbG9yKHN0YXRlLCBlbGVtZW50cy50aW1lckNvbnRhaW5lcikpO1xyXG4gIHdhdGNoKHN0YXRlLCAnYnV0dG9ucycsICgpID0+IHJlbmRlci5idXR0b25zKHN0YXRlLCBlbGVtZW50cy5idXR0b25zQ29udGFpbmVyKSk7XHJcbiAgd2F0Y2goc3RhdGUsICd0aW1lJywgKCkgPT4gcmVuZGVyLnRpbWUoc3RhdGUsIGVsZW1lbnRzLnRpbWVab25lKSk7XHJcbiAgd2F0Y2goc3RhdGUsICdvblBhdXNlJywgKCkgPT4gcmVuZGVyLnBhdXNlUGxheShzdGF0ZSwgZWxlbWVudHMuYnV0dG9uc0NvbnRhaW5lcikpO1xyXG5cclxuICB1cGRhdGVTdGF0ZShzdGF0ZSwgJ3ByZVdvcmsnKTtcclxuXHJcbiAgc3RhdGUudGFza0lzRG9uZSA9ICgpID0+IHtcclxuICAgIG1haW5TdGF0ZS5pc0RvbmUgPSAhbWFpblN0YXRlLmlzRG9uZTtcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3QgcnVuID0gKCkgPT4ge1xyXG4gIHVwZGF0ZVN0YXRlKHN0YXRlLCAnd29yaycpO1xyXG4gIHN0YXRlLnRpbWVyUnVuZXIgPSBzZXRUaW1lcigpO1xyXG59O1xyXG5cclxuY29uc3QgVGltZXIgPSB7IGluaXQsIHJ1biwgdGltZU1hbmFnZXIgfTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRpbWVyO1xyXG4iXX0=