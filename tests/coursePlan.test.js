import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createCoursePlan,
  loadCoursePlan,
  PLAN_STATUSES,
  renderSimpleMarkdown,
  saveCoursePlan,
  saveDraftPlan,
  submitCoursePlan,
} from '../src/utils/coursePlan.js'

const course = { id: 'anth-101', code: 'ANTH 101', name: 'Introduction to Cultural Anthropology' }

function memoryStorage() {
  const values = new Map()
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
}

test('initializes a new plan with course-aware templates and blank course fields', () => {
  const plan = createCoursePlan(course)
  assert.match(plan.jobDescription, /\*\*ANTH 101: Introduction to Cultural Anthropology\*\*/)
  assert.match(plan.jobExpectations, /14-week commitment/)
  assert.equal(plan.positionRequirements, '')
  assert.equal(plan.jobDuties, '')
  assert.equal(plan.requiresCertification, 'No')
  assert.equal(plan.status, PLAN_STATUSES.draft)
  assert.deepEqual(plan.history, [])
})

test('persists edits and retains hidden certification content', () => {
  const storage = memoryStorage()
  const edited = { ...createCoursePlan(course), jobDescription: 'Saved custom copy', requiresCertification: 'No', certificationDescription: 'Previously entered certificate' }
  saveCoursePlan(course.id, edited, storage)
  assert.deepEqual(loadCoursePlan(course, storage), edited)
})

test('migrates equivalent legacy detail fields without overwriting content', () => {
  const plan = createCoursePlan(course, { setupInstructions: 'Legacy requirements', requiredSkillsJobPosting: 'Legacy description', supplementaryTraining: 'Legacy training' })
  assert.equal(plan.positionRequirements, 'Legacy requirements')
  assert.equal(plan.jobDescription, 'Legacy description')
  assert.equal(plan.certificationDescription, 'Legacy training')
})

test('save draft and submit update status and history differently', () => {
  const storage = memoryStorage()
  const draft = saveDraftPlan(course.id, createCoursePlan(course), storage)
  assert.equal(draft.status, PLAN_STATUSES.draft)
  assert.equal(draft.history[0].action, 'Saved draft')

  const submitted = submitCoursePlan(course.id, draft, storage)
  assert.equal(submitted.status, PLAN_STATUSES.submitted)
  assert.equal(submitted.history[0].action, 'Submitted for approval')
  assert.equal(submitted.history[1].action, 'Saved draft')
  assert.equal(loadCoursePlan(course, storage).status, PLAN_STATUSES.submitted)
})

test('renders bold markdown and escapes HTML in previews', () => {
  const html = renderSimpleMarkdown('Need TA for **ANTH 101: Intro**\n\n<script>alert(1)</script>')
  assert.match(html, /<strong>ANTH 101: Intro<\/strong>/)
  assert.match(html, /&lt;script&gt;/)
  assert.doesNotMatch(html, /<script>/)
})
