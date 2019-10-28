/**
 * Advanced React links for purely functional two-way data binding
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */
import { arrayHelpers, helpers } from './helpers';

export * from './helpers'

/** 
 * `Linked` class is an abstract linked value - the value, the function to update this value, and its validation error.
 * The enclosed value is considered as immutable.
 */ 
export abstract class Linked<T>{
    /** Validation error. Usually is a string with error text, but can hold any type. */ 
    error : any = void 0
    
    /** Set linked value */ 
    abstract set( x : T ) : void

    constructor( public value : T ){}

    /** EXPERIMENTAL: Support useRef interface. */ 
    get current(){ return this.value; }
    set current( x : T ){ this.set( x ); }

    // Private accessor for whenChanged. Uniform with Type-R models and collections API.
    protected get _changeToken(){
        return this.value;
    }

    /** Produce the new link executing the given function before the link value will be updated. */
    onChange( handler : ( x : T ) => void ) : Linked<T> {
        return new ClonedValueLink( this, ( x : T ) => {
            handler( x );
            this.set( x );
        });
    }

    /** Produce the new link which transform the value before `set` with a given function. */
    pipe( handler : Linked.Transform<T> ) : Linked< T > {
        return new ClonedValueLink( this, x =>{
            const next = handler( x, this.value );
            next === void 0 || this.set( next );
        } );
    }

    /** 
     * Create React component props for the <input> component.
     * 
     * <input { ...link.props } />
     */ 
    get props(){
        return typeof this.value === 'boolean' ? {
            checked : this.value,
            onChange : e => this.set( Boolean( e.target.checked ) as any )
        }:{
            value : this.value,
            onChange : e => this.set( e.target.value )
        };
    }

    /** Update the linked value using given transform function. */ 
    update( transform : Linked.Transform<T>, e? : Object ) : void {
        const next = transform( this.clone(), e );
        next === void 0 || this.set( next );
    }

    // Create UI event handler function which will update the link with a given transform function.
    action( transform : Linked.Transform< T > ) : Linked.EventHandler {
        return e => this.update( transform, e );
    }

    equals( truthyValue : T ) : Linked<boolean> {
        return new EqualsValueLink( this, truthyValue );
    }

    enabled( defaultValue? : T ) : Linked<boolean> {
        return new EnabledValueLink( this, defaultValue || "" );
    }

    // Array-only links methods
    contains<E>( this : Linked<E[]>, element : E ) : Linked<boolean>{
        return new ContainsRef( this, element );
    }

    push<E>( this : Linked<E[]>, ...args : E[] ) : void;
    push(){
        const array = arrayHelpers.clone( this.value );
        Array.prototype.push.apply( array, arguments );
        this.set( array );
    }

    unshift<E>( this : Linked<E[]>, ...args : E[] ) : void;
    unshift() : void {
        const array = arrayHelpers.clone( this.value );
        Array.prototype.unshift.apply( array, arguments );
        this.set( array );
    }

    
    splice( this : Linked<any[]>, start : number, deleteCount? : number ) : void;
    splice() : void {
        const array = arrayHelpers.clone( this.value );
        Array.prototype.splice.apply( array, arguments );
        this.set( array );
    }

    // Array and objects universal collection methods
    map<E, Z>( this : Linked<E[]>, iterator : ( link : PropValueLink<E, number>, idx : number ) => Z ) : Z[];
    map<E, Z>( this : Linked<{[ key : string ] : E }>, iterator : ( link : PropValueLink<E, string>, idx : string ) => Z ) : Z[];
    map( iterator ) {
        return helpers( this.value ).map( this, iterator );
    }

    removeAt<E>( this : Linked<E[]>, key : number ) : void;
    removeAt<E>( this : Linked<{ [ key : string ] : E }>, key : string ) : void;
    removeAt( key ){
        const { value } = this,
            _ = helpers( value );

        this.set( _.remove( _.clone( value ), key ) );
    }

    at<E>( this : Linked<E[]>, key : number ) : PropValueLink<E, number>;
    at<K extends keyof T, E extends T[K]>( key : K ) : PropValueLink<E, K>;
    at( key ){
        return new PropValueLink( this, key );
    }

    clone() : T {
        let { value } = this;
        return helpers( value ).clone( value );
    }

    /**
     * Convert link to object to the object of links. Optionally filter by 
     */
    pick< K extends keyof T >( ...keys : K[]) : {[ P in K ]: Linked<T[P]>}
    pick() {
        let links = {}, keys = arguments.length ? arguments : Object.keys( this.value );

        for( let i = 0; i < keys.length; i++ ){
            const key : string = keys[ i ];
            links[ key ] = new PropValueLink( this, key );
        }

        return links;
    }

