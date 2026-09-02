<script setup lang="ts">
import { ref } from 'vue'
import { staffnetConfig } from '../../config/staffnetConfig'
import {
  serviceCards,
  staffBulletins,
  recentDocuments,
  type ServiceCard,
} from '../../mocks/staffnetData'

const config = staffnetConfig

const demoServiceId = ref<string | null>(null)

const serviceIconPaths: Record<ServiceCard['icon'], string> = {
  wallet:
    'M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3',
  calendar:
    'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
  clock:
    'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  shield:
    'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
}

function openService(id: string) {
  demoServiceId.value = id
}
</script>

<template>
  <section class="sn-stack">
    <div class="sn-page__head">
      <h1 class="sn-page__title">{{ config.home.title }}</h1>
      <p class="sn-page__subtitle">{{ config.home.subtitle }}</p>
    </div>

    <div>
      <h2 class="sn-card__title" style="margin: 0 0 10px">{{ config.home.servicesTitle }}</h2>
      <div class="sn-grid-cards">
        <button
          v-for="service in serviceCards"
          :key="service.id"
          type="button"
          class="sn-service"
          @click="openService(service.id)"
        >
          <span class="sn-service__icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" :d="serviceIconPaths[service.icon]" />
            </svg>
          </span>
          <span class="sn-service__title">{{ service.title }}</span>
          <span class="sn-service__desc">{{ service.description }}</span>
          <span class="sn-service__link">{{ config.home.openLabel }} →</span>
        </button>
      </div>
      <p v-if="demoServiceId" class="sn-note" style="margin-top: 12px" role="status">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        {{ config.home.demoNotice }}
      </p>
    </div>

    <div class="sn-grid-2">
      <article class="sn-card">
        <div class="sn-card__header">
          <div>
            <h2 class="sn-card__title">{{ config.home.bulletinsTitle }}</h2>
            <p class="sn-card__subtitle">{{ config.home.bulletinsSubtitle }}</p>
          </div>
        </div>
        <div class="sn-card__body">
          <article v-for="bulletin in staffBulletins" :key="bulletin.id" class="sn-bulletin">
            <div class="sn-bulletin__date">
              <span class="sn-bulletin__day">{{ bulletin.day }}</span>
              <span class="sn-bulletin__month">{{ bulletin.month }}</span>
            </div>
            <div>
              <h3 class="sn-bulletin__title">{{ bulletin.title }}</h3>
              <p class="sn-bulletin__excerpt">{{ bulletin.excerpt }}</p>
            </div>
          </article>
        </div>
      </article>

      <article class="sn-card">
        <div class="sn-card__header">
          <div>
            <h2 class="sn-card__title">{{ config.home.recentDocsTitle }}</h2>
            <p class="sn-card__subtitle">{{ config.home.recentDocsSubtitle }}</p>
          </div>
        </div>
        <div class="sn-card__body">
          <div v-for="doc in recentDocuments" :key="doc.id" class="sn-doc-row">
            <span class="sn-doc-row__icon">DOC</span>
            <div>
              <span class="sn-doc-row__name">{{ doc.name }}</span>
              <span class="sn-doc-row__meta">{{ doc.folder }} · {{ doc.modified }}</span>
            </div>
            <RouterLink class="sn-card__link sn-doc-row__action" :to="{ name: 'staff-documents' }">
              {{ config.home.openLabel }}
            </RouterLink>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
