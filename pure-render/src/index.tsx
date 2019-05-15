import * as React from 'react'

export abstract class PurePropsComponent<P extends object> extends React.Component<P> {
    _vector : any[]
    _nextVector : any[]

    createVector : ( nextProps : P ) => any[]
    compareVectors : ( curr : any[], next : any[] ) => boolean

    shouldComponentUpdate( nextProps : P ){
        const nextVector = this._nextVector = this.createVector( nextProps );
        return this.compareVectors( this._vector, nextVector );
    }

    abstract render() : JSX.Element

    componentDidMount(){
        this._vector = this._nextVector;
    }

    componentDidUpdate(){
        this._vector = this._nextVector;
    }
}

const comparators = new Map<Function, string>();

function getBaseClass( Type : Function ){
    const { prototype } = Type,
        baseProto = prototype && Object.getPrototypeOf( prototype );

    return baseProto && baseProto.constructor;
}


function createVectorFunction( props ){
    const expressions = Object.keys( props ).map( key => {
        let comparator : string;
        
        for( let Type = props[ key ]; Type && !comparator; Type = getBaseClass( Type ) ){
            comparator = comparators.get( props[ key ] );
        }
        
        return comparator ?
            comparator.replace( '${x}', 'props.' + name ) :
            'props.' + name;
    })

    return new Function( 'props',`
        return [ ${ expressions.join(',') } ]
    `) as any;
}

function compareVectorsFunction( props ){
    const expressions = [],
        { length } = Object.keys( props );

    for( let i = 0; i < length; i++ ){
        expressions.push( `prev[${i}] !== next[${i}]` );
    }

    return new Function( 'prev', 'next', `
        return ${ expressions.join(' || ') }
    `) as any;
}

export class Define {
    static addPureRender( Type : Function, comparator : string ){
        comparators.set( Type, comparator );
        return this;
    }

    props( props : { [ name : string ] : Function } ){

    }

    pureProps( props : { [ name : string ] : Function }){
        this.createVector = createVectorFunction( props );
        this.compareVectors = compareVectorsFunction( props );

        return this;
    }

    createVector : ( props : object ) => any[]
    compareVectors : ( curr : any[], next : any[] ) => boolean

    render<P extends object>( C : React.ComponentType<P> ) : React.ComponentType<P> {
        const { propTypes } = this;

        if( this.createVector ){
            class PurePropsWrapper extends PurePropsComponent<P> {
                static propTypes = propTypes;
                render(){
                    return <C {...this.props}></C>
                }
            };
    
            PurePropsWrapper.prototype.createVector = this.createVector;
            PurePropsWrapper.prototype.compareVectors = this.compareVectors;
    
            return PurePropsWrapper;    
        }
        else{
            C.propTypes = propTypes;
            return C;
        }
    }
}

Define.addPureRender( Date, '${x} && ${x}.getTime()');
Define.addPureRender( Link, '${x} && ${x}.value');

class Mutable {
    forceUpdate(){
        this._changeToken = {}
        this._onChange && this._onChange( this );
    }
}

// TODO: Wrap ${x} && (...) in a base class. Use `this.` instead of 
Define.addPureRender( Mutable, '${x} && ${x}._changeToken');