    /**
     * Convert link to object to the object of links.
     * Memorises the result, subsequent calls are cheap.
     */
    get $() : T extends object ? Linked.Hash<T> : never {
        if( !this._value$ ){
            let links : Linked.Hash<any> = this._value$ = {},
                { value } = this;

            for( let key in value ){
                if( value.hasOwnProperty( key ) ){
                    links[ key ] = new PropValueLink( this, key );
                }
            }
        }

        return this._value$ as any;
    }

    private _value$ : object

    /**
     * Validate link with validness predicate and optional custom error object. Can be chained.
     */
    check( whenValid : Linked.Validator<T>, error? : any ) : this {
        if( !this.error && !whenValid( this.value ) ){
            this.error = error || whenValid.error || defaultError;
        }

        return this;
    }
}

export namespace Linked {
    export interface Validator< T >{
        ( value : T ) : boolean
        error? : any
    }    

    export type Transform< T > = ( value : T, event? : {} ) => T
    export type EventHandler = ( event : {} ) => void

    export type Hash<T extends object = any> = {
        [K in keyof T] : Linked<T[K]>
    }

    /** Create linked value out of its value and the set function */ 
    export function value<T>( value : T, set : ( x : T ) => void ) : Linked<T>{
        return new CustomValueLink( value, set );
    }

    export function mutable<T extends object>( state : T ) : Linked<T>{
        return new CustomValueLink( state, x => {
            for( let key in x ){
                if( x.hasOwnProperty( key ) ){
                    state[ key ] = x[ key ];
                }
            }
        } );
    }

    /**
    * Unwrap object with links, returning an object of a similar shape filled with link values.
    */
    export function getValues<T extends object>( links : Linked.Hash<T> ) : T {
        return unwrap( links, 'value' ) as any;
    }

    /**
     * Unwrap object with links, returning an object of a similar shape filled with link errors.
     */
    export function getErrors<T extends object>( links : Linked.Hash<T> ) : { [ name in keyof T ] : any } {
        return unwrap( links, 'error' ) as any;
    }

    /**
     * Return true if an object with links contains any errors.
     */
    export function hasErrors<T extends object>( links : Linked.Hash<T> ) : boolean {
        for( let key in links ){
            if( links.hasOwnProperty( key ) && links[ key ].error ){
                return true;
            }
        }

        return false;
    }

    /**
    * Assing links with values from the source object.
    */
   export function setValues<T extends object>( links : Linked.Hash<T>, source : T ) : void {
        if( source ){
            for( let key in links ){
                const sourceKey = trim( key );
                if( source.hasOwnProperty( sourceKey ) ){
                    const sourceVal = source[ sourceKey ];
                    sourceVal === void 0 || links[ key ].set( sourceVal );
                }
            }    
        }
    }

}

class CustomValueLink< T > extends Linked< T > {
    set( x ){}

    constructor( value : T, set : ( x : T ) => void ){
        super( value );
        this.set = set;
    }
}

class ClonedValueLink< T > extends Linked< T > {
    set( x ){}

    constructor( parent : Linked< T >, set : ( x : T ) => void ){
        super( parent.value );
        this.set = set;

        const { error } = parent;
        if( error ) this.error = error;
    }
}

class EqualsValueLink extends Linked< boolean > {
    constructor( public parent : Linked< any >, public truthyValue ){
        super( parent.value === truthyValue );
    }

    set( x : boolean ) : void {
        this.parent.set( x ? this.truthyValue : null );
    }
}

class EnabledValueLink extends Linked< boolean > {
    constructor( public parent : Linked< any >, public defaultValue ){
        super( parent.value != null );
    }

    set( x : boolean ){
        this.parent.set( x ? this.defaultValue : null );
    }
}

class ContainsRef extends Linked< boolean > {
    constructor( public parent : Linked< any >, public element : any ){
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
export class PropValueLink< E, K > extends Linked< E > {
    constructor( private parent : Linked< any >, public key : K ){
        super( parent.value[ key ] );
    }

    remove(){
        this.parent.removeAt( <any>this.key );
    }

    update( transform : Linked.Transform<E>, e? : Object ) : void {
        const { key } = this;

        this.parent.update( obj => {
            const prev = obj[ key ],
                next = transform( helpers( prev ).clone( prev ), e );

            if( next !== void 0 ){
                obj[ key ] = next;
                return obj;
            }
        } );
    }

    // Set new element value to parent array or object, performing purely functional update.
    set( next : E ) : void {
        /*
        this.update( prev => {
            if( prev !== next ) return next
        })*/

        // A bit more efficient implementation.
        const { key } = this;

        this.parent.update( obj => {
            if( obj[ key ] !== next ){
                obj[ key ] = next;
                return obj;
            }
        });

        
    };
}

function unwrap( links : Linked.Hash, field : string) : object {
    const values = {};

    for( let key in links ){
        if( links.hasOwnProperty( key ) ){
            const value = links[ key ][ field ];
            if( value !== void 0 ){
                values[ trim( key ) ] = value;
            }
        }
    }

    return values;
}

function trim( key : string ){
    return key[ 0 ] === '$' ? key.slice( 1 ) : key;
}