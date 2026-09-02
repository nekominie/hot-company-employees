<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { employeePortalConfig } from '../../config/employeePortalConfig'
import { operator } from '../../mocks/employeePortalData'

const route = useRoute()
const router = useRouter()
const config = employeePortalConfig

const now = ref(new Date())
let clockTimer: number | undefined

onMounted(() => {
  clockTimer = window.setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (clockTimer !== undefined) {
    window.clearInterval(clockTimer)
  }
})

const clock = computed(() =>
  now.value.toLocaleTimeString('es-MX', { hour12: false }),
)

function logout() {
  router.push({ name: 'staff-home' })
}
</script>

<template>
  <div class="fn-theme fn-shell">
    <header class="fn-sysbar">
      <span class="fn-sysbar__group">
        <span class="fn-dot fn-blink" aria-hidden="true"></span>
        <span class="fn-sysbar__value--green">{{ config.systemBar.onlineLabel }}</span>
      </span>

      <span class="fn-sysbar__group">
        <span class="fn-sysbar__label">{{ config.systemBar.nodeLabel }}</span>
        <span class="fn-sysbar__value">HERMOSILLO-SRV-02</span>
      </span>

      <span class="fn-sysbar__group">
        <span class="fn-sysbar__label">{{ config.systemBar.userLabel }}</span>
        <span class="fn-sysbar__value">{{ operator.id }} [{{ config.systemBar.clearanceLabel }}]</span>
      </span>

      <span class="fn-sysbar__group fn-sysbar__risk">
        <span class="fn-sysbar__value--green">{{ config.systemBar.riskLabel }}</span>
      </span>

      <span class="fn-sysbar__group fn-sysbar__clock">
        <span class="fn-sysbar__label">{{ config.systemBar.clockLabel }}</span>
        <span class="fn-sysbar__value">{{ clock }}</span>
      </span>

      <button type="button" class="fn-btn fn-btn--sm" @click="router.push({ name: 'staff-home' })">
        {{ config.systemBar.backLabel }}
      </button>

      <button type="button" class="fn-btn fn-btn--danger fn-btn--sm" @click="logout">
        {{ config.systemBar.logoutLabel }}
      </button>
    </header>

    <div class="fn-body">
      <nav class="fn-sidenav" aria-label="Comandos de FISINOR-NET">
        <RouterLink class="fn-brand" :to="{ name: 'console-dashboard' }">
          <span class="fn-brand__name">{{ config.brand.netName }}</span>
          <span class="fn-brand__sub">{{ config.brand.companyName }} · {{ config.brand.version }}</span>
        </RouterLink>

        <div class="fn-sidenav__nav">
          <RouterLink
            v-for="item in config.sidebar.nav"
            :key="item.id"
            :to="{ name: item.routeName }"
            class="fn-sidenav__item"
            :class="{ 'fn-sidenav__item--active': route.name === item.routeName }"
          >
            {{ item.label }}
          </RouterLink>
        </div>

        <div class="fn-sidenav__footer">
          <div v-for="line in config.sidebar.footerLines" :key="line">{{ line }}</div>
        </div>
      </nav>

      <main class="fn-main">
        <div class="fn-content">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
