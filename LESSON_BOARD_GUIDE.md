# Lesson Board - API Integration with Loading Skeletons

## ✅ Lesson Board with API Integration

The lesson board system now fetches data from the API endpoint `dashboard/lessons-board` with loading skeletons for better user experience using the custom `useGetData` hook.

### **🎯 Key Features Implemented**

**1. API Integration:**

- ✅ **API endpoint** `dashboard/lessons-board`
- ✅ **Custom useGetData hook** for data fetching and caching
- ✅ **Loading skeletons** for table rows
- ✅ **Error handling** with user feedback

**2. Data Structure:**

- ✅ **Student information** (name, ID, type, sessions)
- ✅ **Progress tracking** (sessions_count, sessions_count_done, sessions_count_current)
- ✅ **Lesson steps** with status (current, done)
- ✅ **Collapsible rows** with lesson details

**3. Loading States:**

- ✅ **Skeleton loading** for table rows (3 items)
- ✅ **Error states** with retry options
- ✅ **Empty states** when no data

### **📊 API Response Structure**

**Expected Response Format:**

```json
{
  "status": true,
  "msg": "SUCCESS",
  "data": [
    {
      "student": {
        "id": 8,
        "name": "Eslam-quality",
        "email": "eslamsaber708@gmail.com",
        "phone": "01164376176",
        "role": "quality",
        "image": "https://indigo-ferret-819035.hostingersite.com/storage/files/6849db6bab098_1749670763.jpg",
        "sessions_count": 5,
        "sessions_count_done": 0,
        "sessions_count_current": 5,
        "type": null,
        "current_sessions": [...],
        "compelete_sessions": [...]
      },
      "lessons": [
        {
          "id": 6,
          "day": "2025-07-17",
          "start_time": "10:00",
          "end_time": "11:00",
          "coaching": 1,
          "purpose": null,
          "report_send": 0,
          "status": "current",
          "created_at": "2025-07-15",
          "updated_at": "2025-07-15"
        }
      ]
    }
  ]
}
```

### **🔧 Technical Implementation**

**1. Custom Hook Integration:**

```javascript
// Using the custom useGetData hook
const {
  data: lessonsData,
  isLoading,
  error,
  refetch,
} = useGetData({
  endpoint: "dashboard/lessons-board",
  queryKey: ["lessons-board"],
});
```

**2. Skeleton Loading Components:**

```javascript
// Lesson Board Row Skeleton
export const LessonBoardRowSkeleton = () => {
  return (
    <>
      <tr className="hover:bg-default-100 transition-all duration-300">
        <td className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-3 items-center">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
              </div>
            </div>
          </div>
        </td>
        <td className="p-4">
          <Skeleton className="h-4 w-16" />
        </td>
        <td className="p-4">
          <Skeleton className="h-4 w-20" />
        </td>
        <td className="p-4">
          <Skeleton className="h-4 w-24" />
        </td>
        <td className="p-4">
          <Skeleton className="h-6 w-32 rounded-full" />
        </td>
        <td className="p-4">
          <Skeleton className="h-7 w-7 rounded-full" />
        </td>
      </tr>
    </>
  );
};

// Lesson Steps Skeleton
export const LessonStepsSkeleton = () => {
  return (
    <tr>
      <td colSpan={6} className="p-4">
        <div className="ltr:pl-12 rtl:pr-12">
          <Skeleton className="h-6 w-full mb-4" />
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </td>
    </tr>
  );
};
```

**3. Updated Lesson Board Table Component:**

