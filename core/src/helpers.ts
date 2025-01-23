import { Helper } from "./common";
import { PureObject, immutableClassHelpers } from "./immutable-class";

/**
 * Select appropriate helpers function for particular value type.
 */
export interface IterableLink {
    value : any
    at( key : number | string ) : any
}

export type Iterator = ( link : any, key : number ) => any;

const ArrayProto = Array.prototype,
      ObjectProto = Object.prototype;

export function helpers( value : any ) : Helper {
    if( value && typeof value === 'object' ){
        switch( Object.getPrototypeOf( value ) ){
            case ArrayProto  : return arrayHelpers;
            case ObjectProto : return objectHelpers;
            default:
                if( value instanceof PureObject ){
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
