import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import Session from './pages/Session.vue'
import Blog from './pages/Blog.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/verify', component: Session },
  { path: '/blog/:page?', component: Blog }
];

const router = createRouter({
  history: createWebHistory(), // Browser history mode

  routes,
});

export default router;
