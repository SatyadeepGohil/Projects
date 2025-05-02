import { useRef } from "react";
import isEqual from "lodash.isequal";

export function useDeepMemo(factory, deps) {
    const prevDepsRef = useRef();
    const memoRef = useRef();

    if (!isEqual(prevDepsRef.current, deps)) {
        prevDepsRef.current = deps;
        memoRef.current = factory();
    }

    return memoRef.current;
}