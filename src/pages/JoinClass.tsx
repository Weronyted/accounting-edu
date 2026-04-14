import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, Loader2, CheckCircle2, LogIn } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getClassGroupByCode, joinClassGroup, isClassMember } from '@/services/class.service'
import { useAuthStore } from '@/store/useAuthStore'
import type { ClassGroup } from '@/types/roles'

const PENDING_KEY = 'pendingClassCode'

export function JoinClass() {
  const { code } = useParams<{ code: string }>()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [cls, setCls] = useState<ClassGroup | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [alreadyMember, setAlreadyMember] = useState(false)
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState('')

  // Save invite code for auto-join after Google sign-in
  useEffect(() => {
    if (code) localStorage.setItem(PENDING_KEY, code)
  }, [code])

  useEffect(() => {
    if (!code) { setLoading(false); return }
    getClassGroupByCode(code).then(async (group) => {
      setCls(group)
      if (group && user) {
        const member = await isClassMember(group.id, user.uid)
        setAlreadyMember(member)
      }
    }).finally(() => setLoading(false))
  }, [code, user])

  // Auto-join after Google sign-in if pending code matches
  useEffect(() => {
    const pending = localStorage.getItem(PENDING_KEY)
    if (!pending || !user || !cls || joining || alreadyMember || joined) return
    if (pending.toUpperCase() !== cls.inviteCode) return

    async function autoJoin() {
      if (!user || !cls) return
      setJoining(true)
      try {
        await joinClassGroup(cls.id, user.uid, user.displayName ?? '', user.email ?? '')
        localStorage.removeItem(PENDING_KEY)
        setJoined(true)
      } catch {
        // silent - user can manually join
      } finally {
        setJoining(false)
      }
    }
    autoJoin()
  }, [user, cls, joining, alreadyMember, joined])

  async function handleJoin() {
    if (!user || !cls) return
    setJoining(true)
    setError('')
    try {
      await joinClassGroup(cls.id, user.uid, user.displayName ?? '', user.email ?? '')
      localStorage.removeItem(PENDING_KEY)
      setJoined(true)
    } catch {
      setError('Failed to join. Please try again.')
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="flex justify-center py-32">
          <Loader2 size={28} className="animate-spin text-slate-400" />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="max-w-md mx-auto px-4 py-20">
        <Card className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center mx-auto">
            <Users size={28} className="text-primary dark:text-primary-dark" />
          </div>

          {!cls ? (
            <>
              <h1 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">
                Invalid invite link
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                This invite code is not valid or has expired.
              </p>
              <Button variant="outline" onClick={() => navigate('/')}>
                Go home
              </Button>
            </>
          ) : joined || alreadyMember ? (
            <>
              <CheckCircle2 size={32} className="text-green-500 mx-auto" />
              <h1 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">
                {alreadyMember && !joined ? 'Already a member' : 'Joined successfully!'}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You are a member of <strong>{cls.name}</strong>.
              </p>
              <Button onClick={() => navigate(`/class/${cls.id}`)}>
                Go to class
              </Button>
            </>
          ) : (
            <>
              <h1 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">
                Join class
              </h1>
              <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">
                {cls.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Teacher: {cls.teacherName}
              </p>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              {!user ? (
                <div className="space-y-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Sign in to join this class. The invite will be saved automatically.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Trigger auth modal by dispatching a custom event
                      window.dispatchEvent(new CustomEvent('open-auth-modal'))
                    }}
                  >
                    <LogIn size={15} /> Sign in to join
                  </Button>
                </div>
              ) : (
                <Button onClick={handleJoin} loading={joining}>
                  Join {cls.name}
                </Button>
              )}
            </>
          )}
        </Card>
      </div>
    </PageTransition>
  )
}