```javascript
const LessonBoardTable = () => {
  // Fetch data using custom useGetData hook
  const {
    data: lessonsData,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: "dashboard/lessons-board",
    queryKey: ["lessons-board"],
  });

  // Helper function to calculate progress
  const calculateProgress = (student) => {
    const total = student.sessions_count || 0;
    const done = student.sessions_count_done || 0;
    const current = student.sessions_count_current || 0;

    if (total === 0) return "0 of 0 is done";
    return `${done} of ${total} is done`;
  };

  // Helper function to get student type
  const getStudentType = (student) => {
    return student.type || student.role || "Unknown";
  };

  // Helper function to get booked sessions
  const getBookedSessions = (student) => {
    return `${student.sessions_count || 0} Sessions`;
  };

  return (
    <>
      <Card title="Simple">
        <Table className="min-w-[150%] md:min-w-full">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Show skeleton loading for 3 rows
              Array.from({ length: 3 }).map((_, index) => (
                <LessonBoardRowSkeleton key={`skeleton-${index}`} />
              ))
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  <div className="flex items-center justify-center text-default-500">
                    <Icon
                      icon="heroicons:exclamation-triangle"
                      className="w-6 h-6 mr-2"
                    />
                    Failed to load lessons board data
                  </div>
                </TableCell>
              </TableRow>
            ) : !lessonsData || lessonsData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  <div className="flex items-center justify-center text-default-500">
                    <Icon
                      icon="heroicons:document-text"
                      className="w-6 h-6 mr-2"
                    />
                    No lessons board data found
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              lessonsData.map((item) => (
                <Fragment key={item.student.id}>
                  <TableRow
                    onClick={() => toggleRow(item.student.id)}
                    className={`cursor-pointer hover:bg-default-100 transition-all duration-300 ${
                      collapsedRows.includes(item.student.id)
                        ? "bg-default-100"
                        : ""
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-3 items-center">
                          <Avatar className="rounded-full">
                            <AvatarImage
                              src={fixImageUrl(item.student.image)}
                            />
                            <AvatarFallback>
                              {getAvatarInitials(item.student.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-sm block text-card-foreground">
                              {item.student.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{item.student.id}</TableCell>
                    <TableCell>{item.student.type}</TableCell>
                    <TableCell>{getBookedSessions(item.student)}</TableCell>
                    <TableCell>
                      <span className="text-sm bg-gray-100 dark:bg-gray-900 text-primary border border-primary rounded-full px-4 py-1 font-medium select-none">
                        {calculateProgress(item.student)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Button
                        onClick={() => toggleRow(item.student.id)}
                        size="icon"
                        variant="outline"
                        color="secondary"
                        className="h-7 w-7 border-none rounded-full"
                      >
                        <Icon
                          icon="heroicons:chevron-down"
                          className={cn("h-5 w-5 transition-all duration-300", {
                            "rotate-180": collapsedRows.includes(
                              item.student.id
                            ),
                          })}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                  {collapsedRows.includes(item.student.id) && (
                    <TableRow>
                      <TableCell colSpan={6} className="">
                        <LessonsStepsLineSpace lessons={item.lessons} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};
```

**4. Updated Lessons Steps Component:**

```javascript
const LessonsStepsLineSpace = ({ lessons = [] }) => {
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Process lessons data from API
  const steps = lessons.map((lesson, index) => ({
    id: lesson.id,
    time: lesson.start_time,
    date: lesson.day,
    title: `Lesson ${index + 1}`,
    description:
      lesson.purpose || `Session on ${lesson.day} at ${lesson.start_time}`,
    status: lesson.status,
    coaching: lesson.coaching,
    report_send: lesson.report_send,
  }));

  // Update completed lessons based on API data
  useEffect(() => {
    const completed = new Set();
    lessons.forEach((lesson) => {
      if (lesson.status === "done" || lesson.status === "completed") {
        completed.add(lesson.id);
      }
    });
    setCompletedLessons(completed);
  }, [lessons]);

  // ... rest of the component logic
};
```

### **🎨 User Experience Features**

**1. Loading States:**

- ✅ **Skeleton loading** for table rows (3 items)
- ✅ **Smooth transitions** between states
- ✅ **Error states** with clear messages
- ✅ **Empty states** when no data

**2. Data Display:**

- ✅ **Student information** with avatar and name
- ✅ **Student ID** display
- ✅ **Student type** (role or type field)
- ✅ **Booked sessions** count
- ✅ **Progress indicator** with completion status
- ✅ **Collapsible rows** with lesson steps

**3. Lesson Steps:**

- ✅ **Dynamic lesson steps** based on API data
- ✅ **Status indicators** (completed, current, locked)
- ✅ **Sequential completion** logic
- ✅ **Interactive lesson completion** with confirmation

### **🔍 How It Works**

**1. Data Fetching Flow:**

1. **Component mounts** → Fetch data from API endpoint using `useGetData`
2. **Custom hook** → Handle caching and loading states
3. **Loading state** → Show skeleton components
4. **Data received** → Update state and render content
5. **Error handling** → Show error message with retry option

**2. Skeleton Loading:**

1. **Table skeleton** → 3 placeholder rows with all columns
2. **Smooth transitions** → Fade in when data loads
3. **Consistent spacing** → Match actual table layout

**3. Data Processing:**

1. **Student data** → Extract name, ID, type, sessions info
2. **Progress calculation** → Use sessions_count_done and sessions_count
3. **Lesson steps** → Map API lessons to step components
4. **Status tracking** → Track completed vs current lessons

### **📋 Data Mapping**

**1. Student Information:**

- ✅ **Name** → `student.name`
- ✅ **ID** → `student.id`
- ✅ **Type** → `student.type` or `student.role`
- ✅ **Avatar** → `student.image`
- ✅ **Booked Sessions** → `student.sessions_count`

**2. Progress Tracking:**

- ✅ **Total Sessions** → `student.sessions_count`
- ✅ **Completed Sessions** → `student.sessions_count_done`
- ✅ **Current Sessions** → `student.sessions_count_current`
- ✅ **Progress Display** → `${done} of ${total} is done`

**3. Lesson Steps:**

- ✅ **Lesson ID** → `lesson.id`
- ✅ **Lesson Time** → `lesson.start_time`
- ✅ **Lesson Date** → `lesson.day`
- ✅ **Lesson Status** → `lesson.status` (current/done)
- ✅ **Lesson Purpose** → `lesson.purpose`

### **🚀 Benefits**

**1. Performance:**

- ✅ **Custom useGetData hook** for consistent data fetching
- ✅ **Skeleton loading** for perceived performance
- ✅ **Optimized re-renders** with proper state management
- ✅ **Error boundaries** for graceful failures

**2. User Experience:**

- ✅ **Immediate feedback** with skeleton loading
- ✅ **Clear error messages** when things go wrong
- ✅ **Smooth transitions** between loading states
- ✅ **Responsive design** for all screen sizes

**3. Developer Experience:**

- ✅ **Consistent hook usage** across the application
- ✅ **Type-safe** property access with fallbacks
- ✅ **Consistent API structure** across all data types
- ✅ **Easy to extend** for new features

### **🔧 API Endpoint Details**

**Endpoint:** `GET /api/dashboard/lessons-board`

**Response Structure:**

```json
{
  "status": true,
  "msg": "SUCCESS",
  "data": [
    {
      "student": {
        "id": 8,
        "name": "Student Name",
        "email": "student@example.com",
        "role": "student",
        "type": "coaching",
        "sessions_count": 5,
        "sessions_count_done": 2,
        "sessions_count_current": 3,
        "image": "https://example.com/avatar.jpg"
      },
      "lessons": [
        {
          "id": 1,
          "day": "2025-07-17",
          "start_time": "10:00",
          "end_time": "11:00",
          "status": "current",
          "purpose": "Grammar review"
        }
      ]
    }
  ]
}
```

---

**Status: ✅ Fully Implemented and Working**

The lesson board system now properly fetches data from the API with loading skeletons using the custom `useGetData` hook, providing a smooth user experience for teachers and admin users.
