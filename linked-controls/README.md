# Linked Controls

The reference implementation of React form controls using [value links](https://github.com/VoliJS/NestedLink). Can be used as is or as a starting boilerplate for your custom controls with inlined validation errors.

Link can be bound to the any form control consuming `value` and `onChange` props, so linked controls from this package may be used but are not really required.

```javascript
<input {...$value.props} />
```

However, it's beneficial to create a custom form control wrappers encapsulating your markup patterns for a form layout and validation in order to take a full advantage of the value link.

## Installation

    npm install linked-controls --save-dev

## React hooks

##### useThrottle( fun, timeout, changes = [] )

Produce throttled version of the `fun` function, which will be executed after the given delay in msecs.
All external variabled used by fun must be listed in `changes` array to prevent race conditions.

The hook is used by the `<DelayedInput/>`.

## List of controls

### Text and number form fields 

##### `<Input type="text"/>`, `<TextArea />` 

Wrappers for standard `<input>` and `<textarea>` tags which can be directly bound to the string links.

These wrappers will add `invalid` class to enclosed HTML element if an error is present in the link.

```jsx
<Input type="text" $value={ $link } />
<TextArea $value={ $link } />
```

##### `<NumberInput/>`

A cross-browser implementation of *numeric input* tag. It has following differences compared to `<Input>`:

- Keyboard input which obviously leads to invalid values (e.g. letters) are rejected.
- Value is being always converted to valid number.
- There are `integer` and `positive` boolean props controlling input rejection. They can be combined.

`<NumberInput>` validates its value and adds `invalid` class to enclosed input element if it's not a number.

```jsx
<NumberInput $value={ $link } />
<NumberInput $value={ $link } integer={ true }/>
<NumberInput $value={ $link } positive={ true }/>
```

##### `<DelayedInput/>`

Text input field updating the `$value` after the given timeout when user stopped typing (1 second by default).

```jsx
<DelayedInput $value={$link} timeout={500} />
```
### Checkboxes

##### `<Input type="checkbox" />`

Wrapper for the standard `<input>`. Directly binds boolean value with `checkedLink` property.

```jsx
<Input type="text" $checked={ booleanLink } />
<Input type="text" $checked={ $array.contains( 'option' ) } />
```

##### `<Checkbox/>`

Internally, it's `<div>` element which toggles `selected` class on click.
Thus, it can be easily styled.

By default, it has `checkbox` CSS class which can be overridden by passing `className` prop.

It passes through anything else including `children`.
 
```jsx
<Checkbox $checked={ $boolean } />
<Checkbox $checked={ $array.contains( 'option' ) } />
```

### Radio Groups and Select list

##### `<Select/>`

Wrapper for standard `<select/>`. Regular `<option/>` tags must be used. All props are passed through.

```jsx
<Select $value={ linkToSelectedValue }>
    <option value="a">A</option>
    <option value="b">B</option>
</Select>
```

##### `<Input type="radio"/>`
      
Wrapper for the standard `<input>`. Directly binds boolean value with `$checked` property.

Can be directly bound to the link of any type with `$value` or `$checked` property.

```jsx
<label>
    A:
    <Input type="radio" $value={ $flag } value="a" />
</label>
<label>
    B:
    <Input type="radio" $checked={ $flag.equals( "b" ) } />
</label>
```

##### `<Radio/>`

Internally, it's `<div>` element which always sets `selected` class on click. Thus,
it can be easily styled. 

By default, it has `radio` CSS class, which can be overridden by passing `className` prop.
It passes through anything else, including `children`.

It *must* be used in conjunction with `$link.equals( 'value' )` method.

```jsx
<label>
    A:
    <Radio $checked={ $flag.equals( 'a' ) } />
</label>
<label>
    B:
    <Radio $checked={ $flag.equals( 'b' ) } />
</label>
```
