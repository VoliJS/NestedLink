# Painless React forms, validation, and state management
PurePtr enhances the `useState` React Hook, offering a sophisticated, callback-free solution for managing complex forms with input validation. It transforms the React state into an efficient state container. Lightweight at just 6.5K minified, PurePtr is compatible with both JavaScript and TypeScript.

The core of PurePtr is the `PurePtr` object, which represents a pointer to an element of the component's state. It encapsulates the value, a function to update the value, and validation errors. The `PurePtr` class includes methods for useful transformations, such as `ptr.props`, which generates the standard React `{ value, onChange }` props.

PurePtr significantly enhances the modularity and readability of your React project.

```javascript
import { useStatePtr } from '@pure-ptr/react'
import { MyInput } from './controls.jsx'

const MyCoolComponent = () => {
    // Define the component state
    const statePtr = useStatePtr( () => ({
        some : {
            name : '' 
        } 
    }));
    
    // Get the pointer to state.some.name
    const namePtr = statePtr.at( 'some' ).at( 'name' );
    
    // apply validation rules
    namePtr.check( x => x.length > 0, 'Name is required' ),
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

- Two-way data binding to the component state without callbacks.
- Separate validation logic from the markup.
- Easily manage nested objects and arrays in the component state.
- Precise TypeScript typings.

Reference implementation of 'linked' UI controls:

- Standard tags: `<Input />`, `<TextArea />`, `<Select />`
- Custom tags: `<Radio />`, `<Checkbox />`, `<NumberInput />`
- Validator functions: `isNumber`, `isEmail`, `isRequired`

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

### Start hacking

![design](/images/valuelinks.jpg)

It's a very simple library written with TypeScript, there's no any magic inside (except some scary type annotations). If you want to play with the examples, fix the bug, or whatever:

`yarn` - installs the dependencies.

`yarn build` - compiles everything including examples.

## Release Notes
### 2.0

- IMPORTANT: Repository is converted to the monorepository based on yarn worspaces.
- IMPORTANT: `valuelink/tags.jsx` is moved to the dedicated package `linked-controls`.
- Complete support of new React Hooks API.
    - `useLink()` to create the state link.
    - `useIO()` to perform promised IO on mount.
    - `useLocalStorage()` to persist links to the local storage (loaded on mount, saved on unmount).
- $-notation for the link variables.
- New React.Component API (`this.linkAt -> this.$at`, `this.linkAll` -> `this.state$`)
- Group operations `Link.getValues()`, `Link.setValues()`, `Link.getErrors()`

### v1.6

React Hooks support.

- `useLink( initValue )` - create linked state.
- `setLinks({ lnk1, lnk2, ... }, json )` - bulk set link values from an object.
- `linksValues({ lnk1, lnk2, ... })` - extract values object from links.
- `linksErrors({ lnk1, lnk2, ... })` - extract errors object from links.

### v1.5

- `<input {...link.props} />` can be used to bind the link to any of the standard controls expecting `value` and `onChange` props.

---
![usedby](/images/usedby.png)
