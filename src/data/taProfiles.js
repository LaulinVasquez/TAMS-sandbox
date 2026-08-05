const people = [
  { id: 'hannah-cho', name: 'Hannah Cho', email: 'hcho@byui.edu', phone: '(208) 496-4307', hiringAssistant: 'Josh Whitman', supervisor: 'Laurin Vasquez', returning: true, level: 'Level 3' },
  { id: 'marcus-reed', name: 'Marcus Reed', email: 'mreed@byui.edu', phone: '(208) 496-2184', hiringAssistant: 'Emmanuel Otieno', supervisor: 'Seda Hancer', returning: false, level: 'Level 1' },
  { id: 'priya-shah', name: 'Priya Shah', email: 'pshah@byui.edu', phone: '(208) 496-7741', hiringAssistant: 'Alejandro Ramirez', supervisor: 'Laurin Vasquez', returning: true, level: 'Level 2' },
  { id: 'ethan-brooks', name: 'Ethan Brooks', email: 'ebrooks@byui.edu', phone: '(208) 496-6620', hiringAssistant: 'Cristian Velasquez', supervisor: 'Seda Hancer', returning: true, level: 'Level 2' },
  { id: 'sofia-martinez', name: 'Sofia Martinez', email: 'smartinez@byui.edu', phone: '(208) 496-3908', hiringAssistant: 'Josh Whitman', supervisor: 'Laurin Vasquez', returning: false, level: 'Level 1' },
  { id: 'noah-williams', name: 'Noah Williams', email: 'nwilliams@byui.edu', phone: '(208) 496-5519', hiringAssistant: 'Emmanuel Otieno', supervisor: 'Seda Hancer', returning: true, level: 'Level 3' },
  {
    id: 'jordan-park',
    name: 'Jordan Park',
    email: 'jpark@byui.edu',
    phone: '(208) 496-8842',
    hiringAssistant: 'Josh Whitman',
    supervisor: 'Seda Hancer',
    returning: false,
    level: 'Level 1',
    assignmentPlan: [
      { course: 'ENG 101', section: '05', instructor: 'Dr. Smith', maxHours: 6 },
      { course: 'COMM 130', section: '04', instructor: 'Prof. Baker', maxHours: 6 },
      { course: 'REL 200C', section: '02', instructor: 'Prof. Allen', maxHours: 6 },
    ],
  },
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
  const { assignmentPlan, ...personDetails } = person
  const random = seededRandom(1049 + index * 317)
  const assignments = assignmentPlan
    ? assignmentPlan.map((assignment, offset) => ({
      ...assignment,
      status: offset === 0 ? person.level : `Level ${1 + Math.floor(random() * 3)}`,
    }))
    : [0, 1].map(offset => {
      const [courseLabel, instructor] = courses[(index + offset) % courses.length]
      const parts = courseLabel.split(' ')
      const section = parts.pop()
      return { course: parts.join(' '), section, instructor, status: offset === 0 ? person.level : `Level ${1 + Math.floor(random() * 3)}`, maxHours: 10 }
    })
  const expectedHours = assignments.reduce((sum, assignment) => sum + assignment.maxHours, 0)
  const workdayData = Array.from({ length: 14 }, (_, weekIndex) => {
    const workedHours = Number((expectedHours - 3.5 + random() * 6).toFixed(2))
    return {
      week: weekIndex + 1,
      expectedHours,
      workedHours,
      daysUnder25Minutes: random() > .72 ? Math.ceil(random() * 3) : 0,
      manualEntryPercentage: Math.round(random() * 55),
      syncedAt: `2026-${String(6 + Math.floor(weekIndex / 4)).padStart(2, '0')}-${String(3 + (weekIndex % 4) * 7).padStart(2, '0')}T17:00:00.000Z`,
    }
  })
  const onboardingLabels = ['Background Check', 'I-9 Verification', 'Direct Deposit Setup', 'Training Modules', 'Department Orientation']
  const onboarding = onboardingLabels.map((step, stepIndex) => ({ step, status: stepIndex < 2 ? 'Complete' : random() > .55 ? 'Complete' : random() > .45 ? 'In Progress' : 'Pending' }))

  return {
    ...personDetails,
    role: 'Teaching Assistant',
    iNumber: `12${String(3456789 + index * 7319).padStart(7, '0')}`,
    workdayId: `W000${123456789 + index * 48217}`,
    assignments,
    workdayData,
    onboarding,
    notes: personDetails.id === 'jordan-park'
      ? [
        { id: `${personDetails.id}-1`, author: personDetails.supervisor, date: 'Jun 3, 2026', week: 1, text: 'Jordan supports three 6-hour sections this term. Workday reports one combined weekly total, not hours per course.' },
        { id: `${personDetails.id}-2`, author: personDetails.hiringAssistant, date: 'Jun 9, 2026', week: 2, text: 'Confirmed the 18-hour weekly expectation across ENG 101, COMM 130, and REL 200C.' },
      ]
      : [
        { id: `${personDetails.id}-1`, author: personDetails.supervisor, date: 'Jun 3, 2026', week: 1, text: `${personDetails.name.split(' ')[0]} completed the initial check-in. Continue monitoring pacing and weekly hours.` },
        { id: `${personDetails.id}-2`, author: personDetails.hiringAssistant, date: 'Jun 9, 2026', week: 2, text: 'Reviewed manual time entries and clarified the department logging expectations.' },
      ],
  }
}

export const taProfiles = people.map(buildProfile)

export function getTAProfile(id) {
  return taProfiles.find(profile => profile.id === id)
}
