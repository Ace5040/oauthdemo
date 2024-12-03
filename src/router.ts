import { createRouter, createWebHistory } from "vue-router"
import useAuthStore from "@/stores/auth"
import useAccountStore from "@/stores/account"
import testPage from "./pages/index.vue"

const routes = [
  {
    path: "/demo",
    component: testPage,
    meta: { authRequired: true }
  },
  {
    path: "/demo/login",
    name: "login",
    component: () => import("./pages/Auth/AuthPage.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    let isAuthenticated = authStore.isClientAuthenticated()

    if (!isAuthenticated) {
      await authStore.authenticate()
      isAuthenticated = authStore.isClientAuthenticated()
    }

    if (to.fullPath === '/demo/login') {
      isAuthenticated ? next('/demo') : next()
      return
    }

    if (!isAuthenticated && to.meta.authRequired) {
      try {
        const allow = await authStore.showAuthDialog()
        if (allow) {
          next();
        } else {
          next({ name: "login" });
        }
        return
      } catch (error) {
        next({ name: "login" });
        return
      }
    }
    next()
  })

router.afterEach(async () => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has("code")) {
      searchParams.delete("code")
      const newUrl = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}`
      window.history.replaceState(null, "", newUrl)
    }

  const authStore = useAuthStore()
  const accountStore = useAccountStore()
  const isAuthenticated = authStore.isClientAuthenticated()

  let currentUser = accountStore.currentUser

  if (isAuthenticated && !currentUser) {
    currentUser = await accountStore.getCurrentUser()
  }

})

export { router }
