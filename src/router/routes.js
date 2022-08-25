const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        meta: { title: 'Bauwerke' },
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'test',
        name: 'test',
        component: () => import('pages/TestPage.vue'),
      },
    ],
  },

  {
    path: '/bauwerke',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'buildings',
        component: () => import('pages/BuildingsPage.vue'),
      },
      {
        path: ':id',
        name: 'building',
        component: () => import('pages/BuildingPage.vue'),
      },
    ],
  },

  {
    path: '/sortieren',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'sort',
        meta: { title: 'Bilder sortieren' },
        component: () => import('pages/SortPage.vue'),
      },
    ],
  },

  {
    path: '/login',
    name: 'login',
    meta: { title: 'Anmelden', requiresAuth: false },
    component: () => import('pages/LoginPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    meta: { title: 'Not Found', requiresAuth: false },
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
