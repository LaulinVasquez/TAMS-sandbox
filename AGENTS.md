# Agent Task — Update TA Plan Job Information Fields

## Goal

Update the **TA Plan** section on the Course Detail page to match the new job-information requirements.

Use the existing Course Detail implementation and styling. Do not redesign the page. The new fields should visually match the cards, text areas, inputs, spacing, and typography already used throughout TAMS.

Use the provided reference screenshot/template for the expected content and field organization.

---

## Required Fields

Replace the existing Details fields with the following fields in this order:

1. **Position Requirements**
2. **Job Description**
3. **Job Duties**
4. **Job Expectations**
5. **Supplemental Training and/or Required Certificate**

Remove/replace the old labels:

* `Required Skills / Job Posting` → **Job Description**
* `Setup Instructions` → **Position Requirements**
* Replace the current supplementary training label with **Supplemental Training and/or Required Certificate**

---

## 1. Position Requirements

Create a text area titled:

**POSITION REQUIREMENTS**

This field appears **above Job Description**.

This is course-specific content and should remain editable.

Do not add default template text to this field.

---

## 2. Job Description

Create a text area titled:

**JOB DESCRIPTION**

Pre-populate new TA Plans with this template:

> An online teaching assistant (TA) is needed for **[Course Code: Course Title]**. TAs work remotely and support instructors and students under supervision of the Online TA Management Team.
>
> **Note:** Qualified applicants remain on interest lists for multiple semesters and may be contacted as openings arise.

`[Course Code: Course Title]` should not remain static if course information is already available.

For example, for ANTH 101:

> An online teaching assistant (TA) is needed for **ANTH 101: Introduction to Cultural Anthropology**.

Use the selected course's actual course code and title when generating the default template.

The supervisor must still be able to edit the text.

---

## 3. Job Duties

Create a text area titled:

**JOB DUTIES**

This is course-specific information.

Leave the field blank by default so the appropriate person can enter the duties for that course.

---

## 4. Job Expectations

Create a text area titled:

**JOB EXPECTATIONS**

Pre-populate new TA Plans with the following template:

**General TA Job Expectations (non-negotiable, click here for additional detail)**

* 14-week commitment
* Must work 30 minutes/day (minimum), 5 days/week (excluding Sundays)
* Time off is limited to 3 consecutive days (with management approval)
* All work must be completed in Idaho

The text should remain editable.

If the existing application already has an appropriate destination for the **"click here for additional detail"** link, use it. Otherwise preserve the text without inventing a URL.

---

## 5. Supplemental Training and/or Required Certificate

Create a section titled:

**SUPPLEMENTAL TRAINING AND/OR REQUIRED CERTIFICATE**

Add a dropdown:

**Requires certification**

Options:

* No
* Yes

Default:

**No**

### When "No" is selected

Do not display the additional description text area.

### When "Yes" is selected

Dynamically display a text area underneath the dropdown where the user can describe:

* Required certification
* Required supplemental training
* Course-specific training/certification details

The entered description must be preserved when the TA Plan is saved.

If the user changes **Yes → No**, hide the description field. Do not unexpectedly destroy previously entered data unless the existing application's form conventions require clearing it.

---

## Expected Layout

The Details portion of the TA Plan should conceptually become:

```text
DETAILS

POSITION REQUIREMENTS
[ Text Area ]

JOB DESCRIPTION
[ Text Area with default Job Description template ]

JOB DUTIES
[ Text Area ]

JOB EXPECTATIONS
[ Text Area with default Job Expectations template ]

SUPPLEMENTAL TRAINING AND/OR REQUIRED CERTIFICATE

Requires certification
[ No ▼ ]

If Yes:

Certification / Training Description
[ Text Area ]
```

Keep these fields inside the existing TA Plan card rather than creating unrelated cards/pages.

---

## Template Behavior

The Job Description and Job Expectations templates are intended to reduce repeated manual entry.

For **new TA Plans**:

* Automatically initialize Job Description with its template.
* Automatically initialize Job Expectations with its template.
* Automatically substitute the current course code and title into Job Description.
* Position Requirements starts blank.
* Job Duties starts blank.
* Requires Certification defaults to `No`.

For **existing TA Plans**, do not overwrite saved content just because the page is opened.

Templates should act as initial values for new content, not continuously replace user edits.

---

## Persistence

Inspect the existing TA Plan data model before implementation.

These values must persist with the TA Plan:

```text
positionRequirements
jobDescription
jobDuties
jobExpectations
requiresCertification
certificationDescription
```

Follow the project's existing naming conventions if equivalent fields already exist.

Prefer migrating/reusing existing fields where appropriate instead of creating duplicate database columns containing the same information.

The Save and Submit for Approval workflows must include these fields.

---

## Reference Material

Use the reference screenshot provided for this task as the content/layout reference.

Also continue using the existing `course...` and `courses...` screenshots in the repository's `images` folder for the overall Course Detail UI.

The screenshot establishes the expected content for:

* Job Description
* Job Expectations
* Position Requirements
* Supplemental Training and/or Required Certificate

---

## Acceptance Criteria

The task is complete when the Course TA Plan displays the five required sections in the correct order, the old labels have been replaced, Job Description and Job Expectations initialize from their templates, the current course is inserted into the Job Description, certification has a Yes/No dropdown with a conditional description field, all fields can be edited and saved, and existing TA Plan data is not unintentionally overwritten.

Do not implement unrelated Courses or Time Stats changes as part of this task.
