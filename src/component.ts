import * as React from 'react'
import { Link, LinksCache } from './link'

export interface DataBindingSource< S >{
    linkAt< K extends keyof S>( key : K ) : Link< S[ K ] >
    linkAll( ...keys : ( keyof S )[] ) : LinksCache< S >
}

export abstract class LinkedComponent< P, S > extends React.Component< P, S > implements DataBindingSource< S > {
    links : LinksCache< S > = null;

    linkAt< K extends keyof S>( key : K ) : Link< S[ K ] >{
        return linkAt( this, key );
    }

    linkAll( ...args : ( keyof S )[] ) : LinksCache< S >{
        return linkAll( this, args );
    }
}

Link.all = < P, S >( component : React.Component< P, S >, ..._keys : ( keyof S )[] ) => linkAll( <LinkedComponent< P, S >>component, _keys );
Link.state = < P, S >( component : React.Component< P, S >, key : ( keyof S ) ) => linkAt( <LinkedComponent< P, S >>component, key );

function linkAll< P, S >( component : LinkedComponent< P, S >, _keys : ( keyof S )[] ) : LinksCache< S >{
    const { state } = component,
            cache = component.links || ( component.links = <LinksCache< S >>{} ),
            keys = _keys.length ? _keys : <( keyof S )[]>Object.keys( state );

    for( let key of keys ){
        const value = state[ key ],
            cached = cache[ key ];

        if( !cached || cached.value !== value ) {
            cache[ key ] = new StateLink( component, key, value );
        }
    }

    return cache;
}

function linkAt< P, S, K extends keyof S>( component : LinkedComponent< P, S>, key : K ) : Link< S[ K ] >{
    const value = component.state[ key ],
        cache = component.links || ( component.links = <LinksCache< S >>{} ),
        cached = cache[ key ];

    return cached && cached.value === value ? cached : cache[ key ] = new StateLink( component, key, value );
}

export class StateLink< P, S, K extends keyof S > extends Link< S[ K ] > {
    constructor( public component : LinkedComponent< P, S >, public key : K, value : S[ K ] ){
        super( value );
    }

    set( x : S[ K ] ) : void {
        const attrs = <Pick<S, K>> {};
        attrs[ this.key ] = x;
        this.component.setState( attrs );
    }
}