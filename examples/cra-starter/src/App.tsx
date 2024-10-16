import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useStatePtr } from '@pure-ptr/react';
import { CheckboxListGroup, CheckboxObjGroup, CustomCheckboxObjGroup } from './checkbox';
import { DeepLinkedInputs, JointLinks } from './complex';
import { HooksExample } from './hooks';
import { Numeric, SimpleBinding, SelectOption } from './inputs';
import { CustomRadioGroup, RadioGroup } from './radio';

function App() {
  const statePtr = useStatePtr(() =>({
    num : 0,

    // Simple binding to inputs
    str       : "67",
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
}));

  return (
    <div className="App">
      <div>
          <SimpleBinding strPtr={ statePtr.at("str") } boolPtr={ statePtr.at("bool") } />
          <Numeric numPtr={ statePtr.at("num") } />
          <DeepLinkedInputs objPtr={ statePtr.at("deep") } />
          <JointLinks strPtr={ statePtr.at("str") } str2Ptr={ statePtr.at("str2") } />

          <CheckboxObjGroup flagsPtr={ statePtr.at("objFlags") } />
          <CustomCheckboxObjGroup flagsPtr={ statePtr.at("objFlags") } />

          <CheckboxListGroup flagsPtr={ statePtr.at("arrFlags") } />

          <RadioGroup flagPtr={ statePtr.at("radioFlag") } />
          <SelectOption flagPtr={ statePtr.at("radioFlag") } />
          <CustomRadioGroup flagPtr={ statePtr.at("radioFlag") } />
          <HooksExample />
      </div>
    </div>
  );
}

export default App;
