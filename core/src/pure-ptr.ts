/**
 * Purely functional two-way data binding library for React
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */
import { helpers } from './helpers';

type ArrayType<T> = ArrayElement<T>[]
type ArrayElement<T> = T extends (infer E)[] ? E : never

/**
 * An abstract class representing a pointer to a value of type `T`.
 * Provides various methods for manipulating and interacting with the value.
 *
 * @template T - The type of the value.
 */
export abstract class PurePtr<T>{
    /** Validation error. Usually a string containing the error message, but can hold any type. */ 
    error : any = void 0
    
    /** Set value */ 
    abstract set( x : T ) : void

    /**
     * Schedules the setting of a value after a specified delay.
     *
     * @param x - The value to be set.
     * @param delay - The delay in milliseconds before setting the value. Defaults to 0.
     */
    deferSet( x : T, delay = 0 ) : void {
        setTimeout( () => this.set( x ), delay );
    }

    constructor( public value : T ){}

    // Private accessor for whenChanged. Uniform with Type-R models and collections API.
    protected get _changeToken(){
        return this.value;
    }

    /**
     * Registers a handler function to be called when the value changes.
     * The handler function will be invoked with the new value, and the value will be updated.
     *
     * @param handler - A function that takes the new value of type `T` as an argument.
     * @returns A new instance of `ClonedPtr` that wraps the current instance and the handler function.
     */
    onChange( handler : ( x : T ) => void ) : PurePtr<T> {
        return new ClonedPtr( this, ( x : T ) => {
            handler( x );
            this.set( x );
        });
    }

    /**
     * Applies a handler function to the new value and the previous value
     * to transform the value before updating it.
     *
     * @param handler - A function that takes the next value and the previous value,
     * and returns a new value.
     * @returns A new `PurePtr` instance with the result of the handler function.
     */
    pipe( handler : ( next : T, prev : T ) => T ) : PurePtr< T > {
        return new ClonedPtr( this, x =>{
            const next = handler( x, this.value );
            next === void 0 || this.set( next );
        } );
    }

    /**
     * Gets the properties for the React <input/> component based on the Ptr type.
     * 
     * @returns An object containing either `checked` and `onChange` properties if the value is boolean,
     *          or `value` and `onChange` properties otherwise.
     * 
     * - If `T` is boolean:
     *   - `checked`: A boolean indicating the checked state.
     *   - `onChange`: A function that handles the change event and updates the state.
     * 
     * - If `T` is not boolean:
     *   - `value`: The current value of type `T`.
     *   - `onChange`: A function that handles the change event and updates the state.
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

    /**
     * Updates the ptr value using the provided transformation function.
     *
     * @param transform - A function that takes the current value and returns a new value.
     *                    If the function returns `undefined`, the value is not updated.
     */
    update( transform : PurePtr.Transform<T> ) : void {
        const next = transform( this.value );
        next === void 0 || next === this.value || this.set( next );
    }

    /**
     * Schedules an update to be performed after a specified delay.
     *
     * @param transform - The transformation function to be applied during the update.
     * @param delay - The delay in milliseconds before the update is performed. Defaults to 0.
     * @returns void
     */
    deferUpdate( transform : PurePtr.Transform<T>, delay = 0 ) : void {
        setTimeout( () => this.update( transform ), delay );
    }

    /**
     * Compares the current value with the provided `truthyValue` and returns a boolean `PurePtr` instance
     * that indicates whether the values are equal.
     *
     * @param truthyValue - The value to compare with the current value.
     * @returns A `PurePtr<boolean>` instance that represents the result of the comparison.
     */
    equals( truthyValue : T ) : PurePtr<boolean> {
        return new ValueEqualsPtr( this, truthyValue );
    }

    /**
     * Property to determine if the value is truthy.
     * 
     * @returns {boolean | undefined} - Returns `true` if the value is truthy, otherwise `undefined`.
     */
    get isTruthy(): boolean | undefined {
        return this.value ? true : undefined;
    }

    enabled( defaultValue? : T ) : PurePtr<boolean> {
        return new EnabledValuePtr( this, defaultValue || "" );
    }

