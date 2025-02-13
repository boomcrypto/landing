<script setup lang="ts">
import { ref } from 'vue'
import { ID } from 'appwrite'
import { account } from '../lib/appwrite'
import AppLayout from '../components/AppLayout.vue'

import heroImg from '../assets/hero-leftv2.png'
import testimonial1 from '../assets/testimonial1.png'
import testimonial2 from '../assets/testimonial2.jpg'
import testimonial3 from '../assets/testimonial3.jpg'

const sending = ref(false)
const email = ref<string|null>(null)
const message = ref<string|null>(null)

async function joinBeta() {
  if (!email.value) return
  sending.value = true

  try {
    // Generate a unique user ID if user does not have an account yet
    const userId = ID.unique()
    // The URL the user will be redirected to after clicking the link
    const redirectUrl = `${window.location.origin}/session`

    await account.createMagicURLToken(userId, email.value, redirectUrl)
    message.value = 'Check your email for the verification link!'
  } catch (err: any) {
    console.error(err)
    message.value = 'Failed to send verification link. Please try again.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <AppLayout>
    <!-- Hero Section -->
    <section class="px-4 py-16 flex flex-col md:flex-row items-center h-full">
      <div class="md:w-1/2 mb-8 md:mb-0">
        <h5 class="text-fuchsia-100 font-bold mb-4">EXPERIENCE GLOBAL FINANCIAL FREEDOM</h5>
        <h1 class="text-5xl font-bold mb-6">Live the Bitcoin Economy</h1>
        <p class="text-xl mb-8">
          Boom makes Bitcoin easy, practical, and borderless, empowering you to send, store, and grow—your way.
        </p>
        <div class="space-y-4 flex flex-col">
          <input v-model="email" type="email" :placeholder="message || 'Enter your email'" class="w-1/2 p-3 rounded-lg bg-gray-800 border border-gray-700">
          <button class="w-1/2 p-3 rounded-lg bg-fuchsia-400 hover:bg-fuchsia-700 transition" @click="joinBeta">
            Join the Beta
          </button>
        </div>
      </div>
      <div class="md:w-1/2">
        <img :src="heroImg" alt="App Screenshot" class="max-w-sm mx-auto">
      </div>
    </section>

    <!-- Features -->
    <section class="relative not-prose scroll-mt-[72px]">
      <div class="absolute inset-0 pointer-events-none -z-[1]" aria-hidden="true">
        <div class="absolute inset-0"></div>
      </div>
      <div class="mx-auto max-w-7xl relative px-4 lg:py-20 md:px-6 md:py-16 py-12 text-default">
        <div class="max-w-3xl mb-8 md:mb-12 md:mx-auto text-center">
          <h2 class="font-bold font-heading leading-tighter tracking-tighter md:text-4xl text-3xl text-heading">What You Can Do with Boom</h2>
        </div>

        <div class="mx-auto max-w-7xl md:px-8 p-4">
          <div class="md:flex md:gap-16 md:flex-row-reverse">
            <div class="md:basis-1/2 self-center">
              <div class="mx-auto gap-8 grid gap-y-4 md:gap-y-8">
                <div>
                  <div class="flex flex-row max-w-none">
                    <div class="flex justify-center">
                      <svg class="flex justify-center items-center bg-fuchsia-600 dark:bg-fuchsia-700 h-7 mr-2 p-1 rounded-full rtl:ml-2 rtl:mr-0 text-gray-50 w-7" data-icon="tabler:wand" height="1em" viewBox="0 0 24 24" width="1em">
                        <path d="M6 21L21 6l-3-3L3 18zm9-15l3 3M9 3a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2m10 10a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                      </svg>
                    </div>
                    <div class="mt-0.5">
                      <h3 class="rtl:ml-0 ml-2 rtl:mr-2 dark:text-white font-medium leading-6 text-lg">Build, Sell &amp; Grow—All from Your Wallet</h3>
                      <ul class="text-muted mt-3 dark:text-slate-400 ml-2 rtl:ml-0 rtl:mr-2">
                        <li>Create your own shop in minutes and start selling globally.</li>
                        <li>Manage everything in one place—list products, accept payments, and connect with customers effortlessly.</li>
                        <li>Integrated chat lets you talk directly with buyers, handle orders, and build relationships—all within Boom.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <!-- Additional features... -->
              </div>
            </div>
            <div class="md:basis-1/2 md:mt-0 mt-10" aria-hidden="true">
              <div class="relative m-auto max-w-4xl">
                <img src="https://images.unsplash.com/photo-1576153192621-7a3be10b356e?ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;w=1674&amp;q=80" alt="Colorful Image" loading="lazy" class="mx-auto w-full bg-gray-500 rounded-lg shadow-lg">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="relative not-prose scroll-mt-[72px]">
      <div class="mx-auto relative px-4 lg:py-20 md:px-6 md:py-16 py-12 text-default max-w-6xl">
        <div class="max-w-3xl mb-8 md:mb-12 md:mx-auto text-center">
          <h2 class="font-bold font-heading leading-tighter tracking-tighter md:text-4xl text-3xl text-heading">What our users say?</h2>
        </div>
        <div class="grid gap-6 lg:grid-cols-3 sm:grid-cols-2">
          <div class="flex h-auto">
            <div class="flex flex-col dark:border dark:border-slate-600 dark:shadow-none md:p-6 p-4 rounded-md shadow-xl">
              <blockquote class="flex-auto">
                <p class="text-muted">" I've been Stacking from the beginning, and Boom is the simplest crypto wallet that I've used. "</p>
              </blockquote>
              <hr class="dark:border-slate-600 border-slate-200 my-4">
              <div class="flex items-center">
                <div class="rounded-full border border-slate-200 dark:border-slate-600 h-10 w-10">
                  <img :src="testimonial1" alt="sammiek6720 Image" class="rounded-full border border-slate-200 dark:border-slate-600 h-10 w-10">
                </div>
                <div class="rtl:ml-0 grow ml-3 rtl:mr-3">
                  <p class="text-base font-semibold">sammiek6720</p>
                  <p class="text-muted text-xs">User</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Additional testimonials... -->
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="relative not-prose scroll-mt-[72px]">
      <div class="mx-auto max-w-7xl relative px-4 lg:py-20 md:px-6 md:py-16 py-12 text-default">
        <div class="max-w-3xl mb-8 md:mb-12 md:mx-auto text-center">
          <h2 class="font-bold font-heading leading-tighter tracking-tighter md:text-4xl text-3xl text-heading">Frequently asked questions</h2>
        </div>
        <div class="mx-auto gap-8 grid gap-y-8 md:gap-y-12 sm:grid-cols-2">
          <div>
            <div class="flex flex-row max-w-none">
              <div class="flex justify-center">
                <svg class="w-6 h-6 flex-shrink-0 mr-2 mt-1 rtl:ml-2 rtl:mr-0 text-primary" data-icon="tabler:chevron-right" height="1em" viewBox="0 0 24 24" width="1em">
                  <path d="m9 6l6 6l-6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
              </div>
              <div class="mt-0.5">
                <h3 class="font-bold text-xl">How do I install Boom Wallet on my device?</h3>
                <p class="text-muted mt-3">Boom Wallet is a Progressive Web App (PWA), which means you can install it directly from your web browser without needing to visit an app store. Simply navigate to our website using your mobile device or desktop browser. You'll see a prompt or an option in your browser menu to "Add to Home Screen" or "Install App." Tap that, and Boom Wallet will be added to your device for quick and easy access.</p>
              </div>
            </div>
          </div>
          <!-- Additional FAQs... -->
        </div>
      </div>
    </section>
  </AppLayout>
</template>
