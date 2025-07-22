"use client";
import React, { useState, useEffect } from "react";
import { Stepper, Step, StepLabel } from "@/components/ui/steps";
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
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useMutate } from "@/hooks/useMutate";
import LoadingButton from "@/components/Shared/loading-button";
import { Button } from "@/components/ui/button";
import CompleteSessionButton from "./complete-session-button";

const LessonsStepsLineSpace = ({
  lessons = [],
  handleSearchSubmit,
  studentId,
}) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Process lessons data from API
  const steps = lessons.map((lesson, index) => ({
    id: lesson.id,
    time: lesson.start_time.slice(0, 5) + " - " + lesson.end_time.slice(0, 5),
    date: lesson.day,
    title: `Lesson ${index + 1}`,
    description:
      lesson.purpose || `Session on ${lesson.day} at ${lesson.start_time}`,
    status: lesson.status,
    coaching: lesson.coaching,
    report_send: lesson.report_send,
  }));

  // Mutation for completing lessons
  const completeLessonMutation = useMutate({
    method: "GET",
    endpoint: `dashboard/change-lession-status/${selectedLesson?.id}`,
    queryKeysToInvalidate: ["lessons-board"], // Invalidate lessons board data
    text: "Lesson completed successfully!",
    onSuccess: (data) => {
      if (data.status) {
        setShowConfirmDialog(false);
        setSelectedLesson(null);
        handleSearchSubmit();
        // The hook will automatically show success toast and invalidate queries
      }
    },
    onError: (error) => {
      // The hook will automatically show error toast
      console.error("Lesson completion error:", error);
    },
  });

  // Parse date string to Date object
  const parseLessonDate = (dateString) => {
    if (!dateString || dateString.trim() === "") return null;

    try {
      // Handle different date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try parsing DD/MM format
        const parts = dateString.split("/");
        if (parts.length === 2) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // Month is 0-indexed
          const year = new Date().getFullYear();
          return new Date(year, month, day);
        }
      }
      return date;
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return null;
    }
  };

  // Check if lesson date has passed or is today
  const isLessonDateReached = (lessonDate) => {
    if (!lessonDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    const lessonDateObj = new Date(lessonDate);
    lessonDateObj.setHours(0, 0, 0, 0);

    return lessonDateObj <= today;
  };

  // Get lesson status based on date and status
  const getLessonStatus = (lesson) => {
    const status = lesson.status?.toLowerCase();
    const lessonDate = parseLessonDate(lesson.date);
    const dateReached = isLessonDateReached(lessonDate);

    if (!dateReached) {
      return "locked"; // Date hasn't arrived yet
    }

    // Date has been reached
    if (status === "current") {
      return "current"; // Can be completed - main color
    } else if (status === "done") {
      return "done"; // Already completed - green color, no action
    } else {
      return "pending"; // Default state
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "current":
        return "text-primary border-primary bg-primary/10";
      case "done":
        return "text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20";
      case "locked":
        return "text-gray-400 border-gray-300 bg-gray-50 dark:bg-gray-800 dark:text-gray-500";
      default:
        return "text-muted-foreground border-muted-foreground/30";
    }
  };

  // Check if lesson can be interacted with
  const canInteractWithLesson = (lesson) => {
    const status = getLessonStatus(lesson);
    return status === "current"; // Only current lessons with reached dates can be completed
  };

  // Get status message for tooltip or feedback
  const getStatusMessage = (lesson) => {
    const status = getLessonStatus(lesson);
    const lessonDate = parseLessonDate(lesson.date);

    switch (status) {
      case "current":
        return "Click to mark as completed";
      case "done":
        return "Already completed";
      case "future":
        const daysUntil = Math.ceil(
          (lessonDate - new Date()) / (1000 * 60 * 60 * 24)
        );
        return `Available in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`;
      case "no-date":
        return "No date scheduled";
      default:
        return "Not ready yet";
    }
  };

  const handleLessonClick = (lesson) => {
    const status = getLessonStatus(lesson);

    if (status === "done") {
      toast.success("This lesson is already completed!");
      return;
    }

    if (status === "locked") {
      const lessonDate = parseLessonDate(lesson.date);
      const daysUntil = Math.ceil(
        (lessonDate - new Date()) / (1000 * 60 * 60 * 24)
      );
      toast.error(`This lesson is scheduled for ${lesson.date}.`);
      return;
    }

    if (status === "current") {
      setSelectedLesson(lesson);
      setShowConfirmDialog(true);
      return;
    }

    toast.error("This lesson is not ready yet.");
  };

  const confirmLessonCompletion = () => {
    if (selectedLesson) {
      completeLessonMutation.mutate({
        lesson_id: selectedLesson.id,
        completed_at: new Date().toISOString(),
      });
    }
  };

  // Count lessons by status
  const getStatusCounts = () => {
    const counts = { current: 0, done: 0, locked: 0, pending: 0 };
    steps.forEach((step) => {
      const status = getLessonStatus(step);
      counts[status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div>
      <div className="mb-6 flex justify-between">
        <div className="cover">
          <h3 className="text-lg font-semibold text-default-900 mb-2">
            Lessons Progress
          </h3>
          <p className="text-sm text-default-600 mb-3">
            Manage your lessons based on their scheduled dates and current
            status.
          </p>

          {/* Status Summary */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Available: {statusCounts.current}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>Completed: {statusCounts.done}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span>Locked: {statusCounts.locked}</span>
            </div>
          </div>
        </div>

        <CompleteSessionButton
          studentId={studentId}
          lessons={lessons}
          onSuccess={handleSearchSubmit}
        />
      </div>

      <Stepper
        current={statusCounts.done}
        size="md"
        className={`py-3 grid grid-cols-2  ${
          steps.length === 8
            ? "lg:grid-cols-6 xl:grid-cols-8"
            : "lg:grid-cols-4 xl:grid-cols-6"
        } gap-y-10 gap-x-4 `}
      >
        {steps
          .sort((a, b) => {
            const dateA = parseLessonDate(a.date);
            const dateB = parseLessonDate(b.date);
            return dateA - dateB;
          })
          ?.map((lesson, i) => {
            const status = getLessonStatus(lesson);
            const canInteract = canInteractWithLesson(lesson);
            // lessons
            return (
              <Step key={lesson.id}>
                <div
                  className={cn("relative transition-all duration-200", {
                    "cursor-pointer hover:scale-104": canInteract,
                    "cursor-not-allowed": !canInteract,
                  })}
                  onClick={() => handleLessonClick(lesson)}
                  title={getStatusMessage(lesson)}
                >
                  <StepLabel
                    className={cn(
                      "p-2 h-full rounded-md border-2",
                      getStatusColor(status),
                      {
                        "hover:bg-primary/20": canInteract,
                        "opacity-60": !canInteract && status !== "done",
                      }
                    )}
                  >
                    <div className="flex gap-2 relative">
                      {status === "locked" ? (
                        <div className="absolute top-0 right-0 text-gray-500 text-xs">
                          <Icon
                            icon="heroicons:lock-closed"
                            className="w-5 h-5"
                          />
                        </div>
                      ) : status === "done" ? (
                        <div className="absolute top-0 right-0 text-green-600 text-xs">
                          <Icon
                            icon="heroicons:check-circle"
                            className="w-5 h-5"
                          />
                        </div>
                      ) : (
                        <div className="absolute top-0 right-0 text-primary text-xs">
                          <Icon
                            icon="heroicons:clock-circle"
                            className="w-5 h-5"
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-xs font-medium">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {lesson.time}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lesson.date || "No date"}
                        </p>
                      </div>
                    </div>
                  </StepLabel>
                </div>
              </Step>
            );
          })}
      </Stepper>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Icon
                icon="heroicons:check-circle"
                className="w-5 h-5 text-primary"
              />
              Complete Lesson
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Lesson:
                  </span>
                  <span className="text-sm font-semibold">
                    {selectedLesson?.title}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Date:
                  </span>
                  <span className="text-sm">{selectedLesson?.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Time:
                  </span>
                  <span className="text-sm">{selectedLesson?.time}</span>
                </div>
                {selectedLesson?.purpose && (
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Purpose:
                    </span>
                    <span className="text-sm text-right max-w-[200px]">
                      {selectedLesson?.purpose}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to mark this lesson as completed? This
                action cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={completeLessonMutation.isPending}
              className="mr-2"
            >
              Cancel
            </AlertDialogCancel>
            {completeLessonMutation.isPending ? (
              <LoadingButton
                loading={true}
                disabled={true}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Completing...
              </LoadingButton>
            ) : (
              <Button
                onClick={confirmLessonCompletion}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Complete Lesson
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LessonsStepsLineSpace;
