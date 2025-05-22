<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ID } from 'appwrite';
import { account, databases } from '../lib/appwrite';
import AppLayout from '../components/AppLayout.vue';

import heroImg from '../assets/hero-leftv2.png';
import testimonial1 from '../assets/testimonial1.png';
import testimonial2 from '../assets/testimonial2.jpg';
import testimonial3 from '../assets/testimonial3.jpg';

const sending = ref(false);
const email = ref<string | null>(null);
const message = ref<string | null>(null);
const sent = ref(false);
const hasAccount = ref(false);
const isMerchantOrCreator = ref(false);

async function joinBeta() {
  if (!email.value) return;
  sending.value = true;

  try {
    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
      message.value = 'Please enter a valid email address.';
      sending.value = false;
      return;
    }

    // Generate a unique user ID if user does not have an account yet
    const userId = ID.unique();
    // The URL the user will be redirected to after clicking the link
    const redirectUrl = `${window.location.origin}/verify`;

    await account.createMagicURLToken(userId, email.value, redirectUrl);
    
    // Store additional preferences if available
    try {
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID, 
        'shop_users',
        ID.unique(),
        {
          email: email.value,
          isMerchantOrCreator: isMerchantOrCreator.value
        }
      );
    } catch (dbErr) {
      // If database operation fails, still continue with the beta signup
      console.error('Failed to save preferences:', dbErr);
    }
    
    message.value = 'Check your email for the verification link!';
    sent.value = true;
  } catch (err: any) {
    console.error(err);
    message.value = 'Failed to send verification link. Please try again.';
  } finally {
    sending.value = false;
  }
}

onMounted(async () => {
  if (await account.get()) {
    hasAccount.value = true;
  }
});
</script>

