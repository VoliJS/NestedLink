import { useState } from 'react';
import { CustomLink } from './link';
export function useLink(initialState) {
    var _a = useState(initialState), value = _a[0], set = _a[1];
    return new CustomLink(value, set);
}
//# sourceMappingURL=hooks.js.map