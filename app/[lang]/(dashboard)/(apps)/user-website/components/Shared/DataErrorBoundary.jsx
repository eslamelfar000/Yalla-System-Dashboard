"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/Shared/loading-button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { useRefetchData } from "../../hooks/useRefetchAllData";

const DataErrorBoundary = ({
  children,
  error,
  isLoading,
  onRetry,
  dataType = "all",
}) => {
  const [retrying, setRetrying] = useState(false);
  const {
    refetchReviewsData,
    refetchBannerSettings,
    refetchContactSettings,
    refetchAllData,
  } = useRefetchData();

  const handleRetry = async () => {
    setRetrying(true);
    try {
      if (onRetry) {
        await onRetry();
      } else {
        // Use specific refetch based on data type
        switch (dataType) {
          case "reviews":
            await refetchReviewsData();
            break;
          case "banner-settings":
            await refetchBannerSettings();
            break;
          case "contact-settings":
            await refetchContactSettings();
            break;
          default:
            await refetchAllData();
        }
      }
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setRetrying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="h-6 w-6" />
          <span className="text-lg font-medium">Data Loading Error</span>
        </div>
        <p className="text-gray-600 text-center max-w-md">
          {error?.message ||
            "Failed to load data. Please check your connection and try again."}
        </p>
        <LoadingButton
          onClick={handleRetry}
          loading={retrying}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </LoadingButton>
      </div>
    );
  }

  return children;
};

export default DataErrorBoundary;
