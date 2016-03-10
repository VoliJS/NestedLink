Advanced React links for purely functional two-way data binding.

- Implements standard React 0.14 links API
- API extensions:
    - Declarative binding to event handlers.
    - Simple form validation.
    - Link to plain object and array members with pure updates.
    - Derivative boolean links for checkbox and radio groups.
- Reference implementation for 'linked' tags:
    - Standard tags: `<Input />` (with validation), `<Select />`, `<TextArea />`
    - Custom tags: `<Radio />`, `<Checkbox />`

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

# Installation

`npm install valuelink`

CommonJS module, MIT License. No side dependencies.

```javascript
// Links
import Link from 'valuelink'

// React components with linked tags
import { Input } from 'valuelink/tags.jsx'
```

# API

## Create link

- Create custom link: `new Link( value, requestChange )`

    ```javascript
    var customLink = new Link( this.value, x => this.value = x );
    ```

- Create link to react component's state attribute:

    ```javascript
    var nameLink = Link.state( this, 'name' );
    ```

## Update link
 
- Set link value: `link.set( x )` or `link.requestChange( x )` 

    ```javascript
    <button onClick={ () => boolLink.set( !boolLink.value ) } />
    ```

- Update link value: `link.update( prevValue => newValue )` 

    ```javascript
    <button onClick={ () => boolLink.update( x => !x ) } />
    ```

- Create action to handle UI event: `link.action( ( prevValue, Event ) => newValue )`

    ```javascript
    <button onClick={ boolLink.action( x => !x ) } />
    ...
    const setValue = ( x, e ) => e.target.value;
    ...
    <input  value={ link.value }
            onChange={ link.action( setValue ) } />
    ```

## Links validation

Links has `link.check( condition, error = 'Invalid value' )` method which can be used to
check the sequence of conditions. Checks can be chained. 

`condition` is predicate function `linkValue => isValid` taking link value as an argument.
Whenever `condition` returns falsy value, `link.error` will take the value of corresponding `error`. 
`link.error` field may be analyzed by custom `<Input />` control to indicate an error. 

This mechanics can be used to add ad-hoc validation in `render`. 

- Simple asserts:

    ```javascript
    var numLink = List.state( this, 'num' )
                    .check( x => x >= 0 && x <=5 );
                    
    console.log( numLink.error );                    
    ```
    
- Validation asserts with custom error objects
    ```javascript
    var numLink = List.state( this, 'num' )
                    .check( x => x >= 0 && x <=5, 'Number must be between 0 and 5' );
                    
    console.log( numLink.error );                    
    ```

- Chained validation asserts
    ```javascript
    var numLink = List.state( this, 'num' )
                    .check( x => x >= 0, 'Negative numbers are not allowed' )
                    .check( x => x <= 5, 'Number should be not greater than 5' );
                    
    console.log( numLink.error );                    
    ```

## Links to object and arrays      

If linked value is plain object or array, it's possible to generate
  links to their members. Whenever this derivative links will be
  updated, it will lead to proper purely functional update of the
  whole structure. I.e. if you have array in component state,
    and link to its element will be updated, it will lead to proper
    update of stateful component.

- Take link to array or object member 
    ```javascript
        const firstElementLink = arrayLink.at( 0 );
    ``` 
    or
    ```javascript
        const nameLink = objectLink.at( 'name' );
    ``` 

- Map and filter through array or object
    ```javascript
    var list = stringArrayLink.map( ( itemLink, index ) => {
        if( itemLink.value ){        
            return (
                <div key={ index }>
                    <input valueLink={ itemLink } />            
                </div>
            );
        }
    });
    ```
    
## Boolean links

- Link to the presence of value in array
    ```javascript
    const optionXLink = arrayLink.contains( 'optionX' );
    ```

- Link to value equality
    ```javascript
    const optionXLink = stringLink.equals( 'optionX' );
    ```

- toggle boolean link
    ```javascript
    <button onClick={ () => link.toggle() } />
    ```
    or
    ```javascript
    <button onClick={ link.update( x => !x ) } />
    ```
    or
    ```javascript
    <button onClick={ () => link.set( !link.value ) } />
    ```

# Data binding examples

Here are the set of examples for typical data binding use cases. Each section contains custom databound component, state definitions, and usage examples. 

It's generally advised to keep stateful components at the top level.

## Checkboxes

Standard `<input/>` will work. Custom Checkbox component might be implemented like this:

