export function searchProfiles(profiles, query, limit = 8) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []
  return profiles.filter(profile => {
    const courses = profile.assignments?.map(item => item.course).join(' ') ?? ''
    return `${profile.name} ${profile.email} ${courses}`.toLowerCase().includes(normalized)
  }).slice(0, limit)
}

export function filterProfilesByFlag(profiles, flag) {
  if (!flag) return profiles
  return profiles.filter(profile => Boolean(profile[flag]))
}
