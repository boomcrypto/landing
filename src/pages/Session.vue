<template>
  <AppLayout>
  <div class="min-h-screen bg-zinc-900 text-white">
    <div class="max-w-[1280px] mx-auto" v-if="verifying">
      <h1 class="text-4xl font-bold mt-10">Verification</h1>
      <p class="mt-4">{{statusMessage}}</p>
    </div>
    
  </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// Import your Appwrite configuration
import { account } from '../lib/appwrite' // adjust path as needed

const route = useRoute()
const router = useRouter()
const statusMessage = ref('Verifying your account...')
const verifying = ref(true)

onMounted(async () => {
  const userId = route.query.userId as string | undefined
  const secret = route.query.secret as string | undefined

  if (!userId || !secret) {
    // Missing parameters, handle error or redirect
    console.error('Missing userId or secret in URL.')
    router.replace('/login') // redirect home if parameters missing
    return
  }

  try {
    await account.updateMagicURLSession(userId, secret)
    statusMessage.value = 'Account verified successfully! Redirecting to home...'
    
  } catch (err) {
    console.error('Failed to verify account:', err)
    // TODO: handle error - could redirect to a dedicated error page or show a message
    router.replace('/')
  } finally {
    verifying.value = false
    router.replace('/')
  }
})
</script>

<style scoped>
/* Add any styling as needed */
</style>
