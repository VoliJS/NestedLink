import React from 'react';
import { Input } from '@linked/controls';

export * from '@linked/controls'

export const ValidatedInput = ( props ) => (
    <div>
        <Input { ...props } />
        <div className="validation-error">
            { props.$value.error || '' }
        </div>
    </div>
);