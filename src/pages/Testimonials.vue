`<script setup lang="ts">
import { ref, computed } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import testimonial1 from '../assets/testimonial1.png';
import testimonial2 from '../assets/testimonial2.jpg';
import testimonial3 from '../assets/testimonial3.jpg';

// Testimonials data structure
interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  image: string;
  category?: string; // Optional category for filtering
}

const testimonials = ref<Testimonial[]>([
  {
    id: 1,
    quote: "I've been Stacking from the beginning, and Boom is the simplest crypto wallet that I've used.",
    author: "sammiek6720",
    role: "User",
    image: testimonial1,
    category: "User Experience"
  },
  {
    id: 2,
    quote: "The Boom team are true Stacks OG's who understand the value of building good platforms for this ecosystem.",
    author: "Muneeb Ali",
    role: "Stacks Founder",
    image: testimonial2,
    category: "Industry Leader"
  },
  {
    id: 3,
    quote: "This will become an integral element of our online business tech stack.",
    author: "@Electra_Frost",
    role: "Accounting",
    image: testimonial3,
    category: "Business"
  }
]);

// Filter state
const selectedCategory = ref<string | null>(null);
const categories = ["All", "User Experience", "Industry Leader", "Business"];

const filteredTestimonials = computed(() => {
  if (!selectedCategory.value || selectedCategory.value === "All") {
    return testimonials.value;
  }
  return testimonials.value.filter(t => t.category === selectedCategory.value);
});
</script>

<template>
  <AppLayout>
    <!-- Hero Section -->
    <section class="px-4 py-16 text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-6">What Our Users Say</h1>
      <p class="text-xl max-w-3xl mx-auto">
        Discover why users love Boom's simple, secure, and social approach to Bitcoin and digital assets.
      </p>
    </section>

    <!-- Category Filter -->
    <section class="px-4 mb-12">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-wrap gap-4 justify-center">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-2 rounded-full transition-colors',
              selectedCategory === category
                ? 'bg-fuchsia-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </section>

    <!-- Testimonials Grid -->
    <section class="px-4 pb-16">
      <div class="max-w-6xl mx-auto">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="testimonial in filteredTestimonials"
            :key="testimonial.id"
            class="flex flex-col dark:border dark:border-slate-600 dark:shadow-none p-6 rounded-lg shadow-xl"
          >
            <!-- Category Tag -->
            <span 
              v-if="testimonial.category"
              class="text-sm text-fuchsia-400 mb-4"
            >
              {{ testimonial.category }}
            </span>

            <!-- Quote -->
            <blockquote class="flex-auto mb-6">
              <p class="text-lg">" {{ testimonial.quote }} "</p>
            </blockquote>

            <!-- Author Info -->
            <div class="flex items-center mt-auto">
              <div class="rounded-full border border-slate-200 dark:border-slate-600 h-12 w-12">
                <img
                  :src="testimonial.image"
                  :alt="testimonial.author"
                  class="rounded-full border border-slate-200 dark:border-slate-600 h-12 w-12 object-cover"
                />
              </div>
              <div class="ml-3">
                <p class="font-semibold">{{ testimonial.author }}</p>
                <p class="text-sm text-gray-500">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Submit Testimonial CTA -->
    <section class="px-4 py-16 bg-gray-900">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-6">Share Your Boom Story</h2>
        <p class="text-xl mb-8">
          Are you using Boom? We'd love to hear about your experience!
        </p>
        <button class="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
          Submit Your Testimonial
        </button>
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>