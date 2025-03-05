<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer
    class="relative not-prose border-gray-200 border-t dark:border-slate-800"
  >
    <div
      class="absolute inset-0 pointer-events-none dark:bg-dark"
      aria-hidden="true"
    ></div>
    <div class="mx-auto max-w-7xl relative px-4 sm:px-6 dark:text-slate-300">
      <div class="grid gap-y-8 gap-4 grid-cols-12 md:py-12 py-8 sm:gap-8">
        <div class="col-span-12 lg:col-span-4">
          <div class="mb-2">
            <a
              class="font-bold text-xl inline-block"
              href="/"
              >Boom</a
            >
          </div>
          <div class="flex gap-1 text-muted text-sm">
            <a
              class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
              href="/terms"
              >Terms</a
            >
            ·
            <a
              class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
              href="/privacy"
              >Privacy Policy</a
            >
          </div>
        </div>
        <div class="col-span-6 lg:col-span-2 md:col-span-3">
          <div class="mb-2 dark:text-gray-300 font-medium">Product</div>
          <ul class="text-sm">
            <li class="mb-2">
              <a
                class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
                href="/#features"
                >Features</a
              >
            </li>
            <!-- <li class="mb-2">
              <a
                class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
                href="/security"
                >Security</a
              >
            </li> -->
            <li class="mb-2">
              <a
                class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
                href="/team"
                >Team</a
              >
            </li>
            <li class="mb-2">
              <a
                class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
                href="/testimonials"
                >Customer stories</a
              >
            </li>
       <!--     <li class="mb-2">
              <a
                class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
                href="/resoures"
                >Resources</a
              >
            </li> -->
          </ul>
        </div>
        <div class="col-span-6 lg:col-span-2 md:col-span-3">
          <div class="mb-2 dark:text-gray-300 font-medium">Platform</div>
          <ul class="text-sm">
            <li class="mb-2">
              <a
                class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
                href="https://app.boom.money/"
                >Boom</a
              >
            </li>
            <li class="mb-2">
              <a
                class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
                href="https://stackspay.org/"
                >Stacks Pay</a
              >
            </li>
            <li class="mb-2">
              <a
                class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
                href="https://github.com/boomcrypto/matrix-stacks-auth"
                >Matrix Integration</a
              >
            </li>
          </ul>
        </div>
        <div class="col-span-6 lg:col-span-2 md:col-span-3">
          <div class="mb-2 dark:text-gray-300 font-medium">Support</div>
          <ul class="text-sm">
            <li class="mb-2">
              <a
                class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
                href="https://docs.boom.money"
                >Docs</a
              >
            </li>
            <li class="mb-2">
              <a
                class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
                href="https://discord.gg/CwguEnbJAF"
                >Community Forum</a
              >
            </li>
          </ul>
        </div>
        <div class="col-span-6 lg:col-span-2 md:col-span-3">
          <div class="mb-2 dark:text-gray-300 font-medium">Company</div>
          <ul class="text-sm">
            <li class="mb-2">
              <a
                class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
                href="/about"
                >About</a
              >
            </li>
            <li class="mb-2">
              <a
                class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
                href="https://blog.boom.money/"
                >Blog</a
              >
            </li>
            <li class="mb-2">
              <a
                class="text-muted dark:text-gray-400 duration-150 ease-in-out hover:text-gray-700 hover:underline transition"
                href="/media"
                >Press</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="md:flex md:items-center md:justify-between md:py-8 py-6">
        <ul
          class="flex -ml-2 mb-4 md:mb-0 md:ml-4 md:order-1 rtl:-mr-2 rtl:md:ml-0 rtl:md:mr-4 rtl:ml-0"
        >
          <li>
            <a
              class="text-muted dark:text-gray-400 dark:focus:ring-gray-700 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 inline-flex items-center p-2.5 rounded-lg text-sm"
              href="https://x.com/boom_wallet"
              aria-label="X"
              ><svg
                class="h-5 w-5"
                data-icon="tabler:brand-x"
                height="1em"
                viewBox="0 0 24 24"
                width="1em"
              >
                <symbol id="ai:tabler:brand-x">
                  <path
                    d="m4 4l11.733 16H20L8.267 4zm0 16l6.768-6.768m2.46-2.46L20 4"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </symbol>
                <use xlink:href="#ai:tabler:brand-x"></use></svg
            ></a>
          </li>
          <li>
            <a
              class="text-muted dark:text-gray-400 dark:focus:ring-gray-700 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 inline-flex items-center p-2.5 rounded-lg text-sm"
              href="https://github.com/boomcrypto"
              aria-label="Github"
              ><svg
                class="h-5 w-5"
                data-icon="tabler:brand-github"
                height="1em"
                viewBox="0 0 24 24"
                width="1em"
              >
                <symbol id="ai:tabler:brand-github">
                  <path
                    d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </symbol>
                <use xlink:href="#ai:tabler:brand-github"></use></svg
            ></a>
          </li>
        </ul>
        <div class="text-sm dark:text-muted mr-4">
          <img
            src="/favicon-128x128.png"
            alt="Boom logo"
            loading="lazy"
            class="h-5 w-5 bg-cover float-left md:-mt-0.5 md:h-6 md:w-6 mr-1.5 rounded-sm rtl:float-right rtl:ml-1.5 rtl:mr-0"
          />Made by
          <span
            class="dark:text-muted"
            >Boom Platforms</span>
          
          ·{{ currentYear }} All rights reserved.
        </div>
      </div>
    </div>
  </footer>
</template>
