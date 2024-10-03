import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MainLayout from '../views/MainLayout.vue'
import LoginUtil from '@/utils/LoginUtil'
import NProgress from 'nprogress'
import localforage from 'localforage'
import httpUtil from "@/utils/HttpService";
import ApiService from '@/utils/ApiService'
import velFrameWelcome from '@/views/layouts/fragments/vel-frame-welcome.vue'
import VelFrameNotfound from "@/views/layouts/fragments/vel-frame-notfound.vue"
import { useRoutesStore } from "@/stores/data/routesStore";

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'gen',
    component: MainLayout,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: velFrameWelcome, name: 'Welcome' },
      { path: '/404', component: VelFrameNotfound, name: '404' }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const isAuth = LoginUtil.isAuthenticated()
  const whiteList = ['/login', '/forgetpassword', '/register']

  if (!isAuth) {
    if (whiteList.includes(to.path.toLowerCase())) {
      next();
    } else {
      next('/login');
    }
  } else {
    let routesStore = useRoutesStore()
    if (!routesStore.hasLoadRoutes) {
      let result = await dynaAddRoute()

      if (result) {
        next(to.fullPath)
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done();
})
const dynaAddRoute = async () => {
  await ApiService.getVerifyUser();
  let routes = await localforage.getItem("routes")
  await httpUtil.get('/server/user/menus').then(async res => {
    for (let i = 0; i < res.data.menus.length; i++) {
      if (res.data.menus[i].label) {
        res.data.menus[i].name = res.data.menus[i].label
      }
      if (res.data.menus[i].children) {
        for (let j = 0; j < res.data.menus[i].children.length; j++) {
          if (res.data.menus[i].label) {
            res.data.menus[i].name = res.data.menus[i].label
          }
          if (res.data.menus[i].children[j].label) {
            res.data.menus[i].children[j].name = res.data.menus[i].children[j].label
          }
        }
      }
    }
    for (let i = 0; i < res.data.pages.length; i++) {
      if (res.data.pages[i].label) {
        res.data.pages[i].name = res.data.pages[i].label
      }
    }
    routes = await localforage.setItem('routes', res.data)
  }).catch(err => {
    console.error(err)
  })

  if (routes != null) {
    routesProcess(routes)
    return true;
  }
  return false;
}

const routesProcess = (routes) => {
  let routesAll = []
  loopRoutes(routesAll, routes.menus)
  loopRoutes(routesAll, routes.pages)

  routesAll.push({
    label: '404', path: '/404', breadcrumb: ['404 Not found'], name: '404'
  }, {
    label: 'Welcome', path: '/welcome', breadcrumb: ['Welcome'], name: 'Welcome'
  })

  let routesStore = useRoutesStore();
  routesStore.routes = routesAll
  routesStore.menus = routes.menus

  addRoute(routesAll)
  routesStore.hasLoadRoutes = true
}

const loopRoutes = (routesAll, routes, breadcrumb) => {
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].children && routes[i].children.length > 0) {
      if (breadcrumb) {
        routes[i]['breadcrumb'] = [].concat(breadcrumb);
      } else {
        routes[i]['breadcrumb'] = [];
      }
      routes[i].breadcrumb.push(routes[i].label);
      loopRoutes(routesAll, routes[i].children, routes[i].breadcrumb)
    } else {
      if (routes[i].path) {
        if (breadcrumb) {
          routes[i]['breadcrumb'] = [].concat(breadcrumb);
        } else {
          routes[i]['breadcrumb'] = [];
        }
        routes[i].breadcrumb.push(routes[i].label);
        routesAll.push(routes[i])
      }
    }
  }
}

const addRoute = (routesAll) => {
  let modules = import.meta.glob('@/views/**/*.vue')
  for (let i = 0; i < routesAll.length; i++) {
    let route = routesAll[i]
    if (route.path === '/404' || route.path === '/welcome') {
      continue
    }

    router.addRoute('gen', {
      path: route.path,
      name: route.label,
      component: modules['/src/views' + route.component + '.vue']
    });
  }
}


export default router
