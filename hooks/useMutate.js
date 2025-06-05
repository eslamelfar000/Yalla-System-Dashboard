import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useAxios } from "../config/axios.config";
import toast from "react-hot-toast";

export const useMutate = ({
  method,
  endpoint,
  queryKeysToInvalidate = [],
  text,
  onSuccess: userOnSuccess,
  onError: userOnError,
}) => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body) => {
      // Determine if the body is FormData
      const isFormData = body instanceof FormData;
      
      const config = {
        method,
        url: endpoint,
        data: body,
      };

      // Set appropriate headers for FormData
      if (isFormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data',
        };
      }

      const response = await axiosInstance(config);
      return response.data;
    },
    onSuccess: (data) => {
      queryKeysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries(key);
      });

      if (text) {
        toast.success(text);
      }

      if (userOnSuccess) userOnSuccess(data);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.msg || "Something went wrong";
      toast.error(errorMessage);
      
      if (userOnError) userOnError(error);
    },
  });

  return mutation;
};

