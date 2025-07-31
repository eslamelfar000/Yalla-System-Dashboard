import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../config/axios.config";

export const useGetData = ({ endpoint, queryKey, enabledKey = true }) => {
  const axiosInstance = useAxios();

  // Use enabledKey as queryKey if queryKey is not provided
  const finalQueryKey = queryKey || enabledKey;

  const query = useQuery({
    queryKey: finalQueryKey,
    enabled: !!enabledKey,
    queryFn: async () => {
      const response = await axiosInstance.get(endpoint);
      return response.data;
    },
  });

  return { ...query };
};
