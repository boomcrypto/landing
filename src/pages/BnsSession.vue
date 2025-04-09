<template>
  <AppLayout>
    <div class="min-h-screen flex items-center justify-center">
      <div class="max-w-md mx-auto w-full p-6 bg-gray-800 rounded-lg shadow-lg">
        <div v-if="verifying" class="text-center">
          <div class="flex justify-center mb-6">
            <svg class="animate-spin h-12 w-12 text-fuchsia-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold mb-4">Verifying Your Account</h1>
          <p class="text-lg mb-6">{{ statusMessage }}</p>
        </div>
        
        <div v-else-if="error" class="text-center">
          <div class="flex justify-center mb-6">
            <svg class="h-12 w-12 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold mb-4">Verification Failed</h1>
          <p class="text-lg mb-6">{{ errorMessage }}</p>
          <router-link to="/bns-registration" class="inline-block px-6 py-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 transition-colors">
            Return to Registration
          </router-link>
        </div>
        
        <div v-else class="text-center">
          <div class="flex justify-center mb-6">
            <svg class="h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold mb-4">Account Verified!</h1>
          <p class="text-lg mb-6">Your account has been successfully verified. You can now continue with your BNS registration.</p>
          <router-link to="/bns-registration" class="inline-block px-6 py-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 transition-colors">
            Continue to BNS Registration
          </router-link>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { account } from '../lib/appwrite'
import AppLayout from '../components/AppLayout.vue'

const route = useRoute()
const statusMessage = ref('Verifying your account...')
const errorMessage = ref('Failed to verify your account. Please try again.')
const verifying = ref(true)
const error = ref(false)
const success = ref(false)

onMounted(async () => {
  const userId = route.query.userId as string | undefined
  const secret = route.query.secret as string | undefined

  if (!userId || !secret) {
    error.value = true
    verifying.value = false
    errorMessage.value = 'Missing verification information. Please try the link from your email again.'
    return
  }

  try {
    await account.updateMagicURLSession(userId, secret)
    
    // Successful verification
    setTimeout(() => {
      verifying.value = false
      success.value = true
    }, 1500)
    
  } catch (err) {
    console.error('Failed to verify account:', err)
    
    // Failed verification
    setTimeout(() => {
      verifying.value = false
      error.value = true
    }, 1500)
  }
})
</script>

<style scoped>
/* Add any styling as needed */
</style>