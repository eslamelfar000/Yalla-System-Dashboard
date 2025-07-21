# Lesson Status Handling Guide

## Overview

This guide explains how the lesson board handles different lesson statuses based on the scheduled date, current date, and status key from the API data.

## Status Logic

### Status Determination

The system determines lesson status based on three factors:

1. **Date Availability**: Whether the lesson has a scheduled date
2. **Date Comparison**: Whether the lesson date has been reached (today or past)
3. **Status Key**: The `status` field from the API response

### Status Types

#### 1. Current (Can be completed)

- **Condition**: Has date AND date has been reached AND status is "current"
- **Color**: Primary color (blue)
- **Icon**: Play circle
- **Action**: Can be clicked to mark as complete
- **Visual**: Main color with hover effects

#### 2. Done (Already completed)

- **Condition**: Has date AND date has been reached AND status is "done"
- **Color**: Green
- **Icon**: Check circle
- **Action**: No action allowed (already completed)
- **Visual**: Green color, no hover effects

#### 3. Future (Scheduled for later)

- **Condition**: Has date AND date has NOT been reached yet
- **Color**: Orange
- **Icon**: Calendar
- **Action**: No action allowed (date hasn't arrived)
- **Visual**: Orange color, shows days until available

#### 4. No Date (Not scheduled)

- **Condition**: No date set
- **Color**: Gray
- **Icon**: Lock closed
- **Action**: No action allowed (needs date first)
- **Visual**: Grayed out, disabled appearance

#### 5. Pending (Default state)

- **Condition**: Any other combination
- **Color**: Muted
- **Icon**: Clock
- **Action**: No action allowed
- **Visual**: Muted appearance

## Date Handling

### Date Parsing

The system handles various date formats:

- **DD/MM format**: "23/7" → July 23rd of current year
- **Standard date strings**: ISO format dates
- **Invalid dates**: Treated as no date

### Date Comparison Logic

```javascript
const isLessonDateReached = (lessonDate) => {
  if (!lessonDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  const lessonDateObj = new Date(lessonDate);
  lessonDateObj.setHours(0, 0, 0, 0);

  return lessonDateObj <= today;
};
```

## Code Implementation

### Status Detection Function

```javascript
const getLessonStatus = (lesson) => {
  const hasDate = lesson.date && lesson.date.trim() !== "";
  const status = lesson.status?.toLowerCase();
  const lessonDate = parseLessonDate(lesson.date);
  const dateReached = isLessonDateReached(lessonDate);

  if (!hasDate) {
    return "no-date"; // No date set
  }

  if (!dateReached) {
    return "future"; // Date hasn't arrived yet
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
```

### Color Mapping

```javascript
const getStatusColor = (status) => {
  switch (status) {
    case "current":
      return "text-primary border-primary bg-primary/10";
    case "done":
      return "text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20";
    case "future":
      return "text-orange-500 border-orange-500 bg-orange-50 dark:bg-orange-900/20";
    case "no-date":
      return "text-gray-400 border-gray-300 bg-gray-50 dark:bg-gray-800 dark:text-gray-500";
    default:
      return "text-muted-foreground border-muted-foreground/30";
  }
};
```

### Icon Mapping

```javascript
const getStatusIcon = (status) => {
  switch (status) {
    case "current":
      return "heroicons:play-circle";
    case "done":
      return "heroicons:check-circle";
    case "future":
      return "heroicons:calendar";
    case "no-date":
      return "heroicons:lock-closed";
    default:
      return "heroicons:clock";
  }
};
```

## User Interactions

### Click Behavior

- **Current lessons**: Opens confirmation dialog to mark as complete
- **Done lessons**: Shows success message (already completed)
- **Future lessons**: Shows warning with days until available
- **No date lessons**: Shows warning (needs date first)
- **Pending lessons**: Shows info message (not ready)

### Status Messages

- **Current**: "Click to mark as completed"
- **Done**: "Already completed"
- **Future**: "Available in X days"
- **No Date**: "No date scheduled"

### Visual Feedback

- **Hover effects**: Only on current lessons
- **Cursor changes**: Pointer for current, not-allowed for others
- **Opacity**: Reduced opacity for non-interactive lessons
- **Tooltips**: Show status messages on hover

## Status Summary

The component displays a summary of lesson counts by status:

- **Available**: Number of lessons that can be completed today
- **Completed**: Number of lessons already done
- **Future**: Number of lessons scheduled for later dates
- **No Date**: Number of lessons without scheduled dates

## Example Scenarios

### Today is July 21st:

- **Lesson on July 23rd**: Shows as "Future" (orange) - "Available in 2 days"
- **Lesson on July 20th**: Shows as "Current" (blue) - can be completed
- **Lesson on July 19th**: Shows as "Current" (blue) - can be completed
- **Lesson with no date**: Shows as "No Date" (gray) - needs scheduling

## API Integration

The system expects lesson data with the following structure:

```javascript
{
  id: number,
  start_time: string,
  day: string, // Format: "DD/MM" or ISO date string
  purpose: string,
  status: "current" | "done" | "pending",
  coaching: boolean,
  report_send: boolean
}
```

## Benefits

1. **Time-aware**: Lessons are locked until their scheduled date
2. **Clear visual hierarchy**: Different colors for different time states
3. **Helpful feedback**: Shows exact days until lessons become available
4. **Intuitive interactions**: Only today's lessons can be completed
5. **Flexible date parsing**: Handles various date formats
6. **Real-time updates**: Status changes automatically as dates pass
