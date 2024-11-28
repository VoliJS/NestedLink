/**
 * Select appropriate helpers function for particular value type.
 */
export interface IterableLink {
    value : any
    at( key : number | string ) : any
}

export type Iterator = ( link : any, key : number ) => any;

export interface Helper {
    remove( obj : any, key : string | number | symbol ) : any,
    set( prev : any, key : string | number | symbol, value : any ) : any
}

const ArrayProto = Array.prototype,
      ObjectProto = Object.prototype;

export function helpers( value : any ) : Helper {
    if( value && typeof value === 'object' ){
        switch( Object.getPrototypeOf( value ) ){
            case ArrayProto  : return arrayHelpers;
            case ObjectProto : return objectHelpers;
            default:
                if( value instanceof Immutable ){
                    return immutableClassHelpers;
                }
        }
    }

    return dummyHelpers;
}

// Do nothing for types other than Array and plain Object.
const dummyHelpers : Helper = {
    remove( value ){ return value; },
    set( prev : any, key : string, value : any ) : any {
        prev;
    }

};

// `map` and `clone` for plain JS objects
export const objectHelpers : Helper = {
    remove( object : Record<string,any>, key : string ) : {} {
        const { [ key ] : _, ...rest } = object;
        return rest;
    },

    set( prev : Record<string,any>, key : string, value : any ) : {} {
        return { ...prev, [ key ] : value };
    },
};

// `map` and `clone` helpers for arrays.
export const arrayHelpers = {
    remove( array : any[], i : number ) : any[] {
        return array.slice().splice( i, 1 );
    },

    set( array : any[], i : number, value : any ) : any[] {
        const clone = array.slice();
        clone[ i ] = value;
        return clone;
    }
};

/**
 * A base class for immutable classes.
 */
export class Immutable {
    /**
     * Creates a new immutable instance of the class, merging the provided partial instance with a new instance.
     * 
     * @param prev - A partial instance of the class to merge with the new instance.
     * @returns A new immutable instance of the class.
     */
    static from<T extends typeof Immutable>(this: T, prev: Partial<InstanceType<T>>, upd?: Partial<InstanceType<T>>): Readonly<InstanceType<T>> {
        const next = new this();

        if( upd ){
            Object.assign( next, prev, upd );
        }
        else{
            Object.assign( next, prev );
        }

        next.initialize();

        return Object.freeze( next ) as any
    }

    static map<T extends typeof Immutable>(this: T, collection : Iterable<Partial<InstanceType<T>>> ) : InstanceType<T>[]; 
    static map<T extends typeof Immutable, U>(this: T, collection : Iterable<U>, callbackfn: (value: U) => Partial<InstanceType<T>> ) : InstanceType<T>[];
    static map( collection : Iterable<any>, callbackfn: (value: any) => any = x => x ) : any[]{
        const mapped : any[] = [];

        for( let el of collection ){
            const res = callbackfn( el );
            res === void 0 || ( mapped.push( this.from( res ) ));
        }

        return mapped;
    }
    
    /**
     * Initializes computed properties.
     * This method will be called right after the instance is created and all properties are set, 
     * but before the object is sealed.
     */
    initialize(){}
}

export const immutableClassHelpers : Helper = {
    remove( prev : any, key : string ) : any {    
        return prev.constructor.from( prev, { [ key ] : undefined } );

    },

    set( prev : any, key : string, value : any ) : any {
        return prev.constructor.from( prev, { [ key ] : value } );
    }
};