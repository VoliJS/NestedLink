# Features

- Comprehensive solution for two-way data binding and validation. 
- Create links to state's attributes.
- Create links to deeply nested object and array elements with purely functional state updates.
- Ad-hoc boolean links for values equality and presence in array. 

```javascript
var phonebookLink = Link.state( this, 'phonebook' );

var list = phonebookLink.map( itemLink => (
    <div>
        <input valueLink={ itemLink.at( 'name' ) } />            
    </div>
));
```
    

# Installation

`npm install valuelink`

MIT License.

# API

## Create link

- Create link to react component's state attribute

    ```javascript
    var nameLink = Link.state( this, 'name' );
    ```

- Create custom link

    ```javascript
    var customLink = new Link( this.value, x => this.value = x );
    ```

## Update link
 
- update linked value
    ```javascript
    <button onClick={ link.update( x => x + 1 ) } />
    ```
    or
    ```javascript
    <button onClick={ () => link.set( link.value + 1 ) } />
    ```
    or
    ```javascript
    <button onClick={ () => link.requestChange( link.value + 1 ) } />
    ```

## Links validation

- Simple asserts
    ```javascript
    var numLink = List.state( this, 'num' )
                    .check( x => x >= 0 && x <=5 );
                    
    console.log( numLink.validationError );                    
    ```
    
- Validation asserts with custom error objects
    ```javascript
    var numLink = List.state( this, 'num' )
                    .check( x => x >= 0 && x <=5, 'Number must be between 0 and 5' );
                    
    console.log( numLink.validationError );                    
    ```

- Chained validation asserts
    ```javascript
    var numLink = List.state( this, 'num' )
                    .check( x => x >= 0, 'Negative numbers are not allowed' )
                    .check( x => x <= 5, 'Number should be not greater than 5' );
                    
    console.log( numLink.validationError );                    
    ```

## Links to object and arrays        

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