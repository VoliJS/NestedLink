/**
 * Purely functional two-way data binding library for React
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */
import { arrayHelpers, helpers } from './helpers';

export * from './helpers'

type ArrayType<T> = ArrayElement<T>[]
type ArrayElement<T> = T extends (infer E)[] ? E : never
type RecordElement<T> = T extends { [ key : string ] : infer E } ? E : never
type RecordType<T> = { [ key : string ] : RecordElement<T> }

/** 
 * The `PurePtr` class is an abstract, purely functional pointer that encapsulates a value, a function to update the value, and its validation error.
 * The enclosed value is considered immutable.
 */ 
export abstract class PurePtr<T>{
    /** Validation error. Usually a string containing the error message, but can hold any type. */ 
    error : any = void 0
    
    /** Set value */ 
    abstract set( x : T ) : void

    constructor( public value : T ){}

    // Private accessor for whenChanged. Uniform with Type-R models and collections API.
    protected get _changeToken(){
        return this.value;
    }

    /** Creates a new pointer that executes the given function before updating the link's value. */
    onChange( handler : ( x : T ) => void ) : PurePtr<T> {
        return new ClonedPtr( this, ( x : T ) => {
            handler( x );
            this.set( x );
        });
    }

    /** Produces a new pointer that transforms the value before calling `set`. */
    pipe( handler : ( next : T, prev : T ) => T ) : PurePtr< T > {
        return new ClonedPtr( this, x =>{
            const next = handler( x, this.value );
            next === void 0 || this.set( next );
        } );
    }

    /** 
     * Creates React component props for the <input> component.
     * 
     * <input { ...link.props } />
     */ 
    get props() :
        T extends boolean ? { checked : boolean, onChange : ( e : any ) => void } :
            { value : T, onChange : ( e : any ) => void }
    {
        return typeof this.value === 'boolean' ? {
            checked : this.value,
            onChange : e => this.set( Boolean( e.target.checked ) as any )
        }:{
            value : this.value,
            onChange : (e: any) => this.set( e.target.value )
        } as any;
    }

    /** Updates the value using the given transform function. */
    update( transform : PurePtr.Transform<T> ) : void {
        const next = transform( this.value );
        next === void 0 || this.set( next );
    }

    equals( truthyValue : T ) : PurePtr<boolean> {
        return new ValueEqualsPtr( this, truthyValue );
    }

    get isTruthy(){
        return this.value ? true : undefined;
    }

    enabled( defaultValue? : T ) : PurePtr<boolean> {
        return new EnabledValuePtr( this, defaultValue || "" );
    }

    // Array-only methods
    contains( this : PurePtr<ArrayType<T>>, element : ArrayElement<T> ) : PurePtr<boolean>{
        return new ArrayContainsPtr( this, element );
    }

    push( this : PurePtr<ArrayType<T>>, ...args : ArrayType<T> ) : void;
    push(){
        const array = arrayHelpers.clone( this.value );
        Array.prototype.push.apply( array, arguments as any);
        this.set( array );
    }

    unshift( this : PurePtr<ArrayType<T>>, ...args : ArrayType<T> ) : void;
    unshift() : void {
        const array = arrayHelpers.clone( this.value );
        Array.prototype.unshift.apply( array, arguments as any );
        this.set( array );
    }

    
    splice( this : PurePtr<ArrayType<T>>, start : number, deleteCount? : number ) : void;
    splice() : void {
        const array = arrayHelpers.clone( this.value );
        Array.prototype.splice.apply( array, arguments as any);
        this.set( array );
    }

    // Array and objects universal collection methods
    map<Z>( this : PurePtr<ArrayType<T>>, iterator : ( link : ObjPropPtr<ArrayElement<T>, number>, idx : number ) => Z ) : Z[];
    map<Z>( this : PurePtr<RecordType<T>>, iterator : ( link : ObjPropPtr<RecordElement<T>, string>, idx : string ) => Z ) : Z[];
    map( iterator : any ) : any[] {
        return helpers( this.value ).map( this, iterator );
    }

    removeAt( this : PurePtr<ArrayType<T>>, key : number ) : void;
    removeAt( key : keyof T ) : void;
    removeAt( key : number | keyof T ){
        const { value } = this,
            _ = helpers( value );

        this.set( _.remove( _.clone( value ), key as any ) );
    }

    at( this : PurePtr<ArrayType<T>>, key : number ) : ObjPropPtr<ArrayElement<T>, number>;
    at<K extends keyof T, E extends T[K]>( key : K ) : ObjPropPtr<E, K>;
    at( key : number | string ){
        return new ObjPropPtr( this, key );
    }

