Typed links would:

1) Protect data structures from improper assignments
2) Parse JSON??? Serialize to JSON?? Parse JSON on link creation.
3) Performance improvements?

Two approaches: mutable & immutable data structures. Need to analyze both.

Links:

- Should recreate on underlyting data change.
- Should remain the same if data doesn't change.

## Immutable underlyting data.

A) Define schema class???

    const value = useTypedLinked( SchemaClass );

Typed immutable model???

B) Not a class but plain objects?


//TESTS
const User = attributes({
    name : String,
    email : String,
    flags : {
        a : Boolean,
        b : Boolean
    }
})


const user = new User();

user.x = 10;



//TESTS

const Model = {
    some : String,
    other : Date
}

const OtherModel = {
    ...Model,
    someother : String,
    otherOther : type( Date ).value( null ),
    collection : [ Type ],
    col : Collection.of( User ),
    untypedObject : {},
    untypedArray : []
}

function createCtor( schema ){
    return new Function( `
        ${ keys.map( key => `
            this.${ key } = 
        `)}
    `);
}

const $user = linkedSchema( Model );

$user.name.set( 'name' );
$user.set({
    name : 'name'
})


------

Type safe assignments and parsing.



function createCtor( schema ){
    const Constructor = new Function( 'a_attrs', `

        ${ keys.map( key => `
            this.${ key } = 
        `)}
    `);
}


function Constructor( attrs ){
    const { __types } = this;
    this._primitive = '';
    this._date = new __types.date(); //builtins
    this._nested = new (__types.nested)();

    if( attrs ) this.set( attrs );
}

Constructor.prototype = {
    set( attrs ){
        for( let key in attrs ){
            this[ key ] = attrs[ key ];
        }
    },

    set property( x ){
        this._prop = x == null ? null : this.__transform.prop( x, this._prop );
    },

    __transform : {
        primitive : String,

        immutable( x ){
            const C = this.__types.c;
            return x instanceof C ? x : new C( x );
        },

        mutable( x, v ){
            const C = this.__types.mutable;

            if( x instanceof C ){
                return x;
            }
            else if( v ){
                v.set( x );
                return v;
            }
            else{
                this._mutable = new C( x );
            }
        },

        arrayOf( x ){
            const C = this.__types.arrayOf;


        }
    },

    get primitive(){ return this._primitive; },
    set primitive( x ){
        this._primitive = x == null ? null : PrimitiveType( x );
    },

    get class(){ return this._primitive; },
    set class( x ){
        if( x == null ){
            this._class = null;    
        }
        else{
            const C = this.__types.c;
            this._class = 
        }
    },

    get mutable(){ return this._mutable; },
    set mutable( x ){
        if( x == null ){
            this._mutable = null;    
        }
        else{
            const C = this.__types.mutable;

            if( x instanceof C ){
                this._mutable = x;
            }
            else if( this._mutable ){
                this._mutable.__update( x );
            }
            else{
                this._mutable = new C( x );
            }
        }
    },

    get arrayOf(){ return this._mutable; },
    set arrayOf( x ){
        if( x == null ){
            this._mutable = null;    
        }
        else{
            const C = this.__types.mutable;

            if( x instanceof C ){
                this._mutable = x;
            }
            else if( this._mutable ){
                this._mutable.__update( x );
            }
            else{
                this._mutable = new C( x );
            }
        }
    }
}

function createPrimitiveProp( name, Type ){
    return {
        enumerable: true,
        get : new Function(`return this.${_name}`),
        set : new Function( `x`, `this.${_name} = x == null ? null : ${Type.name}( x )`)
    }
}