"use strict";

var _watchjs = _interopRequireDefault(require("watchjs"));

var _Timer = _interopRequireDefault(require("./scripts/Timer"));

var _DoneTasksCounter = _interopRequireDefault(require("./scripts/DoneTasksCounter"));

var _TaskManager = _interopRequireDefault(require("./scripts/TaskManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var watch = _watchjs["default"].watch;
var state = {
  setValues: function setValues() {
    var outOfTurn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    state.outOfTurn = outOfTurn;
    state.isDone = false;
  }
};
watch(state, 'isDone', function () {
  if (state.isDone) {
    _Timer["default"].timeManager.shortBreak();

    _DoneTasksCounter["default"].increaseDoneTasks();

    _Timer["default"].stop();

    _TaskManager["default"].completeTask();

    state.setValues();
  }
});
watch(state, 'outOfTurn', function () {
  return state.outOfTurn ? _Timer["default"].run() : null;
});
watch(_DoneTasksCounter["default"], 'needLongBreak', function () {
  return _DoneTasksCounter["default"].needLongBreak ? _Timer["default"].timeManager.longBreak() : null;
});
state.setValues();

_TaskManager["default"].init(state);

_Timer["default"].init(state);

_DoneTasksCounter["default"].init();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzU3JjL21haW4uanMiXSwibmFtZXMiOlsid2F0Y2giLCJXYXRjaEpTIiwic3RhdGUiLCJzZXRWYWx1ZXMiLCJvdXRPZlR1cm4iLCJpc0RvbmUiLCJUaW1lciIsInRpbWVNYW5hZ2VyIiwic2hvcnRCcmVhayIsIkRvbmVUYXNrc0NvdW50ZXIiLCJpbmNyZWFzZURvbmVUYXNrcyIsInN0b3AiLCJUYXNrTWFuYWdlciIsImNvbXBsZXRlVGFzayIsInJ1biIsIm5lZWRMb25nQnJlYWsiLCJsb25nQnJlYWsiLCJpbml0Il0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7O0lBRVFBLEssR0FBVUMsbUIsQ0FBVkQsSztBQUVSLElBQU1FLEtBQUssR0FBRztBQUNaQyxFQUFBQSxTQUFTLEVBQUUscUJBQXVCO0FBQUEsUUFBdEJDLFNBQXNCLHVFQUFWLEtBQVU7QUFDaENGLElBQUFBLEtBQUssQ0FBQ0UsU0FBTixHQUFrQkEsU0FBbEI7QUFDQUYsSUFBQUEsS0FBSyxDQUFDRyxNQUFOLEdBQWUsS0FBZjtBQUNEO0FBSlcsQ0FBZDtBQU9BTCxLQUFLLENBQUNFLEtBQUQsRUFBUSxRQUFSLEVBQWtCLFlBQU07QUFDM0IsTUFBSUEsS0FBSyxDQUFDRyxNQUFWLEVBQWtCO0FBQ2hCQyxzQkFBTUMsV0FBTixDQUFrQkMsVUFBbEI7O0FBQ0FDLGlDQUFpQkMsaUJBQWpCOztBQUNBSixzQkFBTUssSUFBTjs7QUFDQUMsNEJBQVlDLFlBQVo7O0FBQ0FYLElBQUFBLEtBQUssQ0FBQ0MsU0FBTjtBQUNEO0FBQ0YsQ0FSSSxDQUFMO0FBVUFILEtBQUssQ0FBQ0UsS0FBRCxFQUFRLFdBQVIsRUFBcUI7QUFBQSxTQUFPQSxLQUFLLENBQUNFLFNBQU4sR0FBa0JFLGtCQUFNUSxHQUFOLEVBQWxCLEdBQWdDLElBQXZDO0FBQUEsQ0FBckIsQ0FBTDtBQUVBZCxLQUFLLENBQUNTLDRCQUFELEVBQW1CLGVBQW5CLEVBQW9DO0FBQUEsU0FBT0EsNkJBQWlCTSxhQUFqQixHQUFpQ1Qsa0JBQU1DLFdBQU4sQ0FBa0JTLFNBQWxCLEVBQWpDLEdBQWlFLElBQXhFO0FBQUEsQ0FBcEMsQ0FBTDtBQUVBZCxLQUFLLENBQUNDLFNBQU47O0FBQ0FTLHdCQUFZSyxJQUFaLENBQWlCZixLQUFqQjs7QUFDQUksa0JBQU1XLElBQU4sQ0FBV2YsS0FBWDs7QUFDQU8sNkJBQWlCUSxJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBXYXRjaEpTIGZyb20gJ3dhdGNoanMnO1xyXG5pbXBvcnQgVGltZXIgZnJvbSAnLi9zY3JpcHRzL1RpbWVyJztcclxuaW1wb3J0IERvbmVUYXNrc0NvdW50ZXIgZnJvbSAnLi9zY3JpcHRzL0RvbmVUYXNrc0NvdW50ZXInO1xyXG5pbXBvcnQgVGFza01hbmFnZXIgZnJvbSAnLi9zY3JpcHRzL1Rhc2tNYW5hZ2VyJztcclxuXHJcbmNvbnN0IHsgd2F0Y2ggfSA9IFdhdGNoSlM7XHJcblxyXG5jb25zdCBzdGF0ZSA9IHtcclxuICBzZXRWYWx1ZXM6IChvdXRPZlR1cm4gPSBmYWxzZSkgPT4ge1xyXG4gICAgc3RhdGUub3V0T2ZUdXJuID0gb3V0T2ZUdXJuO1xyXG4gICAgc3RhdGUuaXNEb25lID0gZmFsc2U7XHJcbiAgfSxcclxufTtcclxuXHJcbndhdGNoKHN0YXRlLCAnaXNEb25lJywgKCkgPT4ge1xyXG4gIGlmIChzdGF0ZS5pc0RvbmUpIHtcclxuICAgIFRpbWVyLnRpbWVNYW5hZ2VyLnNob3J0QnJlYWsoKTtcclxuICAgIERvbmVUYXNrc0NvdW50ZXIuaW5jcmVhc2VEb25lVGFza3MoKTtcclxuICAgIFRpbWVyLnN0b3AoKTtcclxuICAgIFRhc2tNYW5hZ2VyLmNvbXBsZXRlVGFzaygpO1xyXG4gICAgc3RhdGUuc2V0VmFsdWVzKCk7XHJcbiAgfVxyXG59KTtcclxuXHJcbndhdGNoKHN0YXRlLCAnb3V0T2ZUdXJuJywgKCkgPT4gKHN0YXRlLm91dE9mVHVybiA/IFRpbWVyLnJ1bigpIDogbnVsbCkpO1xyXG5cclxud2F0Y2goRG9uZVRhc2tzQ291bnRlciwgJ25lZWRMb25nQnJlYWsnLCAoKSA9PiAoRG9uZVRhc2tzQ291bnRlci5uZWVkTG9uZ0JyZWFrID8gVGltZXIudGltZU1hbmFnZXIubG9uZ0JyZWFrKCkgOiBudWxsKSk7XHJcblxyXG5zdGF0ZS5zZXRWYWx1ZXMoKTtcclxuVGFza01hbmFnZXIuaW5pdChzdGF0ZSk7XHJcblRpbWVyLmluaXQoc3RhdGUpO1xyXG5Eb25lVGFza3NDb3VudGVyLmluaXQoKTtcclxuIl19