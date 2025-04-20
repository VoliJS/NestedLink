# Two-way data binding

This guide introduces two-way data binding using pointers in React. With `valuePtr` and related pointer utilities, you can bind form components directly to your application state while keeping the code clean and declarative. Examples include basic inputs, custom wrappers, checkboxes, radio buttons, select elements, and more advanced use cases like delayed or throttled updates.

## Binding to HTML input

This is the simplest example of two-way binding using `valuePtr`. It spreads pre-configured props into a native input element, allowing seamless integration with forms.

```javascript
<input {...valuePtr.props} />
```

## Creating the component wrapper

You can encapsulate pointer logic in a reusable `<Input>` component. This wrapper handles value updates, validation messages, and styling, making your forms cleaner and more consistent.

```javascript
const Input = ({ valuePtr, ...props }) => (
    <div className={`form-control ${ valuePtr.error ? 'error' : '' }`}>
        <input {...props}
            value={ valuePtr.value }
            onChange={ e => valuePtr.set( e.target.value ) }
        />
        <div className="validation-error">
            { valuePtr.error || '' }
        </div>
    </div>
);
```

## Text Inputs

This section demonstrates different patterns for managing user text input, such as delayed and throttled updates. These techniques are useful when you want to defer pointer updates for performance or UX reasons.

### Delayed Input

Updates to the pointer are buffered locally and committed only when the user finishes editing—on blur or when pressing Enter.

```javascript
const DelayedInput = ({ valuePtr }) => {
    const [ statePtr, saveState ] = useLinkedStatePtr(valuePtr);

    return (
        <input
            value={temp}
            onChange={e => setTemp(e.target.value)}
            onBlur={saveState}
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    saveState();
                }
            }}
        />
    );
};
```

### Throttled Input

A throttled input delays updates to the pointer, emitting them periodically instead of on every keystroke. This pattern is useful for filtering, autocomplete, or real-time search.

## Checkbox

Checkboxes can be bound using either a boolean pointer or an array pointer that tracks inclusion of a specific value. This allows rich binding logic for form selections.

=== "Bind to Boolean"
    ```javascript
    <Input 
        type="checkbox" 
        chechedPtr={ booleanPtr } 
    />
    ```

=== "Bind to presence in Array"
    ```javascript
    <Input 
        type="checkbox" 
        chechedPtr={ arrayPtr.contains( 'option' ) } 
    />
    ```

## Radio group

Radio inputs can be linked to a single pointer that tracks the selected option, or you can use a derived boolean pointer for individual options.

=== "Bind to value"
    ```javascript
    <label>
        A:
        <Input 
            type="radio" 
            valuePtr={ selectedPtr } 
            value="a" 
        />
    </label>
    ```

=== "Bind to derived boolean pointer"
    ```javascript
    <label>
        B:
        <Input 
            type="radio" 
            chechedPtr={ selectedPtr.equals( "b" ) } 
        />
    </label>
    ```

## Select from the list

The `<Select>` component allows binding to a pointer using the `valuePtr` prop. It supports native HTML options and reflects user changes into the underlying state.

```javascript
<Select valuePtr={ selectedPtr }>
    <option value="a">A</option>
    <option value="b">B</option>
</Select>
```

## Multiselect

A multiselect interface can bind to an array pointer or similar structure to reflect multiple selections. Implementation depends on your component and binding strategy.