    /**
     * Returns a boolean `PurePtr` instance that indicates whether the element is contained within the array.
     *
     * @param this - A pointer to the array to be checked.
     * @param element - The element to search for within the array.
     * @returns A pointer to a boolean indicating whether the element is contained within the array.
     */
    contains( this : PurePtr<ArrayType<T>>, element : ArrayElement<T> ) : PurePtr<boolean>{
        return new ArrayContainsPtr( this, element );
    }

    /**
     * Pushes one or more elements to the end of the array and updates the value.
     * 
     * This method clones the current array, pushes the provided arguments to the cloned array,
     * and then sets the updated array as the new value.
     * 
     * @param {...any[]} arguments - The elements to add to the end of the array.
     */
    push(this : PurePtr<ArrayType<T>>, ...args : ArrayType<T> ) : void{
        const array = this.value.slice();
        Array.prototype.push.apply( array, args);
        this.set( array );
    }

    /**
     * Adds one or more elements to the beginning of the array and updates the value.
     * 
     * This method clones the current array, applies the `unshift` operation to the clone,
     * and then sets the updated array as the new value.
     * 
     * @param {...any[]} arguments - The elements to add to the beginning of the array.
     * @returns {void}
     */
    unshift( this : PurePtr<ArrayType<T>>, ...args : ArrayType<T> ) : void {
        const array = this.value.slice();
        Array.prototype.unshift.apply( array, args );
        this.set( array );
    }
    
    /**
     * Splices the array stored in `this.value`.
     * 
     * This method clones the current array, applies the splice operation, and then updates the stored array with the result.
     * @returns {void} This method does not return a value.
     */
    splice( this : PurePtr<ArrayType<T>>, start : number, deleteCount? : number ) : void{
        const array = this.value.slice();
        Array.prototype.splice.apply( array, arguments as any);
        this.set( array );
    }

    /**
     * Creates a new array (or object) with the results of calling a provided function on every element.
     *
     * @param iterator - A function that is called for every element of the array. It takes a pointer to the element and its index.
     * @returns A new array with each element being the result of the iterator function.
     */
    map<Z>( this : PurePtr<ArrayType<T>>, iterator : ( link : PurePtr<ArrayElement<T>>, idx : number ) => Z ) : Z[]{
        const length = this.value.length,
              mapped = Array( length );

        for( var i = 0, j = 0; i < length; i++ ){
            const y = iterator( this.at( i ), i );
            y === void 0 || ( mapped[ j++ ] = y );
        }

        mapped.length === j || ( mapped.length = j );

        return mapped;
    }

    removeAt( this : PurePtr<ArrayType<T>>, key : number ) : void;
    removeAt( key : keyof T ) : void;
    /**
     * Removes an element from the collection at the specified key.
     *
     * @param key - The key or index of the element to remove. Can be a number or a key of type T.
     */
    removeAt( key : number | keyof T ){
        const { value } = this,
            _ = helpers( value );

        this.set( _.remove( value, key as any ) );
    }

    at( this : PurePtr<ArrayType<T>>, key : number ) : PurePtr<ArrayElement<T>>;
    at<K extends keyof T>( key : K ) : PurePtr<T[K]>;
    /**
     * Retrieves a pointer to the element at the specified key.
     *
     * @param key - The key to access the property. It can be a number or a string.
     * @returns An instance of `ObjPropPtr` corresponding to the given key.
     */
    at( key : number | string ) : PurePtr<any> {
        return new ObjPropPtr( this, key );
    }

    /**
     * Finds a pointer to an element in the array that satisfies the provided predicate function.
     *
     * @param predicate - A function that tests each element of the array. 
     * It should return `true` to keep the element, `false` otherwise. 
     * It receives two arguments:
     *   - `element`: The current element being processed in the array.
     *   - `idx`: The index of the current element being processed in the array.
     * @returns A pointer to the found element, or `undefined` if no element satisfies the predicate.
     */
    find( this : PurePtr<ArrayType<T>>, predicate : ( element : ArrayElement<T>, idx : number ) => boolean ) : PurePtr<ArrayElement<T>> | undefined {
        const idx = this.value.findIndex( predicate );
        return idx >= 0 ? this.at( idx ) : undefined;
    }

