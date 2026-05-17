export type UserRole = 'owner' | 'admin' | 'teacher' | 'student'

export interface UserRoleRecord {
  role: UserRole
  displayName: string
  email: string
  assignedBy?: string
  assignedAt?: number
}

// ─── Assignment Questions ──────────────────────────────────────────────────────

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'code_task'

export interface TestCase {
  id: string
  description: string
  /** JS expression evaluated in the sandbox iframe — truthy = passed.
   *  Has access to: document, getComputedStyle, _logs (array of console.log outputs), _lastLog */
  check: string
}

export interface TestCaseResult {
  id: string
  description: string
  passed: boolean
  error?: string
}

export interface AssignmentQuestion {
  id: string
  text: string
  type: QuestionType
  /** For multiple_choice: array of 2–5 options */
  options?: string[]
  /** MC: option index as string ('0','1'…); TF: 'true'/'false'; SA: expected text (lowercase) */
  correctAnswer: string
  points: number
  /** code_task: initial code shown in the editor */
  starterCode?: string
  /** code_task: which language tab to focus (determines enabledTabs if set) */
  starterLanguage?: 'html' | 'css' | 'js'
  /** code_task: test cases run against student code */
  testCases?: TestCase[]
}

export interface AssignmentSubmission {
  id?: string
  userId: string
  displayName: string
  assignmentId: string
  /** questionId → student's answer; code_task: JSON.stringify({html,css,js}) */
  answers: Record<string, string>
  /** code_task only: questionId → test case results */
  codeResults?: Record<string, TestCaseResult[]>
  score: number
  maxScore: number
  percentage: number
  submittedAt: number
  /** Teacher override fields */
  manualScore?: number
  manualNote?: string
  gradedBy?: string
}

// ─── Assignment ────────────────────────────────────────────────────────────────

export interface Assignment {
  id: string
  title: string
  description: string
  lessonSlug?: string
  dueDate?: number
  teacherId: string
  teacherName: string
  published: boolean
  type: 'internal'
  createdAt: number
  /** Questions with auto-grading */
  questions?: AssignmentQuestion[]
  maxScore?: number
}

// ─── Dynamic Lessons ──────────────────────────────────────────────────────────

export interface LessonQuizQuestion {
  id: string
  text: string
  /** Always 4 options for lesson quizzes */
  options: [string, string, string, string]
  /** Index of the correct option (0–3) */
  correctIndex: number
}

export interface DynamicLesson {
  id: string
  title: string
  slug: string
  description: string
  /** Main body in Markdown. Images via ![alt](url). */
  content: string
  /** Optional cover image URL */
  coverImageUrl?: string
  /** Quiz shown at end of lesson */
  quiz?: LessonQuizQuestion[]
  published: boolean
  createdBy: string
  createdByName: string
  createdAt: number
  updatedAt: number
}

// ─── Class Groups (internal classes) ─────────────────────────────────────────

export interface ClassGroup {
  id: string
  name: string
  teacherId: string
  teacherName: string
  inviteCode: string
  createdAt: number
}

export interface ClassMember {
  uid: string
  displayName: string
  email: string
  joinedAt: number
}
