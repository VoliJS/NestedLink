# NestedLink API reference

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

## Bind to control

#### ![var] link.props : { value, onChange }

Bind link to the standard form control consuming value and onChange props.

```javascript
<input {...link.props} />
```

#### Custom data-bound controls

You're encouraged to create your own semantic form controls to take the full advantage
 of the value links features. An example of the control:

```javascript
const Input = ({ valueLink, ...props }) => (
    <div className={`form-control ${ valueLink.error ? 'error' : '' }`}>
        <input {...props}
            value={ valueLink.value }
            onChange={ e => valueLink.set( e.target.value ) }
        />
        <div className="validation-error">{ valueLink.error || '' }</div>
    </div>
);
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

[method]: /docs/images/method.png
[static]: /docs/images/static.png
[var]: /docs/images/var.png