/**
 * Advanced React value links with validation and link-to-objects capabilities
 * (c) 2016 Vlad Balin & Volicon, MIT License
 */

function Link( value, set ){
    this.value = value;
    this.set   = set || doNothing;
}

// create link to component's state attribute
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
    // Core link API
    // ---------------------------------------------
    value : void 0,
    set   : doNothing,

    // Immediately update the link
    update : function( transform, e ){
        var nextValue = transform( link.value, e );
        nextValue === void 0 || link.set( nextValue );
    },

    // Create action function which will updates the link
    // link.action( x => !x )
    // link.action( ( x, e ) => e.target.value )
    action : function( transform ){
        var link = this;
        return function( e ){ link.update( transform, e ) };
    },

    // React backward compatibility shim
    requestChange : function( x ){ this.set( x ); },

    // DEPRECATED: Backward compatibility shim
    toggle : function(){ this.set( !this.value ); },

    // Validation API
    // --------------------------------------------------
    error : void 0,

    // DEPRECATED: backward compatibility shim
    get validationError(){ return this.error },

    check : function( whenValid, error ){
        if( !this.error && !whenValid( this.value ) ){
            this.error = error || defaultError;
        }

        return this;
    },

    // Link transformations
    // --------------------------------------------------
    // create boolean link to enclosed array element
    contains : function( element ){
        var link = this;

        return new Link( contains( this.value, element ), function( x ){
            var next = Boolean( x );
            if( this.value !== next ){
                var arr = link.value;
                link.set( x ? arr.concat( element ) : without( arr, element ) );
            }
        } );
    },

    // create boolean link for value equality
    equals : function( asTrue ){
        var link = this;

        return new Link( this.value === asTrue, function( x ){
            link.set( x ? asTrue : null );
        } );
    },

    // link to enclosed object or array member
    at : function( key ){
        var link = this;

        return new Link( this.value[ key ], function( x ){
            if( this.value !== x ){
                var objOrArr    = link.value;
                objOrArr        = clone( objOrArr );
                objOrArr[ key ] = x;
                link.set( objOrArr );
            }
        } );
    },

    // iterates through enclosed object or array, generating set of links
    map : function( fun ){
        var arr = this.value;
        return arr ? ( arr instanceof Array ? mapArray( this, arr, fun ) : mapObject( this, arr, fun ) ) : [];
    },

    // dummies for compatibility with nestedtypes object model...
    constructor : Link,
    initialize  : function( value, set, error ){}
};

// Tools
// ============================================

function mapObject( link, object, fun ){
    var res = [];

    for( var i in object ){
        if( object.hasOwnProperty( i ) ){
            var y = fun( link.at( i ), i );
            y === void 0 || ( res.push( y ) );
        }
    }

    return res;
}

function mapArray( link, arr, fun ){
    var res = [];

    for( var i = 0; i < arr.length; i++ ){
        var y = fun( link.at( i ), i );
        y === void 0 || ( res.push( y ) );
    }

    return res;
}

function contains( arr, el ){
    for( var i = 0; i < arr.length; i++ ){
        if( arr[ i ] === el ) return true;
    }

    return false;
}

function without( arr, el ){
    var res = [];

    for( var i = 0; i < arr.length; i++ ){
        var current = arr[ i ];
        current === el || res.push( current );
    }

    return res;
}

function clone( objOrArray ){
    var proto = objOrArray && Object.getPrototypeOf( objOrArray );

    if( proto === Array.prototype ) return objOrArray.slice();
    if( proto === Object.prototype ){
        var x = {};
        for( var i in objOrArray ) x[ i ] = objOrArray[ i ];
        return x;
    }

    return objOrArray;
}