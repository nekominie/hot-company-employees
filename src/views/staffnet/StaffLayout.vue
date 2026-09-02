<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { staffnetConfig } from '../../config/staffnetConfig'
import { staffAnnouncements, staffUser } from '../../mocks/staffnetData'

const route = useRoute()
const router = useRouter()
const config = staffnetConfig

// Banner rotativo de comunicados
const announcementIndex = ref(0)
let bannerTimer: number | undefined

onMounted(() => {
  bannerTimer = window.setInterval(() => {
    announcementIndex.value = (announcementIndex.value + 1) % staffAnnouncements.length
  }, 7000)
})

onUnmounted(() => {
  if (bannerTimer !== undefined) {
    window.clearInterval(bannerTimer)
  }
})

const activeAnnouncement = computed(
  () => staffAnnouncements[announcementIndex.value] ?? staffAnnouncements[0],
)

const activeRouteName = computed(() => String(route.name ?? ''))

function setAnnouncement(index: number) {
  announcementIndex.value = index
}

// Interstitial de la Consola Legacy
const consoleWarningOpen = ref(false)

function openConsoleWarning() {
  consoleWarningOpen.value = true
}

function enterConsole() {
  consoleWarningOpen.value = false
  router.push({ name: 'console-login' })
}

const navIconPaths: Record<string, string> = {
  home: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75',
  directory:
    'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  documents:
    'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  services:
    'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z',
}
</script>

<template>
  <div class="sn-theme">
    <header class="sn-header">
      <div class="sn-header__row">
        <RouterLink class="sn-brand" :to="{ name: 'staff-home' }">
          <img class="sn-brand__logo" :src="config.brand.logo" :alt="config.brand.companyName" />
          <span>
            <span class="sn-brand__name">{{ config.brand.netName }}</span>
            <span class="sn-brand__sub">{{ config.brand.subLabel }} · {{ config.brand.companyName }}</span>
          </span>
        </RouterLink>

        <div class="sn-search">
          <svg class="sn-search__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input class="sn-search__input" type="text" :placeholder="config.header.searchPlaceholder" />
        </div>

        <div class="sn-user" :title="config.header.userTitle">
          <span class="sn-user__avatar" aria-hidden="true">{{ staffUser.initials }}</span>
          <span>
            <span class="sn-user__name">{{ staffUser.name }}</span>
            <span class="sn-user__meta">{{ staffUser.department }}</span>
            <span class="sn-user__id">ID: {{ staffUser.id }}</span>
          </span>
        </div>
      </div>
    </header>

    <div class="sn-banner-wrap">
      <div class="sn-banner">
        <svg class="sn-banner__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09a48.637 48.637 0 014.297-.307c1.06-.034 2.077-.224 3.02-.616l1.003-.417a.75.75 0 011.04.62 60.86 60.86 0 010 6.85.75.75 0 01-1.04.62l-1.003-.417c-.943-.392-1.96-.582-3.02-.616a48.637 48.637 0 00-4.297-.307zm0 0v4.86c0 .9-.673 1.675-1.564 1.786a48.922 48.922 0 01-1.692.18 1.875 1.875 0 01-2.069-1.866v-4.96"
          />
        </svg>
        <p class="sn-banner__text">
          <strong>{{ config.banner.label }}:</strong>
          {{ activeAnnouncement?.text }}
        </p>
        <div class="sn-banner__dots" role="tablist" aria-label="Comunicados">
          <button
            v-for="(announcement, index) in staffAnnouncements"
            :key="announcement.id"
            type="button"
            class="sn-banner__dot"
            :class="{ 'sn-banner__dot--active': index === announcementIndex }"
            :aria-label="`Comunicado ${index + 1}`"
            @click="setAnnouncement(index)"
          ></button>
        </div>
      </div>
    </div>

    <div class="sn-body">
      <nav class="sn-sidebar" aria-label="Navegación de StaffNet">
        <p class="sn-sidebar__label">{{ config.sidebar.menuLabel }}</p>
        <div class="sn-nav">
          <RouterLink
            v-for="item in config.sidebar.nav"
            :key="item.id"
            :to="{ name: item.routeName }"
            class="sn-nav__item"
            :class="{ 'sn-nav__item--active': activeRouteName === item.routeName }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" :d="navIconPaths[item.id]" />
            </svg>
            {{ item.label }}
          </RouterLink>
        </div>

        <div class="sn-nav__console">
          <button type="button" class="sn-nav__console-item" @click="openConsoleWarning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 003-3m-3 3c-1.657 0-3-1.343-3-3s1.343-3 3-3m0 0a3 3 0 103-3m-3 3h13.5m-13.5 0a3 3 0 013-3m16.5 3a3 3 0 01-3 3m3-3c1.657 0 3-1.343 3-3s-1.343-3-3-3m0 0a3 3 0 10-3 3m3-3v-3c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875v3m16.5 0a3 3 0 01-3 3m3 3a3 3 0 003-3m-3 3v6m-16.5-6v6m0 0a3 3 0 003 3m-3-3h16.5m0 0a3 3 0 003 3" />
            </svg>
            <span>
              {{ config.sidebar.consoleItem.label }}
              <span class="sn-nav__console-note">{{ config.sidebar.consoleItem.note }}</span>
            </span>
          </button>
        </div>
      </nav>

      <main style="min-width: 0">
        <RouterView />
      </main>
    </div>

    <!-- Interstitial: advertencia antes de entrar a la consola legacy -->
    <div v-if="consoleWarningOpen" class="sn-server-modal" role="alertdialog" aria-modal="true">
      <div class="sn-server-modal__panel">
        <div class="sn-server-modal__head">
          <p class="sn-server-modal__title">{{ config.consoleWarning.title }}</p>
          <button type="button" class="sn-server-modal__close" :aria-label="config.consoleWarning.cancelLabel" @click="consoleWarningOpen = false">
            ✕
          </button>
        </div>
        <div class="sn-server-modal__body">
          <p v-for="(line, index) in config.consoleWarning.lines" :key="index" class="sn-server-modal__line" :class="{ 'sn-server-modal__line--warn': index === config.consoleWarning.lines.length - 1 }">
            {{ line }}
          </p>
          <div class="sn-server-modal__meta">
            <span v-for="meta in config.consoleWarning.meta" :key="meta">{{ meta }}</span>
          </div>
        </div>
        <div class="sn-server-modal__actions">
          <button type="button" class="sn-server-modal__cancel" @click="consoleWarningOpen = false">
            {{ config.consoleWarning.cancelLabel }}
          </button>
          <button type="button" class="sn-server-modal__enter" @click="enterConsole">
            {{ config.consoleWarning.enterLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
