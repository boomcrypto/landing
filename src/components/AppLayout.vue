<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-zinc-900 text-white">
    <div class="max-w-[1280px] mx-auto">
      <AppHeader />
      <main>
        <slot></slot>
      </main>
      <AppFooter />
    </div>
  </div>
</template>
