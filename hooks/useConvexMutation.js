import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

export function useConvexMutation(mutation) {
  const mutationFn = useMutation(mutation);

  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function mutate(...args) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mutationFn(...args);
      setData(response);
      return response;
    } catch (error) {
      setError(error);
      toast.error(error?.message || "Something Went Wrong");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return { data, isLoading, error, mutate };
}
