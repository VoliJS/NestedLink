!!!!

Generate lazy link accessors?
Yes, with dedicated class decorator. @linked
Or, make it configurable. 

import { LinkAttributes } 'type-r-link'
import { Model } from 'type-r'
LinkAttributes( Model );

get $name(){
    return this.$at( '$name' );
}

+ Cool in JS
- Doesn't work in TS

// New API.

user.$at('name') // user.linkAt( 'name' )

// For the Component:
user.state$()    // user.linkAll()

// For the model:
user.pick$()    // user.linkAll()

