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

export type LinksCache< S > = {
    [ K in keyof S ] : Link< S[ K ] >
}

export type Iterator = ( link : ElementLink, key : string | number ) => any
export type ChainedLinks = { [ attrName : string ] : ElementLink }

// Main Link class. All links must extend it.
export abstract class Link< T >{
    // @deprecated API. Use component subclass.
    static state : < P, S, K extends keyof S>( component : React.Component< P, S >, key : K ) => Link< S[ K ] >;
    static all : < P, S >( component : React.Component< P, S >, ..._keys : ( keyof S )[] ) => LinksCache< S >;

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

    at< K extends keyof T >( key : K ) : ElementLink<T[K], T> {
        return new ElementLink<T[K], T>( this, key );
    }

    clone() : T {
        let { value } = this;
        return helpers( value ).clone( value );
    }

    pick() : ChainedLinks {
        let links : ChainedLinks = {};

        for( let i = 0; i < arguments.length; i++ ){
            const key : string = arguments[ i ];
            links[ key ] = new ElementLink( this, key );
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
export class ElementLink< T, P > extends Link< T > {
    constructor( public parent : Link< P >, public key : keyof P ){
        super( <any>parent.value[ key ] );
    }

    remove( key? : keyof P ){
        if( key === void 0 ){
            this.parent.remove( this.key );
        }
        else{
            super.remove( key );
        }
    }

    // Set new element value to parent array or object, performing purely functional update.
    set( x : T ){
        if( this.value !== x ){
            this.parent.update( value => {
                value[ this.key ] = <any>x;
                return value;
            } );
        }
    };
}

let x : Link<number[]>;
x.at(1)