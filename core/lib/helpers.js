const ArrayProto = Array.prototype, ObjectProto = Object.prototype;
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
const dummyHelpers = {
    clone(value) { return value; },
    map(link, fun) { return []; },
    remove(value) { return value; }
};
// `map` and `clone` for plain JS objects
export const objectHelpers = {
    // Map through the link to object
    map(link, iterator) {
        let mapped = [], { value } = link;
        for (let key in value) {
            if (value.hasOwnProperty(key)) {
                const element = iterator(link.at(key), key);
                element === void 0 || (mapped.push(element));
            }
        }
        return mapped;
    },
    remove(object, key) {
        delete object[key];
        return object;
    },
    // Shallow clone plain JS object
    clone(object) {
        return { ...object };
    }
};
// `map` and `clone` helpers for arrays.
export const arrayHelpers = {
    // Shallow clone array
    clone(array) {
        return array.slice();
    },
    remove(array, i) {
        array.splice(i, 1);
        return array;
    },
    // Map through the link to array
    map(link, iterator) {
        const length = link.value.length, mapped = Array(length);
        for (var i = 0, j = 0; i < length; i++) {
            const y = iterator(link.at(i), i);
            y === void 0 || (mapped[j++] = y);
        }
        mapped.length === j || (mapped.length = j);
        return mapped;
    }
};
