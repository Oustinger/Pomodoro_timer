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

    this.container = this.createElement('div');
    this.answer = {
      value: null
    };
  }

  _createClass(ConfirmationYN, [{
    key: "createElement",
    value: function createElement(name) {
      var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ''; // eslint-disable-line

      var element = document.createElement("".concat(name));
      element.textContent = text;
      return element;
    }
  }, {
    key: "ask",
    value: function ask(parentContainer) {
      var _this = this,
          _this$container;

      var questionText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Are you sure?';
      this.container.textContent = questionText;
      var buttons = [this.createElement('button', 'Yes'), this.createElement('button', 'No')];
      buttons.forEach(function (b) {
        return b.addEventListener('click', function (_ref) {
          var target = _ref.target;
          _this.answer.value = target.textContent === 'Yes';
        });
      });

      (_this$container = this.container).append.apply(_this$container, buttons);

      parentContainer.append(this.container);
      buttons[0].focus();
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