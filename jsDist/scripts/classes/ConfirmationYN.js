"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2pzU3JjL3NjcmlwdHMvY2xhc3Nlcy9Db25maXJtYXRpb25ZTi5qcyJdLCJuYW1lcyI6WyJDb25maXJtYXRpb25ZTiIsIm5hbWUiLCJ0eXBlIiwiZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImRhdGFzZXQiLCJwYXJlbnRDb250YWluZXIiLCJxdWVzdGlvblRleHQiLCJhbnN3ZXIiLCJ2YWx1ZSIsImJ1dHRvbnMiLCJmb3JFYWNoIiwiYiIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0YXJnZXQiLCJjdXJyZW50VGFyZ2V0IiwiY29udGFpbmVyIiwidGV4dCIsInRleHRDb250ZW50IiwiYXBwZW5kIiwiYXBwZW5kQ2hpbGQiLCJmb2N1cyIsInJlbW92ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFxQkEsYzs7Ozs7OztrQ0FDTEMsSSxFQUFNQyxJLEVBQU07QUFBRTtBQUMxQixVQUFNQyxPQUFPLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBVCxXQUEwQkosSUFBMUIsRUFBaEI7QUFDQUUsTUFBQUEsT0FBTyxDQUFDRyxTQUFSLENBQWtCQyxHQUFsQixDQUFzQkwsSUFBdEI7QUFDQUMsTUFBQUEsT0FBTyxDQUFDSyxPQUFSLENBQWdCTixJQUFoQixHQUF1QkEsSUFBdkI7QUFDQSxhQUFPQyxPQUFQO0FBQ0Q7Ozt3QkFFR00sZSxFQUFpRDtBQUFBOztBQUFBLFVBQWhDQyxZQUFnQyx1RUFBakIsZUFBaUI7QUFDbkQsVUFBTUMsTUFBTSxHQUFHO0FBQUVDLFFBQUFBLEtBQUssRUFBRTtBQUFULE9BQWY7QUFDQSxVQUFNQyxPQUFPLEdBQUcsQ0FBQyxLQUFLUixhQUFMLENBQW1CLFFBQW5CLEVBQTZCLEtBQTdCLENBQUQsRUFBc0MsS0FBS0EsYUFBTCxDQUFtQixRQUFuQixFQUE2QixJQUE3QixDQUF0QyxDQUFoQjtBQUNBUSxNQUFBQSxPQUFPLENBQUNDLE9BQVIsQ0FBZ0IsVUFBQ0MsQ0FBRDtBQUFBLGVBQU9BLENBQUMsQ0FBQ0MsZ0JBQUYsQ0FBbUIsT0FBbkIsRUFBNEIsZ0JBQStCO0FBQUEsY0FBNUJDLE1BQTRCLFFBQTVCQSxNQUE0QjtBQUFBLGNBQXBCQyxhQUFvQixRQUFwQkEsYUFBb0I7O0FBQ2hGLGNBQUlBLGFBQWEsS0FBS0QsTUFBdEIsRUFBOEI7QUFDNUJOLFlBQUFBLE1BQU0sQ0FBQ0MsS0FBUCxHQUFnQkssTUFBTSxDQUFDVCxPQUFQLENBQWVOLElBQWYsS0FBd0IsS0FBeEM7QUFDRDtBQUNGLFNBSnNCLENBQVA7QUFBQSxPQUFoQjtBQUtBLFdBQUtpQixTQUFMLEdBQWlCLEtBQUtkLGFBQUwsQ0FBbUIsS0FBbkIsRUFBMEIsZ0JBQTFCLENBQWpCO0FBQ0EsVUFBTWUsSUFBSSxHQUFHaEIsUUFBUSxDQUFDQyxhQUFULENBQXVCLEdBQXZCLENBQWI7QUFDQWUsTUFBQUEsSUFBSSxDQUFDQyxXQUFMLEdBQW1CWCxZQUFuQjs7QUFDQSw4QkFBS1MsU0FBTCxFQUFlRyxNQUFmLHlCQUFzQkYsSUFBdEIsU0FBK0JQLE9BQS9COztBQUNBSixNQUFBQSxlQUFlLENBQUNjLFdBQWhCLENBQTRCLEtBQUtKLFNBQWpDO0FBQ0FOLE1BQUFBLE9BQU8sQ0FBQyxDQUFELENBQVAsQ0FBV1csS0FBWDtBQUNBLGFBQU9iLE1BQVA7QUFDRDs7OzZCQUVRO0FBQ1AsV0FBS1EsU0FBTCxDQUFlTSxNQUFmO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb25maXJtYXRpb25ZTiB7XHJcbiAgY3JlYXRlRWxlbWVudChuYW1lLCB0eXBlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGAke25hbWV9YCk7XHJcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQodHlwZSk7XHJcbiAgICBlbGVtZW50LmRhdGFzZXQudHlwZSA9IHR5cGU7XHJcbiAgICByZXR1cm4gZWxlbWVudDtcclxuICB9XHJcblxyXG4gIGFzayhwYXJlbnRDb250YWluZXIsIHF1ZXN0aW9uVGV4dCA9ICdBcmUgeW91IHN1cmU/Jykge1xyXG4gICAgY29uc3QgYW5zd2VyID0geyB2YWx1ZTogbnVsbCB9O1xyXG4gICAgY29uc3QgYnV0dG9ucyA9IFt0aGlzLmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsICd5ZXMnKSwgdGhpcy5jcmVhdGVFbGVtZW50KCdidXR0b24nLCAnbm8nKV07XHJcbiAgICBidXR0b25zLmZvckVhY2goKGIpID0+IGIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoeyB0YXJnZXQsIGN1cnJlbnRUYXJnZXQgfSkgPT4ge1xyXG4gICAgICBpZiAoY3VycmVudFRhcmdldCA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgYW5zd2VyLnZhbHVlID0gKHRhcmdldC5kYXRhc2V0LnR5cGUgPT09ICd5ZXMnKTtcclxuICAgICAgfVxyXG4gICAgfSkpO1xyXG4gICAgdGhpcy5jb250YWluZXIgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoJ2RpdicsICdjb25maXJtYXRpb25ZTicpO1xyXG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIHRleHQudGV4dENvbnRlbnQgPSBxdWVzdGlvblRleHQ7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQodGV4dCwgLi4uYnV0dG9ucyk7XHJcbiAgICBwYXJlbnRDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xyXG4gICAgYnV0dG9uc1swXS5mb2N1cygpO1xyXG4gICAgcmV0dXJuIGFuc3dlcjtcclxuICB9XHJcblxyXG4gIHJlbW92ZSgpIHtcclxuICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZSgpO1xyXG4gIH1cclxufVxyXG4iXX0=