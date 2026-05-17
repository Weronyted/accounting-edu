import { initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

/** True when all required Firebase env vars are present. When false the app
 *  runs in guest-only mode backed by localStorage. */
export const firebaseEnabled = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
)

let _auth: Auth | null = null
let _db: Firestore | null = null
let _storage: FirebaseStorage | null = null

if (firebaseEnabled) {
  try {
    const app = initializeApp(firebaseConfig)
    _auth    = getAuth(app)
    _db      = initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    })
    _storage = getStorage(app)
    // Analytics — optional, only if supported by the browser
    isSupported().then((yes) => yes && getAnalytics(app)).catch(() => null)
  } catch (err) {
    console.warn('[Firebase] Initialization failed:', err)
  }
}

export const auth    = _auth    as Auth
export const db      = _db      as Firestore
export const storage = _storage as FirebaseStorage
