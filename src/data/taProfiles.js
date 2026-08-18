const reportRoster = [
  ['700000001', 'Avery Adams', 11],
  ['700000002', 'Jordan Adams', 6],
  ['700000003', 'Taylor Adams', 5],
  ['700000004', 'Morgan Adams', 6],
  ['700000005', 'Riley Adams', 10],
  ['700000006', 'Cameron Adams', 10],
  ['700000007', 'Parker Adams', 10],
  ['700000008', 'Quinn Adams', 7],
  ['700000009', 'Reese Adams', 15],
  ['700000010', 'Hayden Adams', 10],
  ['700000011', 'Logan Adams', 9],
  ['700000012', 'Casey Adams', 5],
  ['700000013', 'Drew Adams', 20],
  ['700000014', 'Skyler Adams', 5],
  ['700000015', 'Emerson Adams', 20],
  ['700000016', 'Rowan Adams', 12],
  ['700000017', 'Finley Adams', 10],
  ['700000018', 'Blake Adams', 10],
  ['700000019', 'Dakota Adams', 5],
  ['700000020', 'Jamie Adams', 15],
]

const courses = [
  ['ENG 101', '03', 'Dr. Smith'],
  ['REL 200C', '03', 'Prof. Allen'],
  ['BUS 210', '02', 'Dr. Carter'],
  ['BIO 180', '01', 'Prof. Nguyen'],
  ['MATH 221', '04', 'Dr. Jensen'],
  ['COMM 130', '02', 'Prof. Baker'],
]

const supervisors = ['Laurin Vasquez', 'Seda Hancer']
const hiringAssistants = ['Josh Whitman', 'Emmanuel Otieno', 'Alejandro Ramirez', 'Cristian Velasquez']

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function buildProfile([iNumber, name, maxAssignedHours], index) {
  const random = seededRandom(1049 + index * 317)
  const [course, section, instructor] = courses[index % courses.length]
  const id = slugify(name)
  const [firstName, lastName] = name.toLowerCase().split(' ')
  const supervisor = supervisors[index % supervisors.length]
  const hiringAssistant = hiringAssistants[index % hiringAssistants.length]
  const level = `Level ${(index % 3) + 1}`

  // Week 12 is deliberately absent. Importing Time Stats supplies its real data.
  const workdayData = Array.from({ length: 11 }, (_, weekIndex) => {
    const workedHours = Number((maxAssignedHours - 1.25 + random() * 2.5).toFixed(2))
    return {
      week: weekIndex + 1,
      expectedHours: maxAssignedHours,
      workedHours,
      daysUnder25Minutes: random() > .82 ? 1 : 0,
      manualEntryPercentage: Math.round(random() * 25),
      syncedAt: `2026-${String(6 + Math.floor(weekIndex / 4)).padStart(2, '0')}-${String(3 + (weekIndex % 4) * 7).padStart(2, '0')}T17:00:00.000Z`,
    }
  })

  const onboardingLabels = ['Background Check', 'I-9 Verification', 'Direct Deposit Setup', 'Training Modules', 'Department Orientation']
  const onboarding = onboardingLabels.map((step, stepIndex) => ({
    step,
    status: stepIndex < 3 ? 'Complete' : random() > .45 ? 'Complete' : 'In Progress',
  }))

  return {
    id,
    name,
    iNumber,
    email: `${firstName}.${lastName}${String(index + 1).padStart(2, '0')}@byui.edu`,
    phone: `(208) 496-${String(2100 + index * 137).slice(-4)}`,
    hiringAssistant,
    supervisor,
    returning: index % 4 !== 1,
    introCallComplete: index % 7 !== 1,
    addedToTeams: index % 10 !== 2,
    level,
    role: 'Teaching Assistant',
    workdayId: `W${String(123456789 + index * 48217).padStart(12, '0')}`,
    assignments: [{ course, section, instructor, status: level, maxHours: maxAssignedHours }],
    workdayData,
    onboarding,
    trainingCompletion: {
      start: random() > .2,
      academicPartnership: random() > .35,
      generalNotes: random() > .45,
    },
    notes: [{
      id: `${id}-1`,
      category: 'Performance Review',
      author: supervisor,
      content: `${name.split(' ')[0]}'s weekly performance is measured against the ${maxAssignedHours}-hour course assignment.`,
      createdAt: '2026-06-03T16:00:00.000Z',
      updatedAt: '2026-06-03T16:00:00.000Z',
      week: 1,
    }],
  }
}

export const taProfiles = reportRoster.map(buildProfile)

export function getTAProfile(id) {
  return taProfiles.find(profile => profile.id === id)
}
