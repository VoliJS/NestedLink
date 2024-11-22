import { Immutable, PurePtr } from '../src'

describe( 'Complex linked state', () =>{
    describe( 'with nested objects', () => {
        it( 'updates properly', () =>{
            const root = { items : { a : 1, b : 2 }};
            const $root = PurePtr.mutable( root );

            $root.at( 'items' ).at( 'a' ).update( () => 2 );
            $root.at( 'items' ).at( 'b' ).update( () => 3 );

            expect( root.items.a ).toBe( 2 );
            expect( root.items.b ).toBe( 3 );
        } )

        it( 'set props properly', () =>{
            const root = { items : { a : 1, b : 2 }};
            const $root = PurePtr.mutable( root );

            $root.at( 'items' ).at( 'a' ).set( 2 );
            $root.at( 'items' ).at( 'b' ).set( 3 );

            expect( root.items.a ).toBe( 2 );
            expect( root.items.b ).toBe( 3 );
        } )


        it( 'handles onChange properly', () =>{
            const root = { items : { a : { c : 1 }, b : 2 }};
            const $root = PurePtr.mutable( root );

            $root.at( 'items' ).at( 'a' )
                .onChange( x => $root.at( 'items' ).at( 'b' ).set( 3 ) )
                .at( 'c' )
                .set( 2 );

            expect( root.items.a.c ).toBe( 2 );
            expect( root.items.b ).toBe( 3 );
        } )
    })

    describe( 'with immutable classes', () => {
        class Items extends Immutable<{
            a : number,
            b : number
        }>(){
            get s(){
                return this.a + this.b;
            }          
        }

        class TestRoot extends Immutable<{
            items : Items
        }>(){
            get s(){
                return this.items.a + this.items.b;
            }
        }

        it( 'updates properly', () =>{
            const root = new TestRoot({ items : new Items({ a : 1, b : 2 })});
            const $root = PurePtr.mutable( root );

            $root.at( 'items' ).at( 'a' ).update( () => 2 );
            $root.at( 'items' ).at( 'b' ).update( () => 3 );

            expect( root.items.a ).toBe( 2 );
            expect( root.items.b ).toBe( 3 );
            expect( root.s ).toBe( root.items.s );
            expect( root.s ).toBe( 5 );
        } )
    })
});