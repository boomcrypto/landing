<template>
  <div class="article-container">
    <article class="prose prose-lg dark:prose-invert" v-html="compiledMarkdown">
    </article>

  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';

export default {
  name: 'MarkdownViewer',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  computed: {
    compiledMarkdown() {
      const md = MarkdownIt({
        linkify: true,
        typographer: true,
      });

      return md.render(this.content);
    }
  }
};
</script>

<style scoped>
p {
  margin-bottom: 2rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
}

h1 {
  font-size: 3.25rem;
  line-height: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

h2 {
  font-size: 2.25rem;
  line-height: 2.5rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.875rem;
  line-height: 2.25rem;
  margin-bottom: 1rem;
}

h4 {
  font-size: 1.5rem;
  line-height: 2rem;
  margin-bottom: 1rem;
}

h5 {
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin-bottom: 1rem;
}

h6 {
  font-size: 1.125rem;
  line-height: 1.75rem;
  margin-bottom: 1rem;
}

blockquote {
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  border-left: 4px solid #ccc;
}

pre {
  background-color: #f4f4f4;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

code {
  background-color: #f4f4f4;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

ul,
ol {
  margin: 1rem 0;
  padding-left: 2rem;
}

li {
  margin: 0.5rem 0;
}

a {
  color: #1a73e8;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

th,
td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}
</style>