import * as React from 'react';
import { validationClasses } from './standard';
import { isNumber } from './validators';
export class NumberInput extends React.Component {
    constructor() {
        super(...arguments);
        this.onKeyPress = e => {
            const { charCode } = e, { integer, positive } = this.props, allowed = (positive ? [] : [45]).concat(integer ? [] : [46]);
            if (e.ctrlKey)
                return;
            if (charCode && // allow control characters
                (charCode < 48 || charCode > 57) && // char is number
                allowed.indexOf(charCode) < 0) { // allowed char codes
                e.preventDefault();
            }
        };
        this.onChange = e => {
            // Update local state...
            const { value } = e.target;
            this.setValue(value);
            const asNumber = Number(value);
            if (value && !isNaN(asNumber)) {
                this.props.$value.update(x => {
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
        this.setAndConvert(this.props.$value.value);
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
        const { $value: $next } = nextProps;
        if (Number($next.value) !== Number(this.value)) {
            this.setAndConvert($next.value); // keep state being synced
        }
    }
    render() {
        const { $value, positive, integer, ...props } = this.props, error = $value.error || this.error;
        return <input {...props} type="text" className={validationClasses(props, this.value, error)} value={this.value} onKeyPress={this.onKeyPress} onChange={this.onChange}/>;
    }
}
//# sourceMappingURL=number.jsx.map