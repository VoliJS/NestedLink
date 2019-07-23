"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var standard_1 = require("./standard");
var validators_1 = require("./validators");
var NumberInput = /** @class */ (function (_super) {
    __extends(NumberInput, _super);
    function NumberInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onKeyPress = function (e) {
            var charCode = e.charCode, _a = _this.props, integer = _a.integer, positive = _a.positive, allowed = (positive ? [] : [45]).concat(integer ? [] : [46]);
            if (e.ctrlKey)
                return;
            if (charCode && // allow control characters
                (charCode < 48 || charCode > 57) && // char is number
                allowed.indexOf(charCode) < 0) { // allowed char codes
                e.preventDefault();
            }
        };
        _this.onChange = function (e) {
            // Update local state...
            var value = e.target.value;
            _this.setValue(value);
            var asNumber = Number(value);
            if (value && !isNaN(asNumber)) {
                _this.props.$value.update(function (x) {
                    // Update link if value is changed
                    if (asNumber !== Number(x)) {
                        return asNumber;
                    }
                });
            }
        };
        return _this;
    }
    NumberInput.prototype.componentWillMount = function () {
        // Initialize component state
        this.setAndConvert(this.props.$value.value);
    };
    NumberInput.prototype.setValue = function (x) {
        // We're not using native state in order to avoid race condition.
        this.value = String(x);
        this.error = this.value === '' || !validators_1.isNumber(x);
        this.forceUpdate();
    };
    NumberInput.prototype.setAndConvert = function (x) {
        var value = Number(x);
        if (this.props.positive) {
            value = Math.abs(x);
        }
        if (this.props.integer) {
            value = Math.round(value);
        }
        this.setValue(value);
    };
    NumberInput.prototype.componentWillReceiveProps = function (nextProps) {
        var $next = nextProps.$value;
        if (Number($next.value) !== Number(this.value)) {
            this.setAndConvert($next.value); // keep state being synced
        }
    };
    NumberInput.prototype.render = function () {
        var _a = this.props, $value = _a.$value, positive = _a.positive, integer = _a.integer, props = __rest(_a, ["$value", "positive", "integer"]), error = $value.error || this.error;
        return React.createElement("input", __assign({}, props, { type: "text", className: standard_1.validationClasses(props, this.value, error), value: this.value, onKeyPress: this.onKeyPress, onChange: this.onChange }));
    };
    return NumberInput;
}(React.Component));
exports.NumberInput = NumberInput;
//# sourceMappingURL=number.js.map