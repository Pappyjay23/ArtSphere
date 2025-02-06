import { auth, db } from '@/firebase/config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { ref } from 'vue'
import useImageUpload from './useImageUpload'

const user = ref(auth.currentUser)
const error = ref(null)
const loading = ref(false)

// Load user from localStorage if available
const storedUser = localStorage.getItem('user')
if (storedUser) {
  user.value = JSON.parse(storedUser)
}

// Update user state when auth state changes
auth.onAuthStateChanged((_user) => {
  user.value = _user
  if (_user) {
    localStorage.setItem('user', JSON.stringify(_user))
  } else {
    localStorage.removeItem('user')
  }
})

const useAuth = () => {
  const { uploadImage } = useImageUpload()

  const signup = async ({ email, password, fullname, username, profileImage }) => {
    error.value = null
    loading.value = true

    try {
      // Validate inputs
      if (!email || !password || !fullname || !username) {
        throw new Error('All fields are required')
      }

      // Format email to be used as document ID (replace . with , for valid document ID)
      const docId = email.replace(/\./g, ',')

      // Create auth user first
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const newUser = userCredential.user

      if (!newUser) {
        throw new Error('Failed to create user account')
      }

      // Upload image if exists
      let imageUrl = null
      if (profileImage) {
        try {
          imageUrl = await uploadImage(profileImage)
        } catch (imgError) {
          console.error('Image upload failed:', imgError)
        }
      }

      // Create user document in Firestore using email as ID
      const userData = {
        uid: newUser.uid, // Keep UID for reference
        fullname,
        username,
        email,
        profileImage: imageUrl,
        createdAt: new Date().toISOString(),
        followers: 0,
        stats: {
          totalCollections: 0,
          activeItems: 0,
          totalViews: 0,
          totalLikes: 0,
        },
      }

      // Set the user document in Firestore using email as document ID
      await setDoc(doc(db, 'users', docId), userData)

      // Update auth profile
      await updateProfile(newUser, {
        displayName: fullname,
        photoURL: imageUrl,
      })

      error.value = null
      return newUser
    } catch (err) {
      console.error('Signup error:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    error.value = null
    loading.value = true

    try {
      const { user: authUser } = await signInWithEmailAndPassword(auth, email, password)
      localStorage.setItem('user', JSON.stringify(authUser))
      error.value = null
      return authUser
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    error.value = null
    try {
      await signOut(auth)
      localStorage.removeItem('user')
      error.value = null
    } catch (err) {
      console.error('Logout error:', err)
      error.value = err.message
      throw err
    }
  }

  return {
    user,
    error,
    loading,
    signup,
    login,
    logout,
  }
}

export default useAuth
