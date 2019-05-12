import Link from "valuelink/lib";

function counter( { counter }, action ){
    switch( action.type ){
        case 'add' :
            return {
                counter : counter + ( action.value || 1 )
            }

        case 'sub' :
            return {
                counter : counter - ( action.value || 1 )
            }
    }
}

const counter = {
    add({ counter }, value = 1 ){
        return {
            counter : counter + value
        }
    },

    sub({ counter }, value = 1 ){
        return {
            counter : counter - value
        } 
    }
}

const Counter = immutableState({
    counter : 0
}, {
    add( value = 1 ){
        return { counter : this.counter + value }
    },

    sub( value = 1 ){
        return { counter : this.counter - value } 
    }
});


function immutableState( init, actions ){
    class ImmutableState {    
        constructor( update = {}, defaults = init ){
            Object.assign( this, defaults, update );
        }

        setValues( values ){
            return values ? new this.constructor( values, this ) : this;
        }
    }

    for( let action of Object.keys( actions ) ){
        ImmutableState.prototype[ action ] = function(){
            return this.setValues(
                actions[ action ].apply( this, arguments )
            );
        }
    }

    return ImmutableState;
}

const Counter = immutableState({
    counter : 0
}, {
    add( value = 1 ){
        this.counter += value;
    },

    sub( value = 1 ){
        this.counter += value;
    }
});


function immutableState( init, actions ){
    class ImmutableState {    
        constructor( defaults = init ){
            Object.assign( this, defaults );
        }
    }

    for( let action of Object.keys( actions ) ){
        ImmutableState.prototype[ action ] = function(){
            const clone = new this.constructor( this );
            return actions[ action ].apply( clone, arguments );
        }
    }

    return ImmutableState;
}


@immutable
class Inner {
    counter = 0;

    add( value = 1 ){
        this.counter += value
        return this;
    }

    sub( value = 1 ){
        this.counter -= value;
        return this;
    }
}

@immutable
class Co {
    counter = 0;
    inner = new Inner

    add( value = 1 ){
        this.counter += value
        this.at( 'inner' ).add( value );
        return this;
    }

    sub( value = 1 ){
        this.counter -= value;
    }
}

function immutable( ImmutableState ){
    const descriptors = Object.getOwnPropertyDescriptors( ImmutableState.prototype );

    for( let action in descriptors ){
        const { value } = descriptors[ action ];

        if( typeof value === 'function' && action !== 'contructor' && action.indexOf( 'get' ) !== 0 ){
            ImmutableState.prototype[ action ] = function(){
                const clone = new this.constructor();
                Object.assign( clone, this );
                value.apply( clone, arguments );
                return clone;
            }
        }
    }
}

const counter = useImmutable( Counter );
counter.add( 1 );

function useImmutable( Class ){
    const [ state, setState ] = useState( () => {
        if( !Class.dispatcher ){
            Class.dispatcher = class Dispatcher {
                constructor( state, setState ){
                    this.state
                }
            }
        }
        return new Class()
    });

    return dispatcher;
}

class Dispatcher {
    constructor( state, setState ){
        this.state = state;
        this.setState = setState;
        Object.assign
    }
}

class MemberLink<T> {
    value : T
    __owner : any
    __key : string
}

class State {
    items = member([]) 
}


class StateLink extends Link {
    constructor( value ){
        super( value )
        this._set = null;
    }

    set( x ){
        this._set( new StateLink( x ) );
    }
}

function emptyLink(){
    return new StateLink( void 0 );
}

// !!! Cached links.
function useLink( value = null ){
    const [ link, setLink ] = useState( emptyLink );
    
    if( link.value === void 0 ) link.value = value;

    link._set = setLink;
    return link;
}

class MutableStateLink extends Link {
    constructor( value ){
        super( value )
        this._set = null;
    }

    set( x ){
        this._set( new StateLink( x ) );
    }
}


function useClassLink( Class ){
    const [ link, setLink ] = useState( emptyClassLink );
    
    if( link.value === void 0 ){
        link.value = new Class();
        link.value._onChange = link
    } 

    link._set = setLink;
    return link;
}


const User = Link.extend({
    action1( a, b, c ){
        return this;
    }
}, {
    name : 1,

})

// Combinators is a great idea.
const MyComp = View
    .props({
        prop : Some,
        prop2 : Other,
        prop3 : Another
    })
    .pureProps({ //1
        a : 1,
        b : 3
    })
    .store({ //1

    })
    .state({

    })
    // Adds methods, for easy handing props annotations.
    .mixins({
        name1( x ){}

    })
    .render(
        function MyComp({ }){
            state.a = 4;
        }
    );

function stateful({
    a : 1,
    b : 2,
}, ({ state }) => {

})

/**
 * The component for pure render only.
 * Takes object constructors. 
 * [ a, b, c ] - keep equality vectors.
 * Compare them, possibly with an unrolled loop.
 * Compile unrolled function to generate the vector.
 * Assign new vector at componentDidMount.
 * Generic way to assign token generation function to the type (with a call).
 * Examples - mutable Date, value extraction from the Link, mutable object.
 * Article about big lie if Flux.
 */