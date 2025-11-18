import { useCallback, useEffect, useState } from 'react';
import { listCaptures, searchCaptures } from '../api/client';

export default function useCaptures() {
  const [captures, setCaptures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listCaptures();
      setCaptures(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const runSearch = useCallback(async (query, tag) => {
    try {
      setLoading(true);
      const result = await searchCaptures({ query, tag });
      setCaptures(result.items ?? []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    captures,
    loading,
    error,
    refresh,
    runSearch,
  };
}
