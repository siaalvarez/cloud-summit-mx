// router.js - Configuración de Vue Router 4

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/logistica', name: 'Logistica', component: LogisticaView },
  { path: '/retail', name: 'Retail', component: RetailView },
  { path: '/fintech', name: 'Fintech', component: FintechView }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
});

