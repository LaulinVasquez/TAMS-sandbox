const people = [
  { id: 'hannah-cho', name: 'Hannah Cho', email: 'hcho@byui.edu', phone: '(208) 496-4307', hiringAssistant: 'Josh Whitman', supervisor: 'Laurin Vasquez', returning: true, level: 'Level 3' },
  { id: 'marcus-reed', name: 'Marcus Reed', email: 'mreed@byui.edu', phone: '(208) 496-2184', hiringAssistant: 'Emmanuel Otieno', supervisor: 'Seda Hancer', returning: false, level: 'Level 1' },
  { id: 'priya-shah', name: 'Priya Shah', email: 'pshah@byui.edu', phone: '(208) 496-7741', hiringAssistant: 'Alejandro Ramirez', supervisor: 'Laurin Vasquez', returning: true, level: 'Level 2' },
  { id: 'ethan-brooks', name: 'Ethan Brooks', email: 'ebrooks@byui.edu', phone: '(208) 496-6620', hiringAssistant: 'Cristian Velasquez', supervisor: 'Seda Hancer', returning: true, level: 'Level 2' },
  { id: 'sofia-martinez', name: 'Sofia Martinez', email: 'smartinez@byui.edu', phone: '(208) 496-3908', hiringAssistant: 'Josh Whitman', supervisor: 'Laurin Vasquez', returning: false, level: 'Level 1' },
  { id: 'noah-williams', name: 'Noah Williams', email: 'nwilliams@byui.edu', phone: '(208) 496-5519', hiringAssistant: 'Emmanuel Otieno', supervisor: 'Seda Hancer', returning: true, level: 'Level 3' },
]

const courses = [
  ['ENG 101 03', 'Dr. Smith'], ['REL 200C 03', 'Prof. Allen'], ['BUS 210 02', 'Dr. Carter'],
  ['BIO 180 01', 'Prof. Nguyen'], ['MATH 221 04', 'Dr. Jensen'], ['COMM 130 02', 'Prof. Baker'],
]

function seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function buildProfile(person, index) {
  const random = seededRandom(1049 + index * 317)
  const assignments = [0, 1].map(offset => {
    const [course, instructor] = courses[(index + offset) % courses.length]
    return { course, instructor, status: offset === 0 ? person.level : `Level ${1 + Math.floor(random() * 3)}`, maxHours: 10 }
  })
  const weeklyData = Array.from({ length: 14 }, (_, weekIndex) => ({
    week: weekIndex + 1,
    courses: assignments.map(assignment => {
      const worked = Number((4.5 + random() * 6.2).toFixed(2))
      return { course: assignment.course, maxHours: assignment.maxHours, worked, daysUnder25: random() > .7 ? -Math.ceil(random() * 3) : 0, manualEntries: Math.round(random() * 62) }
    }),
  }))
  const onboardingLabels = ['Background Check', 'I-9 Verification', 'Direct Deposit Setup', 'Training Modules', 'Department Orientation']
  const onboarding = onboardingLabels.map((step, stepIndex) => ({ step, status: stepIndex < 2 ? 'Complete' : random() > .55 ? 'Complete' : random() > .45 ? 'In Progress' : 'Pending' }))

  return {
    ...person,
    role: 'Teaching Assistant',
    iNumber: `12${String(3456789 + index * 7319).padStart(7, '0')}`,
    workdayId: `W000${123456789 + index * 48217}`,
    assignments,
    weeklyData,
    onboarding,
    notes: [
      { id: `${person.id}-1`, author: person.supervisor, date: 'Jun 3, 2026', text: `${person.name.split(' ')[0]} completed the initial check-in. Continue monitoring pacing and weekly hours.` },
      { id: `${person.id}-2`, author: person.hiringAssistant, date: 'Jun 9, 2026', text: 'Reviewed manual time entries and clarified the department logging expectations.' },
    ],
  }
}

export const taProfiles = people.map(buildProfile)

export function getTAProfile(id) {
  return taProfiles.find(profile => profile.id === id)
}
