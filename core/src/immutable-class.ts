import { Helper } from "./common";

/**
 * A base class for immutable classes.
 */
export class PureObject {
    static object<T extends typeof PureObject>(this: T, props: Partial<InstanceType<T>> ): Readonly<InstanceType<T>>;
    static object<T extends typeof PureObject, U>(this: T, props: U, parse: (value: U ) => Partial<InstanceType<T>>): Readonly<InstanceType<T>>;
    /**
     * Creates a new instance of the class, assigns properties to it, and freezes the object.
     *
     * @param props - The properties to assign to the new instance.
     * @param parse - An optional function to parse the properties before assigning them.
     * @returns A frozen instance of the class with the assigned properties.
     */
    static object(props: any, parse? : Function ): any{
        const next = new this();
        Object.assign( next, parse ? parse( props ) : props );
        next.initialize();
        return Object.freeze( next ) as any
    }

    static array<T extends typeof PureObject>(this: T, collection : Iterable<Partial<InstanceType<T>>> ) : Readonly<InstanceType<T>>[]; 
    static array<T extends typeof PureObject, U>(this: T, collection : Iterable<U>, parse: (value: U, idx : number ) => Partial<InstanceType<T>> | undefined ) : Readonly<InstanceType<T>>[];
    /**
     * Creates a new array of immutable instances by mapping the provided collection.
     * If the result of the callback function is not `undefined`, it is added to the resulting array.
     *
     * @param collection - The iterable collection to be mapped.
     * @param callbackfn - The function to call on each element of the collection. Defaults to an identity function.
     * @returns An array containing the results of applying the callback function to each element of the collection.
     */
    static array( collection : Iterable<any>, callbackfn: (value: any, idx : number) => any = x => x ) : readonly any[]{
        const mapped : any[] = [];
        let i = 0;

        for( let el of collection ){
            const res = callbackfn( el, i++ );
            res === void 0 || ( mapped.push( this.object( res ) ));
        }

        return Object.freeze( mapped );
    }

    /**
     * Initializes computed properties.
     * This method will be called right after the instance is created and all properties are set, 
     * but before the object is sealed.
     */
    initialize(){}

    /**
     * Creates a shallow copy of the current instance, applies the provided function to the copy,
     * initializes the copy, and then returns the copy as an immutable object.
     *
     * @param fun - A function that takes a copy of the current instance and modifies it.
     * @returns A new instance of the current class that has been modified and frozen.
     */
    applyChanges<K extends keyof this>( key : K, value : this[K]) : this;
    applyChanges( fun : ( x : this ) => void ) : this;
    applyChanges( a : Function | string, b? : any ) : this {
        const cloned = new (this as any ).constructor();
        Object.assign( cloned, this )

        if( typeof a === 'function' ){
            a( cloned );
        } else {
            cloned[ a ] = b;
        }

        cloned.initialize()
        return Object.freeze(cloned);
    }    
}

export const immutableClassHelpers : Helper = {
    remove( prev : any, key : string ) : any {    
        return prev.applyChanges( key, undefined );

    },

    set( prev : any, key : string, value : any ) : any {
        return prev.applyChanges( key, value );
    }
};

// Todo: support in pure-ptr
// Todo: support for custom indexes

export class PureCollection<T> extends PureObject {
    items : T[] = []

    getId( x : T ) : string | number {
        return (x as any).id;
    }
    
    // Wrap index in object to workarounf private member polyfill fail with Object.freeze.
    #indexes : { id? : Map<string | number, T> } = { id : undefined };

    // iterable interface
    [Symbol.iterator](){
        return this.items[Symbol.iterator]();
    }

    filter( predicate : ( x : T ) => boolean ) : T[] {
        return this.items.filter( predicate );
    }

    map<R>( selector : ( x : T ) => R ) : R[] {
        return this.items.map( selector );
    }

    groupBy<K>( keySelector : ( x : T ) => K ) : Map<K, T[]> {
        return (Map as any).groupBy( this.items, keySelector );
    }

    sort( compare : ( a : T, b : T ) => number ) : this {
        return this.applyChanges( 'items', [...this.items].sort( compare ) );
    }
    
    get( id : string | number ) : T | undefined{
        const indexes = this.#indexes;

        if( !indexes.id ){
            indexes.id = new Map( this.items.map( x => [this.getId(x), x] ) );
        }

        return indexes.id.get( id );
    }

    add( item : T ) : this {
        return this.applyChanges( 'items', [...this.items, item] );
    }

    unshift( item : T ) : this {
        return this.applyChanges( 'items', [item, ...this.items] );
    }

    push( item : T ) : this {
        return this.applyChanges( 'items', [...this.items, item] );
    }

    // remove by id, array if ids, Partial T, or array of partial T, or predicate
    remove( id : string | number ) : this {
        return this.applyChanges( 'items', this.items.filter( x => this.getId(x) !== id ) );
    }

    static from<T, C extends typeof PureCollection<T>>( this: C, other : Iterable<T> ) : Readonly<PureCollection<T> extends InstanceType<C> ? PureCollection<T> : InstanceType<C>>;
    static from<T, X, C extends typeof PureCollection<T>>( this: C, other : Iterable<X>, parse : ( x : X ) => T ) : Readonly<PureCollection<T> extends InstanceType<C> ? PureCollection<T> : InstanceType<C>>;
    static from( other : Iterable<any>, parse? : ( x : any ) => any ) : PureCollection<any> {
        const arr = Array.isArray(other) ? other : [...other];
        return this.object({ items : parse ? arr.map( parse ) : arr }) as any;
    }
}