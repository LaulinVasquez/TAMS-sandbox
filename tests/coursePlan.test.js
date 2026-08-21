import assert from 'node:assert/strict'
import test from 'node:test'
import { createCoursePlan, loadCoursePlan, saveCoursePlan } from '../src/utils/coursePlan.js'

const course = { id: 'anth-101', code: 'ANTH 101', name: 'Introduction to Cultural Anthropology' }

function memoryStorage() {
  const values = new Map()
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
}

test('initializes a new plan with course-aware templates and blank course fields', () => {
  const plan = createCoursePlan(course)
  assert.match(plan.jobDescription, /ANTH 101: Introduction to Cultural Anthropology/)
  assert.match(plan.jobExpectations, /14-week commitment/)
  assert.equal(plan.positionRequirements, '')
  assert.equal(plan.jobDuties, '')
  assert.equal(plan.requiresCertification, 'No')
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
