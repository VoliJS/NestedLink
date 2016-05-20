function

render(){
    const linked = Link.all( this, 'name', 'email', 'isActive' );

    return (
        <form>
            <label>
                Name: <Input type="text" valueLink={ linked.name }/>
            </label>

            <label>
                Email: <Input type="text" valueLink={ linked.email }/>
            </label>

            <label>
                Is active: <Input type="checkbox" checkedLink={ linked.isActive }/>
            </label>
        </form>
    );
}
