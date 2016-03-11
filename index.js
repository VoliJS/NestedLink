/**
 * Advanced React links for purely functional two-way data binding
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */

/**
 * Link public constructor
 * @param {*} value - link value
 * @param {function(*)=} requestChange - function to set linked value.
 * @constructor
 */
function Link( value, requestChange ){
    this.value = value;
    this.set   = requestChange || doNothing;
}

/**
 * Create link to component's state attribute
 * @param {React.Component} component - It's your `this` in component's `render()`
 * @param {string} attr - state attribute's name
 * @returns {Link}
 */
Link.state = function( component, attr ){
    return new Link( component.state[ attr ], function( x ){
        var nextState     = {};
        nextState[ attr ] = x;
        component.setState( nextState );
    } );
};

module.exports = Link;

function doNothing( x ){ }

var defaultError = 'Invalid value';

Link.prototype = {
    constructor : Link,

    /**
     * Link value. Read-only, cannot be set.
     * @const
     */
    value : void 0,

    /**
     * Set link value
     * @param {*} x - new link value
     */
    set : function( x ){ },

    /**
     * Immediately update the link value using given transform function.
     * @param {function( * ) : *} transform - update function receives cloned link value as an argument; returning
     *     `undefined` prevents update.
     */
    update : function( transform, e ){
        var prevValue = this.value;
        prevValue = helpers( prevValue ).clone( prevValue );

        var nextValue = transform( prevValue, e );
        nextValue === void 0 || this.set( nextValue );
    },

    /**
     * Create UI event handler function which will update the link with a given transform function.
     * @param {function(*, Event=):*} transform - update function receives cloned link value and UI event as an
     *     argument; returning `undefined` prevents update.
     * @returns {function()} - UI event handler
     *
     * Examples:
     *     <button onClick={ link.action( x => !x ) } ... />
     *     <input onChange={ link.action( ( x, e ) => e.target.value ) } ... />
     */
    action : function( transform ){
        var link = this;
        return function( e ){ link.update( transform, e ) };
    },

    /**
     * Similar to `set`. React 0.14 backward compatibility shim.
     * @param {*} x - new link value
     */
    requestChange : function( x ){ this.set( x ); },

    /**
     * Similar to `link.update( x => !x )`. ValueLink 1.0.x compatibility shim.
     * @deprecated
     */
    toggle : function(){ this.set( !this.value ); },

    /**
     * Validation error. Usually is a string with error text, but can hold any type.
     */
    error : void 0,

    /**
     * Similar to `error`. ValueLink 1.0.x compatibility shim.
     * @deprecated
     */
    get validationError(){ return this.error },

    /**
     * Validate link with validness predicate and optional custom error object. Can be chained.
     * @param {function( * ) : boolean} whenValid - Takes link value as an argument, returns true whenever value is
     *     valid.
     * @param {*=} error - optional error object assigned to `link.error`, usually is a string with an error
     *     description.
     * @returns {Link} - pass through link for easy checks chaining.
     */
    check : function( whenValid, error ){
        if( !this.error && !whenValid( this.value ) ){
            this.error = error || defaultError;
        }

        return this;
    },

    /**
     * Create boolean link which is true whenever array has given element. Link value must be an array.
     * @param {*} element - value which should present in array for resulting link to be `true`.
     * @returns {Link} - new boolean link.
     */
    contains : function( element ){
        var parent = this;

        return new Link( this.value.indexOf( element ) >= 0, function( x ){
            var next = Boolean( x );
            if( this.value !== next ){
                var arr = parent.value,
                    nextValue = x ? arr.concat( element ) : arr.filter( function( el ){ return el !== element; });

                parent.set( nextValue );
            }
        } );
    },

    /**
     * Create boolean link which is true whenever link value is equal to the given value.
     * When assigned with `true`, set parent link with `truthyValue`. When assigned with `false`, set it to `null`.
     * @param {*} truthyValue - the value to compare parent link value with.
     * @returns {Link} - new boolean link.
     */
    equals : function( truthyValue ){
        var parent = this;

        return new Link( this.value === truthyValue, function( x ){
            parent.set( x ? truthyValue : null );
        } );
    },

    // link to enclosed object or array member
    /**
     * Create link to array or plain object (hash) member. Whenever member link will be updated,
     * if will set parent link with an updated copy of enclosed array or object,
     * causing 'purely functional update'. Can be chained to link deeply nested structures.
     * @param {string|number} key - index in array or key in object hash.
     * @returns {ChainedLink} - new link to array or object member.
     */
    at : function( key ){
        return new ChainedLink( this, key );
    },

    /**
     * Iterates through the links to enclosed object or array elements.
     * Optionally map them to array of arbitrary values.
     *
     * @param {function( Link, index ) : * } iterator - function called for each member of object or array, optionally
     *     returns mapped value.
     * @returns {Array} - array of values returned by iterator. `undefined` elements are filtered out.
     */
    map : function( iterator ){
        return helpers( this.value ).map( this, iterator );
    }
};

