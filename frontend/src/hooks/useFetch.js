import { useCallback, useEffect, useRef, useState } from "react";

import { apiGet } from "../api/client";

/**
 * Fetches `path` and tracks loading/error state.
 *
 * `params` is serialized into the dependency key, so passing an object literal
 * inline is safe — it will not cause a render loop.
 *
 *   const { data, loading, error } = useFetch("/accounts");
 *
 * Pass a null/undefined `path` to hold off until a dependency is ready; the
 * hook stays in its loading state and issues no request.
 */
export function useFetch(path, params) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const key = params ? JSON.stringify(params) : "";
  const latest = useRef(0);

  const load = useCallback(() => {
    if (!path) return;
    const ticket = ++latest.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    apiGet(path, key ? JSON.parse(key) : undefined)
      .then((data) => {
        // Ignore responses from superseded requests.
        if (ticket === latest.current) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (ticket === latest.current) setState({ data: null, loading: false, error });
      });
  }, [path, key]);

  useEffect(load, [load]);

  return { ...state, refetch: load };
}
