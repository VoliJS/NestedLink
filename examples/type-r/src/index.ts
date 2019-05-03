


class MyComponent extends Component {
    initialize(){
        this.afterRender( () => {

        });

        this.dispose(()=>{

        });

        return () => {

        }
    }

    effects( props, prev ){
        /**
         * useEffect( () => {
         *    doAfterRender();
         * 
         *    return () =>{
         *       doCleanUp();
         *    }
         * }, [ props.a, props.b ])
         */

        this.ifChanged( [ a, b ], ()=>{
            this.afterRender(()=>{

            });

            return 
        });

        

         /* 
         * Lower level:
         * 
         * if( this.useChange( value1, value2 ) ){
         *    cleanUp();
         * 
         *    this.afterRender(() => {
         * 
         *    })
         * }
         * 
         * });
         */
        if( this.hasChanged( 'a', 'b' ) ){
            doCleanup();

            this.afterRender( () =>{
                doAfterRender();
            });
        }
        
        // has.events...
        if( isChanged( props.collection, prev.collection ) ){
            this.stopListening( prev.collection );

            this.listenTo( props.collection, {

            });
        }

        // sync state
        if( this.hasChanged( 'collection', 'a' ) ){
            this.setState({
                collection : props.collection,
                a : props.a
            });
        }

        this.whenChanged( [ collection, 'a' ], () => {
            this.setState({
                collection : props.collection,
                a : props.a
            });

            return () => {

            }
        } );

        this.afterRender( () => {

        });
    }

    componentWillUnmount(){
        // Clean up effects...
        this.setState = () => void;
        this.effects( {}, this.props );

        for( let cb of this._onUnmount ){
            cb.call( this );
        }

        this._onUnmount = void 0;
    }

    componentDidUpdate(){
        for( let cb of this._afterRender ){
            cb.call( this );
        }

        this._afterRender = [];
    }

    componentDidMount(){
        this.componentDidUpdate();
    }

    afterRender( f ){
        this._afterRender.push( f );
    }

    dispose( f ){
        this._onUnmount.unshift( f );
    }

    constructor( props ){
        super( props );
        this.initialize( props );
        this.state || ( this.state = {} );
        this.state._component = this;
        this._previousProps = {};
        this._stateUpdate = null;
    }

    initialize( props : object ){}

    static getDerivedStateFromProps( next, state ){
        const { _component } = state;

        const { setState, props } = _component;
        _component.setState = _component.setStateInEffects;
        _component.props = next;
        
        _component.effects( next, _component._previousProps );

        _component.setState = setState;
        _component.props = props;

        // Remember previous props for the next call...
        _component._previousProps = next;

        // Extract state update...
        const { _stateUpdate } = _component;
        _component._stateUpdate = null;
        return _stateUpdate;
    }

    static getDerivedStateFromProps2( next, state ){
        const { _component } = state;

        const { setState } = _component;
        _component.setState = _component.setStateInEffects;
        
        _component.effects( next, _component._previousProps );

        _component.setState = setState;

        // Extract state update...
        const { _stateUpdate } = _component;
        _component._stateUpdate = null;
        return _stateUpdate;
    }

    hasChanged( ...names : string[] ){
        const { props, _previousProps } = this;

        for( let name of names ){
            if( isChanged( props[ name ], _previousProps[ name ]) ) return true;
        }

        return false;
    }

    previous( name ){
        return this._previousProps[ name ];
    }

    setStateInEffects( attrs ){
        if( this._stateUpdate ){
            assign( this._stateUpdate, attrs );
        }
        else{
            this._stateUpdate = attrs;
        }
    }

    afterRender()

    render(){

    }
}

function isChanged( a, b ){
    if( a === b ) return true;

    if( a && b ) {
        if( a instanceof Link ) return this.isChanged( a.value, b.value );
        if( a instanceof Date ) return a.getTime() === b.getTime();
    }

    return false;
}