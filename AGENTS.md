# TAMS — Build the Weekly Task Schedule Card

## Objective

Create a functional **Weekly Task Schedule card** for the **Supervisor Dashboard**.

The card must automatically determine the current semester week and display only the tasks assigned to that week. Supervisors must be able to check off tasks as they complete them.

Use the uploaded `Weekly Task Schedule.xlsx` file as the source for the semester task information.

---

## Main Requirements

### 1. Current-week display

The card must:

- Display the current semester week, such as `Week 4`.
- Display only the tasks belonging to the current week.
- Not display the task lists for every semester week at the same time.
- Automatically change to the next week's tasks when a new week begins.
- Support:
  - `T-2`
  - `T-1`
  - `Week 1` through `Week 14`

The current week must be calculated from a configurable semester start date. Do not hardcode the current week inside the component.

Example:

```ts
const semesterStartDate = "2026-09-14";
```

Use the start date to calculate how many weeks have passed and select the correct weekly schedule.

---

### 2. Task filtering

This card is for the **Supervisor Dashboard**.

Include tasks that apply to:

- Supervisors
- Everyone
- The supervisor's assigned role, when applicable

Do not show tasks belonging exclusively to unrelated roles.

Create the weekly schedule as structured application data rather than reading the Excel file directly from the frontend.

Recommended structure:

```ts
type WeeklyTask = {
  id: string;
  week: number | "T-2" | "T-1";
  title: string;
  description?: string;
  assignedTo: string[];
  dueDay?: string;
};

type WeeklySchedule = {
  week: number | "T-2" | "T-1";
  label: string;
  tasks: WeeklyTask[];
};
```

Place this data in a dedicated file such as:

```text
src/data/weeklyTaskSchedule.ts
```

---

### 3. Task checklist

Each weekly task must include:

- A checkbox or checkmark control
- The task title
- An optional due date or due-day label
- A clear completed state

When a supervisor checks a task:

- Mark it as complete.
- Add a visual line-through or completed style.
- Update the weekly completion count.
- Persist the completion state.
- Do not lose completion status after refreshing the page.

Completion must be stored per:

```text
supervisor + semester + week + task
```

Do not store one global completion value shared by every supervisor.

Use the project's existing database and API architecture when available. Temporary local storage may only be used if the backend for this feature has not been created yet.

---

### 4. Card header

The top of the card should show:

```text
Weekly Task Schedule
Week 4
September 28 – October 4
```

Also include a progress summary:

```text
3 of 5 completed
```

Add a progress bar calculated from the completed tasks.

Example:

```ts
const progress =
  totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100);
```

---

### 5. Week indicators

Add a compact semester week indicator showing:

```text
T-2  T-1  1  2  3  4  5 ... 14
```

Behavior:

- Completed weeks display a checkmark.
- The current week is visually highlighted.
- Future weeks appear inactive.
- Clicking a week may preview that week's tasks, but the card must return to the current week by default.
- Clearly label previewed weeks so users do not confuse them with the current week.

---

### 6. Empty and special states

Handle these cases:

- No tasks assigned for the current week
- Semester has not started
- Semester has ended
- Schedule data fails to load
- Completion update fails

Example empty-state message:

```text
No supervisor tasks are scheduled for this week.
```

Provide a retry action when loading or updating fails.

---

### 7. Responsive design

The card must work well on:

- Desktop
- Tablet
- Mobile

On smaller screens:

- Keep the checklist easy to tap.
- Allow week indicators to scroll horizontally.
- Avoid horizontal overflow in the card.
- Stack header details when necessary.

---

### 8. Accessibility

Implement:

- Proper labels for every checkbox
- Keyboard navigation
- Visible focus states
- Sufficient color contrast
- `aria-current="step"` for the current week indicator
- Screen-reader text for completed tasks and progress
- Reduced-motion support

Do not rely only on color to communicate status.

---

## Suggested Components

```text
WeeklyTaskScheduleCard
├── WeeklyScheduleHeader
├── WeekIndicatorList
├── WeeklyProgress
├── WeeklyTaskList
│   └── WeeklyTaskItem
└── WeeklyScheduleState
```

Keep the card modular. Do not place all logic and markup inside one large component.

---

## Suggested Utility Functions

Create and test utilities similar to:

```ts
getCurrentSemesterWeek()
getWeekDateRange()
getTasksForWeek()
filterTasksForSupervisor()
calculateWeeklyProgress()
```

The week calculation must correctly handle:

- Dates before Week 1
- `T-2` and `T-1`
- Week boundaries
- Week 14
- Dates after the semester ends

---

## Backend and data model

When using database persistence, create a completion record similar to:

```ts
type TaskCompletion = {
  id: string;
  userId: string;
  semesterId: string;
  taskId: string;
  week: string;
  completed: boolean;
  completedAt: string | null;
};
```

Suggested API behavior:

```text
GET    /api/supervisor/weekly-tasks/current
GET    /api/supervisor/weekly-tasks/:week
PATCH  /api/supervisor/weekly-tasks/:taskId/completion
```

The server must verify that the authenticated user is authorized to view or update supervisor tasks.

---

## Acceptance Criteria

The implementation is complete when:

- The dashboard shows only the current week's task content by default.
- The displayed week changes automatically based on the semester calendar.
- `T-2`, `T-1`, and Weeks 1–14 are supported.
- Supervisors can check and uncheck tasks.
- Completion status persists after refresh.
- Progress updates immediately.
- Tasks are filtered by the correct role.
- Completed, current, and future weeks have distinct states.
- The card is responsive and accessible.
- Loading, empty, error, pre-semester, and post-semester states are handled.
- The feature includes tests for week calculation and task completion behavior.
- Existing dashboard functionality is not broken.

---

## Deliverables

Provide:

1. The weekly schedule data converted from the spreadsheet into structured application data.
2. The reusable dashboard card components.
3. Current-week calculation utilities.
4. Task completion persistence.
5. Backend endpoints or a clearly marked temporary local-storage adapter.
6. Unit tests for date calculations and progress calculations.
7. Component or integration tests for checking off tasks.
8. A brief summary of files created or modified.
9. Confirmation that linting, tests, and the production build pass.
