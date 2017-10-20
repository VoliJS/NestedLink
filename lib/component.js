var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import { Link } from './link';
var LinkedComponent = /** @class */ (function (_super) {
    __extends(LinkedComponent, _super);
    function LinkedComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.links = null;
        return _this;
    }
    LinkedComponent.prototype.linkAt = function (key) {
        return linkAt(this, key);
    };
    LinkedComponent.prototype.linkAll = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return linkAll(this, args);
    };
    return LinkedComponent;
}(React.Component));
export { LinkedComponent };
Link.all = function (component) {
    var _keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        _keys[_i - 1] = arguments[_i];
    }
    return linkAll(component, _keys);
};
Link.state = linkAt;
function linkAll(component, _keys) {
    var state = component.state, cache = component.links || (component.links = {}), keys = _keys.length ? _keys : Object.keys(state);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var value = state[key], cached = cache[key];
        if (!cached || cached.value !== value) {
            cache[key] = new StateLink(component, key, value);
        }
    }
    return cache;
}
function linkAt(component, key) {
    var value = component.state[key], cache = component.links || (component.links = {}), cached = cache[key];
    return cached && cached.value === value ? cached : cache[key] = new StateLink(component, key, value);
}
var StateLink = /** @class */ (function (_super) {
    __extends(StateLink, _super);
    function StateLink(component, key, value) {
        var _this = _super.call(this, value) || this;
        _this.component = component;
        _this.key = key;
        return _this;
    }
    StateLink.prototype.set = function (x) {
        var attrs = {};
        attrs[this.key] = x;
        this.component.setState(attrs);
    };
    return StateLink;
}(Link));
export { StateLink };
//# sourceMappingURL=component.js.map