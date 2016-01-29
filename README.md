# Features

- Create links to state's attributes
    var nameLink = Link.state( this, 'name' );
- Create links to nested arrays and objects
    var phonebookLink = Link.state( this, 'phonebook' );

    var list = phonebookLink.map( itemLink => (
        <div>
            <input valueLink={ itemLink.at( 'name' ) } />            
        </div>
    ));
    
- 
    

# Installation

`npm install valuelink`

# Data binding examples

Here are the set of examples for typical `nestedreact` data binding use cases.

Each section contains custom databound component, model definitions, and usage examples.

Somewhere at the top level component(s) there must be the declaration linking model updates to UI. Either models must be (nested) members of some component's state (which will update UI even in case of deep changes), or you may link component updates to changes of models and collections passed in props. In the last case, you will need to add following line to top or middle-level component definition:

```
    listenToProps : 'myModel myCollection'
```

It's generally advised to keep stateful components at the top level, and use `listenToProps` in the middle level for optimization purposes if you want local updates. Keep you bottom-level components pure, and try to do the same for the most of your middle level (`listenToProps` used wisely won't hurt). For further information on this topic consult the top-level guide.

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

### Binding to boolean model attributes

```javascript
import { Model } from 'nestedtypes'

const MyModel = Model
    .defaults({
        option1 : true,
        option2 : false
    });
    
const CheckboxGroup = ({ model /* instanceof MyModel */ }) => (
    <div>
        <div>
            <Checkbox checkedLink={ model.getLink( 'option1' ) } />
            Option 1
        </div>
        <div>
            <Checkbox checkedLink={ model.getLink( 'option2' ) } />
            Option 2
        </div>
    </div>
);
```

### Binding to array of selected options

```javascript
import { Model } from 'nestedtypes'

const MyModel = Model
    .defaults({
        options : [ 'option1' ]
    });
    
const CheckboxGroup = ({ model /* instanceof MyModel */ }) => {
    const link = model.getLink( 'options' );
    
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

### Binding to collection of selected models

```javascript
import { Model } from 'nestedtypes'

const MyModel = Model
    .defaults({
        all : Some.Collection,
        selected : Collection.subsetOf( 'all' )
    });
    
const CheckboxGroup = ({ model /* instanceof MyModel */ }) => {
    const { all, selected } = model;
    
    return (
        <div>
            { all.map( model => (
                <div>
                    <Checkbox checkedLink={ selected.getLink( model ) } />
                    { model.displayName }
                </div>
            ))}
        </div>
    );
};
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
import { Model } from 'nestedtypes'

const MyModel = Model
    .defaults({
        option : 'option1'
    });
    
const RadioGroup = ({ model /* instanceof MyModel */ }) => {
    const link = model.getLink( 'option' );
    
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

## Input fields

Standard `<input>` will work. You may implement custom input controls to handle complex scenarios
with validation and appearance.

```javascript
const Input = ({ valueLink, ...props }) => (
    <div className='wrapping'
        <input {...props} value={ valueLink.value } onChange={ e => valueLink.set( e.target.value ) }/>
    </div>
);
```

### Binding to model attributes

```javascript
import { Model } from 'nestedtypes'

const MyModel = Model
    .defaults({
        number : 0,
        string : ''
    });
    
const InputGroup = ({ model /* instanceof MyModel */ }) => (
        <div>
            <label>
                Number: 
                <input type='number' valueLink={ model.getLink( 'number' ) } />
            </label>
            <label>
                String: 
                <input valueLink={ model.getLink( 'string' ) } />
            </label>
        </div>
    );
};
```

### Binding to an array of strings

The same technique may be used to bind to an array or hash of strings. First, take a link to this
attribute. Next, use `link.map` method to iterate through elements links created for you.

`link.map` will internally execute `link.at( key )` method to create a link to the plain object or array element.
These methods may be used manually to create binding for the structures of any particular depth and complexity.

However, for the JS data with known structure it's recommended to wrap them in models.

```javascript
import { Model } from 'nestedtypes'

const MyModel = Model
    .defaults({
        strings : [ 'first', 'second' ]
    });
    
const InputGroup = ({ model /* instanceof MyModel */ }) => (
        <div>
            { model.getLink( 'strings' ).map( strLink => (
                <div>
                    <input type='number' valueLink={ strLink } />
                </div>
            )) }
        </div>
    );
};
```
