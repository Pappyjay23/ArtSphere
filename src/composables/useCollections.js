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
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import useImageUpload from './useImageUpload'

const useCollections = () => {
  const error = ref(null)
  const loading = ref(false)
  const { uploadImage } = useImageUpload()

  const createCollection = async (userEmail, collectionData) => {
    error.value = null
    loading.value = true

    try {
      // Upload images
      const imageUrls = await Promise.all(
        collectionData.images.map(async (image) => {
          try {
            return await uploadImage(image)
          } catch (imgError) {
            console.error('Image upload failed:', imgError)
            throw new Error('Failed to upload collection image')
          }
        }),
      )

      // Create collection document
      const collectionRef = await addDoc(collection(db, 'collections'), {
        userEmail,
        name: collectionData.name,
        description: collectionData.description,
        images: imageUrls,
        tags: collectionData.tags,
        createdAt: new Date(),
        views: 0,
        likes: 0,
      })

      // Update user's collections array
      const userDocId = userEmail.replace(/\./g, ',')
      const userRef = doc(db, 'users', userDocId)
      await updateDoc(userRef, {
        'stats.totalCollections': increment(1),
      })

      return collectionRef.id
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

  return {
    error,
    loading,
    createCollection,
    getUserCollections,
  }
}

export default useCollections
