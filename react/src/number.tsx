import * as React from 'react'
import { PurePtr } from '@pure-ptr/core'
import { validationClasses } from './standard'
import { isNumber } from './validators'

// This number component rejects invalid input and modify link only with valid number values.
// Implementing numeric input rejection might be tricky.
export interface NumberInputProps extends React.HTMLProps<HTMLInputElement> {
    positive?: boolean,
    integer?: boolean,
    valuePtr: PurePtr<number>
}

export class NumberInput extends React.Component<NumberInputProps, {}>{
    componentWillMount() {
        // Initialize component state
        this.setAndConvert(this.props.valuePtr.value);
    }

    value: string = '';
    error: any;

    setValue(x: number) {
        // We're not using native state in order to avoid race condition.
        this.value = String(x);
        this.error = this.value === '' || !isNumber(x);
        this.forceUpdate();
    }

    setAndConvert(x: number) {
        let value = Number(x);

        if (this.props.positive) {
            value = Math.abs(x);
        }

        if (this.props.integer) {
            value = Math.round(value);
        }

        this.setValue(value);
    }

    componentWillReceiveProps(nextProps: NumberInputProps) {
        const { valuePtr: $next } = nextProps;

        if (Number($next.value) !== Number(this.value)) {
            this.setAndConvert($next.value); // keep state being synced
        }
    }

    render() {
        const { valuePtr, positive, integer, ...props } = this.props,
            error = valuePtr.error || this.error;

        return <input {...props}
            type="text"
            className={validationClasses(props, this.value, error)}
            value={this.value}
            onFocus={ this.onFocus }
            onBlur={ this.onBlur }
            onKeyPress={this.onKeyPress}
            onChange={this.onChange}
        />;
    }

    onFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        const { onFocus } = this.props;

        if( !this.props.valuePtr.value ){
            this.value = '';
            this.forceUpdate();
        }

        if (onFocus) {
            onFocus(e);
        }
    }

    onBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        const { onBlur } = this.props;

        if( !this.value ){
            this.value = '0';
            this.forceUpdate();
        }

        if (onBlur) {
            onBlur(e);
        }
    }

    onKeyPress = (e: { ctrlKey?: any; preventDefault?: any; charCode?: any }) => {
        const { charCode } = e,
            { integer, positive } = this.props,
            allowed = (positive ? [] : [45]).concat(integer ? [] : [46]);

        if (e.ctrlKey) return;

        if (charCode && // allow control characters
            (charCode < 48 || charCode > 57) && // char is number
            allowed.indexOf(charCode) < 0) { // allowed char codes
            e.preventDefault();
        }
    };

    onChange = (e: { target: { value: any } }) => {
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
    }
}