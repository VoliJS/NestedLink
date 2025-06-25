import React from 'react';
import { Input, InputProps } from '@pure-ptr/react';
import { JSX } from 'react/jsx-runtime';

export * from '@pure-ptr/react'

export const ValidatedInput = ( props: JSX.IntrinsicAttributes & InputProps ) => (
    <div>
        <Input { ...props } />
        <div className="validation-error">
            { props.valuePtr?.error || '' }
        </div>
    </div>
);