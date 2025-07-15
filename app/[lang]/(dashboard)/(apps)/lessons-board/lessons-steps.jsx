"use client";
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useMutate } from "@/hooks/useMutate";

const LessonsStepsLineSpace = () => {
  const [completedLessons, setCompletedLessons] = useState(new Set([1, 2])); // Example: lessons 1 and 2 are completed
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const steps = [
    {
      id: 1,
      time: "10 Am",
      date: "April 12",
      title: "Introduction to React",
      description: "Learn the basics of React components and JSX",
    },
    {
      id: 2,
      time: "11 Am",
      date: "April 12",
      title: "State Management",
      description: "Understanding useState and component state",
    },
    {
      id: 3,
      time: "2 PM",
      date: "April 13",
      title: "Props and Components",
      description: "Passing data between components",
    },
    {
      id: 4,
      time: "3 PM",
      date: "April 13",
      title: "Event Handling",
      description: "Handling user interactions in React",
    },
    {
      id: 5,
      time: "10 Am",
      date: "April 14",
      title: "React Hooks",
      description: "useEffect, useContext, and custom hooks",
    },
    {
      id: 6,
      time: "11 Am",
      date: "April 14",
      title: "API Integration",
      description: "Fetching and managing API data",
    },
    {
      id: 7,
      time: "2 PM",
      date: "April 15",
      title: "Routing",
      description: "Navigation with React Router",
    },
    {
      id: 8,
      time: "3 PM",
      date: "April 15",
      title: "Final Project",
      description: "Build a complete React application",
    },
  ];

  // Mutation for completing lessons
  const completeLessonMutation = useMutate({
    method: "POST",
    endpoint: "dashboard/lessons/complete",
    text: "Lesson completed successfully!",
    onSuccess: (data) => {
      if (data.status) {
        setCompletedLessons((prev) => new Set([...prev, selectedLesson.id]));
        setShowConfirmDialog(false);
        setSelectedLesson(null);
      }
    },
    onError: (error) => {
      toast.error("Failed to complete lesson. Please try again.");
    },
  });

  const handleLessonClick = (lesson) => {
    // Don't allow clicking on already completed lessons
    if (completedLessons.has(lesson.id)) {
      toast.success("This lesson is already completed!");
      return;
    }

    // Check if this is the next lesson to complete (sequential completion)
    const nextLessonId = Math.max(...completedLessons, 0) + 1;
    if (lesson.id !== nextLessonId) {
      toast.warning("Please complete lessons in order!");
      return;
    }

    setSelectedLesson(lesson);
    setShowConfirmDialog(true);
  };

  const confirmLessonCompletion = () => {
    if (selectedLesson) {
      // Send API request to mark lesson as complete
      completeLessonMutation.mutate({
        lesson_id: selectedLesson.id,
        completed_at: new Date().toISOString(),
      });
    }
  };

  const getCurrentStep = () => {
    return Math.max(...completedLessons, 0);
  };

  const isLessonAccessible = (lessonId) => {
    const nextLessonId = Math.max(...completedLessons, 0) + 1;
    return lessonId <= nextLessonId;
  };

  const getLessonStatus = (lessonId) => {
    if (completedLessons.has(lessonId)) {
      return "completed";
    } else if (isLessonAccessible(lessonId)) {
      return "accessible";
    } else {
      return "locked";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-default-900 mb-2">
          Lessons Progress
        </h3>
        <p className="text-sm text-default-600">
          Complete lessons in order. Click on the next available lesson to mark
          it as complete.
        </p>
        <div className="mt-2 text-sm text-default-500">
          Progress: {completedLessons.size}/{steps.length} lessons completed
        </div>
      </div>

      <Stepper
        current={getCurrentStep()}
        size="md"
        className="py-3 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-y-10 gap-x-4"
      >
        {steps?.map((lesson, i) => {
          const status = getLessonStatus(lesson.id);
          return (
            <Step key={lesson.id}>
              <div
                className={cn(
                  "relative cursor-pointer group transition-all duration-200",
                  {
                    "cursor-not-allowed opacity-50": status === "locked",
                    "hover:scale-105": status === "accessible",
                  }
                )}
                onClick={() => handleLessonClick(lesson)}
              >
                {/* Status Icon */}
                <div className="absolute -top-2 -right-2 z-10">
                  {status === "completed" && (
                    <div className="bg-green-500 text-white rounded-full p-1">
                      <Icon icon="heroicons:check" className="w-3 h-3" />
                    </div>
                  )}
                  {status === "locked" && (
                    <div className="bg-gray-400 text-white rounded-full p-1">
                      <Icon icon="heroicons:lock-closed" className="w-3 h-3" />
                    </div>
                  )}
                  {status === "accessible" && (
                    <div className="bg-blue-500 text-white rounded-full p-1 animate-pulse">
                      <Icon icon="heroicons:play" className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <StepLabel
                  className={cn("font-medium", {
                    "text-green-600": status === "completed",
                    "text-blue-600": status === "accessible",
                    "text-gray-400": status === "locked",
                  })}
                >
                  {lesson.date}
                </StepLabel>
                <StepLabel
                  className={cn("uppercase -mt-0 text-xs", {
                    "text-green-500": status === "completed",
                    "text-blue-500": status === "accessible",
                    "text-gray-400": status === "locked",
                  })}
                >
                  {lesson.time}
                </StepLabel>

                {/* Tooltip on hover */}
                {/* <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-default-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                  <div className="font-medium">{lesson.title}</div>
                  <div className="text-default-300 text-xs mt-1">
                    {lesson.description}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-default-900"></div>
                </div> */}
              </div>
            </Step>
          );
        })}
      </Stepper>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Icon
                icon="heroicons:academic-cap"
                className="w-5 h-5 text-blue-500"
              />
              Complete Lesson
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <div>Are you sure you want to mark this lesson as complete?</div>
              {selectedLesson && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
                  <div className="font-semibold text-default-900">
                    {selectedLesson.title}
                  </div>
                  <div className="text-sm text-default-600 mt-1">
                    {selectedLesson.description}
                  </div>
                  <div className="text-xs text-default-500 mt-2">
                    {selectedLesson.date} at {selectedLesson.time}
                  </div>
                </div>
              )}
              <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg mt-4">
                <Icon
                  icon="heroicons:information-circle"
                  className="w-4 h-4 inline mr-2"
                />
                Once marked as complete, you cannot undo this action.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowConfirmDialog(false);
                setSelectedLesson(null);
              }}
              disabled={completeLessonMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLessonCompletion}
              disabled={completeLessonMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {completeLessonMutation.isPending ? (
                <>
                  <Icon
                    icon="heroicons:arrow-path"
                    className="w-4 h-4 mr-2 animate-spin"
                  />
                  Completing...
                </>
              ) : (
                <>
                  <Icon icon="heroicons:check" className="w-4 h-4 mr-2" />
                  Complete Lesson
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LessonsStepsLineSpace;
