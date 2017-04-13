![logo](/images/value-link-logo.png) 

# Purely functional data binding for React

Lightweight (6.5K minified) purely functional two-way data binding for the React designed for TypeScript and ES6.

While losely based on the original React Link idea, `valuelink` develops the idea further providing simple and elegant solutions
for many common problems, such as data binding of the complex state elements and form validation.

Introductory tutorials explaining the basics of the 'Value Link' pattern:

- [Managing state and forms with React. Part 1](https://medium.com/@gaperton/managing-state-and-forms-with-react-part-1-12eacb647112#.j7sqgkj88)
- [Managing state and forms with React, Part 2: Validation](https://medium.com/@gaperton/react-forms-with-value-links-part-2-validation-9d1ba78f8e49#.nllbm4cr7)
- [State and forms in React, part 3: Managing Complex State](https://medium.com/@gaperton/state-and-forms-in-react-part-3-handling-the-complex-state-acf369244d37#.x0fjcxljo)

Examples are [here](https://volicon.github.io/NestedLink/)

Features:

- Support for all major data binding scenarios, including radio groups and select lists.
- Declarative form validation.
- Easy handling of the complex React state with nested objects and arrays.
- 'pure render' optimization friendly due to the value links caching. 
- Exact type inference with the TypeScript.

Reference implementation of 'linked' UI controls included (`tags.jsx`).

- Standard tags: `<Input />` and `<TextArea />` (with validation), `<Select />`,
- Custom tags: `<Radio />`, `<Checkbox />`, `<NumberInput />`

![Value Links](/images/valuelinks.jpg)

> This technology is one of the key components of [NestedReact](https://github.com/Volicon/NestedReact) architecture, 
> helping you to build large-scale React applications with a powerful and fast [NestedTypes](https://github.com/Volicon/NestedTypes/)
> classical OO models.

# New in 1.4

- (!) `link.remove( key )` is renamed to `link.removeAt( key )`; `link.remove()` will work as usual for the links to array/object elements.
- New ES6 API for value links creation:
    - Extend the `LinkedComponent` base class instead of `React.Component`.
    - Use `this.linkAt( 'stateKey' )` instead of `Link.state( this, 'stateKey' )`.
    - Use `this.linkAll( 'key1', 'key2', ... )` instead of `Link.all( this, 'key1', 'key2', ... )`.
    - `this.linkAll()` without arguments will link each member of the state.
    - New API is precisely typed with the recent TypeScript features. `this.linkAt( 'a' )` will cause compilation error if 'a' is not a member of the state. Generated links are properly typed as well.
- Support for modern bundlers in the package.json (`module` field points to `lib` folder with transpiled ES6-import modules).
- UMD module is included in `dist` folder (exporting `NestedLink` global variable).
- Updated examples.

# Installation

## To use in your project

`npm install valuelink`

Both UMD and ES6-imports modules are available. MIT License. No side dependencies.

```javascript
// Links
import React from 'react'
import Link, { LinkedComponent } from 'valuelink'

// You'll need this components with React 15.x instead of standard ones.
import { Input, TextArea, Select, Radio, Checkbox } from 'valuelink/tags.jsx'
```

`tags.jsx` intended to be starting boilerplate for your custom components. Copy this file to your project,
and start hacking.

## To start hacking

If you want to play with the examples, fix the bug, or whatever:

`npm install` - installs the dependencies.

`npm run build` - compiles everything including examples.

## To create your custom data binding

It's really straightforward. Look at the `component.ts` file to see how binding to React state is implemented, it should be a good start.
Basically, all you need is to subclass React.Component and make your own `linkAt` and `linkAll` methods.
You can either use `Link.value` inside to create links dynamically, or extend the `Link` as it's done there.

# How to

## Create link

Links can be created and used inside of the React `component.render()` method.

### Linking to the state attributes

##### ![method] LinkedComponent.linkAt( stateKey ) : Link

Create link to an attribute of the component's state. Component must extend `LinkedComponent` class.

Can be overriden to create custom data binding for something different than the React state.

```javascript
const nameLink = this.linkAt( 'name' ),
      emailLink = this.linkAt( 'email' );
```

##### ![method] LinkedComponent.linkAll( stateKey1, stateKey2, ... ) : { [ key ] : Link }

Create an object with links to listed state members. When no keys are provided, it creates link to 
every member of the state. Component must extend `LinkedComponent` class.

Can be overriden to create custom data binding for something different than the React state.

```javascript
const links = this.linkAll( 'name', 'email' ),
      { name, email } = links;
```

##### ![static] Link.state( this, stateKey ) : Link

Same as `component.linkAt()`, but works with any component class.

```javascript
const nameLink = Link.state( this, 'name' ),
      emailLink = Link.state( this, 'email' );
```

##### ![static] Link.all( this, stateKey1, stateKey2, ... ) : { [ key ] : Link }

Same as `component.linkAll()`, but works with any component class.

```javascript
const links = Link.all( this, 'name', 'email' ),
      { name, email } = links;
```

##### ![var] this.links : { [ key ] : Link } 

All links created during `render()` are _cached_ inside the `component.link` object.
Direct access to the cache may be used in event handlers to reference these links.

> When you create the link to the value which has not been changed since the last `render`,
> link object will be _reused_. Which means that it's safe to use `pure render` optimization.

### Links to object and arrays

##### ![method] linkToObject.at( key ) : Link

Create link to the member of array or object.

If linked value is plain object or array, it's possible to generate
links to their members. Whenever this derivative links will be
updated, it will lead to proper purely functional update (with shallow copying) of the
parent element.

```javascript
const deepLink = this.linkAt( 'array' ).at( 0 ).at( 'name' );
deepLink.set( 'Joe' ); // Will update component state.array
```

##### ![method] linkToObject.pick( key1, key2, ... ) : { [ key ] : Link }
 
Create links to the object's members, and wrap them in an object.

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

##### ![method] linkToAny.enabled( defaultValue = '' ) : Link

Create boolean link which value is `false` when parent link is `null` (or `undefined`), and `true` otherwise.
Whenever the enabled-link is set to `true`, it sets parent link to the `defaultValue`.

This type of links is used to support enabling/disabling of individual form controls with a dedicated checkbox.
`<Input>` control and the rest of form controls must be modified to disable themselves when its `valueLink.value === null`.

```javascript
const textLink = this.linkAt( 'text' );

return (
    <Checkbox checkedLink={ textLink.enabled() } />
    <Input valueLink={ textLink } /> 
);
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
value is set. Similar to:

```javascript
Link.value( link.value, x => {
    callback( x );
    link.set( x );
});
```

##### ![method] link.pipe( transform : ( next, prev ) => any ) : Link

Create the wrapper for existing link which will invoke given transform function
_before_ new value is set. Returned value will be used as new link value,
and if it's `undefined` update will be rejected. Similar to:

```
Link.value( link.value, x => {
    const y = callback( x, link.value );
    if( y !== undefined ){
        link.set( y );
    }
});
```  

Usage example:

```jsx
<Input valueLink={ strLink.pipe( x => x && x.toUpperCase() ) }/>
```

### Note for TypeScript users

`Link` is the parametric type `Link< T >`, where T is the type of the enclosed value.

TypeScript properly infers type of the link and perform static checks failing on missing state members.

```javascript
interface MyState {
    name : string
}
...
const nameLink = this.linkAt( 'name' ); // Link< string >
const missingLink = this.linkAt( 'age' ); // Compile-time error - no such a member in state.
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

##### ![method] linkToObject.removeAt( key ) : void

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
