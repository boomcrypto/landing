<script setup lang="ts">
import { ref } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import WaitlistInfo from '../components/WaitlistInfo.vue';
// import { account } from '../lib/appwrite';

const email = ref('');
const name = ref('');
const company = ref('');
const loading = ref(false);
const error = ref('');
const successMessage = ref('');

const handleSubmit = async () => {
  if (!email.value || !name.value) {
    error.value = 'Please fill out all required fields';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // This is a mockup of the signup process - in production this would connect to a real API
    // await account.createMagicURLSession(
    //   email.value,
    //   'https://boom.money/verify'
    // );
    
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    successMessage.value = 'Thanks for your interest! We\'ve added you to our waitlist for the Basic plan.';
    email.value = '';
    name.value = '';
    company.value = '';
  } catch (err: any) {
    console.error('Signup error:', err);
    error.value = err?.message || 'Failed to sign up. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <AppLayout>
    <section class="py-16 px-4">
      <div class="max-w-xl mx-auto">
        <div class="flex items-center justify-center mb-10">
          <div class="bg-fuchsia-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            BASIC PLAN
          </div>
        </div>
        
        <h1 class="text-4xl font-bold text-center mb-6">Join Our Basic Plan Waitlist</h1>
        <p class="text-xl text-center mb-12">Sign up to be notified when Boom Smart Shops launches and get early access to our Basic plan.</p>
        
        <div class="bg-zinc-800 rounded-xl p-8">
          <WaitlistInfo />
          
          <div v-if="successMessage" class="mb-6 p-4 bg-green-800/30 border border-green-600 rounded-lg">
            <p>{{ successMessage }}</p>
          </div>

          <div v-if="error" class="mb-6 p-4 bg-red-800/30 border border-red-600 rounded-lg">
            <p>{{ error }}</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                id="name"
                v-model="name"
                required
                class="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium mb-2">Email Address *</label>
              <input
                type="email"
                id="email"
                v-model="email"
                required
                class="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label for="company" class="block text-sm font-medium mb-2">Company (Optional)</label>
              <input
                type="text"
                id="company"
                v-model="company"
                class="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="Your company name"
              />
            </div>
            
            <div class="pt-4">
              <button
                type="submit"
                class="w-full py-4 rounded-lg border border-fuchsia-500 text-fuchsia-500 font-semibold hover:bg-fuchsia-500 hover:text-white transition-colors flex justify-center items-center"
                :disabled="loading"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Submitting...' : 'Join the Waitlist' }}
              </button>
            </div>
          </form>
          
          <div class="mt-6 pt-6 border-t border-zinc-700 text-center text-sm text-zinc-400">
            <p>Current pricing: <span class="font-bold text-white">2%</span> per transaction</p>
            <p class="mt-2">Up to 10 products, basic store customization, and Bitcoin payment processing.</p>
            <p class="mt-4">By signing up, you agree to our <a href="/terms" class="text-fuchsia-400 hover:underline">Terms of Service</a> and <a href="/privacy" class="text-fuchsia-400 hover:underline">Privacy Policy</a>.</p>
          </div>
        </div>
        
        <div class="mt-10 text-center">
          <p class="text-lg mb-4">Looking for more advanced features?</p>
          <a href="/pro-signup" class="px-6 py-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition font-semibold">
            Check out our Pro Plan
          </a>
        </div>
      </div>
    </section>
  </AppLayout>
</template>