"use strict";

module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": ["airbnb-base"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 11,
    "sourceType": "module"
  },
  "rules": {
    "no-param-reassign": ["error", {
      "props": false
    }],
    "linebreak-style": ["error", "windows"]
  }
};
//# sourceMappingURL=.eslintrc.js.map