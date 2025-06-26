import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

// Hook to refetch specific data in the user website section
export const useRefetchData = () => {
  const queryClient = useQueryClient();

  // Refetch only reviews data
  const refetchReviewsData = useCallback(async () => {
    try {
      await queryClient.refetchQueries(["reviews"]);
      await queryClient.refetchQueries(["review"]);
      console.log("Reviews data refetched successfully");
    } catch (error) {
      console.error("Error refetching reviews data:", error);
    }
  }, [queryClient]);

  // Refetch only banner settings data
  const refetchBannerSettings = useCallback(async () => {
    try {
      await queryClient.refetchQueries(["banner-settings"]);
      console.log("Banner settings refetched successfully");
    } catch (error) {
      console.error("Error refetching banner settings:", error);
    }
  }, [queryClient]);

  // Refetch only contact settings data
  const refetchContactSettings = useCallback(async () => {
    try {
      await queryClient.refetchQueries(["contact-settings"]);
      console.log("Contact settings refetched successfully");
    } catch (error) {
      console.error("Error refetching contact settings:", error);
    }
  }, [queryClient]);

  // Refetch all data (for the refresh button)
  const refetchAllData = useCallback(async () => {
    try {
      await queryClient.refetchQueries(["reviews"]);
      await queryClient.refetchQueries(["review"]);
      await queryClient.refetchQueries(["banner-settings"]);
      await queryClient.refetchQueries(["contact-settings"]);
      console.log("All data refetched successfully");
    } catch (error) {
      console.error("Error refetching all data:", error);
    }
  }, [queryClient]);

  const invalidateAllData = useCallback(() => {
    // Invalidate all queries to force refetch on next access
    queryClient.invalidateQueries(["reviews"]);
    queryClient.invalidateQueries(["review"]);
    queryClient.invalidateQueries(["banner-settings"]);
    queryClient.invalidateQueries(["contact-settings"]);
  }, [queryClient]);

  const clearAllData = useCallback(() => {
    // Remove all queries from cache
    queryClient.removeQueries(["reviews"]);
    queryClient.removeQueries(["review"]);
    queryClient.removeQueries(["banner-settings"]);
    queryClient.removeQueries(["contact-settings"]);
  }, [queryClient]);

  return {
    refetchReviewsData,
    refetchBannerSettings,
    refetchContactSettings,
    refetchAllData,
    invalidateAllData,
    clearAllData,
  };
}; 