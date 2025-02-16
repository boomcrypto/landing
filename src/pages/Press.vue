<template>
  <AppLayout>
      <div class="max-w-6xl mx-auto px-4 py-12">
    <!-- Press Coverage Section -->
    <!-- <section class="mb-16">
      <h1 class="text-4xl font-bold mb-8">Press & Media</h1> -->
      
      <!-- Featured Press -->
      <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"> -->

        <!-- Press Card -->
        <!-- <div class="border rounded-lg overflow-hidden">
          <img src="https://placehold.co/400x200" alt="CryptoNews Coverage" class="w-full object-cover" />
          <div class="p-4">
            <span class="text-sm">January 15, 2024</span>
            <h3 class="text-xl font-semibold mb-2">Boom Revolutionizes Social Bitcoin Wallets</h3>
            <p class="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
            <a href="#" class="font-medium">Read More →</a>
          </div>
        </div> -->

        <!-- Press Card -->
        <!-- <div class="border rounded-lg overflow-hidden">
          <img src="https://placehold.co/400x200" alt="TechDaily Coverage" class="w-full object-cover" />
          <div class="p-4">
            <span class="text-sm">February 1, 2024</span>
            <h3 class="text-xl font-semibold mb-2">The Future of Social Crypto</h3>
            <p class="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
            <a href="#" class="font-medium">Read More →</a>
          </div>
        </div> -->

        <!-- Press Card -->
        <!-- <div class="border rounded-lg overflow-hidden">
          <img src="https://placehold.co/400x200" alt="BlockchainWeekly Coverage" class="w-full object-cover" />
          <div class="p-4">
            <span class="text-sm">February 10, 2024</span>
            <h3 class="text-xl font-semibold mb-2">Boom Secures Major Partnership</h3>
            <p class="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
            <a href="#" class="font-medium">Read More →</a>
          </div>
        </div>
      </div> -->

      <!-- Press Releases -->
      <!-- <div class="mb-16">
        <h2 class="text-2xl font-bold mb-6">Press Releases</h2> -->

        <!-- <div class="space-y-6">
          <div class="border-b pb-4">
            <span class="text-sm">March 1, 2024</span>
            <h3 class="text-xl font-semibold mb-2">Boom Announces Integration with Major Layer 2 Solution</h3>
            <p class="mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <a href="#" class="font-medium">Download PDF →</a>
          </div>

          <div class="border-b pb-4">
            <span class="text-sm">February 15, 2024</span>
            <h3 class="text-xl font-semibold mb-2">Boom Reaches 100,000 Active Users</h3>
            <p class="mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <a href="#" class="font-medium">Download PDF →</a>
          </div>
        </div> -->
      <!-- </div> -->

      <!-- Brand Assets -->
      <section class="mb-16">
        <h2 class="text-2xl font-bold mb-6">Brand Assets</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Logo Package -->
          <div class="border rounded-lg p-6">
            <img src="/logo-families.png" alt="Boom Logo Package" class="mb-4 w-[200px] h-[100px]" />
            <h3 class="text-lg font-semibold mb-2">Logo Package</h3>
            <p class="mb-4">Official Boom logos in various formats</p>
            <button class="border rounded px-4 py-2 font-medium"  @click="downloadBrandAssetsZIP">Download ZIP</button>
          </div>

          <!-- Brand Guidelines -->
          <div class="border rounded-lg p-6">
            <img src="/brand-guidelines-preview.png" alt="Brand Guidelines" class="mb-4 w-[200px] h-[100px]"  />
            <h3 class="text-lg font-semibold mb-2">Brand Guidelines</h3>
            <p class="mb-4">Complete brand usage and style guide</p>
            <button class="border rounded px-4 py-2 font-medium"  @click="downloadBrandGuidelinesPDF">Download PDF</button>
          </div>

          <!-- Product Screenshots -->
          <div class="border rounded-lg p-6">
            <img src="/product-screenshots.png" alt="Product Screenshots" class="mb-4 w-[200px] h-[100px]" />
            <h3 class="text-lg font-semibold mb-2">Product Screenshots</h3>
            <p class="mb-4">High-resolution app screenshots</p>
            <button class="border rounded px-4 py-2 font-medium">Coming Soon</button>
          </div>
        </div>
      </section>

      <!-- Media Contact -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Media Contact</h2>
        <div class="border rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-2">Press Inquiries</h3>
          <p class="mb-2">For press inquiries, please contact:</p>
          <p class="mb-1">Email: press@boom.money</p>
          <p>Response time: Within 24 hours</p>
        </div>
      </section>
  </div>


  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../components/AppLayout.vue';
import { storage } from '../lib/appwrite'

const downloadBrandGuidelinesPDF = async () => {
  try {
    const fileUrl = await storage.getFileDownload(
      'listing-images',
      '67b162d4000231bcc478'
    )

    const link = document.createElement('a')
    link.href = fileUrl
    link.download = 'Boom-Brand-Guidelines.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading PDF:', error)
    throw error
  }
}

const downloadBrandAssetsZIP = async () => {
  try {
    const fileUrl = await storage.getFileDownload(
      'listing-images',
      '67b16660002e02cff9db'
    )

    const link = document.createElement('a')
    link.href = fileUrl
    link.download = 'Boom-Brand-Assets.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading ZIP:', error)
    throw error
  }
}



</script>

<style scoped>

</style>