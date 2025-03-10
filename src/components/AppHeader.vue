<script setup lang="ts">
import { ref } from 'vue'
import logo from '../assets/boom-24.svg'

const isMenuExpanded = ref(false)

const toggleMenu = () => {
  isMenuExpanded.value = !isMenuExpanded.value
}
</script>

<template>
  <header class="mx-auto w-full border-b border-gray-50/0 ease-in-out flex-none sticky top-0 transition-[opacity] z-40 scroll bg-zinc-900" data-aw-sticky-header="">
    <div class="absolute inset-0"></div>
    <div class="mx-auto max-w-7xl relative md:px-6 text-default md:grid md:grid-cols-3 md:items-center px-3 py-3 w-full">
      <div class="flex justify-between">
        <a class="flex items-center" href="/">
          <span class="rtl:ml-0 ml-2 rtl:mr-2 dark:text-white font-bold md:text-xl self-center text-2xl text-gray-900 whitespace-nowrap">
            <div style="display:flex">
              <img :src="logo" style="margin-right:8px"> Boom
            </div>
          </span>
        </a>
        <div class="flex items-center md:hidden">
          <button 
            type="button" 
            aria-label="Toggle Menu" 
            class="flex justify-center items-center flex-col group h-12 rounded w-12" 
            :class="{ 'expanded': isMenuExpanded }"
            @click="toggleMenu"
          >
            <span class="sr-only">Toggle Menu</span>
            <span class="transition bg-white duration-200 ease h-0.5 my-1 opacity-80 rounded-full transform w-6" :class="{ 'rotate-45 translate-y-2.5': isMenuExpanded }"></span>
            <span class="transition bg-white duration-200 ease h-0.5 my-1 opacity-80 rounded-full transform w-6" :class="{ 'opacity-0': isMenuExpanded }"></span>
            <span class="transition bg-white duration-200 ease h-0.5 my-1 opacity-80 rounded-full transform w-6" :class="{ '-rotate-45 -translate-y-2.5': isMenuExpanded }"></span>
          </button>
        </div>
      </div>
      <nav 
        aria-label="Main navigation" 
        class="items-center md:w-auto w-full md:flex md:justify-self-center md:mx-5 md:overflow-x-auto md:overflow-y-visible overflow-x-hidden overflow-y-auto text-default"
        :class="{ 'hidden': !isMenuExpanded }"
      >
        <ul class="flex flex-col font-medium md:flex-row md:justify-center md:self-center md:text-[0.9375rem] md:w-auto text-xl tracking-[0.01rem] w-full">
          <li><a class="flex items-center dark:hover:text-white hover:text-link px-4 py-3" href="#features">Features</a></li>
          <!-- <li><router-link class="flex items-center dark:hover:text-white hover:text-link px-4 py-3" to="/merchants">Merchants/Creators</router-link></li> -->
          <li><a class="flex items-center dark:hover:text-white hover:text-link px-4 py-3" href="https://blog.boom.money">Blog</a></li>
          <li><a class="flex items-center dark:hover:text-white hover:text-link px-4 py-3" href="https://docs.boom.money">Docs</a></li>
        </ul>
      </nav>
      <div class="items-center md:w-auto w-full hidden md:flex bottom-0 fixed justify-end left-0 md:justify-self-end md:mb-0 md:p-0 md:self-center md:static p-3 rtl:left-auto rtl:right-0">
        <div class="flex items-center justify-between md:w-auto w-full">
          <div class="flex">
            <button type="button" aria-label="Toggle between Dark and Light mode" class="text-muted dark:text-gray-400 dark:focus:ring-gray-700 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 inline-flex items-center p-2.5 rounded-lg text-sm">
              <svg class="w-6 h-6 md:h-5 md:inline-block md:w-5" data-icon="tabler:sun" height="1em" viewBox="0 0 24 24" width="1em">
                <path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
