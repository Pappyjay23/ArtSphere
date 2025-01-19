import { ref } from 'vue'
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  increment,
  query,
  where,
  setDoc,
  arrayUnion,
  getDoc,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import useImageUpload from './useImageUpload'
import { v4 as uuidv4 } from 'uuid'

const useCollections = () => {
  const collections = ref([])
  const error = ref(null)
  const loading = ref(false)
  const { uploadImage } = useImageUpload()

  const createCollection = async (user, collectionData) => {
    error.value = null
    loading.value = true

    try {
      // Fetch user details
      const userDocId = user.email.replace(/\./g, ',')
      const userRef = doc(db, 'users', userDocId)
      const userDoc = await getDoc(userRef)
      if (!userDoc.exists()) {
        throw new Error('User not found')
      }
      const userData = userDoc.data()

      // Upload images
      const imageUrls = await Promise.all(
        collectionData.images.map(async (image) => {
          try {
            const url = await uploadImage(image.file)
            return { id: image.id, url }
          } catch (imgError) {
            console.error('Image upload failed:', imgError)
            throw new Error('Failed to upload collection image')
          }
        }),
      )

      // Create collection document
      const collectionId = uuidv4()
      const newCollection = {
        id: collectionId,
        userEmail: userData.email,
        userName: userData.username,
        userFullName: userData.fullname,
        userProfileImage: userData.profileImage || user.photoURL || '',
        name: collectionData.name,
        images: imageUrls,
        tags: collectionData.tags,
        createdAt: new Date(),
        views: 0,
        likes: 0,
      }

      await setDoc(doc(db, 'collections', collectionId), newCollection)

      // Update user's collections array and stats
      const userCollections = userData.collectionsArray ? userData.collectionsArray.length : 0
      const totalCollections = (await getDocs(collection(db, 'collections'))).size

      await updateDoc(userRef, {
        collections: userCollections,
        'stats.totalCollections': totalCollections,
        'stats.totalImages': increment(collectionData.images.length),
        [`collections.${collectionId}`]: newCollection,
      })

      // Add collection to user's collections array
      await updateDoc(userRef, {
        collectionsArray: arrayUnion(newCollection)
      })

      return collectionId
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUserCollections = async (userEmail) => {
    error.value = null
    loading.value = true

    try {
      const q = query(collection(db, 'collections'), where('userEmail', '==', userEmail))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchCollections = async (userEmail) => {
    loading.value = true
    error.value = null

    try {
      const q = query(collection(db, 'collections'), where('userEmail', '==', userEmail))
      const querySnapshot = await getDocs(q)
      collections.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.error('Fetch collections error:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    collections,
    error,
    loading,
    createCollection,
    getUserCollections,
    fetchCollections,
  }
}

export default useCollections
