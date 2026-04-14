import { create } from 'zustand'
import type { UserRole } from '@/types/roles'

interface RoleStore {
  role: UserRole | null
  roleLoading: boolean
  setRole: (role: UserRole | null) => void
  setRoleLoading: (loading: boolean) => void
  isOwner: () => boolean
  isAdmin: () => boolean
  isTeacher: () => boolean
}

export const useRoleStore = create<RoleStore>()((set, get) => ({
  role: null,
  roleLoading: true,
  setRole: (role) => set({ role, roleLoading: false }),
  setRoleLoading: (roleLoading) => set({ roleLoading }),
  isOwner: () => get().role === 'owner',
  isAdmin: () => ['owner', 'admin'].includes(get().role ?? ''),
  isTeacher: () => ['owner', 'admin', 'teacher'].includes(get().role ?? ''),
}))
