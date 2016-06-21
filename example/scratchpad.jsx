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

export const Radio = ( { className = 'radio', valueLink, value, children } ) => (
    <div className={ className + ( valueLink.value === value ? ' selected' : '' ) }
         onClick={ () => valueLink.set( value ) }
    >
        { children }
    </div>
);

const CustomRadioGroup = ({ selectedLink }) => (
    <fieldset>
        <legend>Custom Radio group bound to value</legend>
        <label>
            A: <Radio valueLink={ selectedLink } value={ 'a' } />
        </label>
        <label>
            B: <Radio valueLink={ selectedLink } value={ 'b' } />
        </label>
    </fieldset>
);