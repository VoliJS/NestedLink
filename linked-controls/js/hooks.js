"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
// Delays function calls for a given timeout.
function useThrottle(fun, timeout, changes) {
    if (changes === void 0) { changes = []; }
    // Create the ref to store timer.
    var timer = react_1.useRef(null);
    function cancel() {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    }
    // Register the 
    react_1.useEffect(function () { return cancel; }, changes);
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        cancel();
        timer.current = setTimeout(function () {
            timer.current = null;
            fun.apply(_this, args);
        }, timeout);
    };
}
exports.useThrottle = useThrottle;
//# sourceMappingURL=hooks.js.map