/**
 * Advanced React links for purely functional two-way data binding
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */
import { helpers, arrayHelpers } from './helpers'

export type Transform< T > = ( value : T, event? : {} ) => T
export type EventHandler = ( event : {} ) => void

export interface Validator< T >{
    ( value : T ) : boolean
    error? : any
}

export type Iterator = ( link : ChainedLink, key : string | number ) => any

export type StateLinks = { [ attrName : string ] : StateLink< any > }
export type ChainedLinks = { [ attrName : string ] : ChainedLink }

export interface StatefulComponent{
    state : {}
    setState : ( attrs : {} ) => void

    // value links cache, to make pure render optimization possible
    links? : StateLinks
}

// Main Link class. All links must extend it.
abstract class Link< T >{
    // Create link to componen't state
    static state< T >( component : StatefulComponent, key : string ) : StateLink< T >{
        const value : T = component.state[ key ],
            cache = component.links || ( component.links = {} ),
            cached = cache[ key ];

        return cached && cached.value === value ? cached : cache[ key ] = new StateLink( value, component, key );
    };

    // Ensure that listed links are cached. Return links cache.
    static all( component : StatefulComponent ) : StateLinks {
        const { state } = component,
            links = component.links || ( component.links = {} );

        for( let i = 1; i < arguments.length; i++ ){
            const key : string = arguments[ i ],
                value = state[ key ],
                cached = links[ key ];

            if( !cached || cached.value !== value ) {
                links[ key ] = new StateLink( value, component, key );
            }
        }

        return links;
    }

    // Create custom link to arbitrary value
    static value< T >( value : T, set : ( x : T ) => void ) : CustomLink< T >{
        return new CustomLink( value, set );
    }

    // create 
    constructor( public value : T ){}

    // Validation error. Usually is a string with error text, but can hold any type.
    error : any

    // DEPRECATED: Old error holder for backward compatibility with Volicon code base
    get validationError() : any { return this.error }

    // Link set functions
    abstract set( x : T ) : void

    onChange( handler : ( x : T ) => void ) : CloneLink< T > {
        return new CloneLink( this, (x : T ) => {
            handler( x );
            this.set( x );
        });
    }

    // DEPRECATED: Old React method for backward compatibility
    requestChange( x : T ) : void {
        this.set( x );
    }

    // Immediately update the link value using given transform function.
    update( transform : Transform< T >, e? : Object ) : void {
        const next = transform( this.clone(), e );
        next === void 0 || this.set( next );
    }

    // Create new link which applies transform function on set.
    pipe( handler : Transform< T > ) : CloneLink< T > {
        return new CloneLink( this, x =>{
            const next = handler( x, this.value );
            next === void 0 || this.set( next );
        } );
    }

    // Create UI event handler function which will update the link with a given transform function.
    action( transform : Transform< T > ) : EventHandler {
        return e => this.update( transform, e );
    }

    equals( truthyValue ) : EqualsLink {
        return new EqualsLink( this, truthyValue );
    }

    enabled( defaultValue = '' ) : EnabledLink {
        return new EnabledLink( this, defaultValue );
    }

    // Array-only links methods
    contains( element : any ) : ContainsLink {
        return new ContainsLink( this, element );
    }

    push() : void {
        const array = arrayHelpers.clone( this.value );
        Array.prototype.push.apply( array, arguments );
        this.set( array );
    }

    unshift() : void {
        const array = arrayHelpers.clone( this.value );
        Array.prototype.unshift.apply( array, arguments );
        this.set( array );
    }

    splice() : void {
        const array = arrayHelpers.clone( this.value );
        Array.prototype.splice.apply( array, arguments );
        this.set( array );
    }

    // Array and objects universal collection methods
    map( iterator : Iterator ) : any[] {
        return helpers( this.value ).map( this, iterator );
    }

    remove( key : string | number ) : void {
        const { value } = this,
            _ = helpers( value );

        this.set( _.remove( _.clone( value ), key ) );
    }

    at( key : string | number ) : ChainedLink {
        return new ChainedLink( this, key );
    }

    clone() : T {
        let { value } = this;
        return helpers( value ).clone( value );
    }

    pick() : ChainedLinks {
        let links : ChainedLinks = {};

        for( let i = 0; i < arguments.length; i++ ){
            const key : string = arguments[ i ];
            links[ key ] = new ChainedLink( this, key );
        }

        return links;
    }

    /**
     * Validate link with validness predicate and optional custom error object. Can be chained.
     */
    check( whenValid : Validator< T >, error? : any ) : this {
        if( !this.error && !whenValid( this.value ) ){
            this.error = error || whenValid.error || defaultError;
        }

        return this;
    }
}

export default Link;

export class CustomLink< T > extends Link< T > {
    set( x ){}

    constructor( value : T, set : ( x : T ) => void ){
        super( value );
        this.set = set;
    }
}

export class CloneLink< T > extends Link< T > {
    set( x ){}

    constructor( parent : Link< T >, set : ( x : T ) => void ){
        super( parent.value );
        this.set = set;

        const { error } = parent;
        if( error ) this.error = error;
    }
}

export class StateLink< T > extends Link< T > {
    constructor( value : T, public component : StatefulComponent, public key : string ){
        super( value );
    }

    set( x : T ) : void {
        this.component.setState({ [ this.key ] : x } );
    }
}

export class EqualsLink extends Link< boolean > {
    constructor( public parent : Link< any >, public truthyValue ){
        super( parent.value === truthyValue );
    }

    set( x : boolean ) : void {
        this.parent.set( x ? this.truthyValue : null );
    }
}

export class EnabledLink extends Link< boolean > {
    constructor( public parent : Link< any >, public defaultValue ){
        super( parent.value != null );
    }

    set( x : boolean ){
        this.parent.set( x ? this.defaultValue : null );
    }
}

export class ContainsLink extends Link< boolean > {
    constructor( public parent : Link< any >, public element : any ){
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
export class ChainedLink extends Link< any > {
    constructor( public parent : Link< {} >, public key : string | number ){
        super( parent.value[ key ] );
    }

    remove( key? ){
        if( key === void 0 ){
            this.parent.remove( this.key );
        }
        else{
            super.remove( key );
        }
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

