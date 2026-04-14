export type UserRole = 'owner' | 'admin' | 'teacher' | 'student'

export interface UserRoleRecord {
  role: UserRole
  displayName: string
  email: string
  assignedBy?: string
  assignedAt?: number
}

export interface DynamicLesson {
  id: string
  title: string
  slug: string
  description: string
  content: string // Markdown
  published: boolean
  createdBy: string
  createdByName: string
  createdAt: number
  updatedAt: number
}

export interface Assignment {
  id: string
  title: string
  description: string
  lessonSlug?: string
  dueDate?: number // timestamp ms
  teacherId: string
  teacherName: string
  published: boolean
  type: 'internal' | 'classroom'
  classroomCourseId?: string
  classroomCourseName?: string
  classroomAssignmentId?: string
  createdAt: number
}

export interface ClassroomCourse {
  id: string
  name: string
  section?: string
}
