import { Immutable, PurePtr } from '../src'

describe( 'Complex linked state', () =>{
    describe( 'with nested objects', () => {
        it( 'updates properly', () =>{
            const rootPtr = PurePtr.mutable( { items : { a : 1, b : 2 }} );

            rootPtr.at( 'items' ).at( 'a' ).update( () => 2 );
            rootPtr.at( 'items' ).at( 'b' ).update( () => 3 );

            expect( rootPtr.value.items.a ).toBe( 2 );
            expect( rootPtr.value.items.b ).toBe( 3 );
        } )

        it( 'set props properly', () =>{
            const rootPtr = PurePtr.mutable( { items : { a : 1, b : 2 }} );

            rootPtr.at( 'items' ).at( 'a' ).set( 2 );
            rootPtr.at( 'items' ).at( 'b' ).set( 3 );

            expect( rootPtr.value.items.a ).toBe( 2 );
            expect( rootPtr.value.items.b ).toBe( 3 );
        } )


        it( 'handles onChange properly', () =>{
            const rootPtr = PurePtr.mutable( { items : { a : { c : 1 }, b : 2 }} );

            rootPtr.at( 'items' ).at( 'a' )
                .onChange( x => rootPtr.at( 'items' ).at( 'b' ).set( 3 ) )
                .at( 'c' )
                .set( 2 );

            expect( rootPtr.value.items.a.c ).toBe( 2 );
            expect( rootPtr.value.items.b ).toBe( 3 );
        } )
    })

    describe( 'with immutable classes', () => {
        class Items extends Immutable {
            a = 0
            b = 0
            c = 0
            
            get s(){
                return this.a + this.b;
            }          

            initialize(): void {
                this.c = this.a + this.b;
            }
        }

        class TestRoot extends Immutable {
            items = new Items()

            get s(){
                return this.items.a + this.items.b;
            }
        }

        it( 'updates properly', () =>{
            const rootPtr = PurePtr.mutable(
                TestRoot.from({ 
                    items : Items.from({
                        a : 1, 
                        b : 2 
                    })
                })
            );

            rootPtr.at( 'items' ).at( 'a' ).update( () => 2 );
            rootPtr.at( 'items' ).at( 'b' ).update( () => 3 );

            console.log( rootPtr.value );

            expect( rootPtr.value.items.a ).toBe( 2 );
            expect( rootPtr.value.items.b ).toBe( 3 );
            expect( rootPtr.value.items.c ).toBe( 5 );
            expect( rootPtr.value.s ).toBe( rootPtr.value.items.s );
            expect( rootPtr.value.s ).toBe( 5 );
        } )
    })
});