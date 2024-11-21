import React from 'react';
import { useImmediateEffect } from './effect-hooks';
import { useClass, useForceUpdate } from './imperative-hooks';
import { validationClasses } from './standard';
import { isNumber } from './validators';
class State {
    constructor() {
        this.value = '';
        this.error = false;
    }
    valueAsNumber(props) {
        return props.nullable && this.value === '' ? null : Number(this.value);
    }
    update(x) {
        const newValue = x == null ? '' : String(x);
        this.value = newValue;
        this.error = newValue !== '' && !isNumber(x);
    }
    setAndConvert(x, props) {
        if (x == null) {
            this.update(null);
        }
        else {
            let newValue = x;
            if (props.positive) {
                newValue = Math.abs(x);
            }
            if (props.integer) {
                newValue = Math.round(newValue);
            }
            this.update(newValue);
        }
    }
}
export const NumberInput = (props) => {
    const { valuePtr, nullable, placeholder, positive, integer, ...rest } = props;
    const state = useClass(State);
    const forceUpdate = useForceUpdate();
    useImmediateEffect(() => {
        if (valuePtr.value !== state.valueAsNumber(props)) {
            state.setAndConvert(valuePtr.value, props);
        }
    }, [valuePtr.value]);
    const handleFocus = (e) => {
        var _a;
        if (!nullable && !valuePtr.value) {
            state.value = '';
            forceUpdate();
        }
        (_a = props.onFocus) === null || _a === void 0 ? void 0 : _a.call(props, e);
    };
    const handleBlur = (e) => {
        var _a;
        if (!nullable && !state.value) {
            state.value = '0';
            forceUpdate();
        }
        (_a = props.onBlur) === null || _a === void 0 ? void 0 : _a.call(props, e);
    };
    const handleKeyPress = (e) => {
        const allowedChars = (positive ? [] : [45]).concat(integer ? [] : [46]);
        const { charCode } = e;
        if (e.ctrlKey)
            return;
        if (charCode &&
            (charCode < 48 || charCode > 57) &&
            allowedChars.indexOf(charCode) < 0) {
            e.preventDefault();
        }
    };
    const handleChange = (e) => {
        const newValue = e.target.value;
        state.update(newValue);
        forceUpdate();
        const asNumber = state.valueAsNumber(props);
        if (!isNaN(asNumber)) {
            valuePtr.update((current) => {
                if (asNumber !== current) {
                    return asNumber;
                }
            });
        }
    };
    return (React.createElement("input", { ...rest, placeholder: placeholder == null ? '' : String(placeholder), type: "text", className: validationClasses(props, state.value, valuePtr.error || state.error), value: state.value, onFocus: handleFocus, onBlur: handleBlur, onKeyPress: handleKeyPress, onChange: handleChange }));
};
export default NumberInput;
//# sourceMappingURL=number.js.map