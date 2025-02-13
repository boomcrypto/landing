<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="px-4 py-12 mt-12 border-t border-gray-800">
    <div class="grid md:grid-cols-4 gap-8">
      <div>
        <h4 class="font-bold mb-4">Product</h4>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-400 hover:text-white">Features</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white">Security</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white">Team</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold mb-4">Platform</h4>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-400 hover:text-white">Smart Shops</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white">Stacks Pay API</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white">Analytics</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold mb-4">Support</h4>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-400 hover:text-white">Docs</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white">Community Forum</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white">Status</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold mb-4">Company</h4>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-400 hover:text-white">About</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white">Blog</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white">News</a></li>
        </ul>
      </div>
    </div>
    <div class="mt-12 text-center text-gray-400">
      <p>Made by Boom Platforms. © {{ currentYear }} All rights reserved.</p>
    </div>
  </footer>
</template>
