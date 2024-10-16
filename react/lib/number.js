import * as React from 'react';
import { validationClasses } from './standard';
import { isNumber } from './validators';
export class NumberInput extends React.Component {
    constructor() {
        super(...arguments);
        this.value = '';
        this.onFocus = (e) => {
            const { onFocus } = this.props;
            if (!this.props.valuePtr.value) {
                this.value = '';
                this.forceUpdate();
            }
            if (onFocus) {
                onFocus(e);
            }
        };
        this.onBlur = (e) => {
            const { onBlur } = this.props;
            if (!this.value) {
                this.value = '0';
                this.forceUpdate();
            }
            if (onBlur) {
                onBlur(e);
            }
        };
        this.onKeyPress = (e) => {
            const { charCode } = e, { integer, positive } = this.props, allowed = (positive ? [] : [45]).concat(integer ? [] : [46]);
            if (e.ctrlKey)
                return;
            if (charCode && // allow control characters
                (charCode < 48 || charCode > 57) && // char is number
                allowed.indexOf(charCode) < 0) { // allowed char codes
                e.preventDefault();
            }
        };
        this.onChange = (e) => {
            // Update local state...
            const { value } = e.target;
            this.setValue(value);
            const asNumber = Number(value);
            if (!isNaN(asNumber)) {
                this.props.valuePtr.update(x => {
                    // Update link if value is changed
                    if (asNumber !== Number(x)) {
                        return asNumber;
                    }
                });
            }
        };
    }
    componentWillMount() {
        // Initialize component state
        this.setAndConvert(this.props.valuePtr.value);
    }
    setValue(x) {
        // We're not using native state in order to avoid race condition.
        this.value = String(x);
        this.error = this.value === '' || !isNumber(x);
        this.forceUpdate();
    }
    setAndConvert(x) {
        let value = Number(x);
        if (this.props.positive) {
            value = Math.abs(x);
        }
        if (this.props.integer) {
            value = Math.round(value);
        }
        this.setValue(value);
    }
    componentWillReceiveProps(nextProps) {
        const { valuePtr: $next } = nextProps;
        if (Number($next.value) !== Number(this.value)) {
            this.setAndConvert($next.value); // keep state being synced
        }
    }
    render() {
        const { valuePtr, positive, integer, ...props } = this.props, error = valuePtr.error || this.error;
        return React.createElement("input", { ...props, type: "text", className: validationClasses(props, this.value, error), value: this.value, onFocus: this.onFocus, onBlur: this.onBlur, onKeyPress: this.onKeyPress, onChange: this.onChange });
    }
}
