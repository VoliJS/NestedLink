import * as React from 'react'
import Link from './link'

export type LinksCache< S > = {
    [ K in keyof S ] : Link< S[ K ] >
}

export interface DataBindingSource< S >{
    linkAt< K extends keyof S>( key : K ) : Link< S[ K ] >
    linkAll( ...keys : ( keyof S )[] ) : LinksCache< S >
}

export abstract class Component< P, S > implements DataBindingSource< S > extends React.Component< P, S > {
    links : LinksCache< S > = null;
    state : S

    linkAt< K extends keyof S>( key : K ) : Link< S[ K ] >{
        const value = this.state[ key ],
            cache = this.links || ( this.links = <LinksCache< S >>{} ),
            cached = cache[ key ];

        return cached && cached.value === value ? cached : cache[ key ] = new StateLink( this, key, value );
    }

    linkAll( ...args : ( keyof S )[] ) : LinksCache< S >{
        const { state } = this,
                cache = this.links || ( this.links = <LinksCache< S >>{} ),
                keys = args.length ? args : <keyof S>Object.keys( state );

        for( let key of keys ){
            const value = state[ key ],
                cached = cache[ key ];

            if( !cached || cached.value !== value ) {
                cache[ key ] = new StateLink( this, key, value );
            }
        }

        return cache;
    }
}

export class StateLink< P, S, K extends keyof S > extends Link< S[ K ] > {
    constructor( public component : Component< P, S >, public key : K, value : S[ K ] ){
        super( value );
    }

    set( x : S[ K ] ) : void {
        const attrs = <Pick<S, K>> {};
        attrs[ this.key ] = x;
        this.component.setState( attrs );
    }
}