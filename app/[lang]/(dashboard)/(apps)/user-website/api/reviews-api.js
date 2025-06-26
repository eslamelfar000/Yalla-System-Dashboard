import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetData } from "@/hooks/useGetData";
import { useAxios } from "@/config/axios.config";
import toast from "react-hot-toast";

// Reviews API Service using custom hooks
export const useReviewsAPI = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  // Get all reviews
  const getAllReviews = useGetData({
    endpoint: "dashboard/reviews",
    queryKey: ["reviews"],
  });

  // Get single review
  const getReview = (id) => useGetData({
    endpoint: `dashboard/reviews/${id}`,
    queryKey: ["review", id],
    enabledKey: !!id,
  });

  // Helper function to refetch only reviews data
  const refetchReviewsData = () => {
    // Invalidate and refetch only reviews-related queries
    queryClient.invalidateQueries(["reviews"]);
    queryClient.invalidateQueries(["review"]);
    queryClient.refetchQueries(["reviews"]);
  };

  // Create review
  const createReview = useMutation({
    mutationFn: async (formData) => {
      // Debug: Log FormData contents before sending
      console.log("API - FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await axiosInstance.post("dashboard/reviews", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("API - Review created successfully:", data);
      // Refetch only reviews data
      refetchReviewsData();
      
      // Optimistically update the cache
      queryClient.setQueryData(["reviews"], (oldData) => {
        if (oldData?.data) {
          return {
            ...oldData,
            data: [...oldData.data, data.data],
          };
        }
        return oldData;
      });
      
      toast.success("Review added successfully");
    },
    onError: (error) => {
      console.error("API - Create review error:", error);
      console.error("API - Error response:", error?.response?.data);
      const errorMessage = error?.response?.data?.msg || "Failed to add review";
      toast.error(errorMessage);
      
      // Refetch only reviews data to ensure consistency
      refetchReviewsData();
    },
  });

  // Update review
  const updateReview = useMutation({
    mutationFn: async ({ id, formData }) => {
      const response = await axiosInstance.post(`dashboard/reviews/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Refetch only reviews data
      refetchReviewsData();
      
      // Optimistically update the cache
      queryClient.setQueryData(["reviews"], (oldData) => {
        if (oldData?.data) {
          return {
            ...oldData,
            data: oldData.data.map(review => 
              review.id === variables.id ? { ...review, ...data.data } : review
            ),
          };
        }
        return oldData;
      });
      
      // Update individual review cache
      queryClient.setQueryData(["review", variables.id], data);
      
      toast.success("Review updated successfully");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.msg || "Failed to update review";
      toast.error(errorMessage);
      
      // Refetch only reviews data to ensure consistency
      refetchReviewsData();
    },
  });

  // Delete review
  const deleteReview = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`dashboard/reviews/${id}`);
      return response.data;
    },
    onSuccess: (data, deletedId) => {
      // Refetch only reviews data
      refetchReviewsData();
      
      // Optimistically update the cache
      queryClient.setQueryData(["reviews"], (oldData) => {
        if (oldData?.data) {
          return {
            ...oldData,
            data: oldData.data.filter(review => review.id !== deletedId),
          };
        }
        return oldData;
      });
      
      // Remove individual review from cache
      queryClient.removeQueries(["review", deletedId]);
      
      toast.success("Review deleted successfully");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.msg || "Failed to delete review";
      toast.error(errorMessage);
      
      // Refetch only reviews data to ensure consistency
      refetchReviewsData();
    },
  });

  return {
    getAllReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    refetchReviewsData, // Export for manual refetch if needed
  };
}; 