/**
 * Link to array or object element enclosed in parent link.
 * Performs purely functional update of the parent, shallow copying its value on `set`.
 * @param {Link} link - link with enclosed array or object.
 * @param {string|number} key - key or array index
 * @extends {Link}
 * @constructor
 */
function ChainedLink( link, key ){
    this.value  = link.value[ key ];
    this.parent = link;
    this.key    = key;
}

ChainedLink.prototype             = Object.create( Link.prototype );
ChainedLink.prototype.constructor = ChainedLink;

/**
 * Set new element value to parent array or object, performing purely functional update.
 * @param x - new element value
 */
ChainedLink.prototype.set = function( x ){
    if( this.value !== x ){
        var key = this.key;

        this.parent.update( function( parent ){
            parent[ key ] = x;
            return parent;
        } );
    }
};

/**
 * Select appropriate helpers function for particular value type.
 * @param value - value to be operated with.
 * @returns {object} - object with helpers functions.
 */
function helpers( value ){
    switch( value && Object.getPrototypeOf( value ) ){
        case Array.prototype :
            return arrayHelpers;
        case Object.prototype :
            return objectHelpers;
        default:
            return dummyHelpers;
    }
}

/**
 * Do nothing for types other than Array and plain Object.
 *
 * @type {{clone: dummyHelpers.clone, map: dummyHelpers.map}}
 */
var dummyHelpers = {
    clone    : function( value ){ return value; },
    map      : function( link, fun ){ return []; }
};

/**
 * `map` and `clone` for plain JS objects
 * @type {{map: objectHelpers.map, clone: objectHelpers.clone}}
 */
var objectHelpers = {
    /**
     * Map through the link to object
     * @param {Link} link - link with object enclosed.
     * @param {function( Link, string ) : * } iterator - to iterate and map through links
     * @returns {Array} - resulting array of mapped values.
     */
    map : function( link, iterator ){
        var mapped = [],
            hash = link.value;

        for( var key in hash ){
            var element = iterator( link.at( key ), key );
            element === void 0 || ( mapped.push( element ) );
        }

        return mapped;
    },

    /**
     * Shallow clone plain JS object
     * @param {object} object
     * @returns {object}
     */
    clone : function( object ){
        var cloned = {};

        for( var key in object ){
            cloned[ key ] = object[ key ];
        }

        return cloned;
    }
};

/**
 * `map` and `clone` helpers for arrays.
 * @type {{clone: arrayHelpers.clone, map: arrayHelpers.map }}
 */
var arrayHelpers = {
    /**
     * Shallow clone array
     * @param array
     * @returns {array}
     */
    clone : function( array ){
        return array.slice();
    },

    /**
     * Map through the link to array
     * @param {Link} link - link with an array enclosed.
     * @param {function( Link, string ) : * } iterator - to iterate and map through links
     * @returns {Array} - resulting array of mapped values.
     */
    map : function( link, iterator ){
        var mapped = [],
            array = link.value;

        for( var i = 0; i < array.length; i++ ){
            var y = iterator( link.at( i ), i );
            y === void 0 || ( mapped.push( y ) );
        }

        return mapped;
    }
};