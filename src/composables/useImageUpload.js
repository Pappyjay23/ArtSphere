import { ref } from 'vue'

const useImageUpload = () => {
  const error = ref(null)
  const loading = ref(false)

  const uploadImage = async (file) => {
    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('key', import.meta.env.VITE_IMGBB_API_KEY)

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to upload image')
      }

      // Return the display URL (or you can use other URLs provided by ImgBB)
      return data.data.url
    } catch (err) {
      console.error('Image upload error:', err)
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
