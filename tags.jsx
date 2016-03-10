const React = require( 'react' );

const setValue = ( x, e ) => e.target.value;
const setBoolValue = ( x, e ) => Boolean( e.target.checked );

exports.Input = ( { invalid = 'invalid', className = '', valueLink, checkedLink, ...props } ) =>{
    const type = props.type,
          link = valueLink || checkedLink;

    switch( type ){
        case 'checkbox':
            return <input {...props}
                className={ className }
                checked={ link.value }
                onChange={ link.action( setBoolValue ) }/>;

        case 'radio' :
            return <input {...props}
                className={ className }
                checked={ link.value === props.value }
                onChange={ e => { e.target.checked && link.set( props.value ) } }/>;

        default:
            return <input {...props}
                className={ valueLink.error ? invalid + ' ' + className : className }
                value={ valueLink.value }
                onChange={ valueLink.action( setValue ) }/>;
    }
};

exports.TextArea = ( { invalid = 'invalid', className = '', valueLink, ...props } ) => (
    <textarea {...props}
        className={ valueLink.error ? invalid + ' ' + className : className }
        value={ valueLink.value }
        onChange={ valueLink.action( setValue ) }/>
);

exports.Select = ( { valueLink, children, ...props } ) => (
    <select {...props}
            value={ valueLink.value }
            onChange={ valueLink.action( setValue ) }>
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