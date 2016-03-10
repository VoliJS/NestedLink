import './main.css'
import React from 'react'
import ReactDOM from 'react-dom'
import Link from 'index.js'
import { Input, Select, TextArea, Radio, Checkbox } from 'tags.jsx'

const App = React.createClass( {
    getInitialState(){
        return {
            str       : 67,
            bool      : true,
            objFlags  : {
                a : true,
                b : false
            },
            arrFlags  : [ 'a', 'b' ],
            deep      : {
                text : [ 'not a number', 25 ]
            },
            radioFlag : 'a'
        }
    },

    render(){
        return (
            <div>
                <SimpleBinding strLink={ Link.state( this, 'str' )} boolLink={ Link.state( this, 'bool' )} />
                <DeepLinkedInputs objLink={ Link.state( this, 'deep' ) } />

                <CheckboxObjGroup flagsLink={ Link.state( this, 'objFlags' ) } />
                <CustomCheckboxObjGroup flagsLink={ Link.state( this, 'objFlags' ) } />

                <CheckboxListGroup flagsLink={ Link.state( this, 'arrFlags' ) } />

                <RadioGroup flagLink={ Link.state( this, 'radioFlag' ) } />
                <SelectOption flagLink={ Link.state( this, 'radioFlag' ) } />
                <CustomRadioGroup flagLink={ Link.state( this, 'radioFlag' ) } />
            </div>
        );
    }
} );

const isNumber = x => !isNaN( Number( x ) );

const SimpleBinding = ({ strLink, boolLink }) => {
    strLink.check( isNumber );

    return (
        <fieldset>
            <legend>Direct state fields binding</legend>

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
}

const DeepLinkedInputs = ({ objLink }) => (
    <fieldset>
        <legend>Deeply linked inputs</legend>
        { objLink.at( 'text' ).map( ( itemLink, i ) =>(
            <Input key={ i } valueLink={ itemLink.check( isNumber ) } />
        ))}
    </fieldset>
);

const CheckboxObjGroup = ({ flagsLink }) => (
    <fieldset>
        <legend>Custom Checkbox group bound to object</legend>
        <label>
            A:
            <Input type="checkbox" checkedLink={ flagsLink.at( 'a' ) }/>
        </label>
        <label>
            B:
            <Input type="checkbox" checkedLink={ flagsLink.at( 'b' ) }/>
        </label>
    </fieldset>
);

const CustomCheckboxObjGroup = ({ flagsLink }) => (
    <fieldset>
        <legend>Custom checkbox group bound to object</legend>
        <label>
            A:
            <Checkbox checkedLink={ flagsLink.at( 'a' ) }/>
        </label>
        <label>
            B:
            <Checkbox checkedLink={ flagsLink.at( 'b' ) }/>
        </label>
    </fieldset>
);

const CheckboxListGroup = ({ flagsLink }) => (
    <fieldset>
        <legend>Checkbox group bound to list</legend>
        <label>
            A:
            <Input type="checkbox" checkedLink={ flagsLink.contains( 'a' ) }/>
        </label>
        <label>
            B:
            <Input type="checkbox" checkedLink={ flagsLink.contains( 'b' ) }/>
        </label>
    </fieldset>
);

const RadioGroup = ({ flagLink }) => (
    <fieldset>
        <legend>Radio group bound to value</legend>
        <label>
            A:
            <Input type="radio" valueLink={ flagLink } value="a" />
        </label>
        <label>
            B:
            <Input type="radio" valueLink={ flagLink } value="b" />
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
            A:
            <Radio checkedLink={ flagLink.equals( 'a' ) } />
        </label>
        <label>
            B:
            <Radio checkedLink={ flagLink.equals( 'b' ) } />
        </label>
    </fieldset>
);

ReactDOM.render( <App />, document.getElementById( 'app-mount-root' ) );

