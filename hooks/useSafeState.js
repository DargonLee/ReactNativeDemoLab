import {useRef, useCallback, useEffect, useState} from "react";

export function useSafeState(init) {
	const [state, setState] = useState(init);
	const d = useIsDestroyed();

	const setter = useCallback(
		v => {
			if (!d.current) {
				setState(v);
			}
		},
		[d],
	);

	return [state, setter];
}
export function useIsDestroyed() {
	const ref = useRef(false);
	useEffect(() => () => (ref.current = true), []);
	return ref;
}
