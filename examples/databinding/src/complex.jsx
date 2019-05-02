import React from 'react';
import { Input, isNumber } from 'linked-controls';

export const JointLinks = ({ $str, $str2 }) => {
    $str.check( isNumber );
    const $joint = $str.onChange( x => $str2.set( x ) );

    return (
        <fieldset>
            <legend>Joint links</legend>

            <label>
                First
                <Input $value={ $joint }/>
            </label>

            <label>
                Should update when first changes
                <Input $value={ $str2.pipe( x => x && x.toUpperCase() ) }/>
            </label>
        </fieldset>
    );
};

export const DeepLinkedInputs = ({ $obj }) => {
    const $array = $obj.at( 'text' );
    return (
        <fieldset>
            <legend>Deeply linked and validated state elements</legend>
            { $array.map( ( $item, i ) =>(
                <label key={ i }>
                    { i + ':' }
                    <Input $value={ $item.check( isNumber ) } />
                    <button onClick={ () => $item.remove() } >x</button>
                </label>
            ))}

            <button onClick={ () => $array.push( '' ) }>Add</button>
        </fieldset>
    );
};
