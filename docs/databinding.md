# Data binding Reference

Link can be bound to the standard form control consuming value and onChange props like this:

```javascript
<input {...$value.props} />
```

In order to take the full advantage of the value link pattern you're encouraged to create
custom semantic form control wrappers, encapsulating the markup for form layout and validation.

Here's the reference for data bound tags from [valuelink/tags](/src/tags.tsx) which might be used
as starting boilerplate.

### Text and number form fields 

##### `<Input type="text"/>`, `<TextArea />` 

`tags.jsx` contains wrappers for standard `<input>` and `<textarea>` tags,
  which can be directly bound to the string state elements.

These wrappers will add `invalid` class to enclosed HTML element, if an error is present in the bound link.

```jsx
<Input type="text" $value={ $link } />
<TextArea $value={ $link } />
```

##### `<NumberInput/>`

There's also cross-browser implementation of *numeric input* tag. It has following differences compared to `<Input>`:

- Keyboard input which obviously leads to invalid values (e.g. letters) are rejected.
- Value is being always converted to valid number.
- There are `integer` and `positive` boolean props controlling input rejection. They can be combined.

`<NumberInput>` validates its value, and adds `invalid` class to enclosed input element if it's not a number.

```jsx
<NumberInput $value={ $link } />
<NumberInput $value={ $link } integer={ true }/>
<NumberInput $value={ $link } positive={ true }/>
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

By default, it has `checkbox` CSS class, which can be overridden by passing `className` prop.

It passes through anything else, including `children`.
 
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

Can be directly bound to the state member using `$value` property.

```jsx
<label>
    A:
    <Input type="radio" $value={ $flag } value="a" />
</label>
<label>
    B:
    <Input type="radio" $value={ $flag } value="b" />
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
