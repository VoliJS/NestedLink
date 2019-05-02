import * as tslib_1 from "tslib";
import * as React from 'react';
import { Link } from './link';
var LinkedComponent = /** @class */ (function (_super) {
    tslib_1.__extends(LinkedComponent, _super);
    function LinkedComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.links = null;
        return _this;
    }
    // @deprecated use `this.$at( key )`
    LinkedComponent.prototype.linkAt = function (key) {
        return this.$at(key);
    };
    // Get the link to the state member with the given key.
    LinkedComponent.prototype.$at = function (key) {
        var value = this.state[key], cache = this.links || (this.links = {}), cached = cache[key];
        return cached && cached.value === value ?
            cached :
            cache[key] = new StateLink(this, key, value);
    };
    LinkedComponent.prototype.linkAll = function () {
        return this.state$.apply(this, arguments);
    };
    LinkedComponent.prototype.state$ = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var state = this.state, cache = this.links || (this.links = {}), keys = args.length ? args : Object.keys(state);
        for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
            var key = keys_1[_a];
            var value = state[key], cached = cache[key];
            if (!cached || cached.value !== value) {
                cache[key] = new StateLink(this, key, value);
            }
        }
        return cache;
    };
    return LinkedComponent;
}(React.Component));
export { LinkedComponent };
var StateLink = /** @class */ (function (_super) {
    tslib_1.__extends(StateLink, _super);
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