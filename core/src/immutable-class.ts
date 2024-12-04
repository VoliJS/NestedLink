import { Helper } from "./common";

/**
 * A base class for immutable classes.
 */
export class Immutable {
    static object<T extends typeof Immutable>(this: T, props: Partial<InstanceType<T>> ): Readonly<InstanceType<T>>;
    static object<T extends typeof Immutable, U>(this: T, props: Partial<InstanceType<T>>, parse: (value: U ) => Partial<InstanceType<T>>): Readonly<InstanceType<T>>;
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

    static array<T extends typeof Immutable>(this: T, collection : Iterable<Partial<InstanceType<T>>> ) : Readonly<InstanceType<T>>[]; 
    static array<T extends typeof Immutable, U>(this: T, collection : Iterable<U>, parse: (value: U, idx : number ) => Partial<InstanceType<T>> | undefined ) : Readonly<InstanceType<T>>[];
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
     * Creates a new instance of the current object with the specified properties merged into it.
     * 
     * @param props - An object containing properties to be merged into the new instance.
     * @param options - Optional parameter that can be used to initialize the new instance.
     * @returns A new instance of the current object with the specified properties merged in, frozen to prevent further modifications.
     */
    set( props : Partial<this> ) : this {
        const next = new ( this.constructor as any )() as this;
        Object.assign( next, this, props );
        next.initialize();
        return Object.freeze( next );
    }
}

export const immutableClassHelpers : Helper = {
    remove( prev : any, key : string ) : any {    
        return prev.set({ [ key ] : undefined });

    },

    set( prev : any, key : string, value : any ) : any {
        return prev.set({ [ key ] : value });
    }
};

// Todo: support in pure-ptr

export function Collection<T, K>( getId : ( x : T ) => K ){
    return class Collection extends Immutable {
        items : T[] = []
        
        #byId? : Map<K, T> = undefined;

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
            return this.set( { items : [...this.items].sort( compare ) } as Partial<this> );
        }
        
        get( id : K ) : T | undefined{
            if( !this.#byId ){
                this.#byId = new Map( this.items.map( x => [getId(x), x] ) );
            }

            return this.#byId.get( id );
        }

        add( item : T ) : this {
            return this.set( { items : [...this.items, item] } as Partial<this> );
        }

        unshift( item : T ) : this {
            return this.set( { items : [item, ...this.items] } as Partial<this> );
        }

        push( item : T ) : this {
            return this.set( { items : [...this.items, item] } as Partial<this> );
        }

        // remove by id, array if ids, Partial T, or array of partial T, or predicate
        remove( id : K ) : this {
            return this.set( { items : this.items.filter( x => getId(x) !== id ) } as Partial<this> );
        }

        static from<X = T>( other : Iterable<T>, parse? : ( x : X ) => Partial<T> ) : Collection {
            return this.object({ items : [...other] }) as any;
        }
    }
}