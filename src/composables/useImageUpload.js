import { ref } from 'vue'

// Upload image to Cloudinary(Console) - https://console.cloudinary.com/
const useImageUpload = () => {
  const error = ref(null)
  const loading = ref(false)

  // Cloudinary credentials from your .env file
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  // Helper to get Public ID from a Cloudinary URL
  const getPublicIdFromUrl = (url) => {
    // Example: https://res.cloudinary.com/demo/image/upload/v1234/folder/image.jpg
    // Returns: folder/image
    const parts = url.split('/')
    const lastPart = parts[parts.length - 1].split('.')[0]
    const folderPart = parts[parts.length - 2]
    // If your folder is 'profiles' or 'collections', we need that too
    return `${folderPart}/${lastPart}`
  }

  const uploadImage = async (file, folder = 'collections') => {
    if (!file) return null

    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)
      formData.append('folder', folder) // Organizes images into folders in Cloudinary

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      return {
        url: data.secure_url,
        publicId: data.public_id,
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err)
      error.value = 'Failed to upload image. Please try again.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    uploadImage,
    error,
    loading,
  }
}

export default useImageUpload
