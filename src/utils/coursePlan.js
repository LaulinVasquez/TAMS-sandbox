export const JOB_EXPECTATIONS_TEMPLATE = `**General TA Job Expectations (non-negotiable, click here for additional detail)**

* 14-week commitment
* Must work 30 minutes/day (minimum), 5 days/week (excluding Sundays)
* Time off is limited to 3 consecutive days (with management approval)
* All work must be completed in Idaho`

export const PLAN_STATUSES = {
  draft: 'Draft',
  submitted: 'Submitted',
}

export function buildJobDescription(course) {
  return `An online teaching assistant (TA) is needed for **${course.code}: ${course.name}**. TAs work remotely and support instructors and students under supervision of the Online TA Management Team.

**Note:** Qualified applicants remain on interest lists for multiple semesters and may be contacted as openings arise.`
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function renderSimpleMarkdown(value) {
  const escaped = escapeHtml(value ?? '')
  const withInline = escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\n)\* (.+)/g, '$1• $2')
  return withInline
    .split(/\n{2,}/)
    .map(paragraph => `<p>${paragraph.replaceAll('\n', '<br />')}</p>`)
    .join('')
}

function createHistoryEntry(action, status) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    action,
    status,
    at: new Date().toISOString(),
  }
}

export function createCoursePlan(course, storedPlan = null) {
  const defaults = {
    status: PLAN_STATUSES.draft,
    positionRequirements: '',
    jobDescription: buildJobDescription(course),
    jobDuties: '',
    jobExpectations: JOB_EXPECTATIONS_TEMPLATE,
    requiresCertification: 'No',
    certificationDescription: '',
    history: [],
  }
  if (!storedPlan) return defaults

  return {
    ...defaults,
    ...storedPlan,
    status: storedPlan.status ?? defaults.status,
    history: Array.isArray(storedPlan.history) ? storedPlan.history : defaults.history,
    positionRequirements: storedPlan.positionRequirements ?? storedPlan.setupInstructions ?? defaults.positionRequirements,
    jobDescription: storedPlan.jobDescription ?? storedPlan.requiredSkillsJobPosting ?? defaults.jobDescription,
    certificationDescription: storedPlan.certificationDescription ?? storedPlan.supplementaryTraining ?? defaults.certificationDescription,
  }
}

export function loadCoursePlan(course, storage = localStorage) {
  const raw = storage.getItem(`tams-course-plan-${course.id}`)
  if (!raw) return createCoursePlan(course)
  try { return createCoursePlan(course, JSON.parse(raw)) } catch { return createCoursePlan(course) }
}

export function saveCoursePlan(courseId, plan, storage = localStorage) {
  storage.setItem(`tams-course-plan-${courseId}`, JSON.stringify(plan))
  return plan
}

export function saveDraftPlan(courseId, plan, storage = localStorage) {
  const next = {
    ...plan,
    status: PLAN_STATUSES.draft,
    history: [createHistoryEntry('Saved draft', PLAN_STATUSES.draft), ...(plan.history ?? [])].slice(0, 20),
  }
  return saveCoursePlan(courseId, next, storage)
}

export function submitCoursePlan(courseId, plan, storage = localStorage) {
  const next = {
    ...plan,
    status: PLAN_STATUSES.submitted,
    history: [createHistoryEntry('Submitted for approval', PLAN_STATUSES.submitted), ...(plan.history ?? [])].slice(0, 20),
  }
  return saveCoursePlan(courseId, next, storage)
}

export function formatPlanHistoryDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function planStatusTone(status) {
  return status === PLAN_STATUSES.submitted
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-amber-200 bg-amber-50 text-amber-700'
}
