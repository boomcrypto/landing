<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto px-4 py-12">
      <!-- Press Coverage Section -->
      <section class="mb-16">
        <h1 class="text-4xl font-bold mb-8">Media Coverage</h1>

        <!-- Featured Press -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">

          <!-- Press Card -->
          <div class="border rounded-lg overflow-hidden">
            <div class="h-48 w-full">
              <img src="/media-bitcoin-and-beyond.png" alt="Bitcoin and Beyond" class="w-full h-full object-cover" />
            </div>
            <div class="p-4">
              <span class="text-sm">January 12, 2025</span>
              <h3 class="text-xl font-semibold mb-2">Bitcoin and Beyond with Melanie Carstens</h3>
              <p class="mb-4">Boom founder, Dan Trevino, talks about the future of Bitcoin payments.</p>
              <a href="https://www.youtube.com/watch?v=sVH0akW-q-U&t=17s" class="font-medium">Watch now →</a>
            </div>
          </div>

          <!-- Press Card -->
          <div class="border rounded-lg overflow-hidden">
            <div class="h-48 w-full">
              <img src="/media-bitcoin-and-beyond.png" alt="Bitcoin and Beyond" class="w-full h-full object-cover" />
            </div>
            <div class="p-4">
              <span class="text-sm">May 26, 2023</span>
              <h3 class="text-xl font-semibold mb-2">A Founder's Journey into Bitcoin - Dan</h3>
              <p class="mb-4">Co-founder of DeepLake, Dan Trevino, talks about Bitcoin developer APIs and DLCs.</p>
              <a href="https://youtu.be/Szl9ocB7Q0w?si=AXtC5JocJEjs9rf9" class="font-medium">Watch now →</a>
            </div>
          </div>

          <!-- Press Card -->
          <div class="border rounded-lg overflow-hidden">
            <div class="h-48 w-full">
              <img src="/leather_lounge_media.jpeg" alt="Boom joins Leather Lounge"
                class="w-full h-full object-cover" />
            </div>
            <div class="p-4">
              <span class="text-sm">July 3, 2024</span>
              <h3 class="text-xl font-semibold mb-2">Boom joins Leather Lounge</h3>
              <p class="mb-4">We join @cmpbfg and NoCodeClarity to talk about innovations on the Stacks blockchain.</p>
              <a href="https://x.com/LeatherBTC/status/1807800113009721799" class="font-medium">Read More →</a>
            </div>
          </div>

          <!-- Press Card -->
          <div class="border rounded-lg overflow-hidden">
            <div class="h-48 w-full">
              <img src="/media-stacks-resident.png" alt="Boom Stacks Residency" class="w-full h-full object-cover" />
            </div>
            <div class="p-4">
              <span class="text-sm">November 8, 2021</span>
              <h3 class="text-xl font-semibold mb-2">Stacks Residents Provide The Ecosystem A New Layer of Expertise and
                Leadership</h3>
              <p class="mb-4">Boom team chosen to provide leadership and innovation for the Stacks blockchain. Focus
                areas include NFT standards, and developer support.</p>
              <a href="https://stacks.org/introducing-stacks-residents#boom" class="font-medium">Read More →</a>
            </div>
          </div>

          <!-- Press Card -->
          <div class="border rounded-lg overflow-hidden">
            <div class="h-48 w-full">
              <img src="/introducing_boom_wallet.png" alt="Introducing Boom: A Wallet for STX & NFTs on Stacks 2.0"
                class="w-full h-full object-cover" />
            </div>
            <div class="p-4">
              <span class="text-sm">January 14, 2021</span>
              <h3 class="text-xl font-semibold mb-2">Introducing Boom: A Wallet for STX & NFTs on Stacks 2.0</h3>
              <p class="mb-4">Co-founder Dan Trevino talks about the evolution of Boom Wallet and the new Stacks 2.0
                blockchain.</p>
              <a href="https://www.stacks.co/blog/introducing-boom-a-wallet-for-stx-nfts-on-stacks-2-0"
                class="font-medium">Read More →</a>
            </div>
          </div>
        </div>

        <!-- Press Releases -->
        <div class="mb-16">
          <h2 class="text-2xl font-bold mb-6">Press Releases</h2>

          <div class="space-y-6">
            <div class="border-b pb-4">
              <span class="text-sm">December 2, 2024</span>
              <h3 class="text-xl font-semibold mb-2">Boom Announces StacksPay Protocol</h3>
              <p class="mb-2">Boom Platforms is excited to announce that the StacksPay protocol has been submitted for
                review via the Stacks Improvement Proposal (SIP) process. This submission is a significant step in our
                mission to leverage open standards and drive innovation in payment finance (PayFi) on Bitcoin through
                the scalable and secure Stacks Layer 2 network.</p>
              <a href="/docs/2024-12-02-StacksPay-press-release.pdf" class="font-medium">Download PDF →</a>
            </div>

            <div class="border-b pb-4">
              <span class="text-sm">February 13, 2024</span>
              <h3 class="text-xl font-semibold mb-2">Boom Joins N21 Program</h3>
              <p class="mb-2"> Boom announced its acceptance into the prestigious N21 program</p>
              <a href="/docs/2024-02-13-Boom-joins-N21.pdf" class="font-medium">Download PDF →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Brand Assets -->
      <section class="mb-16">
        <h2 class="text-2xl font-bold mb-6">Brand Assets</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Logo Package -->
          <div class="border rounded-lg p-6">
            <img src="/logo-families.png" alt="Boom Logo Package" class="mb-4 w-[200px] h-[100px]" />
            <h3 class="text-lg font-semibold mb-2">Logo Package</h3>
            <p class="mb-4">Official Boom logos in various formats</p>
            <button class="border rounded px-4 py-2 font-medium" @click="downloadBrandAssetsZIP">Download ZIP</button>
          </div>

          <!-- Brand Guidelines -->
          <div class="border rounded-lg p-6">
            <img src="/brand-guidelines-preview.png" alt="Brand Guidelines" class="mb-4 w-[200px] h-[100px]" />
            <h3 class="text-lg font-semibold mb-2">Brand Guidelines</h3>
            <p class="mb-4">Complete brand usage and style guide</p>
            <button class="border rounded px-4 py-2 font-medium" @click="downloadBrandGuidelinesPDF">Download
              PDF</button>
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