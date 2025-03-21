import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import Session from './pages/Session.vue'
import Privacy from './pages/Privacy.vue'
import Terms from './pages/Terms.vue';
import About from './pages/About.vue';
import Team from './pages/Team.vue';
import Press from './pages/Press.vue';
import Testimonials from './pages/Testimonials.vue';
import Release from './pages/Release.vue';
import SmartShops from './pages/SmartShops.vue';
import BasicSignup from './pages/BasicSignup.vue';
import ProSignup from './pages/ProSignup.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/verify', component: Session },
  { path: '/privacy', component: Privacy },
  { path: '/terms', component: Terms },
  { path: '/about', component: About },
  { path: '/team', component: Team },
  { path: '/media', component: Press },
  { path: '/testimonials', component: Testimonials },
  { path: '/press-release/:slug', component: Release },
  { path: '/merchants', component: SmartShops },
  { path: '/basic-signup', component: BasicSignup },
  { path: '/pro-signup', component: ProSignup },
];

const router = createRouter({
  history: createWebHistory(), // Browser history mode

  routes,
});

export default router;
