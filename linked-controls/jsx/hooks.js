import { useRef, useEffect } from 'react';
// Delays function calls for a given timeout.
export function useThrottle(fun, timeout, changes = []) {
    const timer = useRef(null);
    function cancel() {
        if (timer.current)
            clearTimeout(timer.current);
    }
    useEffect(() => cancel, changes);
    return function (...args) {
        cancel();
        timer.current = setTimeout(() => {
            timer.current = null;
            fun.apply(this, args);
        }, timeout);
    };
}
//# sourceMappingURL=hooks.js.map