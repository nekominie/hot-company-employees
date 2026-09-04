import { createRouter, createWebHistory } from 'vue-router'
import { staffnetConfig } from '../config/staffnetConfig'
import { employeePortalConfig } from '../config/employeePortalConfig'
import StaffLayout from '../views/staffnet/StaffLayout.vue'
import StaffLogin from '../views/staffnet/StaffLogin.vue'
import StaffHome from '../views/staffnet/StaffHome.vue'
import StaffDirectory from '../views/staffnet/StaffDirectory.vue'
import StaffDocuments from '../views/staffnet/StaffDocuments.vue'
import StaffServices from '../views/staffnet/StaffServices.vue'
import StaffChat from '../views/staffnet/StaffChat.vue'
import ConsoleLogin from '../views/console/ConsoleLogin.vue'
import ConsoleLayout from '../views/console/ConsoleLayout.vue'
import ConsoleDashboard from '../views/console/ConsoleDashboard.vue'
import ConsoleFiles from '../views/console/ConsoleFiles.vue'
import ConsoleIncidents from '../views/console/ConsoleIncidents.vue'
import ConsoleDirectory from '../views/console/ConsoleDirectory.vue'
import ConsoleProfile from '../views/console/ConsoleProfile.vue'
import ConsoleLogs from '../views/console/ConsoleLogs.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ===== StaffNet (intranet corporativa clara) =====
    { path: '/empleados/login', name: 'staff-login', component: StaffLogin },
    {
      path: '/empleados',
      component: StaffLayout,
      children: [
        { path: '', redirect: { name: 'staff-home' } },
        { path: 'inicio', name: 'staff-home', component: StaffHome },
        { path: 'chat', name: 'staff-chat', component: StaffChat },
        { path: 'directorio', name: 'staff-directory', component: StaffDirectory },
        { path: 'documentos', name: 'staff-documents', component: StaffDocuments },
        { path: 'servicios', name: 'staff-services', component: StaffServices },
      ],
    },

    // ===== Consola Legacy / Terminal SCADA (módulo oscuro) =====
    { path: '/empleados/console/login', name: 'console-login', component: ConsoleLogin },
    {
      path: '/empleados/console',
      component: ConsoleLayout,
      children: [
        { path: '', redirect: { name: 'console-dashboard' } },
        { path: 'dashboard', name: 'console-dashboard', component: ConsoleDashboard },
        { path: 'archivos', name: 'console-files', component: ConsoleFiles },
        { path: 'incidentes', name: 'console-incidents', component: ConsoleIncidents },
        { path: 'directorio', name: 'console-directory', component: ConsoleDirectory },
        { path: 'perfil', name: 'console-profile', component: ConsoleProfile },
        { path: 'logs', name: 'console-logs', component: ConsoleLogs },
      ],
    },

    // Redirecciones de rutas antiguas del terminal
    { path: '/empleados/dashboard', redirect: { name: 'console-dashboard' } },
    { path: '/empleados/archivos', redirect: { name: 'console-files' } },
    { path: '/empleados/incidentes', redirect: { name: 'console-incidents' } },
    { path: '/empleados/perfil', redirect: { name: 'console-profile' } },
    { path: '/empleados/logs', redirect: { name: 'console-logs' } },

    { path: '/:pathMatch(.*)*', redirect: { name: 'staff-home' } },
  ],
})

// Títulos de documento combinados de ambas capas
const staffTitles = staffnetConfig.documentTitles
const consoleTitles = employeePortalConfig.documentTitles

const fullTitles: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(staffTitles.pages).map(([name, title]) => [name, `${staffTitles.base} — ${title}`]),
  ),
  ...Object.fromEntries(
    Object.entries(consoleTitles.pages).map(([name, title]) => [name, `${consoleTitles.base} — ${title}`]),
  ),
}

router.afterEach((to) => {
  document.title = fullTitles[String(to.name)] ?? staffTitles.base
})
