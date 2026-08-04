# TAMS Agent Task
## Feature: Redesign the Performance Dashboard (Workday-Based Metrics)

### Objective

Redesign the **Performance** tab to better reflect how Workday actually reports TA hours.

Currently the dashboard assumes Workday provides worked hours **per course/section**, but this is incorrect.

Workday only provides **one total amount of worked hours for the week**, regardless of how many courses the TA supports.

The UI should reflect this reality while still giving supervisors meaningful insights.

---

# Problem

Current table:

| Course | Max Hrs | Total Worked | Difference | Status | Days Under 25 min | Manual Entries |
|---------|---------|--------------|------------|--------|-------------------|----------------|

Only **Max Hours** belongs to a course.

Everything else is actually calculated from the TA's **overall weekly Workday data**, not per course.

Displaying those values per course is misleading because the same Workday totals would be repeated across every section.

---

# New Design

## Card 1 — Course Assignment

Rename:

**Hours Performance**
➡️ **Course Assignments**

Purpose:

Only show workload allocation.

Columns:

- Course
- Section
- Maximum Assigned Hours

Example

| Course | Section | Max Hours |
|---------|----------|-----------|
| ENG 101 | 03 | 10 hrs |
| REL 200C | 03 | 10 hrs |

Nothing else belongs in this table.

This card simply answers:

> "What courses is this TA assigned to and how many hours are allocated?"

---

# Card 2 — Weekly Workday Performance

Create a brand new summary card.

Title:

**Weekly Workday Performance**

Metrics:

### Worked Hours

Example

18.4 / 20 hrs

Progress bar underneath.

---

### Difference

+0.4 hrs

or

-1.6 hrs

Green when positive.

Red when negative.

---

### Status

Badge

Possible values:

- On Track
- Below Hours
- Over Hours
- Needs Review

---

### Days Under 25 Minutes

Example

0

or

2

---

### Manual Entries

Display as percentage.

Example

18%

Color coding:

Green
Yellow
Orange
Red

depending on thresholds.

---

This entire card is based on ONE Workday record for the selected week.

NOT per course.

---

# Remove Redundancy

Current dashboard has:

Hours Performance

AND

Week Performance

These two cards display almost the same information.

This is redundant.

Remove the current **Week Performance** card completely.

---

# Replace Week Performance with Analytics

Instead of repeating numbers, show trends.

Create a graph.

Title:

**Weekly Hours Trend**

Graph type:

Line chart

or

Bar chart

X-axis

Week 1

Week 2

Week 3

...

Week 14

Y-axis

Hours

---

Show two datasets:

Expected Hours

Worked Hours

Example

Week 1

Expected: 20

Worked: 18

Week 2

Expected: 20

Worked: 20

Week 3

Expected: 20

Worked: 21

etc.

---

Highlight current selected week.

Hover tooltip should show:

Worked Hours

Expected Hours

Difference

Status

---

Benefits

A supervisor can immediately identify:

Consistently under hours

Improvement

Overworking

Attendance trends

without reading lots of numbers.

---

# Keep Week Selector

The Week dropdown should continue controlling:

Weekly Workday Performance

Trend graph highlight

Notes

Everything should synchronize with the selected week.

---

# Notes Card

The Notes card is already good.

Only small improvements:

Newest notes first.

Timestamp formatting:

Jun 3, 2026

instead of long format.

Allow Enter to submit.

Shift+Enter for new line.

Auto focus after adding note.

---

# Student Support Performance

Keep this section.

Future metrics may include:

Average grading turnaround

Late grading %

Communication response time

Student satisfaction

Missing grading alerts

Do not implement these yet.

Just keep the placeholder.

---

# Empty States

If Workday data has not yet synced:

Display

"No Workday data available for this week."

instead of

0 hours.

Avoid misleading supervisors into thinking the TA worked zero hours.

---

# Suggested Layout

---------------------------------------------------------

TA Header

Tabs

---------------------------------------------------------

Course Assignments

---------------------------------------------------------

Weekly Workday Performance

---------------------------------------------------------

Weekly Hours Trend (Graph)

---------------------------------------------------------

Notes

---------------------------------------------------------

Student Support Performance

---------------------------------------------------------

---

# Technical Notes

Use reusable dashboard card components.

Keep responsive behavior.

Desktop:

Course Assignment

↓

Weekly Performance

↓

Graph

↓

Notes

↓

Student Support

Mobile:

Stack cards vertically.

Chart should become horizontally scrollable if needed.

---

# UX Goals

The redesign should answer these supervisor questions within five seconds:

• What courses does this TA support?

• Did they work enough hours this week?

• Are they consistently meeting expectations?

• Are there attendance concerns?

• Are there notes from previous supervisors?

The dashboard should feel more like a professional analytics page than a spreadsheet.

---

# Future Enhancements (Do Not Implement Yet)

- Weekly trend predictions.
- Supervisor recommendations using AI.
- Workday sync indicator.
- Export weekly performance as PDF.
- Comparison against department averages.
- Semester performance heatmap.
- Notifications when a TA falls below required hours for multiple weeks.