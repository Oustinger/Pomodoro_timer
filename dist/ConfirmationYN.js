"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var ConfirmationYN = /*#__PURE__*/function () {
  function ConfirmationYN() {
    _classCallCheck(this, ConfirmationYN);
  }

  _createClass(ConfirmationYN, [{
    key: "createElement",
    value: function createElement(name, type) {
      // eslint-disable-line
      var element = document.createElement("".concat(name));
      element.classList.add(type);
      element.dataset.type = type;
      return element;
    }
  }, {
    key: "ask",
    value: function ask(parentContainer) {
      var _this$container;

      var questionText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Are you sure?';
      var answer = {
        value: null
      };
      var buttons = [this.createElement('button', 'yes'), this.createElement('button', 'no')];
      buttons.forEach(function (b) {
        return b.addEventListener('click', function (_ref) {
          var target = _ref.target,
              currentTarget = _ref.currentTarget;

          if (currentTarget === target) {
            answer.value = target.dataset.type === 'yes';
          }
        });
      });
      this.container = this.createElement('div', 'confirmationYN');
      var text = document.createElement('p');
      text.textContent = questionText;

      (_this$container = this.container).append.apply(_this$container, [text].concat(buttons));

      parentContainer.appendChild(this.container);
      buttons[0].focus();
      return answer;
    }
  }, {
    key: "remove",
    value: function remove() {
      this.container.remove();
    }
  }]);

  return ConfirmationYN;
}();

exports["default"] = ConfirmationYN;
//# sourceMappingURL=ConfirmationYN.js.map