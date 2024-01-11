import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/book-edit',
      name: 'book-edit',
      component: () => import('../views/BookEditView.vue'),
      props: true
    },
    {
      path: '/preview-and-download',
      name: 'preview-and-download',
      component: () => import('../views/PreviewAndDownloadView.vue')
    }
  ]
})

export default router
