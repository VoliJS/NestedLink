


class MyComponent extends Component {

    willMount(){

        this.whenUnmount(()=>{

        });
    }

    willRender(){
        if( this.hasChanged( 'prop' ) ){
            this.previous( 'prop' )
        }

        this.afterRender(()=>{

        });
    }

    render(){

    }
}