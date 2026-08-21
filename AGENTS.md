# Agent Task — Update Courses UI to Match Reference Screenshots

## Goal

Update the **Courses** section in the TAMS template so it closely matches the existing TAMS design shown in the reference screenshots located in the repository's `images` folder.

The screenshots are already available in the TAMS sandbox repo and their filenames begin with:

* `courses...`
* `course...`

The agent should inspect those screenshots directly and use them as the primary visual reference.

---

## Courses List Page

When the user clicks **Courses** in the left navigation, recreate the page shown in the `courses...` reference screenshot as closely as possible.

The page should include the same overall structure:

* Page title: **Courses**
* Supporting description below the title
* Search input
* Course count
* Filter control
* Export control
* View control
* Course table

The table should include fields similar to:

* Course
* Name
* Department
* Status
* Sections
* Unassigned
* Notes

Each course row should be clickable and open the corresponding course detail page.

Match the reference UI closely in:

* spacing
* card borders
* table density
* typography hierarchy
* button sizing
* alignment
* status badges
* sidebar/content spacing

Reuse the existing TAMS design system and components wherever possible rather than creating a separate visual system.

---

## Course Detail Page

When a user selects a course, recreate the layout shown in the `course...` screenshots.

The top of the page should include:

* Course code
* Course name
* Department information

Create cards/sections similar to the references.

### Course Summary

Display information such as:

* Status
* Sections
* Unassigned
* TA Plan status
* TAP weekly hours

### Course Notes

Create a persistent notes card similar to the reference.

Include:

* Note textarea/input
* Staff-only checkbox
* Add note button
* Existing notes area

The visual styling should closely follow the screenshot.

### Resources

Add the Resources section shown in the reference with the same general layout.

### TA Plan

Create the TA Plan section using the reference screenshots as the UI target.

The section should support:

* Weekly duties
* Responsibility selection
* Description field
* Hours/week
* Add weekly duty
* Remove duty
* Non-regular duties
* Add non-regular duty

### Details

Include the same detail areas shown in the reference:

* Required Skills / Job Posting
* Supplementary Training
* Setup Instructions
* Required Certifications

Provide:

* Save
* Submit for approval
* History

### Sections This Term

Include the final **Sections This Term** card/section shown in the reference.

---

## Visual Requirements

The screenshots in the `images` folder are the primary design source.

The agent should inspect the images whose names begin with `course` or `courses` before implementing.

Do not redesign the page based on personal preference.

The goal is to make the current TAMS template look and behave **very close to the reference implementation**, including:

* layout
* proportions
* spacing
* borders
* controls
* tables
* cards
* typography
* navigation behavior

Pixel-perfect matching is not required, but the result should clearly look like the same application.

---

## Implementation Requirements

Before changing code:

1. Inspect the existing Courses routes/components.
2. Inspect the screenshots in the repository `images` folder.
3. Reuse existing TAMS components and styles when possible.
4. Keep the implementation responsive.
5. Preserve existing functionality unless a change is required to match the reference.
6. Avoid hardcoding the entire page if reusable data/components already exist.
7. Keep course list data and course detail data structured so real backend data can replace placeholders later.

---

## Scope

For this task, focus only on reproducing the **Courses list page and Course detail page** shown in the screenshots.

Do not implement the Time Stats import feature yet.

Once the Courses UI is aligned with the reference design, the next ticket/update will build on top of this structure.
