import ReactDOM from 'react-dom'
import { LinkedComponent, useLink } from 'valuelink'
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
                <HooksExample />
            </div>
        );
    }
}

ReactDOM.render( <App />, document.getElementById( 'app-mount-root' ) );
