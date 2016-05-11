# Advanced Value Links for React

Library for purely functional data binding in React based on `value link` pattern.

Approach used by this library significantly differs to common way of dealing with state and forms in React.
While based on original React Link idea, `valuelink` moves it far further providing simple and elegant solutions
for common problems, such as data binding of the complex state and form validation.

Introductory tutorials explaining the basics of the 'Value Link' pattern:

- [Managing state and forms with React. Part 1](https://medium.com/@gaperton/managing-state-and-forms-with-react-part-1-12eacb647112#.j7sqgkj88)
- [Managing state and forms with React, Part 2: Validation](https://medium.com/@gaperton/react-forms-with-value-links-part-2-validation-9d1ba78f8e49#.nllbm4cr7)

Features:

- Able to link complex React state with nested objects and arrays.
- All major data binding scenarios are supported, including radio groups and select lists.
- Declarative form validation.
- Support for 'pure render' optimization.
- Reference implementation of 'linked' UI controls (`tags.jsx`).
    - Standard tags: `<Input />` and `<TextArea />` (with validation), `<Select />`,
    - Custom tags: `<Radio />`, `<Checkbox />`
- TypeScript source and type definitions.
- Backward compatible with standard React 0.14 links API

```javascript
var linkToArray = Link.state( this, 'phonebook' );

var list = linkToArray.map( ( itemLink, i ) => (
    <div key={ i }>
        <Input valueLink={ itemLink.at( 'name' ) } />            
    </div>
));
```    

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

# API 

## Create link

### Linking to the state attributes

You can create link to an attribute of component state directly:

```javascript
const nameLink = Link.state( this, 'name' ),
      emailLink = Link.state( this, 'email' );
```

Or, you can create them in a bulk:

```javascript
const links = Link.all( this, 'name', 'email' ),
      { name, email } = links;
```
All links to the state, no matter how they are created, are _cached_ inside the component.
You can access the cache in the component's `render()` directly with `this.links`.

When you create the link to the value which has not been changed since the last `render`,
link object will be _reused_. Which means that you can use `pure render` optimization.

`Link.all` ensures that links to the listed state members are cached and up to date,
and returns cache object (same as `this.links`). `Link.state` behaves in the same way, but returns the link.

### Links to object and arrays

`linkToObject.at( key )` - create link to the member of array or object.

If linked value is plain object or array, it's possible to generate
links to their members. Whenever this derivative links will be
updated, it will lead to proper purely functional update (with shallow copying) of the
parent element.

```javascript
const deepLink = Link.state( this, 'array' ).at( 0 ).at( 'name' );

deepLink.set( 'Joe' ); // Will update component state.array
```

`linkToObject.pick( key1, key2, ... )` - create object hash with links to the object's members.

Example:
```javascript
const links = userLink.pick( 'name', 'email' ),
      { name, email } = links;
```

`linkToObject.map( ( linkToItem, itemKey ) => any | void )` - map and filter through array or object.

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

`linkToArray.contains( element )` - creates the link to the presence of value in array.

Resulting link value is `true` whenever element is present in array, and `false` otherwise.
Whenever resulting link is assigned with new value, it will flip `element` in the array.

Useful for the large checkbox groups.

```javascript
const optionXBoolLink = arrayLink.contains( 'optionX' );
```

`linkToAny.equals( whenTrue )` - create boolean link to value equality.

Resulting link value is `true` whenever parent link value equals to `whenTrue`, and `false` otherwise.
When resulting link is assigned with `true`, it sets parent link value with `whenTrue`, and with `null` otherwise.

Useful for radio groups.

```javascript
const optionXLink = stringLink.equals( 'optionX' );
```

### Custom links

`Link.value( value, nextValue => void )` - create custom link.

It may be used for different scenarios. Good example is to use 'edit element' component for adding new element.

Imagine that we have a component `<EditUser valueLink={ userLink } />` expecting the link to an object.
When editing is finished, `EditUser` will update the given link with a new values.

Then, following custom link will allow you to add new user with the same form element.

```javascript
<EditUser valueLink={ Link.value( {}, x => userArrayLink.push( x ) ) } />
```

Read more about links to objects updates in the next section.

### Note for TypeScript users

`Link` actually is parametric type `Link< T >`, where T is the type of the enclosed value.
And both `Link.value< T >` and `Link.state< T >` are parametric functions. For `Link.state` type is always inferred
as `Object`, so you can refine it manually:

```javascript
const nameLink = Link.state< string >( this, 'name' );
```
    
## Link updates

### Simple value updates

`link.set( x )`, `link.requestChange( x )` - set link value.

```javascript
<button onClick={ () => boolLink.set( !boolLink.value ) } />
```

`link.update( prevValue => newValue )` - update link value with transform function.

    ```javascript
<button onClick={ () => boolLink.update( x => !x ) } />
```

`link.action( ( prevValue, event ) => nextValue )` - create action to handle UI event.

`link.action` takes transform function, and produce a new function which takes single argument.
When it's called, this argument's value is passed as second transform parameter.

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

`linkToObject.update( clonedObject => modifiedClonedObject )` - update enclosed object or array.

`linkToObject.action( ( clonedObject, event ) => modifiedClonedObject )` - update enclosed object or array.

Plain objects and arrays are shallow copied by `update` and `action` functions,
thus it's safe just to update the value in place.

```javascript
<button onClick={ () => objLink.update( obj => {
                                obj.a = 1;
                                return obj;
                            }) } />
```

`linkToObject.remove( key )`, `linkToObject.at( key ).remove()` - remove element with a given key from the enclosed object ar array.

### Link to arrays updates

`linkToArray.splice()`, `linkToArray.push()`, `linkToArray.unshift()` - proxied native Array methods.

Works in the same way and accepts the same parameters as corresponding Array method,
but returns `undefined` and leads to the proper purely functional update of the parent object chain.

## Links validation

It's highly recommended to read [tutorial](https://medium.com/@gaperton/react-forms-with-value-links-part-2-validation-9d1ba78f8e49#.nllbm4cr7)
on validation with value links.

`link.check( value => isValid, error = 'Invalid value' )` - evaluate given condition for the current link value, and assign
    given error object to the `link.error` when it fails. Can be chained.

`link.error` field may be analyzed by custom `<Input />` control to indicate an error (see `tags.jsx` controls and supplied examples).

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

# Data binding examples

Here are the set of working [examples](/main.html) for typical data binding use cases.
Sources are [here](/example/main.jsx).

Also, there's an [example](/example/userslist.jsx) of an [application](/userslist.html) managing the users list.

[Custom elements boilerplate](/tags.jsx) which is used by both examples is another good example.