    find( this : PurePtr<ArrayType<T>>, predicate : ( element : ArrayElement<T>, idx : number ) => boolean ) : PurePtr<ArrayElement<T>> | undefined {
        const idx = this.value.findIndex( predicate );
        return idx >= 0 ? this.at( idx ) : undefined;
    }

    remove( this : PurePtr<ArrayType<T>>, predicate : ( element : ArrayElement<T>, idx : number ) => boolean ) : void {
        this.update( array => array.filter( ( el, idx ) => !predicate( el, idx ) ) );
    }

    removeSelf(){
        this.set( undefined as any );
    }

    filter( this : PurePtr<ArrayType<T>>, predicate : ( element : ArrayElement<T>, idx : number ) => boolean ) : PurePtr<ArrayElement<T>>[] {
        const result: PurePtr<ArrayElement<T>>[] = [];

        for (let i = 0; i < this.value.length; i++) {
            if (predicate(this.value[i], i)) {
                result.push(this.at(i));
            }
        }

        return result;
    }

    clone() : T {
        let { value } = this;
        return helpers( value ).clone( value );
    }

    /**
     * Create pointers to the given object properties.
     *
     * @returns {ObjPropPtr<any, any>[]} An array of pointers.
     */
    pick<K extends (keyof T)[]>(...keys: K): { [I in keyof K]: ObjPropPtr<T[K[I]], K[I]> }
    pick(){
        let links: ObjPropPtr<any, any>[] = Array( arguments.length );

        for (let i = 0; i < arguments.length; i++) {
            links[i] = new ObjPropPtr(this, arguments[i]);
        }

        return links;
    }

    /**
     * Validate pointer with predicate. Can be chained.
     */
    check( whenValid : PurePtr.Validator<T>, error? : any ) : this {
        if( !this.error && !whenValid( this.value ) ){
            this.error = error || whenValid.error || defaultError;
        }

        return this;
    }
}

export namespace PurePtr {
    export interface Validator< T >{
        ( value : T ) : boolean
        error? : any
    }    

    export type Transform< T > = ( value : T ) => T | undefined

    export type Hash<T extends object = any> = {
        [K in keyof T] : PurePtr<T[K]>
    }

    /** Create pointer out of its value and the set function */ 
    export function value<T>( value : T, set : ( x : T ) => void ) : PurePtr<T>{
        return new CustomPtr( value, set );
    }

    export function mutable<T extends object>( state : T ) : PurePtr<T>{
        return new CustomPtr( state, x => {
            for( let key in x ){
                if( x.hasOwnProperty( key ) ){
                    state[ key ] = x[ key ];
                }
            }
        } );
    }
}

class CustomPtr< T > extends PurePtr< T > {
    set( x : T ){}

    constructor( value : T, set : ( x : T ) => void ){
        super( value );
        this.set = set;
    }
}

class ClonedPtr<T> extends PurePtr< T > {
    set( x : T ){}

    constructor( parent : PurePtr< T >, set : ( x : T ) => void ){
        super( parent.value );
        this.set = set;

        const { error } = parent;
        if( error ) this.error = error;
    }
}

class ValueEqualsPtr extends PurePtr< boolean > {
    constructor( public parent : PurePtr< any >, public truthyValue : any ){
        super( parent.value === truthyValue );
    }

    set( x : boolean ) : void {
        this.parent.set( x ? this.truthyValue : null );
    }
}

class EnabledValuePtr extends PurePtr< boolean > {
    constructor( public parent : PurePtr< any >, public defaultValue : any ){
        super( parent.value != null );
    }

    set( x : boolean ){
        this.parent.set( x ? this.defaultValue : null );
    }
}

class ArrayContainsPtr extends PurePtr< boolean > {
    constructor( public parent : PurePtr< any >, public element : any ){
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
export class ObjPropPtr< E, K > extends PurePtr< E > {
    constructor( private parent : PurePtr< any >, public key : K ){
        super( parent.value[ key ] );
    }

    removeSelf(){
        this.parent.removeAt( <any>this.key );
    }

    update( transform : PurePtr.Transform<E> ) : void {
        const { key } = this;

        this.parent.update( obj => {
            const prev = obj[ key ],
                next = transform( helpers( prev ).clone( prev ) );

            if( next !== void 0 ){
                const res = helpers( obj ).clone( obj )
                res[ key ] = next;
                return res;
            }
        } );
    }

    // Set new element value to parent array or object, performing purely functional update.
    set( next : E ) : void {
        const { key } = this;

        this.parent.update( obj => {
            if( obj[ key ] !== next ){
                const res = helpers( obj ).clone( obj )
                res[ key ] = next;
                return res;
            }
        });
    };
}