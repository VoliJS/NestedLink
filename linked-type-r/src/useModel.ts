import { useRef, useEffect } from 'react'
import { useForceUpdate, useStore } from './common'

export function useModel<T extends ( typeof Model | typeof Collection )>( Class : T ) : InstanceType<T> {
    const state = useRef( null ),
          forceUpdate = useForceUpdate();

    // Make sure the state exists...
    let owner = state.current;
    if( !owner ){
        owner = state.current = new ModelOwner( Class, forceUpdate );
    }

    // Supress updates on the state changes until rendering will be finished.
    owner.silent = true;
    useEffect(() => {
        owner.silent = false;
    });

    // Set the store.
    const store = useStore();
    if( owner.store !== store ){
        owner.store = store;
    }

    // Dispose state un unmount.
    useEffect( () => () => owner.dispose(), []);

    return owner.model;
}

export function useCollection( ModelClass : typeof Model ){
    return useModel( ModelClass.Collection );
}

class ModelOwner {
    model : Model
    store : Store = null;

    silent = true;
    
    constructor( ModelClass : typeof Transactional, public forceUpdate ){
        const model = this.model = new ( ModelClass as any )();
        model._owner = this;
        model._key = 'state';
    }

    getStore(){
        return  this.store || ( this.model as any )._defaultStore || Store.global;
    }

    get( key : string ){
        // Ask upper store.
        const store = this.getStore();
        return store && store.get( key );
    }

    _onChildrenChange(){
        this.silent || this.forceUpdate();
    }

    dispose(){
        const { model } = this as any;
        model._key = model._owner = null;
        model.dispose();
        this.model = void 0;
    }
}