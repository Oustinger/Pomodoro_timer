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

    this.container = this.createElement('div');
    this.answer = {
      value: null
    };
  }

  _createClass(ConfirmationYN, [{
    key: "createElement",
    value: function createElement(name) {
      var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      // eslint-disable-line
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2pzU3JjL3NjcmlwdHMvY2xhc3Nlcy9Db25maXJtYXRpb25ZTi5qcyJdLCJuYW1lcyI6WyJDb25maXJtYXRpb25ZTiIsImNvbnRhaW5lciIsImNyZWF0ZUVsZW1lbnQiLCJhbnN3ZXIiLCJ2YWx1ZSIsIm5hbWUiLCJ0ZXh0IiwiZWxlbWVudCIsImRvY3VtZW50IiwidGV4dENvbnRlbnQiLCJwYXJlbnRDb250YWluZXIiLCJxdWVzdGlvblRleHQiLCJidXR0b25zIiwiZm9yRWFjaCIsImIiLCJhZGRFdmVudExpc3RlbmVyIiwidGFyZ2V0IiwiYXBwZW5kIiwiZm9jdXMiLCJyZW1vdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFBcUJBLGM7QUFDbkIsNEJBQWM7QUFBQTs7QUFDWixTQUFLQyxTQUFMLEdBQWlCLEtBQUtDLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBakI7QUFDQSxTQUFLQyxNQUFMLEdBQWM7QUFBRUMsTUFBQUEsS0FBSyxFQUFFO0FBQVQsS0FBZDtBQUNEOzs7O2tDQUVhQyxJLEVBQWlCO0FBQUEsVUFBWEMsSUFBVyx1RUFBSixFQUFJO0FBQUU7QUFDL0IsVUFBTUMsT0FBTyxHQUFHQyxRQUFRLENBQUNOLGFBQVQsV0FBMEJHLElBQTFCLEVBQWhCO0FBQ0FFLE1BQUFBLE9BQU8sQ0FBQ0UsV0FBUixHQUFzQkgsSUFBdEI7QUFDQSxhQUFPQyxPQUFQO0FBQ0Q7Ozt3QkFFR0csZSxFQUFpRDtBQUFBO0FBQUE7O0FBQUEsVUFBaENDLFlBQWdDLHVFQUFqQixlQUFpQjtBQUNuRCxXQUFLVixTQUFMLENBQWVRLFdBQWYsR0FBNkJFLFlBQTdCO0FBQ0EsVUFBTUMsT0FBTyxHQUFHLENBQUMsS0FBS1YsYUFBTCxDQUFtQixRQUFuQixFQUE2QixLQUE3QixDQUFELEVBQXNDLEtBQUtBLGFBQUwsQ0FBbUIsUUFBbkIsRUFBNkIsSUFBN0IsQ0FBdEMsQ0FBaEI7QUFDQVUsTUFBQUEsT0FBTyxDQUFDQyxPQUFSLENBQWdCLFVBQUNDLENBQUQ7QUFBQSxlQUFPQSxDQUFDLENBQUNDLGdCQUFGLENBQW1CLE9BQW5CLEVBQTRCLGdCQUFnQjtBQUFBLGNBQWJDLE1BQWEsUUFBYkEsTUFBYTtBQUNqRSxVQUFBLEtBQUksQ0FBQ2IsTUFBTCxDQUFZQyxLQUFaLEdBQXFCWSxNQUFNLENBQUNQLFdBQVAsS0FBdUIsS0FBNUM7QUFDRCxTQUZzQixDQUFQO0FBQUEsT0FBaEI7O0FBR0EsOEJBQUtSLFNBQUwsRUFBZWdCLE1BQWYsd0JBQXlCTCxPQUF6Qjs7QUFDQUYsTUFBQUEsZUFBZSxDQUFDTyxNQUFoQixDQUF1QixLQUFLaEIsU0FBNUI7QUFDQVcsTUFBQUEsT0FBTyxDQUFDLENBQUQsQ0FBUCxDQUFXTSxLQUFYO0FBQ0Q7Ozs2QkFFUTtBQUNQLFdBQUtqQixTQUFMLENBQWVrQixNQUFmO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb25maXJtYXRpb25ZTiB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IHRoaXMuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0aGlzLmFuc3dlciA9IHsgdmFsdWU6IG51bGwgfTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUVsZW1lbnQobmFtZSwgdGV4dCA9ICcnKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGAke25hbWV9YCk7XHJcbiAgICBlbGVtZW50LnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgIHJldHVybiBlbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgYXNrKHBhcmVudENvbnRhaW5lciwgcXVlc3Rpb25UZXh0ID0gJ0FyZSB5b3Ugc3VyZT8nKSB7XHJcbiAgICB0aGlzLmNvbnRhaW5lci50ZXh0Q29udGVudCA9IHF1ZXN0aW9uVGV4dDtcclxuICAgIGNvbnN0IGJ1dHRvbnMgPSBbdGhpcy5jcmVhdGVFbGVtZW50KCdidXR0b24nLCAnWWVzJyksIHRoaXMuY3JlYXRlRWxlbWVudCgnYnV0dG9uJywgJ05vJyldO1xyXG4gICAgYnV0dG9ucy5mb3JFYWNoKChiKSA9PiBiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKHsgdGFyZ2V0IH0pID0+IHtcclxuICAgICAgdGhpcy5hbnN3ZXIudmFsdWUgPSAodGFyZ2V0LnRleHRDb250ZW50ID09PSAnWWVzJyk7XHJcbiAgICB9KSk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQoLi4uYnV0dG9ucyk7XHJcbiAgICBwYXJlbnRDb250YWluZXIuYXBwZW5kKHRoaXMuY29udGFpbmVyKTtcclxuICAgIGJ1dHRvbnNbMF0uZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZSgpIHtcclxuICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZSgpO1xyXG4gIH1cclxufVxyXG4iXX0=