import type { User } from 'firebase/auth'

interface UserAvatarProps {
  user: User
  size?: number
}

export function UserAvatar({ user, size = 32 }: UserAvatarProps) {
  const initials = (user.displayName ?? user.email ?? 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (user.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName ?? 'User'}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    )
  }

  return (
    <div
      className="rounded-full bg-primary dark:bg-primary-dark flex items-center justify-center text-white font-medium text-xs"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  )
}
