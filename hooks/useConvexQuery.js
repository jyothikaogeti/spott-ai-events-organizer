import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { toast } from "sonner";

export function useConvexQuery(query, ...args) {
  const queryResult = useQuery(query, ...args);

  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (queryResult === undefined) {
      setIsLoading(true);
    } else {
      try {
        setData(queryResult);
        setError(null);
      } catch (error) {
        setError(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [queryResult]);

  return { data, isLoading, error };
}
