// API service plugin for client-side initialization
export default defineNuxtPlugin(async () => {
  // Initialize API service on client side
  const { apiService } = await import('~/composables/useApi.js')
  
  // Initialize the service
  try {
    await apiService.initialize()
    console.log('API Service initialized on client side')
  } catch (error) {
    console.error('Failed to initialize API Service on client side:', error)
  }
})

