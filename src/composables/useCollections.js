import { db } from '@/firebase/config'
import {
  arrayUnion,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'
import useImageUpload from './useImageUpload'

// Move collections ref outside the composable to make it shared state
const collections = ref([])

const useCollections = () => {
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
        likedBy: [],
      }

      await setDoc(doc(db, 'collections', collectionId), newCollection)

      // Update user's collections array and stats
      const totalCollections = (await getDocs(collection(db, 'collections'))).size

      await updateDoc(userRef, {
        'stats.totalCollections': totalCollections,
        'stats.totalImages': increment(collectionData.images.length),
        collectionsArray: arrayUnion(newCollection),
      })

      return collectionId
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCollection = async (user, collectionData) => {
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

      // Upload new images
      const existingImages = collectionData.images.filter((image) => image.url)
      const newImages = collectionData.images.filter((image) => !image.url)
      const newImageUrls = await Promise.all(
        newImages.map(async (image) => {
          try {
            const url = await uploadImage(image.file)
            return { id: image.id, url }
          } catch (imgError) {
            console.error('Image upload failed:', imgError)
            throw new Error('Failed to upload collection image')
          }
        }),
      )

      // Update collection document
      const updatedCollection = {
        ...collectionData,
        images: [...existingImages, ...newImageUrls],
        tags: [
          ...(collectionData.tags || []),
          ...newImages.map((image, index) => ({
            id: image.id,
            tag: collectionData.tags[index].tag,
          })),
        ],
      }

      await setDoc(doc(db, 'collections', collectionData.id), updatedCollection)

      // Update user's collections array and stats
      const updatedCollectionsArray = userData.collectionsArray.map((collection) =>
        collection.id === collectionData.id ? updatedCollection : collection,
      )

      await updateDoc(userRef, {
        collectionsArray: updatedCollectionsArray,
        'stats.totalImages': increment(newImageUrls.length),
      })

      return collectionData.id
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCollection = async (user, collectionId) => {
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

      // Delete collection document
      await deleteDoc(doc(db, 'collections', collectionId))

      // Update user's collections array and stats
      const updatedCollectionsArray = userData.collectionsArray.filter(
        (collection) => collection.id !== collectionId,
      )
      await updateDoc(userRef, {
        collectionsArray: updatedCollectionsArray,
        'stats.totalCollections': increment(-1),
        'stats.totalImages': increment(
          -userData.collectionsArray.find((collection) => collection.id === collectionId).images
            .length,
        ),
      })

      // Update total collections document if it exists
      const totalCollectionsRef = doc(db, 'stats', 'totalCollections')
      const totalCollectionsDoc = await getDoc(totalCollectionsRef)
      if (totalCollectionsDoc.exists()) {
        await updateDoc(totalCollectionsRef, {
          count: increment(-1),
        })
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserCollections = async (userEmail) => {
    error.value = null
    loading.value = true

    try {
      const userDocId = userEmail.replace(/\./g, ',')
      const userRef = doc(db, 'users', userDocId)
      const userDoc = await getDoc(userRef)
      if (!userDoc.exists()) {
        throw new Error('User not found')
      }
      const userData = userDoc.data()
      collections.value = userData.collectionsArray || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchAllCollections = async () => {
    loading.value = true
    error.value = null

    try {
      const querySnapshot = await getDocs(collection(db, 'collections'))
      collections.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.error('Fetch collections error:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const toggleLike = async (user, collectionId, userEmail) => {
    try {
      if (!user) throw new Error('Must be logged in to like collections')

      const collectionRef = doc(db, 'collections', collectionId)
      const collectionDoc = await getDoc(collectionRef)

      if (!collectionDoc.exists()) return

      const collectionData = collectionDoc.data()

      const userDocId = userEmail.replace(/\./g, ',')
      const userRef = doc(db, 'users', userDocId)
      const userDoc = await getDoc(userRef)
      if (!userDoc.exists()) {
        throw new Error('User not found')
      }
      const userData = userDoc.data()

      const userCollectionsArray = userData.collectionsArray.filter(
        (collection) => collection.id !== collectionId,
      )

      const hasLiked =
        collectionData.likedBy?.includes(user.email) ||
        userCollectionsArray.likedBy?.includes(user.email)
      const newLikes = hasLiked
        ? Math.max(0, (collectionData.likes || userCollectionsArray.likes || 0) - 1)
        : (collectionData.likes || userCollectionsArray.likes || 0) + 1

      // Update Firestore
      await updateDoc(collectionRef, {
        likes: newLikes,
        likedBy: hasLiked ? arrayRemove(user.email) : arrayUnion(user.email),
      })

      const updatedCollectionsArray = userData.collectionsArray.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              likes: newLikes,
              likedBy: hasLiked
                ? (collection.likedBy || []).filter((email) => email !== user.email)
                : [...(collection.likedBy || []), user.email],
            }
          : collection,
      )

      await updateDoc(userRef, {
        collectionsArray: updatedCollectionsArray,
      })

      // Update local state with new collection data
      const updatedCollection = {
        ...collectionData,
        id: collectionId,
        likes: newLikes,
        likedBy: hasLiked
          ? (collectionData.likedBy || []).filter((email) => email !== user.email)
          : [...(collectionData.likedBy || []), user.email],
      }

      // Find and update the collection in our shared reactive collections array
      const index = collections.value.findIndex((c) => c.id === collectionId)
      if (index !== -1) {
        collections.value[index] = updatedCollection
      }
    } catch (err) {
      console.error('Toggle like error:', err)
    }
  }

  return {
    collections,
    error,
    loading,
    createCollection,
    updateCollection,
    deleteCollection,
    fetchUserCollections,
    fetchAllCollections,
    toggleLike,
  }
}

export default useCollections
