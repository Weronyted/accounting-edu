import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  BookMarked,
  History,
  Settings,
  GraduationCap,
  Loader2,
  Check,
  Unlink,
  Link2,
  ShieldCheck,
  ClipboardList,
  Trophy,
  Users,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { PageTransition } from '@/components/layout/PageTransition'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { UserAvatar } from '@/components/auth/UserAvatar'
import { useAuthStore } from '@/store/useAuthStore'
import { useRoleStore } from '@/store/useRoleStore'
import { useProgressStore } from '@/store/useProgressStore'
import { LESSON_META } from '@/lessons'
import { formatScore, scoreVariant } from '@/utils/formatScore'
import { auth } from '@/services/firebase'
import {
  connectGoogleClassroom,
  getClassroomToken,
  disconnectGoogleClassroom,
  listCourses,
  createClassroomAssignment,
  type ClassroomAssignmentInput,
} from '@/services/classroom.service'
import { createAssignment, listAssignments } from '@/services/admin.service'
import { getMySubmissions } from '@/services/submission.service'
import { getUserClassId, getClassGroup, listTeacherClasses } from '@/services/class.service'
import type { ClassroomCourse, AssignmentSubmission, Assignment, ClassGroup } from '@/types/roles'

type Tab = 'overview' | 'assignments' | 'settings' | 'classroom'

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  teacher: 'Teacher',
  student: 'Student',
}