    /**
     * Removes elements from the array that match the given predicate.
     *
     * @param this - The array from which elements will be removed.
     * @param predicate - A function that tests each element of the array. 
     * If the predicate returns `true`, the element is removed.
     * @returns void
     */
    remove( this : PurePtr<ArrayType<T>>, predicate : ( element : ArrayElement<T>, idx : number ) => boolean ) : void {
        this.update( array => array.filter( ( el, idx ) => !predicate( el, idx ) ) );
    }

    /**
     * Removes the element from the array or object.
     */
    removeSelf(){
        this.set( undefined as any );
    }

    /**
     * Filters the elements of the array based on the provided predicate function, and returns an array of pointers to the filtered elements.
     *
     * @param predicate - A function that tests each element of the array. 
     * It should return `true` to keep the element, or `false` otherwise. 
     * It receives the current element and its index as arguments.
     * @returns An array of `PurePtr` elements that satisfy the predicate function.
     */
    filter( this : PurePtr<ArrayType<T>>, predicate : ( element : ArrayElement<T>, idx : number ) => boolean ) : PurePtr<ArrayElement<T>>[] {
        const result: PurePtr<ArrayElement<T>>[] = [];

        for (let i = 0; i < this.value.length; i++) {
            if (predicate(this.value[i], i)) {
                result.push(this.at(i));
            }
        }

        return result;
    }

    pick<K extends (keyof T)[]>(...keys: K): { [I in keyof K]: ObjPropPtr<T[K[I]], K[I]> }
    /**
     * Creates an array of pointers to the specified object properties.
     *
     * @returns An array of `ObjPropPtr` instances corresponding to the provided arguments.
     */
    pick(){
        let links: ObjPropPtr<any, any>[] = Array( arguments.length );

        for (let i = 0; i < arguments.length; i++) {
            links[i] = new ObjPropPtr(this, arguments[i]);
        }

        return links;
    }

    /**
     * Validates the current value using the provided validator function.
     * If the value is invalid and no previous error exists, sets the error.
     *
     * @param whenValid - A function that takes the current value and returns a boolean indicating if the value is valid.
     * @param error - An optional error to set if the value is invalid. If not provided, the error from the validator or a default error will be used.
     * @returns The current instance for chaining.
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

    /**
     * Creates a new `PurePtr` instance with the given value and setter function.
     *
     * @template T - The type of the value.
     * @param {T} value - The initial value to be stored in the `PurePtr`.
     * @param {(x: T) => void} set - A function to set the value.
     * @returns {PurePtr<T>} A new `PurePtr` instance containing the value and setter function.
     */
    export function value<T>( value : T, set : ( x : T ) => void ) : PurePtr<T>{
        return new CustomPtr( value, set );
    }

    export function mutable<T extends object>( state : T ) : PurePtr<T>{
        const placeholder = PurePtr
            .value( state, x => {
                placeholder.value = x;
            } )

        return placeholder;
    }

    /**
     * Checks if any of the provided pointers have errors.
     *
     * @param ptrs - An array of pointers to check for errors.
     * @returns `true` if any pointer has an error, otherwise `false`.
     */
    export function haveErrors( ...ptrs : PurePtr<any>[] ) : boolean {
        return ptrs.some( ptr => ptr.error !== void 0 );
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
export class ObjPropPtr< E, K extends string|number|symbol> extends PurePtr< E > {
    constructor( private parent : PurePtr< any >, public key : K ){
        super( parent.value[ key ] );
    }

    removeSelf(){
        this.parent.removeAt( this.key );
    }

    update( transform : PurePtr.Transform<E> ) : void {
        const { key } = this;

        this.parent.update( parent => {
            const prev = parent[ key ],
                next = transform( prev );

            if( next !== void 0 && next !== prev ){
                return helpers( parent ).set( parent, key, next );
            }
        } );
    }

    // Set new element value to parent array or object, performing purely functional update.
    set( next : E ) : void {
        const { key } = this;

        this.parent.update( parent => {
            if( parent[ key ] !== next ){
                return helpers( parent ).set( parent, key, next );
            }
        });
    };
}