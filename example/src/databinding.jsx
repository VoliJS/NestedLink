/**
 * ValueLink Data binding examples
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */

import './main.css'
import React from 'react'
import ReactDOM from 'react-dom'
import Link, { LinkedComponent } from 'valuelink'
import { Input, NumberInput, Select, TextArea, Radio, Checkbox } from 'valuelink/tags'

class App extends LinkedComponent {
    // All this stuff we can link to
    state = {
            num : 0,

            // Simple binding to inputs
            str       : 67,
            str2      : "dedede",
            bool      : true,

            // Binding to checkboxes
            objFlags  : {
                a : true,
                b : false
            },

            // Binding to checkboxes
            arrFlags  : [ 'a', 'b' ],

            // binding to inputs
            deep      : {
                text : [ 'not a number', 25 ]
            },

            // that will be bound to radio and select list
            radioFlag : 'a'
    }

    render(){
        const links = this.linkAll();

        return (
            <div>
                <SimpleBinding strLink={ links.str } boolLink={ links.bool } />
                <Numeric numLink={ links.num } />
                <DeepLinkedInputs objLink={ links.deep } />
                <JointLinks strLink={ links.str } str2Link={ links.str2 } />

                <CheckboxObjGroup flagsLink={ links.objFlags } />
                <CustomCheckboxObjGroup flagsLink={ links.objFlags } />

                <CheckboxListGroup flagsLink={ links.arrFlags } />

                <RadioGroup flagLink={ links.radioFlag } />
                <SelectOption flagLink={ links.radioFlag } />
                <CustomRadioGroup flagLink={ links.radioFlag } />
            </div>
        );
    }
}

const isNumber = x => !isNaN( Number( x ) );

const Numeric = ({ numLink }) => (
    <fieldset>
        <legend>Number fields with wrong input rejection</legend>

        <label>
            Number
            <NumberInput valueLink={ numLink }/>
        </label>

        <label>
            Positive
            <NumberInput valueLink={ numLink } positive={ true } />
        </label>

        <label>
            Integer
            <NumberInput valueLink={ numLink } integer={ true } />
        </label>
    </fieldset>
);

const SimpleBinding = ({ strLink, boolLink }) => {
    strLink.check( isNumber );

    return (
        <fieldset>
            <legend>Direct state fields binding</legend>

            <label>
                Standard input
                <input { ...strLink.props }/>
            </label>

            <label>
                String
                <Input valueLink={ strLink }/>
            </label>

            <label>
                TextArea
                <TextArea valueLink={ strLink }/>
            </label>

            <label>
                Checkbox bound to bool
                <Input type="checkbox" checkedLink={ boolLink }/>
            </label>
        </fieldset>
    );
};

const JointLinks = ({ strLink, str2Link }) => {
    strLink.check( isNumber );
    const jointLink = strLink.onChange( x => str2Link.set( x ) );

    return (
        <fieldset>
            <legend>Joint links</legend>

            <label>
                First
                <Input valueLink={ jointLink }/>
            </label>

            <label>
                Should update when first changes
                <Input valueLink={ str2Link.pipe( x => x && x.toUpperCase() ) }/>
            </label>
        </fieldset>
    );
};

const DeepLinkedInputs = ({ objLink }) => {
    const arrayLink = objLink.at( 'text' );
    return (
        <fieldset>
            <legend>Deeply linked and validated state elements</legend>
            { arrayLink.map( ( itemLink, i ) =>(
                <label key={ i }>
                    { i + ':' }
                    <Input valueLink={ itemLink.check( isNumber ) } />
                    <button onClick={ () => itemLink.remove() } >x</button>
                </label>
            ))}

            <button onClick={ () => arrayLink.push( '' ) }>Add</button>
        </fieldset>
    );
};

const CheckboxObjGroup = ({ flagsLink }) => {
    const links = flagsLink.pick( 'a', 'b' );

    return (
        <fieldset>
            <legend>Standard checkbox group bound to object</legend>
            <label>
                A: <Input type="checkbox" checkedLink={ links.a }/>
            </label>
            <label>
                B: <input type="checkbox" { ...links.b.props }/>
            </label>
        </fieldset>
    );
}

const CustomCheckboxObjGroup = ({ flagsLink }) => (
    <fieldset>
        <legend>Custom checkbox group bound to object</legend>
        <label>
            A: <Checkbox checkedLink={ flagsLink.at( 'a' ) }/>
        </label>
        <label>
            B: <Checkbox checkedLink={ flagsLink.at( 'b' ) }/>
        </label>
    </fieldset>
);

const CheckboxListGroup = ({ flagsLink }) => (
    <fieldset>
        <legend>Checkbox group bound to list</legend>
        <label>
            A: <Input type="checkbox" checkedLink={ flagsLink.contains( 'a' ) }/>
        </label>
        <label>
            B: <Input type="checkbox" checkedLink={ flagsLink.contains( 'b' ) }/>
        </label>
    </fieldset>
);

const RadioGroup = ({ flagLink }) => (
    <fieldset>
        <legend>Radio group bound to value</legend>
        <label>
            A: <Input type="radio" valueLink={ flagLink } value="a" />
        </label>
        <label>
            B: <input type="radio" { ...flagLink.equals( 'b' ).props } />
        </label>
    </fieldset>
);

const SelectOption = ({ flagLink }) =>(
    <fieldset>
        <legend>Select option from list</legend>
        <label>Select:
            <Select valueLink={ flagLink }>
                <option value="a">a</option>
                <option value="b">b</option>
            </Select>
        </label>
    </fieldset>
);

const CustomRadioGroup = ({ flagLink }) => (
    <fieldset>
        <legend>Custom Radio group bound to value</legend>
        <label>
            A: <Radio checkedLink={ flagLink.equals( 'a' ) } />
        </label>
        <label>
            B: <Radio checkedLink={ flagLink.equals( 'b' ) } />
        </label>
    </fieldset>
);

ReactDOM.render( <App />, document.getElementById( 'app-mount-root' ) );

