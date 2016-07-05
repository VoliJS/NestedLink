![logo](/images/value-link-logo.png) 

# Purely functional data binding for React

Library for purely functional data binding in React based on `value link` pattern.

Approach used by this library significantly differs to common way of dealing with state and forms in React.
While based on original React Link idea, `valuelink` moves it far further providing simple and elegant solutions
for common problems, such as data binding of the complex state and form validation.

Introductory tutorials explaining the basics of the 'Value Link' pattern:

- [Managing state and forms with React. Part 1](https://medium.com/@gaperton/managing-state-and-forms-with-react-part-1-12eacb647112#.j7sqgkj88)
- [Managing state and forms with React, Part 2: Validation](https://medium.com/@gaperton/react-forms-with-value-links-part-2-validation-9d1ba78f8e49#.nllbm4cr7)
- [State and forms in React, part 3: Managing Complex State](https://medium.com/@gaperton/state-and-forms-in-react-part-3-handling-the-complex-state-acf369244d37#.x0fjcxljo)

Working examples are [here](https://volicon.github.io/NestedLink/)

Features:

- Able to link complex React state with nested objects and arrays.
- All major data binding scenarios are supported, including radio groups and select lists.
- Declarative form validation.
- Support for 'pure render' optimization.
- Reference implementation of 'linked' UI controls (`tags.jsx`).
    - Standard tags: `<Input />` and `<TextArea />` (with validation), `<Select />`,
    - Custom tags: `<Radio />`, `<Checkbox />`, `<NumberInput />`
- TypeScript source and type definitions.
- Backward compatible with standard React 0.14 links API

![Value Links](/images/valuelinks.jpg)

> This technology is one of the key components of [NestedReact](https://github.com/Volicon/NestedReact) architecture, 
> helping you to build large-scale React applications with a powerful and fast [NestedTypes](https://github.com/Volicon/NestedTypes/)
> classical OO models.

# New in 1.3

- API for links cache, dramatically simplifying forms data binding:
    - All links created with `Link.state` are cached, and are recreated only when value is different.
    - `const links = Link.all( this, 'attr1', 'attr2', ... )` makes sure that links for specified `state` members
        are cached, and returns the reference to the cache. Thus, `links.attr1` is the direct reference to the link.
    - Links cache is directly accessible in `render()` with `this.links`.
- Link methods for purely functional updates of the enclosed object:
    - Links to arrays: `unshift(...)`, `push(...)`, `splice(...)` proxy call to native Array methods.
    - Links to arrays and objects: `remove( key )` removes element with specified key.
    - Links to array and object members: `remove()` removes element from parent object or array.
- Methods for links to objects and arrays:
    - `link.pick( key1, key2, ... )` creates an object with links to listed object members, in the same way as `Link.all`.
    - `link.clone()` creates shallow copy of the enclosed object.
- Added "Users List" application example.
- `link.toggle` is _removed_. Use `link.update( x => !x )` instead.
- Validator functions for `link.check` may contain default `error` message.
- `link.onChange( callback )` and `link.pipe( transform )` for listening on link changes.
- tags.jsx:
    - `<NumberInput/>` tag with input rejection for numbers.
    - All text input tags adds `required` class if there's validation error and value is empty (issue #5). 

# Installation

`npm install valuelink`

CommonJS module, MIT License. No side dependencies.

```javascript
// Links
import Link from 'valuelink'

// You'll need this components with React 15.x instead of standard ones.
import { Input, TextArea, Select, Radio, Checkbox } from 'valuelink/tags.jsx'
```

`tags.jsx` intended to be starting boilerplate for your custom components. Copy this file to your project,
and start hacking.

# How to

## Create link

Links can be created and used inside of the React `component.render()` method.

### Linking to the state attributes

##### ![static] Link.state( this, stateKey ) : Link

You can create link to an attribute of component state directly:

```javascript
const nameLink = Link.state( this, 'name' ),
      emailLink = Link.state( this, 'email' );
```

##### ![var] this.links : { [ key ] : Link } 

All links to the state are _cached_ inside the `component.link` object.
When you create the link to the value which has not been changed since the last `render`,
link object will be _reused_. Which means that you can use `pure render` optimization.

##### ![static] Link.all( this, stateKey1, stateKey2, ... ) : { [ key ] : Link }

`Link.all` ensures that links to the listed state members are cached and up to date,
and returns `this.links` object.

```javascript
const links = Link.all( this, 'name', 'email' ),
      { name, email } = links;
```

### Links to object and arrays

##### ![method] linkToObject.at( key ) : Link

Create link to the member of array or object.

If linked value is plain object or array, it's possible to generate
links to their members. Whenever this derivative links will be
updated, it will lead to proper purely functional update (with shallow copying) of the
parent element.

```javascript
const deepLink = Link.state( this, 'array' ).at( 0 ).at( 'name' );

deepLink.set( 'Joe' ); // Will update component state.array
```

##### ![method] linkToObject.pick( key1, key2, ... ) : { [ key ] : Link }
 
Create links to the object's members, and wrap them in an object.

Example:

```javascript
const links = userLink.pick( 'name', 'email' ),
      { name, email } = links;
```

##### ![method] linkToObject.map( ( linkToItem, itemKey ) => any | void ) : any[]

Map and filter through array or object.

```javascript
var list = stringArrayLink.map( ( itemLink, index ) => {
    if( itemLink.value ){ // Skip empty elements
        return (
            <div key={ index }>
                <Input valueLink={ itemLink } />
            </div>
        );
    }
});
```

## Offhand boolean links

##### ![method] linkToArray.contains( element ) : Link

Creates the link to the presence of value in array.

Resulting link value is `true` whenever element is present in array, and `false` otherwise.
Whenever resulting link is assigned with new value, it will flip `element` in the array.

Useful for the large checkbox groups.

```javascript
const optionXBoolLink = arrayLink.contains( 'optionX' );
```

##### ![method] linkToAny.equals( whenTrue ) : Link

Create boolean link to value equality.

Resulting link value is `true` whenever parent link value equals to `whenTrue`, and `false` otherwise.
When resulting link is assigned with `true`, it sets parent link value with `whenTrue`, and with `null` otherwise.

Useful for radio groups.

```javascript
const optionXLink = stringLink.equals( 'optionX' );
```

### Custom links

##### ![static] Link.value( value, nextValue => void ) : Link

Create custom link with the given value and update function.

It may be used for different scenarios. Good example is to use 'edit element' component for adding new element.

Imagine that we have a component `<EditUser valueLink={ userLink } />` expecting the link to an object.
When editing is finished, `EditUser` will update the given link with a new values.

Then, following custom link will allow you to add new user with the same form element.

```javascript
<EditUser valueLink={ Link.value( {}, x => userArrayLink.push( x ) ) } />
```

Read more about links to objects updates in the next section.

##### ![method] link.onChange( callback : any => void ) : Link

Create the wrapper for existing link which will invoke callback whenever new
value is set.

##### ![method] link.pipe( transform : any => any ) : Link

Create the wrapper for existing link which will invoke given transform function
_before_ new value is set. Returned value will be used as new link value,
and if it's `undefined` update will be rejected.
 
```jsx
<Input valueLink={ strLink.pipe( x => x && x.toUpperCase() ) }/>
```

### Note for TypeScript users

`Link` actually is parametric type `Link< T >`, where T is the type of the enclosed value.
And both `Link.value< T >` and `Link.state< T >` are parametric functions. For `Link.state` type is always inferred
as `Object`, so you can refine it manually:

```javascript
const nameLink = Link.state< string >( this, 'name' );
```
    
## Link updates

### Simple value updates

##### ![method] link.set( x ) : void

##### ![method] link.requestChange( x ) : void

Set link to the given value.

```javascript
<button onClick={ () => boolLink.set( !boolLink.value ) } />
```

##### ![method] link.update( prevValue => any ) : void

Update link value using the given value transform function.

```javascript
<button onClick={ () => boolLink.update( x => !x ) } />
```

##### ![method] link.action( ( prevValue, event ) => any ) : ( event => void )

Create UI event handler which will transform the link.

`link.action` takes transform function, and produce a new function which takes single `event` argument.
When it's called, `event` and link `value` are passes as transform parameters, and link will be updated 
with returned value.

This is particularly useful in (but not restricted to) UI event handlers.

```javascript
// simple click event handler...
<button onClick={ boolLink.action( x => !x ) } />

// manual binding to input control:
const setValue = ( x, e ) => e.target.value;
...
<input  value={ link.value }
        onChange={ link.action( setValue ) } />
```

### Link to objects and arrays updates

Plain objects and arrays are shallow copied by `link.update()` and within `link.action()` handlers,
thus it's safe just to update the value in place.

##### ![method] linkToObject.update( clonedObject => Object ) : void
 
Update enclosed object or array.

##### ![method] linkToObject.action( ( clonedObject, event ) => Object ) : ( event => void )
 
Creates action to update enclosed object or array.

```javascript
<button onClick={ () => objLink.update( obj => {
                                obj.a = 1;
                                return obj;
                            }) } />
```

##### ![method] linkToObject.remove( key ) : void

##### ![method] linkToObject.at( key ).remove() : void

Remove element with a given key from the enclosed object ar array.

### Link to arrays updates

Link to arrays proxies some important Array methods. 

##### ![method] linkToArray.splice( ... ) : void

##### ![method] linkToArray.push( ... ) : void

##### ![method] linkToArray.unshift( ... ) : void

Works in the same way and accepts the same parameters as corresponding Array method,
but returns `undefined` and leads to the proper purely functional update of the parent object chain.

## Links validation

> It's highly recommended to read [tutorial](https://medium.com/@gaperton/react-forms-with-value-links-part-2-validation-9d1ba78f8e49#.nllbm4cr7)
> on validation with value links.

##### ![method] link.check( value => boolean, error = 'Invalid value' ) : Link
 
Evaluate given condition for the current link value, and assign
given error object to the `link.error` when it fails. There are no restriction on the error object shape and type.

It's possible to assign default error message to the validator function. `tags.jsx` provides `isRequired` and `isEmail`
generic validator functions as an examples. Excerpt from `tags.jsx`: 

```jsx
export const isRequired = x => x != null && x !== '';
isRequired.error = 'Required';
```
 
Checks can be chained. In this case, the first check which fails will leave its error in the link.

##### ![var] link.error : any | void

This link field may be analyzed by custom `<Input />` control to indicate an error (see `tags.jsx` controls and supplied examples).

This mechanics can be used to add ad-hoc validation in `render`. 

```javascript
// Simple check
const numLink = List.state( this, 'num' )
                .check( x => x >= 0 && x <=5 );

console.log( numLink.error );

// Check with error message
const numLink = List.state( this, 'num' )
                .check( x => x >= 0 && x <=5, 'Number must be between 0 and 5' );

console.log( numLink.error );

// Chained checks
const numLink = List.state( this, 'num' )
                .check( x => x >= 0, 'Negative numbers are not allowed' )
                .check( x => x <= 5, 'Number should be not greater than 5' );

console.log( numLink.error );
```

## Data binding examples

Here are the set of [working](https://volicon.github.io/valuelink/databinding.html) [examples](/databinding.html) for typical data binding use cases.

Also, there's [working](https://volicon.github.io/valuelink) [example](/example/userslist.jsx) of an application managing the users list.

[Custom elements boilerplate](/tags.jsx) which is used by both examples is another good example.

### Text and number form fields 

##### `<Input type="text"/>`, `<TextArea />` 

`tags.jsx` contains wrappers for standard `<input>` and `<textarea>` tags,
  which can be directly bound to the string state elements.

These wrappers will add `invalid` class to enclosed HTML element, if an error is present in the bound link.

```jsx
<Input type="text" valueLink={ link } />
<TextArea valueLink={ link } />
```

##### `<NumberInput/>`

There's also cross-browser implementation of *numeric input* tag. It has following differences compared to `<Input>`:

- Keyboard input which obviously leads to invalid values (e.g. letters) are rejected.
- Value is being always converted to valid number.
- There are `integer` and `positive` boolean props controlling input rejection. They can be combined.

`<NumberInput>` validates its value, and adds `invalid` class to enclosed input element if it's not a number.

```jsx
<NumberInput valueLink={ link } />
<NumberInput valueLink={ link } integer={ true }/>
<NumberInput valueLink={ link } positive={ true }/>
```

### Checkboxes

##### `<Input type="checkbox" />`

Wrapper for the standard `<input>`. Directly binds boolean value with `checkedLink` property.

```jsx
<Input type="text" checkedLink={ booleanLink } />
<Input type="text" checkedLink={ arrayLink.contains( 'option' ) } />
```

##### `<Checkbox/>`

Internally, it's `<div>` element which toggles `selected` class on click.
Thus, it can be easily styled.

By default, it has `checkbox` CSS class, which can be overridden by passing `className` prop.

It passes through anything else, including `children`.
 
```jsx
<Checkbox checkedLink={ booleanLink } />
<Checkbox checkedLink={ arrayLink.contains( 'option' ) } />
```

### Radio Groups and Select list

##### `<Select/>`

Wrapper for standard `<select/>`. Regular `<option/>` tags must be used. All props are passed through.

```jsx
<Select valueLink={ linkToSelectedValue }>
    <option value="a">A</option>
    <option value="b">B</option>
</Select>
```

##### `<Input type="radio"/>`
      
Wrapper for the standard `<input>`. Directly binds boolean value with `checkedLink` property.

Can be directly bound to the state member using `valueLink` property.

```jsx
<label>
    A:
    <Input type="radio" valueLink={ flagLink } value="a" />
</label>
<label>
    B:
    <Input type="radio" valueLink={ flagLink } value="b" />
</label>
```

##### `<Radio/>`

Internally, it's `<div>` element which always sets `selected` class on click. Thus,
it can be easily styled. 

By default, it has `radio` CSS class, which can be overridden by passing `className` prop.
It passes through anything else, including `children`.

It *must* be used in conjunction with `link.equals( 'value' )` method.

```jsx
<label>
    A:
    <Radio checkedLink={ flagLink.equals( 'a' ) } />
</label>
<label>
    B:
    <Radio checkedLink={ flagLink.equals( 'b' ) } />
</label>
```

[method]: /images/method.png
[static]: /images/static.png
[var]: /images/var.png
