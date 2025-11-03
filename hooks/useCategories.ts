import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../app/api/categories";
import { useUserStore } from "../store/useUserStore";

export const useCategories = () => {
  const user = useUserStore((state) => state.user);
  return useQuery({
    queryKey: ["categories", user?.email],
    queryFn: getCategories,
    refetchOnMount: false, // Don’t re-fetch unless stale
    retry: 1,
    enabled: !!user,
  });
};
