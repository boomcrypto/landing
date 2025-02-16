import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import Session from './pages/Session.vue'
import Blog from './pages/Blog.vue'
import Privacy from './pages/Privacy.vue'
import Terms from './pages/Terms.vue';
import About from './pages/About.vue';
import Team from './pages/Team.vue';
import Press from './pages/Press.vue';
import Testimonials from './pages/Testimonials.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/verify', component: Session },
  { path: '/blog/:page?', component: Blog },
  { path: '/privacy', component: Privacy },
  { path: '/terms', component: Terms },
  { path: '/about', component: About },
  { path: '/team', component: Team },
  { path: '/media', component: Press },
  { path: '/testimonials', component: Testimonials },
];

const router = createRouter({
  history: createWebHistory(), // Browser history mode

  routes,
});

export default router;
