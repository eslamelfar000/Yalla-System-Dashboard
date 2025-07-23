"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetData } from "@/hooks/useGetData";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const QualityFilter = ({
  selectedQuality,
  onQualityChange,
  onClearFilter,
  clearButton = true,
}) => {
  const { user } = useAuth();

  // Get teachers data for filter
  const {
    data: qualityData,
    isLoading: qualityLoading,
    error: qualityError,
  } = useGetData({
    endpoint: "dashboard/users?roles[0]=quality&page=1",
    queryKey: ["quality"],
  });

  const quality = qualityData?.data?.data || [];

  // Set default teacher to first teacher in list for quality role
  useEffect(() => {
    if (quality.length > 0 && !selectedQuality) {
      // Use user_id for quality role
    //   onQualityChange(quality[0].id.toString());
    } else if (user && user.role === "quality" && user.id && !selectedQuality) {
      onQualityChange(user.id.toString());
    }
  }, [user, selectedQuality, onQualityChange, quality]);

  const handleClearFilter = () => {
    onClearFilter();
  };

  if (qualityLoading) {
    return <Skeleton className="h-10 w-[200px]" />;
  }

  if (qualityError) {
    return <div className="text-red-500">Error loading quality</div>;
  }

  return (
    <div className="flex items-center justify-between gap-4">
      {selectedQuality && clearButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilter}
          className="h-8"
        >
          <Icon icon="heroicons:x-mark" className="w-4 h-4 mr-1" />
          Clear Filter
        </Button>
      )}
      <div className="flex items-center gap-4">
        <Select
          value={selectedQuality || "Select your quality"}
          onValueChange={onQualityChange}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select your quality" />
          </SelectTrigger>
          <SelectContent defaultValue={"Select your quality"}>
            <SelectItem value="Select your quality" disabled>
              Select your quality
            </SelectItem>
            {quality.map((quality) => (
              <SelectItem
                key={quality.id}
                value={quality.id.toString()}
              >
                {quality.name || quality.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default QualityFilter;
