import { trainingModules } from '../data/training'

export function getTrainingProgress(completion = {}) {
  const completed = trainingModules.filter(module => completion[module.id]).length
  return {
    completed,
    total: trainingModules.length,
    percentage: trainingModules.length ? Math.round((completed / trainingModules.length) * 100) : 0,
  }
}

export function getTrainingStatus(completion = {}) {
  const { completed, total } = getTrainingProgress(completion)
  if (completed === 0) return 'Not started'
  if (completed === total) return 'Complete'
  return 'In progress'
}

export function filterProfilesByTrainingStatus(profiles, status) {
  if (!status || status === 'all') return profiles
  return profiles.filter(profile => getTrainingStatus(profile.trainingCompletion) === status)
}