<template>
  <AppLayout>
    <!-- Hero Section -->
    <section
      class="px-4 py-16 flex flex-col md:flex-row items-center h-full min-h-screen"
    >
      <div class="md:w-1/2 mb-8 md:mb-0">
        <h5 class="text-fuchsia-100 font-bold mb-4">
          Pay. Play. Shop. Share.
        </h5>
        <h1 class="text-5xl font-bold mb-6">Be Sovereign.</h1>
        <p class="text-xl mb-8">
          Boom makes Bitcoin easy, practical, and borderless, empowering you to
          send, store, and grow—your way.
        </p>
        <div class="space-y-4 flex flex-col">
          <div v-if="hasAccount">
            <p class="text-sm text-gray-400">
              You're already part of the beta! 🚀
            </p>
          </div>
          <div v-else-if="sent">
            <div class="p-4 bg-gray-800 rounded-lg max-w-lg">
              <p class="text-fuchsia-300 font-semibold mb-2">✓ Success!</p>
              <p>{{ message }}</p>
            </div>
          </div>
          <div v-else class="max-w-lg space-y-4">
            <div class="flex flex-col sm:flex-row gap-3">
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="w-full sm:w-2/3 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 outline-none"
                :disabled="sending"
                @keyup.enter="joinBeta"
              />
              <button
                :disabled="sending || !email"
                class="w-full sm:w-1/3 p-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                @click="joinBeta"
              >
                <span v-if="sending" class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span v-else>Join the beta</span>
              </button>
            </div>
            
            <div class="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="merchant" 
                v-model="isMerchantOrCreator"
                class="h-4 w-4 rounded border-gray-600 bg-gray-700 text-fuchsia-500 focus:ring-fuchsia-400 focus:ring-offset-gray-800"
              >
              <label for="merchant" class="text-sm">I am a merchant/creator and I want to learn more about earning in Bitcoin.</label>
            </div>
            
            <p v-if="message" class="text-red-400 text-sm">{{ message }}</p>
          </div>
        </div>
      </div>
      <div class="md:w-1/2">
        <img
          :src="heroImg"
          alt="App Screenshot"
          class="max-w-sm mx-auto"
        />
      </div>
    </section>

    <!-- Features -->
    <section
      class="relative not-prose scroll-mt-[72px]"
      id="features"
    >
      <div
        class="absolute inset-0 pointer-events-none -z-[1]"
        aria-hidden="true"
      >
        <div class="absolute inset-0"></div>
      </div>
      <div
        class="mx-auto max-w-7xl relative px-4 lg:py-20 md:px-6 md:py-16 py-12 text-default"
      >
        <div class="mx-auto max-w-7xl md:px-8 p-4">
          <h2
            class="font-bold font-heading leading-tighter tracking-tighter md:text-4xl text-3xl text-heading text-center md:mb-12"
          >
            What you can do with Boom
          </h2>

          <div class="md:flex md:gap-16 md:flex-row-reverse">
            <div class="md:basis-1/2 self-center">
              <div class="text-lg dark:text-slate-400 mb-12"></div>
              <div class="mx-auto gap-8 grid gap-y-4 md:gap-y-8">
                <div>
                  <div class="flex flex-row max-w-none">
                    <div class="flex justify-center">
                      <svg
                        class="flex justify-center items-center bg-fuchsia-600 dark:bg-fuchsia-700 h-7 mr-2 p-1 rounded-full rtl:ml-2 rtl:mr-0 text-gray-50 w-7"
                        data-icon="tabler:wand"
                        height="1em"
                        viewBox="0 0 24 24"
                        width="1em"
                      >
                        <symbol id="ai:tabler:wand">
                          <path
                            d="M6 21L21 6l-3-3L3 18zm9-15l3 3M9 3a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2m10 10a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2"
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                          ></path>
                        </symbol>
                        <use xlink:href="#ai:tabler:wand"></use>
                      </svg>
                    </div>
                    <div class="mt-0.5">
                      <h3
                        class="rtl:ml-0 ml-2 rtl:mr-2 dark:text-white font-medium leading-6 text-lg"
                      >
                        Build, Sell &amp; Grow—All from Your Wallet
                      </h3>
                      <p
                        class="text-muted mt-3 dark:text-slate-400 ml-2 rtl:ml-0 rtl:mr-2"
                      ></p>
                      <li>
                        Create your own shop in minutes and start selling
                        globally.
                      </li>
                      <li>
                        Manage everything in one place—list products, accept
                        payments, and connect with customers effortlessly.
                      </li>
                      <li>
                        Integrated chat lets you talk directly with buyers,
                        handle orders, and build relationships—all within Boom.
                      </li>
                      <p></p>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="flex flex-row max-w-none">
                    <div class="flex justify-center">
                      <svg
                        class="flex justify-center items-center bg-fuchsia-600 dark:bg-fuchsia-700 h-7 mr-2 p-1 rounded-full rtl:ml-2 rtl:mr-0 text-gray-50 w-7"
                        data-icon="tabler:message"
                        height="1em"
                        viewBox="0 0 24 24"
                        width="1em"
                      >
                        <symbol id="ai:tabler:message">
                          <path
                            d="M8 9h8m-8 4h6m4-9a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                          ></path>
                        </symbol>
                        <use xlink:href="#ai:tabler:message"></use>
                      </svg>
                    </div>
                    <div class="mt-0.5">
                      <h3
                        class="rtl:ml-0 ml-2 rtl:mr-2 dark:text-white font-medium leading-6 text-lg"
                      >
                        Shop, Pay &amp; Connect—Anywhere
                      </h3>
                      <p
                        class="text-muted mt-3 dark:text-slate-400 ml-2 rtl:ml-0 rtl:mr-2"
                      ></p>
                      <li>
                        Pay your friends, local vendors, or online merchants
                        effortlessly.
                      </li>
                      <li>
                        Split bills in a tap, settle payments, and keep
                        track—all with built-in chat for easy coordination.
                        <p></p>
                      </li>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="md:basis-1/2 md:mt-0 mt-10"
              aria-hidden="true"
            >
              <div class="relative m-auto max-w-4xl">
                <img
                  src="https://images.unsplash.com/photo-1576153192621-7a3be10b356e?ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;w=1674&amp;q=80"
                  alt="Colorful Image"
                  loading="lazy"
                  class="mx-auto w-full bg-gray-500 rounded-lg shadow-lg"
                  crossorigin="anonymous"
                  decoding="async"
                  height="500"
                  referrerpolicy="no-referrer"
                  sizes="(max-width: 768px) 100vw, 432px"
                  srcset="
                    https://images.unsplash.com/photo-1576153192621-7a3be10b356e?ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;w=400&amp;q=80&amp;h=400 400w,
                    https://images.unsplash.com/photo-1576153192621-7a3be10b356e?ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;w=768&amp;q=80&amp;h=768 768w
                  "
                  style="
                    object-fit: cover;
                    object-position: center;
                    width: 100%;
                    height: auto;
                    aspect-ratio: 1;
                  "
                  width="500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="relative not-prose scroll-mt-[72px]">
      <div
        class="absolute inset-0 pointer-events-none -z-[1]"
        aria-hidden="true"
      >
        <div class="absolute inset-0"></div>
      </div>
      <div
        class="mx-auto max-w-7xl relative px-4 lg:py-20 md:px-6 md:py-16 py-12 text-default lg:pt-0 md:pt-0 pt-0"
      >
        <div class="mx-auto max-w-7xl md:px-8 p-4">
          <div class="md:flex md:gap-16">
            <div class="md:basis-1/2 self-center">
              <div class="text-lg dark:text-slate-400 mb-12"></div>
              <div class="mx-auto gap-8 grid gap-y-4 md:gap-y-8">
                <div>
                  <div class="flex flex-row max-w-none">
                    <div class="flex justify-center">
                      <svg
                        class="flex justify-center items-center bg-fuchsia-600 dark:bg-fuchsia-700 h-7 mr-2 p-1 rounded-full rtl:ml-2 rtl:mr-0 text-gray-50 w-7"
                        data-icon="tabler:shopping-bag"
                        height="1em"
                        viewBox="0 0 24 24"
                        width="1em"
                      >
                        <symbol id="ai:tabler:shopping-bag">
                          <g
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                          >
                            <path
                              d="M6.331 8H17.67a2 2 0 0 1 1.977 2.304l-1.255 8.152A3 3 0 0 1 15.426 21H8.574a3 3 0 0 1-2.965-2.544l-1.255-8.152A2 2 0 0 1 6.331 8"
                            ></path>
                            <path d="M9 11V6a3 3 0 0 1 6 0v5"></path>
                          </g>
                        </symbol>
                        <use xlink:href="#ai:tabler:shopping-bag"></use>
                      </svg>
                    </div>
                    <div class="mt-0.5">
                      <h3
                        class="rtl:ml-0 ml-2 rtl:mr-2 dark:text-white font-medium leading-6 text-lg"
                      >
                        Stay Informed &amp; in Control
                      </h3>
                      <p
                        class="text-muted mt-3 dark:text-slate-400 ml-2 rtl:ml-0 rtl:mr-2"
                      ></p>
                      <li>
                        Get real-time market updates, stay on top of Bitcoin
                        price movements, and never miss key insights.
                      </li>
                      <li>
                        Access news, discussions, and events—all within the app.
                      </li>
                      <p></p>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="flex flex-row max-w-none">
                    <div class="flex justify-center">
                      <svg
                        class="flex justify-center items-center bg-fuchsia-600 dark:bg-fuchsia-700 h-7 mr-2 p-1 rounded-full rtl:ml-2 rtl:mr-0 text-gray-50 w-7"
                        data-icon="tabler:currency-bitcoin"
                        height="1em"
                        viewBox="0 0 24 24"
                        width="1em"
                      >
                        <symbol id="ai:tabler:currency-bitcoin">
                          <path
                            d="M6 6h8a3 3 0 0 1 0 6a3 3 0 0 1 0 6H6M8 6v12m0-6h6M9 3v3m4-3v3M9 18v3m4-3v3"
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                          ></path>
                        </symbol>
                        <use xlink:href="#ai:tabler:currency-bitcoin"></use>
                      </svg>
                    </div>
                    <div class="mt-0.5">
                      <h3
                        class="rtl:ml-0 ml-2 rtl:mr-2 dark:text-white font-medium leading-6 text-lg"
                      >
                        Secure, Fast &amp; Simple
                      </h3>
                      <p
                        class="text-muted mt-3 dark:text-slate-400 ml-2 rtl:ml-0 rtl:mr-2"
                      ></p>
                      <li>
                        Security, while keeping full ownership of your funds.
                      </li>
                      <li>
                        Experience the simplicity of modern digital payments—no
                        middlemen, no limits.
                      </li>
                      <p></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="md:basis-1/2 md:mt-0 mt-10"
              aria-hidden="true"
            >
              <div class="relative m-auto max-w-4xl">
                <img
                  src="https://images.unsplash.com/photo-1453738773917-9c3eff1db985?ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;w=2070&amp;q=80"
                  alt="Vintage Image"
                  loading="lazy"
                  class="mx-auto w-full bg-gray-500 rounded-lg shadow-lg"
                  crossorigin="anonymous"
                  decoding="async"
                  height="500"
                  referrerpolicy="no-referrer"
                  sizes="(max-width: 768px) 100vw, 432px"
                  srcset="
                    https://images.unsplash.com/photo-1453738773917-9c3eff1db985?ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;w=400&amp;q=80&amp;h=400 400w,
                    https://images.unsplash.com/photo-1453738773917-9c3eff1db985?ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;w=768&amp;q=80&amp;h=768 768w
                  "
                  style="
                    object-fit: cover;
                    object-position: center;
                    width: 100%;
                    height: auto;
                    aspect-ratio: 1;
                  "
                  width="500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="relative not-prose scroll-mt-[72px]">
      <div
        class="absolute inset-0 pointer-events-none -z-[1]"
        aria-hidden="true"
      >
        <div class="absolute inset-0"></div>
      </div>
      <div
        class="mx-auto relative px-4 lg:py-20 md:px-6 md:py-16 py-12 text-default max-w-6xl"
      >
        <div class="max-w-3xl mb-8 md:mb-12 md:mx-auto text-center">
          <h2
            class="font-bold font-heading leading-tighter tracking-tighter md:text-4xl text-3xl text-heading"
          >
            What our users say?
          </h2>
        </div>
        <div class="grid gap-6 lg:grid-cols-3 sm:grid-cols-2">
          <div class="flex h-auto">
            <div
              class="flex flex-col dark:border dark:border-slate-600 dark:shadow-none md:p-6 p-4 rounded-md shadow-xl"
            >
              <blockquote class="flex-auto">
                <p class="text-muted">
                  " I've been Stacking from the beginning, and Boom is the
                  simplest crypto wallet that I've used. "
                </p>
              </blockquote>
              <hr class="dark:border-slate-600 border-slate-200 my-4" />
              <div class="flex items-center">
                <div
                  class="rounded-full border border-slate-200 dark:border-slate-600 h-10 w-10"
                >
                  <img
                    :src="testimonial1"
                    alt="sammiek6720 Image"
                    loading="lazy"
                    class="rounded-full border border-slate-200 dark:border-slate-600 h-10 w-10 min-h-full min-w-full"
                    crossorigin="anonymous"
                    decoding="async"
                    height="40"
                    referrerpolicy="no-referrer"
                    sizes="40px"
                    style="
                      object-fit: cover;
                      object-position: top left;
                      width: 40px;
                      height: 40px;
                    "
                    width="40"
                  />
                </div>
                <div class="rtl:ml-0 grow ml-3 rtl:mr-3">
                  <p class="text-base font-semibold">sammiek6720</p>
                  <p class="text-muted text-xs">User</p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex h-auto">
            <div
              class="flex flex-col dark:border dark:border-slate-600 dark:shadow-none md:p-6 p-4 rounded-md shadow-xl"
            >
              <blockquote class="flex-auto">
                <p class="text-muted">
                  " The Boom team are true Stacks OG's who understand the value
                  of building good platforms for this ecosystem. "
                </p>
              </blockquote>
              <hr class="dark:border-slate-600 border-slate-200 my-4" />
              <div class="flex items-center">
                <div
                  class="rounded-full border border-slate-200 dark:border-slate-600 h-10 w-10"
                >
                  <img
                    :src="testimonial2"
                    alt="Muneeb Ali Image"
                    loading="lazy"
                    class="rounded-full border border-slate-200 dark:border-slate-600 h-10 w-10 min-h-full min-w-full"
                    crossorigin="anonymous"
                    decoding="async"
                    height="40"
                    referrerpolicy="no-referrer"
                    sizes="40px"
                    style="
                      object-fit: cover;
                      object-position: top left;
                      width: 40px;
                      height: 40px;
                    "
                    width="40"
                  />
                </div>
                <div class="rtl:ml-0 grow ml-3 rtl:mr-3">
                  <p class="text-base font-semibold">Muneeb Ali</p>
                  <p class="text-muted text-xs">Stacks Founder</p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex h-auto">
            <div
              class="flex flex-col dark:border dark:border-slate-600 dark:shadow-none md:p-6 p-4 rounded-md shadow-xl"
            >
              <blockquote class="flex-auto">
                <p class="text-muted">
                  " This will become an integral element of our online business
                  tech stack. "
                </p>
              </blockquote>
              <hr class="dark:border-slate-600 border-slate-200 my-4" />
              <div class="flex items-center">
                <div
                  class="rounded-full border border-slate-200 dark:border-slate-600 h-10 w-10"
                >
                  <img
                    :src="testimonial3"
                    alt="@Electra_Frost Image"
                    loading="lazy"
                    class="rounded-full border border-slate-200 dark:border-slate-600 h-10 w-10 min-h-full min-w-full"
                    crossorigin="anonymous"
                    decoding="async"
                    height="40"
                    referrerpolicy="no-referrer"
                    sizes="40px"
                    style="
                      object-fit: cover;
                      object-position: top left;
                      width: 40px;
                      height: 40px;
                    "
                    width="40"
                  />
                </div>
                <div class="rtl:ml-0 grow ml-3 rtl:mr-3">
                  <p class="text-base font-semibold">@Electra_Frost</p>
                  <p class="text-muted text-xs">Accounting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex justify-center font-medium md:mt-12 mt-8 mx-auto w-fit"
        >
          <a
            class="btn-secondary"
            href="/testimonials"
            rel="noopener noreferrer"
            target="_blank"
            >Read more testimonials<svg
              class="h-5 w-5 -mr-1.5 inline-block ml-1 rtl:-ml-1.5 rtl:mr-1"
              data-icon="tabler:chevron-right"
              height="1em"
              viewBox="0 0 24 24"
              width="1em"
            >
              <symbol id="ai:tabler:chevron-right">
                <path
                  d="m9 6l6 6l-6 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </symbol>
              <use xlink:href="#ai:tabler:chevron-right"></use></svg
          ></a>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="relative not-prose scroll-mt-[72px]">
      <div
        class="absolute inset-0 pointer-events-none -z-[1]"
        aria-hidden="true"
      >
        <div class="absolute inset-0"></div>
      </div>
      <div
        class="mx-auto max-w-7xl relative px-4 lg:py-20 md:px-6 md:py-16 py-12 text-default"
      >
        <div class="max-w-3xl mb-8 md:mb-12 md:mx-auto text-center">
          <h2
            class="font-bold font-heading leading-tighter tracking-tighter md:text-4xl text-3xl text-heading"
          >
            Frequently asked questions
          </h2>
        </div>
        <div class="mx-auto gap-8 grid gap-y-8 md:gap-y-12 sm:grid-cols-2">
          <div>
            <div class="flex flex-row max-w-none">
              <div class="flex justify-center">
                <svg
                  class="w-6 h-6 flex-shrink-0 mr-2 mt-1 rtl:ml-2 rtl:mr-0 text-primary"
                  data-icon="tabler:chevron-right"
                  height="1em"
                  viewBox="0 0 24 24"
                  width="1em"
                >
                  <use xlink:href="#ai:tabler:chevron-right"></use>
                </svg>
              </div>
              <div class="mt-0.5">
                <h3 class="font-bold text-xl">
                  How do I install Boom Wallet on my device?
                </h3>
                <p class="text-muted mt-3">
                  Boom Wallet is a Progressive Web App (PWA), which means you
                  can install it directly from your web browser without needing
                  to visit an app store. Simply navigate to our website using
                  your mobile device or desktop browser. You'll see a prompt or
                  an option in your browser menu to "Add to Home Screen" or
                  "Install App." Tap that, and Boom Wallet will be added to your
                  device for quick and easy access.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div class="flex flex-row max-w-none">
              <div class="flex justify-center">
                <svg
                  class="w-6 h-6 flex-shrink-0 mr-2 mt-1 rtl:ml-2 rtl:mr-0 text-primary"
                  data-icon="tabler:chevron-right"
                  height="1em"
                  viewBox="0 0 24 24"
                  width="1em"
                >
                  <use xlink:href="#ai:tabler:chevron-right"></use>
                </svg>
              </div>
              <div class="mt-0.5">
                <h3 class="font-bold text-xl">
                  Is Boom Wallet secure, and do I control my private keys?
                </h3>
                <p class="text-muted mt-3">
                  Absolutely! Your security and privacy are our top priorities.
                  With Boom Wallet, you have full control over your private
                  keys—we never have access to them or your funds. This means
                  your crypto assets are securely stored, and only you can
                  authorize transactions. Remember the golden rule: "Your keys,
                  your crypto—no exceptions."
                </p>
              </div>
            </div>
          </div>
          <div>
            <div class="flex flex-row max-w-none">
              <div class="flex justify-center">
                <svg
                  class="w-6 h-6 flex-shrink-0 mr-2 mt-1 rtl:ml-2 rtl:mr-0 text-primary"
                  data-icon="tabler:chevron-right"
                  height="1em"
                  viewBox="0 0 24 24"
                  width="1em"
                >
                  <use xlink:href="#ai:tabler:chevron-right"></use>
                </svg>
              </div>
              <div class="mt-0.5">
                <h3 class="font-bold text-xl">
                  What is Stacks Pay, and how does it work with Boom Wallet and
                  Boom Smart Shops?
                </h3>
                <p class="text-muted mt-3">
                  Stacks Pay is a payment protocol that simplifies crypto
                  transactions by using easy links and QR codes—think of it like
                  the convenience of Lightning Network, but without the
                  complexity. In Boom Wallet, you can send and receive payments
                  effortlessly using Stacks Pay. For merchants using Boom Smart
                  Shops, Stacks Pay enables seamless acceptance of Bitcoin and
                  multiple Stacks tokens through smart contracts, making
                  transactions smooth and hassle-free.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div class="flex flex-row max-w-none">
              <div class="flex justify-center">
                <svg
                  class="w-6 h-6 flex-shrink-0 mr-2 mt-1 rtl:ml-2 rtl:mr-0 text-primary"
                  data-icon="tabler:chevron-right"
                  height="1em"
                  viewBox="0 0 24 24"
                  width="1em"
                >
                  <use xlink:href="#ai:tabler:chevron-right"></use>
                </svg>
              </div>
              <div class="mt-0.5">
                <h3 class="font-bold text-xl">
                  How do I use the in-wallet chat feature to communicate with
                  friends and merchants?
                </h3>
                <p class="text-muted mt-3">
                  Our in-app chat lets you connect directly with friends and
                  merchants without leaving Boom Wallet. To start chatting, open
                  your wallet and select the contact or merchant you wish to
                  communicate with. You can securely exchange messages without
                  exposing any personal information, enhancing your crypto
                  experience by keeping all your interactions in one secure
                  place.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div class="flex flex-row max-w-none">
              <div class="flex justify-center">
                <svg
                  class="w-6 h-6 flex-shrink-0 mr-2 mt-1 rtl:ml-2 rtl:mr-0 text-primary"
                  data-icon="tabler:chevron-right"
                  height="1em"
                  viewBox="0 0 24 24"
                  width="1em"
                >
                  <use xlink:href="#ai:tabler:chevron-right"></use>
                </svg>
              </div>
              <div class="mt-0.5">
                <h3 class="font-bold text-xl">
                  How does Boom leverage sBTC to expand Bitcoin's utility and build the Bitcoin economy?
                </h3>
                <p class="text-muted mt-3">
                  Boom leverages sBTC to expand Bitcoin's utility and build the Bitcoin economy by integrating it into its ecosystem of products, making it easier for users to trade, build, and connect within the Bitcoin network.
                  Here's how Boom leverages sBTC:
                </p>
                  <ul>
                    <li><strong>Boom Wallet:</strong> Facilitates BTC transactions, enabling users to pay and receive sBTC directly from their Bitcoin holdings without involving custodians.
                    </li>
                    <li><strong>Boom Smart Shops:</strong> Enables the selling of digital products and services, with instant transactions in sBTC secured by Bitcoin's Layer 1. For example, a coder can sell a course and receive payment in sBTC.
                    </li>
                    <li><strong>Boom Chat:</strong> Provides decentralized communication channels, fostering secure and trustless interactions between users.
                    </li>
                    <li><strong>Smart Contracts:</strong> Allows entrepreneurs to offer subscriptions and other services via sBTC-powered smart contracts. Boom handles the technical aspects, allowing users to generate recurring revenue.
                    </li>   
                  </ul>
                  <br />
                  By integrating sBTC into its products, Boom simplifies the process for users to engage in the Bitcoin economy, fostering growth and expanding Bitcoin's utility.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
</template>
