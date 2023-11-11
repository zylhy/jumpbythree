import { createRouter, createWebHistory } 'vue-router'

let routes = [{ path: '/', component: require('../views/index.vue') }]

const router = new createRouter({
    routes, history: createWebHistory()
})

export default router