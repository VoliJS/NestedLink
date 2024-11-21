import * as React from 'react';
import { validationClasses } from './standard';
import { isNumber } from './validators';
/**
 * A React component for handling numeric input with optional constraints for positive and integer values.
 *
 * @extends {React.Component<NumberInputProps, {}>}
 *
 * @property {PurePtr<number>} props.valuePtr - A pointer object that holds the value of the input element.
 * @property {boolean} props.positive - A flag to indicate that the input should only accept positive numbers.
 * @property {boolean} props.integer - A flag to indicate that the input should only accept integer numbers.
 * @property {boolean} props.nullable - A flag to indicate that the input can be null.
 *
 * @example
 *   <NumberInput valuePtr={ numberValuePtr }/>
 *   <NumberInput valuePtr={ numberValuePtr } nullable />
 *   <NumberInput valuePtr={ numberValuePtr } positive/>
 *   <NumberInput valuePtr={ numberValuePtr } integer/>
 *   <NumberInput valuePtr={ numberValuePtr } positive integer/>
 */
export class NumberInput extends React.Component {
    constructor() {
        super(...arguments);
        this.value = '';
        this.onFocus = (e) => {
            const { nullable, onFocus } = this.props;
            if (!nullable && !this.props.valuePtr.value) {
                this.value = '';
                this.forceUpdate();
            }
            if (onFocus) {
                onFocus(e);
            }
        };
        this.onBlur = (e) => {
            const { onBlur, nullable } = this.props;
            if (!nullable && !this.value) {
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
            const asNumber = this.valueAsNumber;
            if (!isNaN(asNumber)) {
                this.props.valuePtr.update(x => {
                    // Update link if value is changed
                    if (asNumber !== x) {
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
        this.value = x == null ? '' : String(x);
        this.error = this.value !== '' && !isNumber(x);
        this.forceUpdate();
    }
    setAndConvert(x) {
        if (x == null) {
            this.setValue(null);
        }
        else {
            let value = x;
            if (this.props.positive) {
                value = Math.abs(x);
            }
            if (this.props.integer) {
                value = Math.round(value);
            }
            this.setValue(value);
        }
    }
    componentWillReceiveProps({ valuePtr }) {
        if (valuePtr.value !== this.valueAsNumber) {
            this.setAndConvert(valuePtr.value); // keep state being synced
        }
    }
    get valueAsNumber() {
        return this.props.nullable && this.value === '' ? null : Number(this.value);
    }
    render() {
        const { valuePtr, positive, integer, nullable, placeholder, ...props } = this.props, error = valuePtr.error || this.error;
        return React.createElement("input", { ...props, placeholder: placeholder == null ? '' : String(placeholder), type: "text", className: validationClasses(props, this.value, error), value: this.value, onFocus: this.onFocus, onBlur: this.onBlur, onKeyPress: this.onKeyPress, onChange: this.onChange });
    }
}
