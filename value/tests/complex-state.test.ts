import { Linked } from '../src'

describe( 'Complex linked state', () =>{
    describe( 'with nested objects', () => {
        it( 'updates properly', () =>{
            const [ root, $root ] = linkedObject({ items : { a : 1, b : 2 }} );

            $root.at( 'items' ).at( 'a' ).update( () => 2 );
            $root.at( 'items' ).at( 'b' ).update( () => 3 );

            expect( root.items.a ).toBe( 2 );
            expect( root.items.b ).toBe( 3 );
        } )

        it( 'set props properly', () =>{
            const [ root, $root ] = linkedObject({ items : { a : 1, b : 2 }} );

            $root.at( 'items' ).at( 'a' ).set( 2 );
            $root.at( 'items' ).at( 'b' ).set( 3 );

            expect( root.items.a ).toBe( 2 );
            expect( root.items.b ).toBe( 3 );
        } )


        it( 'handles onChange properly', () =>{
            const [ root, $root ] = linkedObject({ items : { a : { c : 1 }, b : 2 }} );

            $root.at( 'items' ).at( 'a' )
                .onChange( x => $root.at( 'items' ).at( 'b' ).set( 3 ) )
                .at( 'c' )
                .set( 2 );

            expect( root.items.a.c ).toBe( 2 );
            expect( root.items.b ).toBe( 3 );
        } )
    })
});

// Create mutable object state updated in place.
function linkedObject<T>( x : T ) : [ T, Linked<T> ]{
    let root = { ...x };
    const $root = Linked.value( root, x => Object.assign( root, x ) );

    return [ root, $root ];
}