```javascript
const Checkbox = ({ className = 'checkbox', checkedLink }) => (
    <div className={ className + ( checkedLink.value ? ' selected' : '' ) }
         onClick = { checkedLink.update( x => !x ) }
    />
);
```

Examples will assume working with custom Checkbox.

### Binding to boolean attributes

```javascript
const CheckboxGroup = ({ modelLink }) => (
    <div>
        <div>
            <Checkbox checkedLink={ modelLink.at( 'option1' ) } />
            Option 1
        </div>
        <div>
            <Checkbox checkedLink={ modelLink.at( 'option2' ) } />
            Option 2
        </div>
    </div>
);
```

Usage:

```javascript
    getInitialState(){
        return {
            model : {
                option1 : true,
                option2 : false
            }
        }
    }
    
    render(){
        return <CheckboxGroup modelLink={ Link.state( this, 'model' ) } />    
    }
```    

### Binding to array of selected options

```javascript
const CheckboxGroup = ({ modelLink }) => {
    const link = modelLink.at( 'options' );
    
    return (
        <div>
            <div>
                <Checkbox checkedLink={ link.contains( 'option1' ) } />
                Option 1
            </div>
            <div>
                <Checkbox checkedLink={ link.contains( 'option2' ) } />
                Option 2
            </div>
        </div>
    );
};
```

Usage:

```javascript
    getInitialState(){
        return {
            model : {
                options : [ 'option1' ]
            }
        }
    }
    
    render(){
        return <CheckboxGroup modelLink={ Link.state( this, 'model' ) } />    
    }
```    

## Radio Groups

For the radio groups you will need custom Radio component. It's very similar to custom Checkbox one,
with one difference in click handler:

```javascript
const Radio = ({ className = 'radio', checkedLink }) => (
    <div className={ className + ( checkedLink.value ? ' selected' : '' ) }
         onClick = { checkedLink.update( () => true ) }
    />
);
```

In this example, we bind radio to string values. It's not required for them to be strings.

```javascript
const RadioGroup = ({ modelLink }) => {
    const link = modelLink.at( 'option' );
    
    return (
        <div>
            <div>
                <Radio checkedLink={ link.equals( 'option1' ) } />
                Option 1
            </div>
            <div>
                <Radio checkedLink={ link.equals( 'option2' ) } />
                Option 2
            </div>
        </div>
    );
};
```

Usage:

```javascript
    getInitialState(){
        return {
            model : {
                options : 'option1'
            }
        }
    }
    
    render(){
        return <RadioGroup modelLink={ Link.state( this, 'model' ) } />    
    }
```    

## Input fields

Standard `<input>` will work. You may implement custom input controls to handle complex scenarios
with validation and appearance.

```javascript
const Input = ({ valueLink, ...props }) => (
    <div className={ `my-nice-input ${ valueLink.validationError ? 'is-invalid' : '' }` }
        <input {...props} value={ valueLink.value } onChange={ e => valueLink.set( e.target.value ) }/>
    </div>
);
```

### Binding to object's attributes

```javascript    
const InputGroup = ({ modelLink }) => (
        <div>
            <label>
                Number: 
                <Input type='number' valueLink={ modelLink.at( 'number' ).check( x => x > 0 ) } />
            </label>
            <label>
                String: 
                <Input valueLink={ modelLink.at( 'string' ) } />
            </label>
        </div>
    );
};
```

Usage:

```javascript
    getInitialState(){
        return {
            model : {
                number : 0,
                string : ''
            }
        }
    }
    
    render(){
        return <InputGroup modelLink={ Link.state( this, 'model' ) } />    
    }
```    

### Binding to an array of strings

The same technique may be used to bind to an array or hash of strings. First, take a link to this
attribute. Next, use `link.map` method to iterate through elements links created for you.

`link.map` will internally execute `link.at( key )` method to create a link to the plain object or array element.
These methods may be used manually to create binding for the structures of any particular depth and complexity.

```javascript
const InputGroup = ({ model /* instanceof MyModel */ }) => (
        <div>
            { model.getLink( 'strings' ).map( strLink => (
                <div>
                    <input valueLink={ strLink } />
                </div>
            )) }
        </div>
    );
};
```

Usage: 

```javascript
    getInitialState(){
        return {
            model : {
                strings : [ 'first', 'second' ]
            }
        }
    }
    
    render(){
        return <InputGroup modelLink={ Link.state( this, 'model' ) } />    
    }
```