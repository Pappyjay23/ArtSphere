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
      if (!email || !password || !fullname || !username) {
        throw new Error('All fields are required')
      }

      const docId = email.replace(/\./g, ',')

      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const newUser = userCredential.user

      // 2. Upload Profile Image to Cloudinary folder 'profiles'
      let profileImageData = null
      if (profileImage) {
        try {
          profileImageData = await uploadImage(profileImage, 'profiles')
        } catch (imgError) {
          console.error('Profile image upload failed:', imgError)
          // Continue signup even if image fails
        }
      }

      // 3. Update Auth Profile (Internal Firebase State)
      await updateProfile(newUser, {
        displayName: fullname,
        photoURL: profileImageData?.url || null,
      })

      // 4. Save User Data to Firestore (Database State)
      const userData = {
        uid: newUser.uid,
        fullname,
        username,
        email,
        profileImage: profileImageData
          ? {
              url: profileImageData.url,
              publicId: profileImageData.publicId,
            }
          : null,
        createdAt: new Date().toISOString(),
        followers: 0,
        stats: {
          totalCollections: 0,
          activeItems: 0,
          totalViews: 0,
          totalLikes: 0,
        },
      }

      await setDoc(doc(db, 'users', docId), userData)

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
    }
  }

  return { user, error, loading, signup, login, logout }
}

export default useAuth
