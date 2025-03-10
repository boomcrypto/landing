<template>
  <AppLayout>
    <MarkdownViewer :content="markdownContent" class="q-mt-xl" />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue';
import MarkdownViewer from '../components/MarkdownViewer.vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const release = route.params.slug
const markdownContent = ref('')

onMounted(async () => {
  if (!release) {
    // Handle error or redirect
    console.error('Missing release slug in URL.')
    router.replace('/') // redirect home if parameters missing
    return
  } else {
    const response = await fetch(`/docs/md/${release}.md`);
    markdownContent.value = await response.text();
  }
})


</script>
<style scoped></style>
