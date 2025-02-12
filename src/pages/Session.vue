<template>
  <div class="min-h-screen bg-zinc-900 text-white">
    <div class="max-w-[1280px] mx-auto" v-if="verifying">
      <h1 class="text-4xl font-bold mt-10">Verification</h1>
      <p class="mt-4">Verifying your account...</p>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
// Import your Appwrite configuration
import { account } from '../lib/appwrite' // adjust path as needed

const route = useRoute() 
const status = ref(false)
const verifying = ref(true)

onMounted(async () => {
  console.log('session mounted')
  const userId = route.query.userId as string | undefined
  const secret = route.query.secret as string | undefined

  if (!userId || !secret) {
    // Missing parameters, handle error or redirect
    console.error('Missing userId or secret in URL.')
    router.replace('/login') // redirect home if parameters missing
    return
  }

  try {
    const userSession = await account.updateMagicURLSession(userId, secret)
    console.log('Account verified successfully:', userSession)
    const result = await account.deleteSession(userSession.$id);
    console.log('Session deleted successfully:', result);
  } catch (err) {
    console.error('Failed to verify account:', err)
    // TODO: handle error - could redirect to a dedicated error page or show a message
    router.replace('/')
  }
})
</script>

<style scoped>
/* Add any styling as needed */
</style>
