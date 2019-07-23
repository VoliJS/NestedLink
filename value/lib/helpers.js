import * as tslib_1 from "tslib";
var ArrayProto = Array.prototype, ObjectProto = Object.prototype;
export function helpers(value) {
    if (value && typeof value === 'object') {
        switch (Object.getPrototypeOf(value)) {
            case ArrayProto: return arrayHelpers;
            case ObjectProto: return objectHelpers;
        }
    }
    return dummyHelpers;
}
// Do nothing for types other than Array and plain Object.
var dummyHelpers = {
    clone: function (value) { return value; },
    map: function (link, fun) { return []; },
    remove: function (value) { return value; }
};
// `map` and `clone` for plain JS objects
export var objectHelpers = {
    // Map through the link to object
    map: function (link, iterator) {
        var mapped = [], value = link.value;
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                var element = iterator(link.at(key), key);
                element === void 0 || (mapped.push(element));
            }
        }
        return mapped;
    },
    remove: function (object, key) {
        delete object[key];
        return object;
    },
    // Shallow clone plain JS object
    clone: function (object) {
        return tslib_1.__assign({}, object);
    }
};
// `map` and `clone` helpers for arrays.
export var arrayHelpers = {
    // Shallow clone array
    clone: function (array) {
        return array.slice();
    },
    remove: function (array, i) {
        array.splice(i, 1);
        return array;
    },
    // Map through the link to array
    map: function (link, iterator) {
        var length = link.value.length, mapped = Array(length);
        for (var i = 0, j = 0; i < length; i++) {
            var y = iterator(link.at(i), i);
            y === void 0 || (mapped[j++] = y);
        }
        mapped.length === j || (mapped.length = j);
        return mapped;
    }
};
//# sourceMappingURL=helpers.js.map