export function Profile() {
  const { user } = useAuthStore()
  const { role, isTeacher, isAdmin } = useRoleStore()
  const { progress } = useProgressStore()
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  // ─── Assignment history state ─────────────────────────────────────────────────
  const [mySubmissions, setMySubmissions] = useState<AssignmentSubmission[]>([])
  const [assignmentMap, setAssignmentMap] = useState<Record<string, Assignment>>({})
  const [myClass, setMyClass] = useState<ClassGroup | null>(null)
  const [teacherClasses, setTeacherClasses] = useState<ClassGroup[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  // ─── Settings state ──────────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMsg, setSettingsMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  // ─── Classroom state ─────────────────────────────────────────────────────────
  const [classroomToken, setClassroomToken] = useState<string | null>(null)
  const [classroomLoading, setClassroomLoading] = useState(false)
  const [courses, setCourses] = useState<ClassroomCourse[]>([])
  const [coursesLoading, setCoursesLoading] = useState(false)
  const [newAssign, setNewAssign] = useState<{
    title: string
    description: string
    courseId: string
    dueDate: string
  }>({ title: '', description: '', courseId: '', dueDate: '' })
  const [assignSaving, setAssignSaving] = useState(false)
  const [assignMsg, setAssignMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  // Load class info on mount
  useEffect(() => {
    if (!user) return
    // Student: find their class
    getUserClassId(user.uid).then((cid) => {
      if (cid) getClassGroup(cid).then(setMyClass)
    })
    // Teacher: load their created classes
    if (isTeacher()) {
      listTeacherClasses(user.uid).then(setTeacherClasses)
    }
  }, [user])

  // Load assignment history when assignments tab opens
  useEffect(() => {
    if (!user || activeTab !== 'assignments' || mySubmissions.length > 0) return
    setHistoryLoading(true)
    Promise.all([
      getMySubmissions(user.uid),
      listAssignments(),
    ]).then(([subs, assigns]) => {
      setMySubmissions(subs)
      const map: Record<string, Assignment> = {}
      assigns.forEach((a) => { map[a.id] = a })
      setAssignmentMap(map)
    }).finally(() => setHistoryLoading(false))
  }, [user, activeTab])

  // Load classroom token on mount (teacher only)
  useEffect(() => {
    if (!user || !isTeacher()) return
    getClassroomToken(user.uid).then(setClassroomToken)
  }, [user, isTeacher])

  // Load courses when token is available and tab active
  useEffect(() => {
    if (!classroomToken || activeTab !== 'classroom') return
    setCoursesLoading(true)
    listCourses(classroomToken)
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setCoursesLoading(false))
  }, [classroomToken, activeTab])

  if (!user) {
    return (
      <PageTransition>
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <User size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Sign in to view your profile.</p>
        </div>
      </PageTransition>
    )
  }

  const bookmarkedSections = Object.entries(progress).flatMap(([slug, p]) =>
    p.bookmarks.map((sectionId) => ({
      slug,
      sectionId,
      topicTitle: LESSON_META[slug]?.title ?? slug,
    }))
  )

  const quizHistory = Object.entries(progress)
    .filter(([, p]) => p.quizAttempts > 0)
    .sort(([, a], [, b]) => b.lastVisited - a.lastVisited)

  const tabs: { id: Tab; label: string; icon: React.ElementType; show: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: User, show: true },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList, show: true },
    { id: 'settings', label: 'Settings', icon: Settings, show: true },
    { id: 'classroom', label: 'Google Classroom', icon: GraduationCap, show: isTeacher() },
  ]

  // ─── Settings save ────────────────────────────────────────────────────────────
  async function handleSettingsSave() {
    if (!user) return
    setSettingsSaving(true)
    setSettingsMsg(null)
    try {
      if (displayName !== user.displayName) {
        await updateProfile(auth.currentUser!, { displayName })
      }
      if (newPassword) {
        if (!currentPassword) throw new Error('Enter your current password to change it')
        const credential = EmailAuthProvider.credential(user.email!, currentPassword)
        await reauthenticateWithCredential(auth.currentUser!, credential)
        await updatePassword(auth.currentUser!, newPassword)
        setCurrentPassword('')
        setNewPassword('')
      }
      setSettingsMsg({ type: 'ok', text: 'Profile updated successfully.' })
    } catch (err: unknown) {
      setSettingsMsg({ type: 'err', text: err instanceof Error ? err.message : 'Failed to save' })
    } finally {
      setSettingsSaving(false)
    }
  }

  // ─── Classroom connect ────────────────────────────────────────────────────────
  async function handleConnectClassroom() {
    setClassroomLoading(true)
    try {
      const { token } = await connectGoogleClassroom()
      setClassroomToken(token)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to connect')
    } finally {
      setClassroomLoading(false)
    }
  }

  async function handleDisconnectClassroom() {
    if (!user) return
    await disconnectGoogleClassroom(user.uid)
    setClassroomToken(null)
    setCourses([])
  }

  // ─── Create Classroom assignment ──────────────────────────────────────────────
  async function handleCreateAssignment() {
    if (!classroomToken || !user) return
    if (!newAssign.title || !newAssign.courseId) {
      setAssignMsg({ type: 'err', text: 'Title and course are required.' })
      return
    }
    setAssignSaving(true)
    setAssignMsg(null)
    try {
      const input: ClassroomAssignmentInput = {
        title: newAssign.title,
        description: newAssign.description,
        dueDate: newAssign.dueDate ? new Date(newAssign.dueDate) : undefined,
        linkUrl: window.location.origin + '/dashboard',
        linkTitle: 'AccountingEdu — Dashboard',
      }

      const classroomId = await createClassroomAssignment(classroomToken, newAssign.courseId, input)
      const course = courses.find((c) => c.id === newAssign.courseId)

      // Mirror in Firestore
      await createAssignment({
        title: newAssign.title,
        description: newAssign.description,
        lessonSlug: undefined,
        dueDate: newAssign.dueDate ? new Date(newAssign.dueDate).getTime() : undefined,
        teacherId: user.uid,
        teacherName: user.displayName ?? '',
        published: true,
        type: 'classroom',
        classroomCourseId: newAssign.courseId,
        classroomCourseName: course?.name ?? '',
        classroomAssignmentId: classroomId,
      })

      setNewAssign({ title: '', description: '', courseId: '', dueDate: '' })
      setAssignMsg({ type: 'ok', text: 'Assignment created in Google Classroom!' })
    } catch (err: unknown) {
      setAssignMsg({ type: 'err', text: err instanceof Error ? err.message : 'Failed to create' })
    } finally {
      setAssignSaving(false)
    }
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-6">
          <UserAvatar user={user} size={56} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white">
                {user.displayName}
              </h1>
              {role && (
                <Badge
                  variant={
                    role === 'owner'
                      ? 'danger'
                      : role === 'admin'
                      ? 'warning'
                      : role === 'teacher'
                      ? 'success'
                      : 'default'
                  }
                >
                  {ROLE_LABELS[role] ?? role}
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
          {isAdmin() && (
            <Link
              to="/admin"
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-sm font-medium hover:bg-primary/20 dark:hover:bg-primary-dark/20 transition-colors"
            >
              <ShieldCheck size={14} /> Admin Panel
            </Link>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6 w-fit">
          {tabs
            .filter((t) => t.show)
            .map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {activeTab === id && (
                  <motion.div
                    layoutId="profile-tab-bg"
                    className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <Icon size={14} />
                  {label}
                </span>
              </button>
            ))}
        </div>

        {/* ── Overview ───────────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* My class (student) */}
            {myClass && (
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-primary dark:text-primary-dark" />
                    <h3 className="font-heading font-semibold text-slate-900 dark:text-white">
                      My Class
                    </h3>
                  </div>
                  <Link
                    to={`/class/${myClass.id}`}
                    className="text-xs text-primary dark:text-primary-dark hover:underline font-medium"
                  >
                    Open →
                  </Link>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{myClass.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">Teacher: {myClass.teacherName}</p>
              </Card>
            )}

            {/* Teacher's classes */}
            {isTeacher() && teacherClasses.length > 0 && (
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-primary dark:text-primary-dark" />
                  <h3 className="font-heading font-semibold text-slate-900 dark:text-white">
                    My Classes
                  </h3>
                </div>
                <div className="space-y-2">
                  {teacherClasses.map((cls) => (
                    <Link
                      key={cls.id}
                      to={`/class/${cls.id}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-primary/30 dark:hover:border-primary-dark/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                    >
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {cls.name}
                      </span>
                      <span className="text-xs text-primary dark:text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity">
                        Open →
                      </span>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {/* Quiz history */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <History size={16} className="text-primary dark:text-primary-dark" />
                <h3 className="font-heading font-semibold text-slate-900 dark:text-white">
                  Quiz History
                </h3>
              </div>
              {quizHistory.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No quiz attempts yet.{' '}
                  <Link
                    to="/lessons/intro-to-accounting"
                    className="text-primary dark:text-primary-dark hover:underline"
                  >
                    Take a quiz
                  </Link>
                </p>
              ) : (
                <div className="space-y-2">
                  {quizHistory.map(([slug, p]) => (
                    <div
                      key={slug}
                      className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {LESSON_META[slug]?.title ?? slug}
                        </p>
                        <p className="text-xs text-slate-400">
                          {p.quizAttempts} attempts · {new Date(p.lastVisited).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={scoreVariant(p.quizScore)}>{formatScore(p.quizScore)}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Bookmarks */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <BookMarked size={16} className="text-primary dark:text-primary-dark" />
                <h3 className="font-heading font-semibold text-slate-900 dark:text-white">
                  Bookmarks
                </h3>
              </div>
              {bookmarkedSections.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No bookmarks yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {bookmarkedSections.map(({ slug, sectionId, topicTitle }) => (
                    <Link
                      key={`${slug}-${sectionId}`}
                      to={`/lessons/${slug}#${sectionId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-xs font-medium hover:bg-primary/10 dark:hover:bg-primary-dark/20 transition-colors"
                    >
                      {topicTitle} › {sectionId.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* ── Assignments history ─────────────────────────────────────────────── */}
        {activeTab === 'assignments' && (
          <motion.div
            key="assignments"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Submission history */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={16} className="text-primary dark:text-primary-dark" />
                <h3 className="font-heading font-semibold text-slate-900 dark:text-white">
                  Assignment Results
                </h3>
              </div>

              {historyLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 size={20} className="animate-spin text-slate-400" />
                </div>
              ) : mySubmissions.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No assignments submitted yet.{' '}
                  <Link
                    to="/assignments"
                    className="text-primary dark:text-primary-dark hover:underline"
                  >
                    Browse assignments
                  </Link>
                </p>
              ) : (
                <div className="space-y-2">
                  {mySubmissions.map((sub) => {
                    const assign = assignmentMap[sub.assignmentId]
                    const pct = sub.percentage
                    const color =
                      pct >= 80
                        ? 'text-green-600 dark:text-green-400'
                        : pct >= 60
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-red-500 dark:text-red-400'
                    return (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {assign?.title ?? sub.assignmentId}
                          </p>
                          <p className="text-xs text-slate-400">
                            {sub.score}/{sub.maxScore} pts ·{' '}
                            {new Date(sub.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-lg font-bold ${color}`}>{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* ── Settings ───────────────────────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="max-w-lg space-y-5">
              <h2 className="font-heading font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings size={18} /> Profile Settings
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Display Name
                </label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-400 cursor-not-allowed"
                  value={user.email ?? ''}
                  disabled
                  title="Email cannot be changed directly"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Email changes are not supported for linked accounts.
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">
                  Change Password (email accounts only)
                </p>
                <div className="space-y-3">
                  <input
                    type="password"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="New password (leave blank to keep current)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              {settingsMsg && (
                <p
                  className={`text-sm px-3 py-2 rounded-lg ${
                    settingsMsg.type === 'ok'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  }`}
                >
                  {settingsMsg.text}
                </p>
              )}

              <Button onClick={handleSettingsSave} loading={settingsSaving} size="sm">
                <Check size={14} /> Save Changes
              </Button>
            </Card>
          </motion.div>
        )}

        {/* ── Google Classroom (teachers only) ───────────────────────────────── */}
        {activeTab === 'classroom' && isTeacher() && (
          <motion.div
            key="classroom"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Connection status */}
            <Card>
              <h2 className="font-heading font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <GraduationCap size={18} /> Google Classroom Integration
              </h2>

              {classroomToken ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Link2 size={16} />
                    <span className="text-sm font-medium">Connected</span>
                    <span className="text-xs text-slate-400">(token valid for ~1 hour)</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleDisconnectClassroom}>
                    <Unlink size={13} /> Disconnect
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Connect your Google account to create assignments in your Classroom courses.
                  </p>
                  <Button
                    size="sm"
                    onClick={handleConnectClassroom}
                    loading={classroomLoading}
                  >
                    <Link2 size={13} /> Connect Google Classroom
                  </Button>
                </div>
              )}
            </Card>

            {/* Create assignment */}
            {classroomToken && (
              <Card>
                <h3 className="font-heading font-semibold text-slate-900 dark:text-white mb-4">
                  Create Assignment
                </h3>

                {coursesLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 size={20} className="animate-spin text-slate-400" />
                  </div>
                ) : courses.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No active Classroom courses found for your account.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Course *
                      </label>
                      <select
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        value={newAssign.courseId}
                        onChange={(e) =>
                          setNewAssign((a) => ({ ...a, courseId: e.target.value }))
                        }
                      >
                        <option value="">— Select a course —</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                            {c.section ? ` (${c.section})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Assignment Title *
                      </label>
                      <input
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Complete Lesson 1 Quiz"
                        value={newAssign.title}
                        onChange={(e) => setNewAssign((a) => ({ ...a, title: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                        placeholder="Instructions for students..."
                        value={newAssign.description}
                        onChange={(e) =>
                          setNewAssign((a) => ({ ...a, description: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Due Date (optional)
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        value={newAssign.dueDate}
                        onChange={(e) =>
                          setNewAssign((a) => ({ ...a, dueDate: e.target.value }))
                        }
                      />
                    </div>

                    {assignMsg && (
                      <p
                        className={`text-sm px-3 py-2 rounded-lg ${
                          assignMsg.type === 'ok'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        }`}
                      >
                        {assignMsg.text}
                      </p>
                    )}

                    <Button onClick={handleCreateAssignment} loading={assignSaving} size="sm">
                      <GraduationCap size={14} /> Create in Google Classroom
                    </Button>

                    <p className="text-xs text-slate-400">
                      The assignment will also be saved in the AccountingEdu system and visible in
                      the Admin Panel.
                    </p>
                  </div>
                )}
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
