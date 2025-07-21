"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useMutate } from "@/hooks/useMutate";
import LoadingButton from "@/components/Shared/loading-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

const CompleteSessionButton = ({ studentId, lessons, onSuccess }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Check if all lessons are completed
  const allLessonsCompleted = lessons?.every(
    (lesson) => lesson.status === "done"
  );

  // Check if any lessons are available for completion
  const hasAvailableLessons = lessons?.some((lesson) => {
    const hasDate = lesson.day && lesson.day.trim() !== "";
    const status = lesson.status?.toLowerCase();
    const lessonDate = new Date(lesson.day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lessonDate.setHours(0, 0, 0, 0);
    const dateReached = lessonDate <= today;

    return hasDate && dateReached && status === "current";
  });

  // Mutation for completing session
  const completeSessionMutation = useMutate({
    method: "POST",
    endpoint: `dashboard/complete-session/${studentId}`,
    queryKeysToInvalidate: ["lessons-board"],
    text: "Session completed successfully!",
    onSuccess: (data) => {
      if (data.status) {
        setShowConfirmDialog(false);
        setIsCompleting(false);
        onSuccess?.();
        toast.success("Session completed successfully!");
      }
    },
    onError: (error) => {
      setIsCompleting(false);
      console.error("Session completion error:", error);
    },
  });

  const handleCompleteSession = () => {
    if (allLessonsCompleted) {
      toast.info("All lessons are already completed!");
      return;
    }

    if (!hasAvailableLessons) {
      toast.error("No lessons are available for completion at this time.");
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmSessionCompletion = () => {
    setIsCompleting(true);
    completeSessionMutation.mutate({
      student_id: studentId,
      completed_at: new Date().toISOString(),
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          onClick={handleCompleteSession}
          size="lg"
          variant="outline"
          disabled={allLessonsCompleted || !hasAvailableLessons}
          className={cn("h-10 px-4 text-sm font-medium", {
            "bg-green-50 text-green-700 border-green-200 hover:bg-green-100":
              allLessonsCompleted,
            "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20":
              hasAvailableLessons && !allLessonsCompleted,
            "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed":
              !hasAvailableLessons && !allLessonsCompleted,
          })}
        >
          <Icon
            icon={
              allLessonsCompleted
                ? "heroicons:check-circle"
                : "heroicons:play-circle"
            }
            className="w-6 h-6 mr-2"
          />
          {allLessonsCompleted ? "Session Completed" : "Complete Session"}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Icon
                icon="heroicons:check-circle"
                className="w-5 h-5 text-primary"
              />
              Complete Session
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Student ID:
                  </span>
                  <span className="text-sm font-semibold">{studentId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total Lessons:
                  </span>
                  <span className="text-sm">{lessons?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Completed:
                  </span>
                  <span className="text-sm">
                    {lessons?.filter((l) => l.status === "done").length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Available:
                  </span>
                  <span className="text-sm">
                    {lessons?.filter((l) => {
                      const hasDate = l.day && l.day.trim() !== "";
                      const status = l.status?.toLowerCase();
                      const lessonDate = new Date(l.day);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      lessonDate.setHours(0, 0, 0, 0);
                      const dateReached = lessonDate <= today;
                      return hasDate && dateReached && status === "current";
                    }).length || 0}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to complete this session? This will mark
                all available lessons as completed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCompleting} className="mr-2">
              Cancel
            </AlertDialogCancel>
            {isCompleting ? (
              <LoadingButton
                loading={true}
                disabled={true}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Completing...
              </LoadingButton>
            ) : (
              <Button
                onClick={confirmSessionCompletion}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Complete Session
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CompleteSessionButton;
