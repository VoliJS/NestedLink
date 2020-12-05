import './main.css';

import React from 'react'
import ReactDOM from 'react-dom';
import { LinkedComponent } from '@linked/react';
import { CheckboxListGroup, CheckboxObjGroup, CustomCheckboxObjGroup } from './checkbox.jsx';
import { DeepLinkedInputs, JointLinks } from './complex.jsx';
import { HooksExample } from './hooks.jsx';
import { Numeric, SimpleBinding, SelectOption } from './inputs.jsx';
import { CustomRadioGroup, RadioGroup } from './radio.jsx';
    
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
        const state$ = this.state$();

        return (
            <div>
                <SimpleBinding $str={ state$.str } $bool={ state$.bool } />
                <Numeric $num={ state$.num } />
                <DeepLinkedInputs $obj={ state$.deep } />
                <JointLinks $str={ state$.str } $str2={ state$.str2 } />

                <CheckboxObjGroup $flags={ state$.objFlags } />
                <CustomCheckboxObjGroup $flags={ state$.objFlags } />

                <CheckboxListGroup $flags={ state$.arrFlags } />

                <RadioGroup $flag={ state$.radioFlag } />
                <SelectOption $flag={ state$.radioFlag } />
                <CustomRadioGroup $flag={ state$.radioFlag } />
                <HooksExample />
            </div>
        );
    }
}

ReactDOM.render( <App />, document.getElementById( 'app-mount-root' ) );
