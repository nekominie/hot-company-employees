<script setup lang="ts">
import { useRouter } from 'vue-router'
import { employeePortalConfig } from '../../config/employeePortalConfig'
import {
  dashboardStats,
  incidentRecords,
  recentSystemLogs,
} from '../../mocks/employeePortalData'

const router = useRouter()
const config = employeePortalConfig

const statusChipClass: Record<string, string> = {
  pending: 'fn-badge--amber',
  investigating: 'fn-badge--blue',
  contained: 'fn-badge--green',
  redtape: 'fn-badge--gray',
}

const recentIncidents = incidentRecords.slice(0, 3)

function goFiles() {
  router.push({ name: 'employee-files' })
}
function goIncidents() {
  router.push({ name: 'employee-incidents' })
}
function goDirectory() {
  router.push({ name: 'employee-directory' })
}
function goLogs() {
  router.push({ name: 'employee-logs' })
}
</script>

<template>
  <section class="fn-stack">
    <div class="fn-page__head">
      <div>
        <h1 class="fn-page__title">{{ config.dashboard.title }}</h1>
        <p class="fn-page__subtitle">{{ config.dashboard.crumb }}</p>
      </div>
      <span class="fn-badge fn-badge--green">{{ config.systemBar.onlineLabel }}</span>
    </div>

    <article class="fn-panel">
      <div class="fn-panel__title">
        <span><span class="fn-panel__title-marker">▌</span>{{ config.dashboard.motd.label }}</span>
      </div>
      <div class="fn-panel__body">
        <p
          v-for="(line, index) in config.dashboard.motd.lines"
          :key="index"
          style="margin: 0 0 8px; font-size: 12px; line-height: 1.7"
        >
          {{ line }}
        </p>
      </div>
    </article>

    <div class="fn-cols">
      <div v-for="stat in dashboardStats" :key="stat.id" class="fn-stat">
        <div class="fn-stat__label">{{ stat.label }}</div>
        <div class="fn-stat__value" :class="{ 'fn-stat__value--plain': stat.plain }">
          {{ stat.value }}
        </div>
      </div>
    </div>

    <div class="fn-grid-2">
      <article class="fn-panel">
        <div class="fn-panel__title">
          <span><span class="fn-panel__title-marker">▌</span>{{ config.dashboard.recentIncidentsTitle }}</span>
          <button type="button" class="fn-btn fn-btn--sm" @click="goIncidents">
            {{ config.dashboard.viewAllLabel }}
          </button>
        </div>
        <div class="fn-table-wrap">
          <table class="fn-table">
            <thead>
              <tr>
                <th>{{ config.dashboard.columns.folio }}</th>
                <th>{{ config.dashboard.columns.datetime }}</th>
                <th>{{ config.dashboard.columns.sector }}</th>
                <th>{{ config.dashboard.columns.status }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="incident in recentIncidents" :key="incident.folio">
                <td class="fn-table__mono">{{ incident.folio }}</td>
                <td class="fn-table__dim">{{ incident.datetime }}</td>
                <td>{{ incident.sector }}</td>
                <td>
                  <span class="fn-badge" :class="statusChipClass[incident.status]">
                    {{ config.incidents.statusLabels[incident.status] }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="fn-panel">
        <div class="fn-panel__title">
          <span><span class="fn-panel__title-marker">▌</span>{{ config.dashboard.quickCommandsTitle }}</span>
        </div>
        <div class="fn-panel__body">
          <div class="fn-cmds">
            <button type="button" class="fn-cmd" @click="goFiles">&gt; EXPLORADOR_ARCHIVOS</button>
            <button type="button" class="fn-cmd" @click="goIncidents">&gt; REGISTRO_INCIDENTES</button>
            <button type="button" class="fn-cmd" @click="goDirectory">&gt; DIRECTORIO_PERSONAL</button>
            <button type="button" class="fn-cmd" @click="goLogs">&gt; LOGS_SISTEMA</button>
          </div>
        </div>
      </article>
    </div>

    <article class="fn-panel">
      <div class="fn-panel__title">
        <span><span class="fn-panel__title-marker">▌</span>{{ config.dashboard.recentLogsTitle }}</span>
      </div>
      <div class="fn-panel__body" style="padding: 8px 12px">
        <div v-for="line in recentSystemLogs" :key="line.time" style="display: flex; gap: 10px; font-size: 11.5px; line-height: 1.8">
          <span class="fn-table__dim">{{ line.time }}</span>
          <span
            :style="{
              color:
                line.severity === 'ok'
                  ? 'var(--fn-green)'
                  : line.severity === 'warn'
                    ? 'var(--fn-amber)'
                    : line.severity === 'error'
                      ? 'var(--fn-red)'
                      : 'var(--fn-text)',
            }"
          >
            {{ line.text }}
          </span>
        </div>
      </div>
    </article>
  </section>
</template>
