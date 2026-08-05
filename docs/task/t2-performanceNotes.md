# TAMS Agent Task
## Feature: Categorized Supervisor Notes

### Objective

Redesign the **Supervisor Notes** component in the Performance tab to make notes easier to organize, search, and review throughout the semester.

Currently, all notes are stored in a single chronological list. As the semester progresses, supervisors will accumulate dozens of notes, making it difficult to locate important information.

Each note should now belong to a predefined category (title) so supervisors can quickly filter and review notes by purpose.

---

# Why This Change?

A supervisor may create notes for many different reasons:

- Initial introductions
- Performance reviews
- Outreach attempts
- Call summaries
- Hiring discussions
- Gratitude Week
- General observations

Without categorization, finding a specific note requires scrolling through the entire history.

Adding categories makes the system much more scalable and supervisor-friendly.

---

# New Note Creation Flow

Instead of only displaying a text box, the form should now include:

1. Note Category (Required)
2. Note Body
3. Add Note button

Layout example:

------------------------------------------------------

Category
[ Performance Review ▼ ]

Notes

______________________________________

______________________________________

______________________________________

                    [ Add Note ]

------------------------------------------------------

The note cannot be saved unless a category has been selected.

---

# Note Categories

Use the following predefined categories:

- Performance Review
- Personal Outreach 1
- Personal Outreach 2
- Intro Calls
- Call Summary
- Week 7 Gratitude
- Hiring Team
- Other

These values should be stored exactly as listed.

Do not allow users to create custom categories.

---

# Displaying Notes

Each note card should now display:

------------------------------------------------------

Performance Review

Laurin Vasquez

Jun 3, 2026

Hannah completed the initial check-in...

------------------------------------------------------

The category should appear prominently at the top of the note card as a colored badge or label.

Example:

[ Performance Review ]

instead of plain text.

---

# Filtering Notes

Above the notes list, add a filter dropdown.

Example:

Filter Notes

[ All Categories ▼ ]

Available options:

- All Categories
- Performance Review
- Personal Outreach 1
- Personal Outreach 2
- Intro Calls
- Call Summary
- Week 7 Gratitude
- Hiring Team
- Other

Selecting a category should instantly filter the visible notes.

No page reload.

---

# Default Behavior

When opening the page:

Filter =

All Categories

Display all notes in reverse chronological order (newest first).

---

# Search (Optional UI Placeholder)

Next to the filter, include a search box.

Placeholder:

Search notes...

For now, the search can simply filter note text and supervisor names.

If search is not implemented yet, create the UI component and leave a TODO comment.

---

# Suggested Layout

---------------------------------------------------------

Supervisor Notes

Filter
[ All Categories ▼ ]

Search Notes
[____________________]

---------------------------------------------------------

[ Performance Review ]

Laurin Vasquez

Jun 3, 2026

Hannah completed the weekly performance review...

---------------------------------------------------------

[ Intro Calls ]

Josh Whitman

Jun 9, 2026

Discussed expectations and introduced department
resources.

---------------------------------------------------------

[ Hiring Team ]

Heather Preece

Jun 12, 2026

Approved candidate for next semester.

---------------------------------------------------------

---

# Visual Design

Use colored badges for categories.

Suggested colors:

Performance Review
Blue

Personal Outreach 1
Orange

Personal Outreach 2
Dark Orange

Intro Calls
Purple

Call Summary
Teal

Week 7 Gratitude
Green

Hiring Team
Red

Other
Gray

Use existing badge styles if available.

---

# UX Improvements

Keep all current functionality and add:

- Press Enter to submit (Ctrl/Cmd + Enter if multiline is preferred).
- Shift + Enter creates a new line.
- Automatically clear the form after saving.
- Keep the selected category after adding a note (to make entering multiple notes easier).
- Automatically scroll the new note into view.
- Show a success toast after saving.
- Show an empty state when no notes match the selected filter.

Example:

"No notes found for Performance Review."

---

# Data Model

Each note should include:

{
  id,
  category,
  author,
  content,
  createdAt,
  updatedAt
}

Category is required.

Content is required.

Author is required.

CreatedAt should be generated automatically.

---

# Future Enhancements (Do Not Implement Yet)

- Edit existing notes.
- Delete notes (with confirmation dialog).
- Pin important notes.
- Mention another supervisor (@username).
- Attach files or screenshots.
- AI-generated note summaries.
- Export notes to PDF.
- Filter by supervisor.
- Filter by date range.
- Advanced keyword search.

---

# Acceptance Criteria

✓ Every new note requires a category.

✓ Categories are selected from a predefined dropdown.

✓ Notes display the category badge.

✓ Notes can be filtered by category.

✓ Default filter is "All Categories."

✓ Notes remain sorted newest to oldest.

✓ Responsive layout works on desktop and mobile.

✓ Existing visual style remains consistent with the rest of TAMS.

---

# Goal

The Supervisor Notes section should evolve from a simple comment box into a structured communication log, allowing supervisors to quickly locate performance reviews, outreach records, hiring discussions, and other important interactions throughout the semester.