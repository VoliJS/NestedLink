import { useState } from 'react'
import { CustomLink } from './link'

export function useLink<S>( initialState : S | (() => S) ){
    const [ value, set ] = useState( initialState );
    return new CustomLink( value, set );
}