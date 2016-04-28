/**
 * Advanced React links for purely functional two-way data binding
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */
 
export type Transform = ( value : any, event? : Object ) => any

export type EventHandler = ( event : Object ) => void

export type Validator = ( value : any ) => boolean

export type Iterator = ( link : ChainedLink, key : string | number ) => any

export interface StatefulComponent {
    state : Object,
    setState : ( attrs : Object ) => void
} 

export default class Link {
    constructor( public value : any ){}
    
    // Validation error. Usually is a string with error text, but can hold any type.
    error : any
    get validationError() : any { return this.error }
    
    // Link set functions
    set( x : any ) : void {}
    
    // DEPRECATED: Old React method for backward compatibility
    requestChange( x : any ) : void {
        this.set( x );
    }
    
    // Create link to componen't state
    static state( component : StatefulComponent, key : string ){
        return new StateLink( component, key ); 
    };
    
    static value( value : any, set : ( x ) => void ){
        return new CustomLink( value, set );
    }
    
    // DEPRECATED: Old valueLink method for backward compatibility
    toggle() : void { this.set( !this.value ); }
    
    contains( element : any ) : ContainsLink {        
        return new ContainsLink( this, element );            
    }
    
    // Immediately update the link value using given transform function.
    update( transform : Transform, e? : Object ) : void {
        let prev = this.value;
        prev = helpers( prev ).clone( prev );

        const next = transform( prev, e );
        next === void 0 || this.set( next );
    }
    
    // Create UI event handler function which will update the link with a given transform function.
    action( transform : Transform ) : EventHandler {
        return e => this.update( transform, e );
    }
    
    equals( truthyValue ) : EqualsLink {
        return new EqualsLink( this, truthyValue );
    }
    
    at( key : string | number ) : ChainedLink {
        return new ChainedLink( this, key );
    }
    
    map( iterator : Iterator ) : any[] {
        return helpers( this.value ).map( this, iterator );
    }
    
    /**
     * Validate link with validness predicate and optional custom error object. Can be chained.
     */
    check( whenValid : Validator, error? : any ) : this {
        if( !this.error && !whenValid( this.value ) ){
            this.error = error || defaultError;
        }

        return this;
    }
}

export class CustomLink extends Link {
    constructor( value : any, set : ( x ) => void ){
        super( value );
        this.set = set;
    }
}

export class StateLink extends Link {
    constructor( public component : StatefulComponent, public key : string ){
        super( component.state[ key ] );
    }
    
    set( x ){
        this.component.setState({ [ this.key ] : x } );
    } 
}  

export class EqualsLink extends Link {
    value : boolean
    
    constructor( public parent : Link, public truthyValue ){
        super( parent.value === truthyValue );
    }
    
    set( x : boolean ){
        this.parent.set( x ? this.truthyValue : null );
    }
}

export class ContainsLink extends Link {
    value : boolean
    
    constructor( public parent : Link, public element : any ){
        super( parent.value.indexOf( element ) >= 0 );
    }
    
    set( x : boolean ){
        var next = Boolean( x );
        
        if( this.value !== next ){
            var arr : any[] = this.parent.value,
                nextValue = x ? arr.concat( this.element ) : arr.filter( el => el !== this.element );

            this.parent.set( nextValue );
        }
    }
}

const  defaultError = 'Invalid value';

/**
 * Link to array or object element enclosed in parent link.
 * Performs purely functional update of the parent, shallow copying its value on `set`.
 */
export class ChainedLink extends Link {
    constructor( public parent : Link, public key : string | number ){
        super( parent.value[ key ] );
    }
    
    // Set new element value to parent array or object, performing purely functional update.
    set( x ){
        if( this.value !== x ){
            this.parent.update( value => {
                value[ this.key ] = x;
                return value;
            } );
        }
    };
} 

/**
 * Select appropriate helpers function for particular value type.
 */
interface Helper {
    map( link : Link, iterator : Iterator ) : any[]
    clone( obj : any ) : any
}

function helpers( value ) : Helper {
    switch( value && Object.getPrototypeOf( value ) ){
        case Array.prototype :
            return arrayHelpers;
        case Object.prototype :
            return objectHelpers;
        default:
            return dummyHelpers;
    }
}

// Do nothing for types other than Array and plain Object.
const dummyHelpers : Helper = {
    clone( value ){ return value; },
    map( link, fun ){ return []; }
};


// `map` and `clone` for plain JS objects
const objectHelpers : Helper = {
    // Map through the link to object
    map( link : Link, iterator : Iterator ) : any[] {
        const hash = link.value;
        let  mapped = [];

        for( var key in hash ){
            var element = iterator( link.at( key ), key );
            element === void 0 || ( mapped.push( element ) );
        }

        return mapped;
    },


     // Shallow clone plain JS object
    clone( object : {} ) : {} {
        let cloned = {};

        for( var key in object ){
            cloned[ key ] = object[ key ];
        }

        return cloned;
    }
};

// `map` and `clone` helpers for arrays.
const arrayHelpers : Helper = {
    // Shallow clone array
    clone( array : any[] ) : any[] {
        return array.slice();
    },

    // Map through the link to array
    map( link : Link, iterator : Iterator ) : any[] {
        var mapped = [],
            array = link.value;

        for( var i = 0; i < array.length; i++ ){
            var y = iterator( link.at( i ), i );
            y === void 0 || ( mapped.push( y ) );
        }

        return mapped;
    }
};