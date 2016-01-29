/**
 * Advanced React-compatible value links
 */

function Link( value, set, error ){
    this.value           = value;
    this.requestChange   = set || doNothing;
    this.validationError = error;
}

// create link to component's state attribute
Link.state = function( component, attr ){
    return new Link( component.state[ attr ], function( x ){
        var nextState = {};
        nextState[ attr ] = x;
        component.setState( nextState );
    });
};

module.exports = Link;

function doNothing( x ){ }

var defaultError = 'Invalid value';

Link.prototype = {
    value           : null,
    validationError : null,
    requestChange   : doNothing,

    set             : function( x ){ this.requestChange( x ); },
    toggle          : function(){ this.requestChange( !this.value ); },

    // create function which updates the link
    update : function( transform ){
        var link = this;
        return function(){
            link.requestChange( transform( link.value ) )
        }
    },

    check : function( whenValid, error ){
        if( !this.validationError && !whenValid( this.value ) ){
            this.validationError = error || defaultError;
        }

        return this;
    },

    // create boolean link to enclosed array element
    contains : function( element ){
        var link = this;

        return new Link( contains( this.value, element ), function( x ){
            var next = Boolean( x );
            if( this.value !== next ){
                var arr = link.value;
                link.requestChange( x ? arr.concat( element ) : without( arr, element ) );
            }
        } );
    },

    // create boolean link for value equality
    equals : function( asTrue ){
        var link = this;

        return new Link( this.value === asTrue, function( x ){
            link.requestChange( x ? asTrue : null );
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
                link.requestChange( objOrArr );
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
    initialize : function( value, set, error ){},
    get _changeToken(){
        return this.value;
    }
};

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
    return objOrArray instanceof Array ? objOrArray.slice() : Object.assign( {}, objOrArray );
}