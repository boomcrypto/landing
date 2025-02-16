<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ID, Query } from 'appwrite'
import { databases, storage, databaseId } from '../lib/appwrite'
import AppLayout from '../components/AppLayout.vue'

interface Testimonial {
  $id: string;
  name: string;
  quote: string;
  job_role: string;
  category: string;
  imageId: string;
  imageUrl?: string;
}

const route = useRoute()
const showModal = ref(false)
const isSubmitting = ref(false)
const submitError = ref('')
const isLoading = ref(true)
const loadError = ref('')

const testimonials = ref<Testimonial[]>([]);

// Categories must match Appwrite enum
const categories = [
  'User_Experience',
  'Industry_Leader',
  'Business',
  'Developer',
  'Creator'
];

// Form state
const formData = ref({
  name: '',
  quote: '',
  job_role: '',
  category: '',
  image: null as File | null
});

// Form validation state
const formErrors = ref({
  name: '',
  quote: '',
  job_role: '',
  category: '',
  image: ''
});

// Filter state
const selectedCategory = ref<string|null>(null);

const filteredTestimonials = computed(() => {
  if (!selectedCategory.value || selectedCategory.value === "All") {
    return testimonials.value;
  }
  return testimonials.value.filter(t => t.category === selectedCategory.value);
});

