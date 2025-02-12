import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import Session from './pages/Session.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/verify', component: Session }
];

const router = createRouter({
  history: createWebHistory(), // Browser history mode

  routes,
});

export default router;
