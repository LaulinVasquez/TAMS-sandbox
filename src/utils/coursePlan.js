export const JOB_EXPECTATIONS_TEMPLATE = `General TA Job Expectations (non-negotiable, click here for additional detail)

• 14-week commitment
• Must work 30 minutes/day (minimum), 5 days/week (excluding Sundays)
• Time off is limited to 3 consecutive days (with management approval)
• All work must be completed in Idaho`

export function buildJobDescription(course) {
  return `An online teaching assistant (TA) is needed for ${course.code}: ${course.name}. TAs work remotely and support instructors and students under supervision of the Online TA Management Team.

Note: Qualified applicants remain on interest lists for multiple semesters and may be contacted as openings arise.`
}

export function createCoursePlan(course, storedPlan = null) {
  const defaults = {
    positionRequirements: '',
    jobDescription: buildJobDescription(course),
    jobDuties: '',
    jobExpectations: JOB_EXPECTATIONS_TEMPLATE,
    requiresCertification: 'No',
    certificationDescription: '',
  }
  if (!storedPlan) return defaults

  return {
    ...defaults,
    ...storedPlan,
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
}
