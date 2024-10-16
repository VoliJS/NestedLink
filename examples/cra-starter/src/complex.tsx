import React from 'react';
import { Input, isNumber, PurePtr } from '@pure-ptr/react';

export const JointLinks = ({ strPtr, str2Ptr } :{
    strPtr : PurePtr<string>,
    str2Ptr : PurePtr<string>
}) => {
    strPtr.check( isNumber );
    const jointPtr = strPtr.onChange( x => str2Ptr.set( x ) );

    return (
        <fieldset>
            <legend>Joint links</legend>

            <label>
                First
                <Input valuePtr={ jointPtr }/>
            </label>

            <label>
                Should update when first changes
                <Input valuePtr={ str2Ptr.pipe( x => x && x.toUpperCase() ) }/>
            </label>
        </fieldset>
    );
};

export const DeepLinkedInputs = ({ objPtr }:{
   objPtr : PurePtr<{ text : string[] }>
}) => {
    const arrayPtr = objPtr.at( 'text' );
    return (
        <fieldset>
            <legend>Deeply linked and validated state elements</legend>
            { arrayPtr.map( ( itemPtr, i ) =>(
                <label key={ i }>
                    { i + ':' }
                    <Input valuePtr={ itemPtr.check( isNumber ) } />
                    <button onClick={ () => itemPtr.remove() } >x</button>
                </label>
            ))}

            <button onClick={ () => arrayPtr.push( '' ) }>Add</button>
        </fieldset>
    );
};
