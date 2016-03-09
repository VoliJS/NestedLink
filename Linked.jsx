var React = require( 'react' );

exports.Input = ( { invalid = 'invalid', className = '', valueLink, checkedLink, ...props } ) =>{
    const type = props.type,
          link = valueLink || checkedLink;

    switch( type ){
        case 'checkbox':
            return <input {...props}
                className={ className }
                checked={ link.value }
                onChange={ e => link.set( Boolean( e.target.checked ) ) }/>;

        case 'radio' :
            return <input {...props}
                className={ className }
                checked={ link.value === props.value }
                onChange={ e => e.target.checked && link.set( props.value ) }/>;

        default:
            return <input {...props}
                className={ valueLink.error ? invalid + ' ' + className : className }
                value={ valueLink.value }
                onChange={ e => valueLink.set( e.target.value ) }/>;
    }
};

exports.TextArea = ( { invalid = 'invalid', className = '', valueLink, ...props } ) => (
    <textarea {...props}
        className={ valueLink.error ? invalid + ' ' + className : className }
        value={ valueLink.value }
        onChange={ e => valueLink.set( e.target.value ) }/>
);

exports.Select = ( { valueLink, children, ...props } ) => (
    <select {...props}
            value={ valueLink.value }
            onChange={ e => valueLink.set( e.target.value ) }>
        { children }
    </select>
);

exports.Radio = ({ className = 'radio', checkedLink }) => (
    <div className={ className + ( checkedLink.value ? ' selected' : '' ) }
         onClick = { checkedLink.action( () => true ) }
    />
);

exports.Checkbox = ({ className = 'checkbox', checkedLink }) => (
    <div className={ className + ( checkedLink.value ? ' selected' : '' ) }
         onClick = { checkedLink.action( x => !x ) }
    />
);