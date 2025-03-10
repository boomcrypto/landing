<script setup lang="ts">
import AppLayout from '../components/AppLayout.vue';
</script>

<template>
  <AppLayout>
    <!-- Hero Section -->
    <section class="px-4 py-16 flex flex-col md:flex-row items-center h-full bg-zinc-900">
      <div class="md:w-1/2 mb-8 md:mb-0">
        <h5 class="text-fuchsia-100 font-bold mb-4">
          FOR MERCHANTS & CREATORS
        </h5>
        <h1 class="text-5xl font-bold mb-6">Boom Smart Shops</h1>
        <p class="text-xl mb-8">
          The complete e-commerce platform built for the Bitcoin economy. Sell globally, get paid instantly, and build your business with the power of Bitcoin and Stacks.
        </p>
        <div class="space-y-4">
          <a href="#features" class="inline-block px-6 py-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 transition">
            Explore Features
          </a>
        </div>
      </div>
      <div class="md:w-1/2 flex justify-center">
        <img 
          src="https://images.unsplash.com/photo-1556742393-d75f468bfcb0?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3"
          alt="Merchant using Boom Smart Shops"
          class="max-w-sm rounded-lg shadow-2xl"
        />
      </div>
    </section>

    <!-- Key Features -->
    <section class="py-16 px-4 bg-zinc-800">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-16">Why Choose Boom Smart Shops?</h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="p-6 bg-zinc-700 rounded-lg flex flex-col items-center text-center">
            <div class="w-16 h-16 flex items-center justify-center bg-fuchsia-500 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Instant Bitcoin & Stacks Payments</h3>
            <p>Receive payments directly in Bitcoin (via sBTC) and Stacks (STX), eliminating intermediaries and reducing fees.</p>
          </div>
          
          <!-- Feature 2 -->
          <div class="p-6 bg-zinc-700 rounded-lg flex flex-col items-center text-center">
            <div class="w-16 h-16 flex items-center justify-center bg-fuchsia-500 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Smart Contract-Powered</h3>
            <p>Secure, trustless transactions are facilitated using Clarity smart contracts, ensuring reliability and security for both you and your customers.</p>
          </div>
          
          <!-- Feature 3 -->
          <div class="p-6 bg-zinc-700 rounded-lg flex flex-col items-center text-center">
            <div class="w-16 h-16 flex items-center justify-center bg-fuchsia-500 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Customizable Storefronts</h3>
            <p>Set up online stores with customizable layouts that fit your brand and product needs - no coding required.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Details Section -->
    <section id="features" class="py-16 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-16">Powerful Features for Your Business</h2>

        <!-- Feature Row 1 -->
        <div class="flex flex-col md:flex-row items-center mb-20">
          <div class="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h3 class="text-2xl font-bold mb-4 text-fuchsia-400">StackPay Integration</h3>
            <p class="mb-4">Native support for StacksPay links allows frictionless payments for customers using Boom Wallet and other compatible wallets.</p>
            <ul class="list-disc list-inside space-y-2">
              <li>One-click checkout experience</li>
              <li>Support for multiple cryptocurrencies</li>
              <li>No third-party payment processors</li>
            </ul>
          </div>
          <div class="md:w-1/2">
            <div class="bg-zinc-800 p-8 rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="StackPay Integration"
                class="rounded-lg w-full shadow-lg"
              />
            </div>
          </div>
        </div>

        <!-- Feature Row 2 -->
        <div class="flex flex-col md:flex-row-reverse items-center mb-20">
          <div class="md:w-1/2 mb-8 md:mb-0 md:pl-8">
            <h3 class="text-2xl font-bold mb-4 text-fuchsia-400">Non-Custodial & Decentralized</h3>
            <p class="mb-4">Maintain full control over your funds without relying on centralized payment processors. Your keys, your money - always.</p>
            <ul class="list-disc list-inside space-y-2">
              <li>Full ownership of your funds</li>
              <li>No custodial risks</li>
              <li>Direct on-chain settlements</li>
            </ul>
          </div>
          <div class="md:w-1/2">
            <div class="bg-zinc-800 p-8 rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1642010654727-a693951def5c?q=80&w=2964&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Non-Custodial & Decentralized"
                class="rounded-lg w-full shadow-lg"
              />
            </div>
          </div>
        </div>

        <!-- Feature Row 3 -->
        <div class="flex flex-col md:flex-row items-center mb-20">
          <div class="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h3 class="text-2xl font-bold mb-4 text-fuchsia-400">Cross-Border Compatibility</h3>
            <p class="mb-4">Designed to support merchants worldwide, enabling seamless global commerce with low transaction fees, regardless of country or currency.</p>
            <ul class="list-disc list-inside space-y-2">
              <li>Serve customers globally</li>
              <li>Low-cost international transactions</li>
              <li>No currency conversion fees</li>
            </ul>
          </div>
          <div class="md:w-1/2">
            <div class="bg-zinc-800 p-8 rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=2833&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Cross-Border Compatibility"
                class="rounded-lg w-full shadow-lg"
              />
            </div>
          </div>
        </div>

        <!-- Feature Row 4 -->
        <div class="flex flex-col md:flex-row-reverse items-center">
          <div class="md:w-1/2 mb-8 md:mb-0 md:pl-8">
            <h3 class="text-2xl font-bold mb-4 text-fuchsia-400">Built-in Chat & Customer Support</h3>
            <p class="mb-4">Facilitates customer interactions, order inquiries, and dispute resolution within the Boom Wallet ecosystem.</p>
            <ul class="list-disc list-inside space-y-2">
              <li>Direct messaging with customers</li>
              <li>Streamlined order management</li>
              <li>Build customer relationships</li>
            </ul>
          </div>
          <div class="md:w-1/2">
            <div class="bg-zinc-800 p-8 rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1573164713619-24c711fe7878?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Built-in Chat Functionality"
                class="rounded-lg w-full shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- More Features -->
    <section class="py-16 px-4 bg-zinc-800">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">Additional Features</h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Additional Feature 1 -->
          <div class="p-6 bg-zinc-700 rounded-lg flex items-start">
            <div class="w-12 h-12 flex items-center justify-center bg-fuchsia-500 rounded-full mr-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-2">Seamless Merchant Payouts</h3>
              <p>Eliminates payout delays common in traditional e-commerce platforms by enabling direct on-chain settlements.</p>
            </div>
          </div>
          
          <!-- Additional Feature 2 -->
          <div class="p-6 bg-zinc-700 rounded-lg flex items-start">
            <div class="w-12 h-12 flex items-center justify-center bg-fuchsia-500 rounded-full mr-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-2">Product Discovery</h3>
              <p>Users can browse and purchase from Boom Smart Shops directly within Boom Wallet, increasing visibility for merchants.</p>
            </div>
          </div>
          
          <!-- Additional Feature 3 -->
          <div class="p-6 bg-zinc-700 rounded-lg flex items-start">
            <div class="w-12 h-12 flex items-center justify-center bg-fuchsia-500 rounded-full mr-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-2">Progressive Web App</h3>
              <p>Fast, responsive, and mobile-friendly performance for merchants and customers with native-like experience.</p>
            </div>
          </div>
          
          <!-- Additional Feature 4 -->
          <div class="p-6 bg-zinc-700 rounded-lg flex items-start">
            <div class="w-12 h-12 flex items-center justify-center bg-fuchsia-500 rounded-full mr-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-2">Secure & Reliable</h3>
              <p>Built on blockchain technology, ensuring transparent, secure, and tamper-proof transactions for your business.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Subscription Plans Section -->
    <section class="py-16 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-6">Subscription Plans</h2>
        <p class="text-xl text-center mb-16 max-w-3xl mx-auto">Choose the plan that's right for your business. Our transparent pricing means no hidden fees or surprises.</p>
        
        <div class="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          <!-- Basic Plan -->
          <div class="bg-zinc-800 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105">
            <div class="p-8 border-b border-zinc-700">
              <h3 class="text-2xl font-bold mb-2">Basic</h3>
              <div class="flex items-end gap-1 mb-6">
                <span class="text-4xl font-bold">1%</span>
                <span class="text-sm text-zinc-400 mb-1">per transaction</span>
              </div>
              <p class="text-zinc-300">Perfect for creators just starting out or testing the waters with Bitcoin.</p>
            </div>
            <div class="p-8">
              <ul class="space-y-4">
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-fuchsia-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Up to 50 products</span>
                </li>
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-fuchsia-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Basic store customization</span>
                </li>
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-fuchsia-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Bitcoin and Stacks payments</span>
                </li>
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-fuchsia-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Customer chat support</span>
                </li>
              </ul>
              <button class="w-full py-3 mt-8 rounded-lg border border-fuchsia-500 text-fuchsia-500 font-semibold hover:bg-fuchsia-500 hover:text-white transition-colors">
                Get Started
              </button>
            </div>
          </div>
          
          <!-- Pro Plan (Highlighted) -->
          <div class="bg-zinc-800 rounded-xl overflow-hidden relative transition-transform duration-300 hover:scale-105">
            <div class="absolute top-0 right-0 bg-fuchsia-500 text-white px-4 py-1 text-sm font-semibold">
              POPULAR
            </div>
            <div class="p-8 border-b border-zinc-700 bg-zinc-900">
              <h3 class="text-2xl font-bold mb-2">Pro</h3>
              <div class="flex items-end gap-1 mb-6">
                <span class="text-4xl font-bold">0.8%</span>
                <span class="text-sm text-zinc-400 mb-1">per transaction</span>
              </div>
              <p class="text-zinc-300">For growing businesses looking to scale their online presence.</p>
            </div>
            <div class="p-8">
              <ul class="space-y-4">
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-fuchsia-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Unlimited products</span>
                </li>
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-fuchsia-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Advanced store customization</span>
                </li>
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-fuchsia-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Multi-currency support</span>
                </li>
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-fuchsia-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Analytics dashboard</span>
                </li>
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-fuchsia-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Priority support</span>
                </li>
              </ul>
              <button class="w-full py-3 mt-8 rounded-lg bg-fuchsia-500 text-white font-semibold hover:bg-fuchsia-600 transition-colors">
                Get Started
              </button>
            </div>
          </div>
          
          <!-- Enterprise Plan -->
          <div class="bg-zinc-800 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105">
            <div class="p-8 border-b border-zinc-700">
              <h3 class="text-2xl font-bold mb-2">Enterprise</h3>
              <div class="flex items-end gap-1 mb-6">
                <span class="text-4xl font-bold">0.5%</span>
                <span class="text-sm text-zinc-400 mb-1">per transaction</span>
              </div>
              <p class="text-zinc-300">Custom solutions for large businesses with high volume needs.</p>
            </div>
            <div class="p-8">
              <ul class="space-y-4">
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-fuchsia-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Everything in Pro</span>
                </li>
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-fuchsia-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Custom smart contract development</span>
                </li>
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-fuchsia-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Dedicated account manager</span>
                </li>
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-fuchsia-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>API access for custom integrations</span>
                </li>
              </ul>
              <button class="w-full py-3 mt-8 rounded-lg border border-fuchsia-500 text-fuchsia-500 font-semibold hover:bg-fuchsia-500 hover:text-white transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold mb-6">Ready to Start Selling?</h2>
        <p class="text-xl mb-8">Join the future of commerce with Boom Smart Shops and start accepting Bitcoin and Stacks payments today.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#" class="px-8 py-4 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 transition font-semibold">
            Join the Beta
          </a>
          <a href="https://docs.boom.money" class="px-8 py-4 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition font-semibold">
            Read the Docs
          </a>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 px-4 bg-zinc-800">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        
        <div class="space-y-6">
          <!-- FAQ Item 1 -->
          <div class="p-6 bg-zinc-700 rounded-lg">
            <h3 class="text-xl font-bold mb-3">How do I set up a Boom Smart Shop?</h3>
            <p>Setting up your shop is simple. Just create an account with Boom Wallet, navigate to the Smart Shops section, and follow the step-by-step guide to customize your store, add products, and start selling.</p>
          </div>
          
          <!-- FAQ Item 2 -->
          <div class="p-6 bg-zinc-700 rounded-lg">
            <h3 class="text-xl font-bold mb-3">What types of products can I sell?</h3>
            <p>Boom Smart Shops supports both digital and physical products. Whether you're selling e-books, art, merchandise, or services, our platform can handle it all with dedicated features for each product type.</p>
          </div>
          
          <!-- FAQ Item 3 -->
          <div class="p-6 bg-zinc-700 rounded-lg">
            <h3 class="text-xl font-bold mb-3">How do payments work?</h3>
            <p>Payments are processed directly on the blockchain using StackPay technology. When a customer makes a purchase, the funds are sent directly to your wallet - no middlemen, no delays, and minimal fees.</p>
          </div>
          
          <!-- FAQ Item 4 -->
          <div class="p-6 bg-zinc-700 rounded-lg">
            <h3 class="text-xl font-bold mb-3">What are the costs and subscription options?</h3>
            <p>We offer three simple pricing tiers based on a percentage fee per transaction:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Basic:</strong> 1% per transaction, suitable for small stores with up to 50 products</li>
              <li><strong>Pro:</strong> 0.8% per transaction, for growing businesses with unlimited products and enhanced features</li>
              <li><strong>Enterprise:</strong> 0.5% per transaction, tailored for high-volume sellers with custom requirements</li>
            </ul>
            <p class="mt-2">Unlike traditional platforms, there are no monthly fixed costs - you only pay when you make a sale. There are also no setup fees, listing fees, or hidden charges.</p>
          </div>
          
          <!-- FAQ Item 5 -->
          <div class="p-6 bg-zinc-700 rounded-lg">
            <h3 class="text-xl font-bold mb-3">Can I offer subscription products to my customers?</h3>
            <p>Yes! All plans support recurring billing through smart contracts. You can set up subscription products like memberships, content access, or service packages with flexible billing cycles (weekly, monthly, quarterly, or annually). Your customers can subscribe with a single transaction, and payments will be automatically processed according to your defined schedule.</p>
          </div>
          
          <!-- FAQ Item 6 -->
          <div class="p-6 bg-zinc-700 rounded-lg">
            <h3 class="text-xl font-bold mb-3">Can I upgrade or downgrade my plan later?</h3>
            <p>Absolutely! You can switch between plans at any time as your business needs change. When upgrading, you'll immediately gain access to all the features of your new plan. There are no penalties or lock-in periods - we believe in growing with you at your own pace.</p>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
</template>