// Load testimonials from Appwrite
const loadTestimonials = async () => {
  isLoading.value = true;
  loadError.value = '';

  try {
    const response = await databases.listDocuments(
      databaseId,
      '67b17a7f0023eddc01d3',
      [
        Query.orderDesc('$createdAt')
      ]
    );

    // Get testimonials with image URLs
    const testimonialsWithImages = await Promise.all(
      response.documents.map(async (doc) => {
        try {
          const imageUrl = storage.getFileView(
            'listing-images',
            doc.imageId
          );

          return {
            ...doc,
            imageUrl
          };
        } catch (error) {
          console.error('Error loading image for testimonial:', error);
          return {
            ...doc,
            imageUrl: '' // Placeholder or default image URL could go here
          };
        }
      })
    );

    testimonials.value = testimonialsWithImages;
  } catch (error) {
    console.error('Error loading testimonials:', error);
    loadError.value = 'Failed to load testimonials. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

const validateForm = () => {
  let isValid = true;
  formErrors.value = {
    name: '',
    quote: '',
    job_role: '',
    category: '',
    image: ''
  };

  if (!formData.value.name) {
    formErrors.value.name = 'Name is required';
    isValid = false;
  }

  if (!formData.value.quote) {
    formErrors.value.quote = 'Quote is required';
    isValid = false;
  }

  if (!formData.value.job_role) {
    formErrors.value.job_role = 'Role is required';
    isValid = false;
  }

  if (!formData.value.category) {
    formErrors.value.category = 'Category is required';
    isValid = false;
  }

  if (!formData.value.image) {
    formErrors.value.image = 'Image is required';
    isValid = false;
  }

  return isValid;
};

const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    formData.value.image = input.files[0];
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  isSubmitting.value = true;
  submitError.value = '';

  try {
    // First upload the image
    const imageFile = formData.value.image as File;
    const fileUpload = await storage.createFile(
      'listing-images',
      ID.unique(),
      imageFile
    );

    // Then create the testimonial document
    await databases.createDocument(
      databaseId,
      '67b17a7f0023eddc01d3',
      ID.unique(),
      {
        name: formData.value.name,
        quote: formData.value.quote,
        job_role: formData.value.job_role,
        category: formData.value.category,
        imageId: fileUpload.$id
      }
    );

    // Reset form and close modal
    formData.value = {
      name: '',
      quote: '',
      job_role: '',
      category: '',
      image: null
    };
    showModal.value = false;

    // Reload testimonials
    await loadTestimonials();

  } catch (error) {
    console.error('Error submitting testimonial:', error);
    submitError.value = 'Failed to submit testimonial. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

const displayCategory = (category: string) => {
  return category.replace(/_/g, ' ');
};

// Initial load
onMounted(async () => {
  await loadTestimonials();
  
  if (route.query.testimonial === import.meta.env.VITE_TESTIMONIAL) {
    showModal.value = true;
  }
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
            v-for="category in ['All', ...categories]"
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-2 rounded-full transition-colors',
              selectedCategory === category
                ? 'bg-fuchsia-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700'
            ]"
          >
            {{ category.replace(/_/g, ' ') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto"></div>
      <p class="mt-4 text-gray-400">Loading testimonials...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="text-center py-12">
      <p class="text-red-500">{{ loadError }}</p>
      <button 
        @click="loadTestimonials"
        class="mt-4 px-4 py-2 bg-fuchsia-600 rounded-lg hover:bg-fuchsia-700 transition-colors"
      >
        Try Again
      </button>
    </div>

    <!-- Testimonials Grid -->
    <section v-else class="px-4 pb-16">
      <div class="max-w-6xl mx-auto">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="testimonial in filteredTestimonials"
            :key="testimonial.$id"
            class="flex flex-col dark:border dark:border-slate-600 dark:shadow-none p-6 rounded-lg shadow-xl"
          >
            <!-- Category Tag -->
            <span class="text-sm text-fuchsia-400 mb-4">
              {{ testimonial.category.replace(/_/g, ' ') }}
            </span>

            <!-- Quote -->
            <blockquote class="flex-auto mb-6">
              <p class="text-lg">" {{ testimonial.quote }} "</p>
            </blockquote>

            <!-- Author Info -->
            <div class="flex items-center mt-auto">
              <div class="rounded-full border border-slate-200 dark:border-slate-600 h-12 w-12">
                <img
                  v-if="testimonial.imageUrl"
                  :src="testimonial.imageUrl"
                  :alt="testimonial.name"
                  class="rounded-full border border-slate-200 dark:border-slate-600 h-12 w-12 object-cover"
                />
              </div>
              <div class="ml-3">
                <p class="font-semibold">{{ testimonial.name }}</p>
                <p class="text-sm text-gray-500">{{ testimonial.job_role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showModal = false"
    >
      <div class="bg-gray-900 p-8 rounded-lg max-w-2xl w-full mx-4 relative">
        <button
          @click="showModal = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 class="text-2xl font-bold mb-6">Submit Your Testimonial</h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium mb-2">Name</label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              :class="{ 'border-red-500': formErrors.name }"
            />
            <p v-if="formErrors.name" class="mt-1 text-sm text-red-500">
              {{ formErrors.name }}
            </p>
          </div>

          <!-- Quote -->
          <div>
            <label class="block text-sm font-medium mb-2">Your Quote</label>
            <textarea
              v-model="formData.quote"
              rows="4"
              class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              :class="{ 'border-red-500': formErrors.quote }"
            ></textarea>
            <p v-if="formErrors.quote" class="mt-1 text-sm text-red-500">
              {{ formErrors.quote }}
            </p>
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-medium mb-2">Role/Title</label>
            <input
              v-model="formData.job_role"
              type="text"
              class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              :class="{ 'border-red-500': formErrors.job_role }"
            />
            <p v-if="formErrors.job_role" class="mt-1 text-sm text-red-500">
              {{ formErrors.job_role }}
            </p>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium mb-2">Category</label>
            <select
              v-model="formData.category"
              class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              :class="{ 'border-red-500': formErrors.category }"
            >
              <option value="">Select a category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <p v-if="formErrors.category" class="mt-1 text-sm text-red-500">
              {{ formErrors.category }}
            </p>
          </div>

          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium mb-2">Your Photo</label>
            <input
              type="file"
              accept="image/*"
              @change="handleImageSelect"
              class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              :class="{ 'border-red-500': formErrors.image }"
            />
            <p v-if="formErrors.image" class="mt-1 text-sm text-red-500">
              {{ formErrors.image }}
            </p>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Testimonial' }}
            </button>
            <p v-if="submitError" class="mt-2 text-sm text-red-500">
              {{ submitError }}
            </p>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>