export const courses = [
  ['ANTH 101', 'Introduction to Cultural Anthropology', 'Department of Sociology and Social Work'],
  ['APD 325', 'Fashion History', 'Art and Design'],
  ['ART 125', 'Adobe CC Basics', 'Art and Design'],
  ['BIO 180', 'Introduction to Biology I', 'Biological Sciences'],
  ['BIO 181', 'Introduction to Biology II', 'Biological Sciences'],
  ['BIO 264', 'Human Anatomy and Physiology I', 'Biological Sciences'],
  ['BIO 264L', 'Human Anatomy and Physiology I Lab', 'Biological Sciences'],
  ['BIO 265', 'Human Anatomy and Physiology II', 'Biological Sciences'],
  ['BIO 265L', 'Human Anatomy and Physiology II Lab', 'Biological Sciences'],
  ['BIO 375', 'Genetics and Molecular Biology', 'Biological Sciences'],
  ['BUS 301', 'Advanced Writing in Professional Contexts', 'Business'],
  ['BUS 310', 'Launching New Ventures', 'Business'],
  ['BUS 321', 'Organizational Leadership', 'Business'],
  ['BUS 375', 'Business Law', 'Business'],
  ['BUS 380', 'International Business', 'Business'],
  ['BUS 410', 'Principles of Advanced Business Management', 'Business'],
  ['CE 161', 'Fundamentals in 2D CADD', 'Engineering'],
  ['CONST 305', 'Construction Estimating', 'Construction Management'],
].map(([code, name, department], index) => ({
  id: code.toLowerCase().replace(/\s/g, '-'), code, name, department,
  status: 'Scaled', sections: index === 0 ? 0 : index % 5 === 0 ? 2 : 0,
  unassigned: index === 5 ? 1 : 0, notes: 0, taPlanStatus: 'Draft', tapWeeklyHours: index === 0 ? 5 : null,
}))

export const totalCourseCount = 84

export function getCourse(id) {
  return courses.find(course => course.id === id) || courses[0]
}
