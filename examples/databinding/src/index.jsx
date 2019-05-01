import './main.css';

import ReactDOM from 'react-dom';
import { LinkedComponent } from 'valuelink';
import { CheckboxListGroup, CheckboxObjGroup, CustomCheckboxObjGroup } from './checkbox';
import { DeepLinkedInputs, JointLinks } from './complex';
import { HooksExample } from './hooks';
import { Numeric, SimpleBinding } from './inputs';
import { CustomRadioGroup, RadioGroup } from './radio';
    
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
