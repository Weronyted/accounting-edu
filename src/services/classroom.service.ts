import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import type { ClassroomCourse } from '@/types/roles'

const CLASSROOM_SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students',
]

interface TeacherProfile {
  classroomAccessToken: string
  classroomTokenExpiry: number
  connectedAt: number
}

// ─── Auth / Connection ────────────────────────────────────────────────────────

/** Opens a Google popup to grant Classroom scopes and stores the token. */
export async function connectGoogleClassroom(): Promise<{ token: string; expiry: number }> {
  const provider = new GoogleAuthProvider()
  CLASSROOM_SCOPES.forEach((s) => provider.addScope(s))

  const result = await signInWithPopup(auth, provider)
  const credential = GoogleAuthProvider.credentialFromResult(result)
  const token = credential?.accessToken

  if (!token) throw new Error('Failed to get Classroom access token')

  const expiry = Date.now() + 3_600_000 // 1 hour
  await setDoc(
    doc(db, 'teacherProfiles', result.user.uid),
    { classroomAccessToken: token, classroomTokenExpiry: expiry, connectedAt: Date.now() },
    { merge: true }
  )

  return { token, expiry }
}

/** Returns the stored token if still valid, otherwise null. */
export async function getClassroomToken(uid: string): Promise<string | null> {
  const snap = await getDoc(doc(db, 'teacherProfiles', uid))
  if (!snap.exists()) return null

  const { classroomAccessToken, classroomTokenExpiry } = snap.data() as TeacherProfile
  if (Date.now() > classroomTokenExpiry) return null

  return classroomAccessToken
}

export async function disconnectGoogleClassroom(uid: string): Promise<void> {
  await setDoc(
    doc(db, 'teacherProfiles', uid),
    { classroomAccessToken: null, classroomTokenExpiry: 0 },
    { merge: true }
  )
}

// ─── Classroom API calls ──────────────────────────────────────────────────────

async function classroomFetch(token: string, path: string, options: RequestInit = {}) {
  const res = await fetch(`https://classroom.googleapis.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Classroom API error ${res.status}: ${body}`)
  }
  return res.json()
}

export async function listCourses(token: string): Promise<ClassroomCourse[]> {
  const data = await classroomFetch(token, '/courses?courseStates=ACTIVE')
  return ((data.courses ?? []) as Array<Record<string, string>>).map((c) => ({
    id: c.id,
    name: c.name,
    section: c.section,
  }))
}

export interface ClassroomAssignmentInput {
  title: string
  description: string
  dueDate?: Date
  linkUrl?: string
  linkTitle?: string
}

export async function createClassroomAssignment(
  token: string,
  courseId: string,
  input: ClassroomAssignmentInput
): Promise<string> {
  const body: Record<string, unknown> = {
    title: input.title,
    description: input.description,
    state: 'PUBLISHED',
    workType: 'ASSIGNMENT',
  }

  if (input.dueDate) {
    body.dueDate = {
      year: input.dueDate.getFullYear(),
      month: input.dueDate.getMonth() + 1,
      day: input.dueDate.getDate(),
    }
    body.dueTime = { hours: 23, minutes: 59, seconds: 0, nanos: 0 }
  }

  if (input.linkUrl) {
    body.materials = [{ link: { url: input.linkUrl, title: input.linkTitle ?? input.linkUrl } }]
  }

  const data = await classroomFetch(token, `/courses/${courseId}/courseWork`, {
    method: 'POST',
    body: JSON.stringify(body),
  })

  return data.id as string
}
