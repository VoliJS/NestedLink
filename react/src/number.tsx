import { PurePtr } from '@pure-ptr/core';
import React from 'react';
import { useImmediateEffect } from './effect-hooks';
import { useClass, useForceUpdate } from './imperative-hooks';
import { validationClasses } from './standard';
import { isNumber } from './validators';

interface NumberInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'placeholder'> {
    positive?: boolean;
    integer?: boolean;
    valuePtr: PurePtr<number | null>;
    nullable?: boolean;
    placeholder?: number | string;
}

class State {
    value = '';
    error = false;

    valueAsNumber( props : NumberInputProps ) {
        return props.nullable && this.value === '' ? null : Number(this.value);
    }

    update( x : number | string | null ) {
        const newValue = x == null ? '' : String(x);
        this.value = newValue;
        this.error = newValue !== '' && !isNumber(x);
    }

    setAndConvert( x : number | null, props : NumberInputProps): void {
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

export const NumberInput = ( props : NumberInputProps ) => {
    const {     
        valuePtr,
        nullable,
        placeholder,
        positive,
        integer,
        ...rest
    } = props;

    const state = useClass( State ); 
    const forceUpdate = useForceUpdate();

    useImmediateEffect(() => {
        if( valuePtr.value !== state.valueAsNumber(props) ) {
            state.setAndConvert(valuePtr.value, props );
        }
    }, [valuePtr.value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!nullable && !valuePtr.value) {
            state.value = '';
            forceUpdate();
        }
        props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!nullable && !state.value) {
            state.value = '0';
            forceUpdate();
        }

        props.onBlur?.(e);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowedChars = (positive ? [] : [45]).concat(integer ? [] : [46]);
        const { charCode } = e;

        if (e.ctrlKey) return;

        if (
            charCode &&
            (charCode < 48 || charCode > 57) &&
            allowedChars.indexOf(charCode) < 0
        ) {
            e.preventDefault();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        state.update(newValue);
        forceUpdate();

        const asNumber = state.valueAsNumber(props);

        if (!isNaN(asNumber as any)) {
            valuePtr.update((current) => {
                if (asNumber !== current) {
                    return asNumber;
                }
            });
        }
    };

    return (
        <input
            {...rest}
            placeholder={placeholder == null ? '' : String(placeholder)}
            type="text"
            className={validationClasses(props, state.value, valuePtr.error || state.error)}
            value={state.value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            onChange={handleChange}
        />
    );
};

export default NumberInput;

