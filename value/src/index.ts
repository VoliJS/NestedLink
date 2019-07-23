/**
 * Advanced React links for purely functional two-way data binding
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */
import { arrayHelpers, helpers } from './helpers';

export type Transform< T > = ( value : T, event? : {} ) => T
export type EventHandler = ( event : {} ) => void

export interface Validator< T >{
    ( value : T ) : boolean
    error? : any
}

// Main Link class. All links must extend it.
export abstract class ValueLink< T >{
    // Create custom link to arbitrary value
    static value< T >( value : T, set : ( x : T ) => void ) : ValueLink< T >{
        return new CustomValueLink( value, set );
    }

    /**
    * Unwrap object with links, returning an object of a similar shape filled with link values.
    */
    static getValues<K extends keyof L, L extends ValueLinkHash>( links : L )
       : { [ name in K ] : any } {
       return unwrap( links, 'value' ) as any;
    }

    // EXPERIMENTAL: Support useRef interface.
    get current(){ return this.value; }
    set current( x : T ){ this.set( x ); }

    // Private accessor for whenChanged. Uniform with Type-R models and collections API.
    protected get _changeToken(){
        return this.value;
    }

    /**
     * Unwrap object with links, returning an object of a similar shape filled with link errors.
     */
    static getErrors<K extends keyof L, L extends ValueLinkHash>( links : L )
        : { [ name in K ] : L[name]["value"] } {
        return unwrap( links, 'error' ) as any;
    }

    /**
     * Return true if an object with links contains any errors.
     */
    static hasErrors<L extends ValueLinkHash>( links : L )
        : boolean {
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
    static setValues( links : ValueLinkHash, source : object ) : void {
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

    constructor( public value : T ){}

    // Validation error. Usually is a string with error text, but can hold any type.
    error : any

    // Link set functions
    abstract set( x : T ) : void

    onChange( handler : ( x : T ) => void ) : ValueLink< T > {
        return new ClonedValueLink( this, (x : T ) => {
            handler( x );
            this.set( x );
        });
    }

    // <input { ...link.props } />
    get props(){
        return typeof this.value === 'boolean' ? {
            checked : this.value,
            onChange : e => this.set( Boolean( e.target.checked ) as any )
        }:{
            value : this.value,
            onChange : e => this.set( e.target.value )
        };
    }

    // Immediately update the link value using given transform function.
    update( transform : Transform< T >, e? : Object ) : void {
        const next = transform( this.clone(), e );
        next === void 0 || this.set( next );
    }

    // Create new link which applies transform function on set.
    pipe( handler : Transform< T > ) : ValueLink< T > {
        return new ClonedValueLink( this, x =>{
            const next = handler( x, this.value );
            next === void 0 || this.set( next );
        } );
    }

    // Create UI event handler function which will update the link with a given transform function.
    action( transform : Transform< T > ) : EventHandler {
        return e => this.update( transform, e );
    }

    equals( truthyValue : T ) : ValueLink<boolean> {
        return new EqualsValueLink( this, truthyValue );
    }

    enabled( defaultValue? : T ) : ValueLink<boolean> {
        return new EnabledValueLink( this, defaultValue || "" );
    }

    // Array-only links methods
    contains<E>( this : ValueLink<E[]>, element : E ) : ValueLink<boolean>{
        return new ContainsRef( this, element );
    }

    push<E>( this : ValueLink<E[]>, ...args : E[] ) : void;
    push(){
        const array = arrayHelpers.clone( this.value );
        Array.prototype.push.apply( array, arguments );
        this.set( array );
    }

    unshift<E>( this : ValueLink<E[]>, ...args : E[] ) : void;
    unshift() : void {
        const array = arrayHelpers.clone( this.value );
        Array.prototype.unshift.apply( array, arguments );
        this.set( array );
    }

    splice( start : number, deleteCount? : number );
    splice() : void {
        const array = arrayHelpers.clone( this.value );
        Array.prototype.splice.apply( array, arguments );
        this.set( array );
    }

    // Array and objects universal collection methods
    map<E, Z>( this : ValueLink<E[]>, iterator : ( link : PropValueLink<E, number>, idx : number ) => Z ) : Z[];
    map<E, Z>( this : ValueLink<{[ key : string ] : E }>, iterator : ( link : PropValueLink<E, string>, idx : string ) => Z ) : Z[];
    map( iterator ) {
        return helpers( this.value ).map( this, iterator );
    }

    removeAt<E>( this : ValueLink<E[]>, key : number ) : void;
    removeAt<E>( this : ValueLink<{ [ key : string ] : E }>, key : string ) : void;
    removeAt( key ){
        const { value } = this,
            _ = helpers( value );

        this.set( _.remove( _.clone( value ), key ) );
    }

    at< E >( this : ValueLink< E[] >, key : number ) : PropValueLink<E, number>;
    at< K extends keyof T, E extends T[K]>( key : K ) : PropValueLink<E, K>;
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
    pick< K extends keyof T >( ...keys : K[]) : {[ P in K ]: ValueLink<T[P]>}
    pick() {
        let links = {}, keys = arguments.length ? arguments : Object.keys( this.value );

        for( let i = 0; i < keys.length; i++ ){
            const key : string = keys[ i ];
            links[ key ] = new PropValueLink( this, key );
        }

        return links;
    }

    /**
     * Convert link to object to the object of links with $-keys.
     */
    $links() : { [ key : string ] : ValueLink<any> }{
        let links : ValueLinkHash = {},
            { value } = this;

        for( let key in value ){
            if( value.hasOwnProperty( key ) ){
                links[ '$' + key ] = new PropValueLink( this, key );
            }
        }

        return links as any;
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

export class CustomValueLink< T > extends ValueLink< T > {
    set( x ){}

    constructor( value : T, set : ( x : T ) => void ){
        super( value );
        this.set = set;
    }
}

export class ClonedValueLink< T > extends ValueLink< T > {
    set( x ){}

    constructor( parent : ValueLink< T >, set : ( x : T ) => void ){
        super( parent.value );
        this.set = set;

        const { error } = parent;
        if( error ) this.error = error;
    }
}

export class EqualsValueLink extends ValueLink< boolean > {
    constructor( public parent : ValueLink< any >, public truthyValue ){
        super( parent.value === truthyValue );
    }

    set( x : boolean ) : void {
        this.parent.set( x ? this.truthyValue : null );
    }
}

export class EnabledValueLink extends ValueLink< boolean > {
    constructor( public parent : ValueLink< any >, public defaultValue ){
        super( parent.value != null );
    }

    set( x : boolean ){
        this.parent.set( x ? this.defaultValue : null );
    }
}

export class ContainsRef extends ValueLink< boolean > {
    constructor( public parent : ValueLink< any >, public element : any ){
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
export class PropValueLink< E, K > extends ValueLink< E > {
    constructor( private parent : ValueLink< any >, public key : K ){
        super( parent.value[ key ] );
    }

    remove(){
        this.parent.removeAt( <any>this.key );
    }

    // Set new element value to parent array or object, performing purely functional update.
    set( x : E ) : void {
        if( this.value !== x ){
            this.parent.update( value => {
                value[ this.key ] = x;
                return value;
            } );
        }
    };
}

export interface ValueLinkHash {
    [ name : string ] : ValueLink<any>
}

function unwrap( links : ValueLinkHash, field : string) : object {
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