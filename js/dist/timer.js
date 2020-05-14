// import require from '../lib/require.js';
import WatchJS from 'melanke-watchjs';

const watch = WatchJS.watch;

const modeMapping = {
  preWork: {
    time: 1500,
    buttons: ['start'],
    bgColor: 'red',
    onPause: null,
    forTimer: false,
  },
  work: {
    time: 1500,
    buttons: ['pausePlay', 'stop', 'restart'],
    bgColor: 'red',
    onPause: false,
    forTimer: true,
  },
  preRelax: {
    time: 300,
    buttons: ['start'],
    bgColor: 'blue',
    onPause: null,
    forTimer: false,
  },
  relax: {
    time: 300,
    buttons: ['pausePlay', 'stop', 'restart'],
    bgColor: 'blue',
    onPause: false,
    forTimer: true,
  },
};

const updateState = (state, modeName) => ({ ...state, modeName, ...modeMapping[modeName] });

const getMode = (current, operation) => {
  const modes = ['preWork', 'work', 'preRelax', 'relax'];
  const currentId = modes.indexOf(current);
  let newId;
  switch (operation) {
    case 'next':
      newId = currentId + 1;
      break;
    case 'prev':
      newId = currentId - 1;
    case 'refresh':
      newId = 0;
    default:
      throw new Error(`Unknown operation: ${operation}`)
  }
  return modes[newId];
};

const timerFunc = (state) => {
  if (state.time === 0) {
    state.time = 0;
    setTimeout(() => updateState(state, getMode[state.modeName, 'next']), 1000);
  }
  state.time -= 1;
};

const eventButtonsFunctions = {
  start: (state) => {
    state = updateState(state, getMode[state.modeName, 'next']);
    state.timerRuner(setInterval(timerFunc(state), 1000));
  },
  pausePlay: (state) => {
    state.onPause = !state.onPause;
    if (state.onPause) {
      clearInterval(state.timerRuner);
      return;
    }
    state.timerRuner(setInterval(timerFunc(state), 1000));
  },
  stop: (state) => {
    clearInterval(state.timerRuner);
    state = updateState(state, getMode[state.modeName, 'refresh']);
  },
  restart: (state) => {
    clearInterval(state.timerRuner);
    state = updateState(state, getMode[state.modeName, 'prev']);
  },
};

const render = {
  bgColor: ({ color }, container) => container.setAttribute('bgColor', `${color}`),
  buttons: (state, container) => state.buttons.forEach((type) => {
    const buttonContainer = document.createElement('button');
    buttonContainer.id = type;
    buttonContainer.textContent = type;
    buttonContainer.addEventListener('click', () => eventButtonsFunctions[type](state));
    container.appendChild(buttonContainer);
  }),
  time: ({ timeValue }, container) => {
    container.textContent = timeValue;
  },
  pausePlay: ({ onPause }, container) => {
    const pausePlayButton = container.getElementById('pausePlay');
    pausePlayButton.textContent = onPause ? 'Resume' : 'Pause';
  },
};

export default () => {
  const elements = {
    timerContainer: document.querySelector('#timer'),
    timeZone: document.querySelector('#time-zone'),
    buttonsContainer: document.querySelector('#buttons'),
  };

  const state = {};

  watch(state, 'bgColor', () => render.bgColor(state, elements.timerContainer));
  watch(state, 'buttons', () => render.buttons(state, elements.buttonsContainer))
  watch(state, 'time', () => render.time(state, elements.timerContainer));
  watch(state, 'onPause', () => render.pausePlay(state, elements.buttonsContainer));

  updateState(state, 'preWork');
};

define(function (require) {
  // Load any app-specific modules
  // with a relative require call,
  // like:
  var messages = require('./messages');

  // Load library/vendor modules using
  // full IDs, like:
  var watch = require('print');

  print(messages.getHello());
});
