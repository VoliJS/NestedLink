# Introduction

PurePtr is a lightweight library designed to enhance state management and form validation in React applications. It combines a sophisticated state container for managing complex state, seamless two-way data binding for forms, robust validation mechanisms, and an I/O hook for handling asynchronous operations. Compatible with both JavaScript and TypeScript, PurePtr significantly improves the modularity and readability of your React projects, making state management and form validation more intuitive and less error-prone.

```javascript
import { useStatePtr } from '@pure-ptr/react'
import { MyInput } from './controls.jsx'

const MyComponent = () => {
    // Define the component state
    const statePtr = useStatePtr( () => ({
        some : {
            name : '' 
        } 
    }));
    
    // Get the pointer to state.some.name
    const namePtr = statePtr.at( 'some' ).at( 'name' );
    
    // apply validation rules
    namePtr
        .check( x => x.length > 0, 'Name is required' ),
        .check( x => x.length > 2, 'Name is too short' );
        .check( x => x.length < 20, 'Name is too long' );

    return (
        <MyInput valuePtr={namePtr} />
    )
}

// controls.jsx
import * as React from 'react'

// Custom form field with validation taking the pointer to the `value`
const MyInput = ({ valuePtr }) => (
    <div>
        <input {...valuePtr.props} className={ valuePtr.error ? 'error' : '' } />
        <span>{ valuePtr.error || '' }</span>
    </div>
)
```

## Features

- State Management
    - `useStatePtr()`: Creates a pointer to a local component state.
    - `useLocalStoragePtr()`: Creates a pointer to a state persisted in local storage.
    - `useSessionStoragePtr()`: Creates a pointer to a state persisted in session storage.
    - `useLinkedStatePtr()`: Creates a pointer to a local component state linked to another state.
    - `ptr.at()`, `ptr.map()`, and other methonds to supports complex state updates, including array and object manipulations.

- React Forms
    - `ptr.check()`: Adds a validation rule to a pointer.
    - `ptr.error`: Returns the encapsulated validation error.
    - `ptr.props`: Generates standard React { value, onChange } props for easy two-way databinding.
    - `ptr.contains()`, `ptr.equals()` and other methods to support complex data binding scenarios like presence if the value in the array.

- `useAsync()`: handle asynchronous operations within a React component using async/await, promises, and cancellations.

- Helpers
    - `useThrottle()`: Throttles a function, ensuring it is only called once within the specified timeout period.
    - `useInterval()`: Executes a function on a timer interval.
    - `DelayedInput`: A input component for handling delayed input updates.
    - `NumericInput`: A input component for handling numeric input with wrong input rejection.

## Tutorials

The rationale behind the design and a high-level overview of how amazing NestedLink is: [React Hooks, form validation, and complex state](https://itnext.io/react-hooks-and-two-way-data-binding-dd4210f0ed94)

A series of 5-minute tutorials (with `React.Component`):

- [The basics of ValueLink design pattern](https://medium.com/@gaperton/managing-state-and-forms-with-react-part-1-12eacb647112#.j7sqgkj88)
- [Form validation with ValueLinks](https://medium.com/@gaperton/react-forms-with-value-links-part-2-validation-9d1ba78f8e49#.nllbm4cr7)
- [Complex state with ValueLinks](https://medium.com/@gaperton/state-and-forms-in-react-part-3-handling-the-complex-state-acf369244d37#.x0fjcxljo)

### [API Reference](/valuelink/API.md)

### [Linked Controls Reference](/linked-controls/README.md)

### [Examples](https://volijs.github.io/NestedLink)([sources](/examples/))

## How to

### Use it in your project

There are no side dependencies except `react` as peer dependency. Installation:

`npm install valuelink --save-dev`

Refer to the [databinding examples](/examples/databinding) and the [manual](/linked-controls/README.md) for the typical data binding scenarios.

### Create your own data bound controls

Use [linked-controls](/linked-controls) project as the starting boilerplate for your components.

### Create the binding to the custom state container

NestedLink is an abstraction of the data binding independent on both the particular control and the state container. The [default binding](/valuelink/src/component.ts) implemented
in the library is for the standard React state. It's fairly easy to create your own.

You need to subclass React.Component and make your own `$at` and `state$` methods.
You can either use `Link.value` inside to create links dynamically, or extend the `Link` as it's done in [/valuelink/src/component.ts](/valuelink/src/component.ts).