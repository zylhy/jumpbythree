import { createRouter, createWebHistory } from 'vue-router'; 

let routes = [{ path: '/', component: ()=> import('../views/index.vue')}]

const router = new createRouter({
    routes, history: createWebHistory()
})

export default router