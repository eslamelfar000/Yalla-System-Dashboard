// components/SwiperDashboard.jsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/Shared/loading-button";
import SliderFormModal from "./SliderFormModal";
import SwiperItemCard from "./SwiperItemCard";
import ConfirmationDialog from "../Shared/ConfirmationDialog";
import DataErrorBoundary from "../Shared/DataErrorBoundary";
import { useReviewsAPI } from "../../api/reviews-api";
import { Trash2 } from "lucide-react";

function SwiperDashboard() {
  const [editing, setEditing] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    reviewId: null,
    reviewTitle: "",
  });

  const {
    getAllReviews,
    createReview,
    updateReview,
    deleteReview,
    refetchReviewsData,
  } = useReviewsAPI();

  // Get reviews data using the hook
  const { data: reviewsData, isLoading, error, refetch } = getAllReviews;
  const reviews = reviewsData?.data || [];

  const addOrUpdateReview = async (reviewData) => {
    const formData = new FormData();
    formData.append("title", reviewData.title);
    formData.append("description", reviewData.description);

    // Debug logging
    console.log("Review data received:", reviewData);
    console.log("Image file:", reviewData.imageFile);

    if (reviewData.imageFile) {
      formData.append("image", reviewData.imageFile);
      console.log("Image appended to FormData");
    } else {
      console.log("No image file found");
    }

    // Debug: Log FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    if (reviewData.id) {
      // Update existing review
      await updateReview.mutateAsync({ id: reviewData.id, formData });
    } else {
      // Create new review
      await createReview.mutateAsync(formData);
    }

    setOpenModal(false);
  };

  const handleDeleteClick = (review) => {
    setDeleteConfirm({
      open: true,
      reviewId: review.id,
      reviewTitle: review.title,
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.reviewId) {
      await deleteReview.mutateAsync(deleteConfirm.reviewId);
      setDeleteConfirm({ open: false, reviewId: null, reviewTitle: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, reviewId: null, reviewTitle: "" });
  };

  const handleRetry = async () => {
    await refetch();
  };

  return (
    <DataErrorBoundary
      error={error}
      isLoading={isLoading}
      onRetry={handleRetry}
      dataType="reviews"
    >
      <div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Testimonials Slider</h1>
            <div className="space-x-2">
              <Button
                onClick={() => {
                  setEditing(null);
                  setOpenModal(true);
                }}
              >
                Add New Review
              </Button>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews found. Add your first review to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {reviews.map((review) => (
                <SwiperItemCard
                  key={review.id}
                  slider={review}
                  onEdit={() => {
                    setEditing(review);
                    setOpenModal(true);
                  }}
                  onDelete={() => handleDeleteClick(review)}
                  deleteLoading={
                    deleteReview.isPending &&
                    deleteConfirm.reviewId === review.id
                  }
                />
              ))}
            </div>
          )}

          <SliderFormModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSave={addOrUpdateReview}
            initialData={editing}
            loading={createReview.isPending || updateReview.isPending}
          />

          <ConfirmationDialog
            open={deleteConfirm.open}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            title="Delete Review"
            description={`Are you sure you want to delete "${deleteConfirm.reviewTitle}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            loading={deleteReview.isPending}
            variant="destructive"
            icon={Trash2}
          />
        </div>
      </div>
    </DataErrorBoundary>
  );
}

export default SwiperDashboard;
