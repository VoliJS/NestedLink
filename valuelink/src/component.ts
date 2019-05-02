import * as React from 'react'
import { Link } from './link'

export type LinksCache< S, X extends keyof S> = {
    [ K in X ] : Link< S[ K ] >
}

export interface DataBindingSource< S >{
    linkAt< K extends keyof S>( key : K ) : Link< S[ K ] >
    linkAll<K extends keyof S>( ...keys : K[] ) : LinksCache< S, K >
    $at< K extends keyof S>( key : K ) : Link< S[ K ] >
    state$<K extends keyof S>( ...keys : K[] ) : LinksCache< S, K >
}

export abstract class LinkedComponent< P, S > extends React.Component< P, S > implements DataBindingSource< S > {
    links : LinksCache< S, keyof S > = null;

    // @deprecated use `this.$at( key )`
    linkAt<K extends keyof S>( key : K ) : Link<S[K]>{
        return this.$at( key );
    }

    // Get the link to the state member with the given key.
    $at<K extends keyof S>( key : K ) : Link<S[K]>{
        const value = this.state[ key ],
        cache = this.links || ( this.links = {} as any ),
        cached = cache[ key ];

        return cached && cached.value === value ?
                    cached :
                    cache[ key ] = new StateLink( this, key, value );
    }

    // @deprecated use `this.state$()`
    linkAll<K extends keyof S>( ...keys : K[] ) : LinksCache< S, K >
    linkAll(){
        return this.state$.apply( this, arguments );
    }

    /**
     * Get the object with links to the elements of the component's state.
     * const state$ = this.state$();
     * 
     * Get the links to the given list of state elements.
     * const state$ = this.state$( 'a', 'b', 'c' );
     */ 
    state$<K extends keyof S>( ...keys : K[] ) : LinksCache< S, K >;
    state$( ...args : ( keyof S )[] ){
        const { state } = this,
            cache = this.links || ( this.links = <any>{} ),
            keys = args.length ? args : <( keyof S )[]>Object.keys( state );

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
    constructor( public component : LinkedComponent< P, S >, public key : K, value : S[ K ] ){
        super( value );
    }

    set( x : S[ K ] ) : void {
        const attrs = <Pick<S, K>> {};
        attrs[ this.key ] = x;
        this.component.setState( attrs );
    }
}