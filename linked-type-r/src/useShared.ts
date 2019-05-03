import { useEffect, useRef } from 'react'
import { useForceUpdate } from './common'

/**
 * Update the when any of the listed obect changes.
 */
export function useShared( ...objs : Transactional[] ){
    const forceUpdate = useForceUpdate(),
        context = useRef( {} );

    for( let obj of objs ){
        useEffect( () => {        
            obj.onChanges( forceUpdate, context.current as any );
        
            return () => {
                obj.offChanges( forceUpdate, context.current as any );
            }
        }, [ obj ] );
    }
}