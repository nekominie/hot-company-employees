<script setup lang="ts">
import { ref } from 'vue'
import { employeePortalConfig } from '../../config/employeePortalConfig'
import { accessHistory, operator } from '../../mocks/employeePortalData'

const config = employeePortalConfig

const tokenRequested = ref(false)

const cardRows = [
  { id: 'name', value: operator.name },
  { id: 'role', value: operator.role },
  { id: 'department', value: operator.department },
  { id: 'clearance', value: operator.clearance },
  { id: 'since', value: operator.since },
  { id: 'token', value: operator.tokenStatus },
] as const

const cardRowClass = (rowId: string): string => {
  if (rowId === 'clearance') return 'fn-kv__value fn-kv__value--green'
  if (rowId === 'token') return 'fn-kv__value fn-kv__value--green'
  return 'fn-kv__value'
}
</script>

<template>
  <section class="fn-stack">
    <div class="fn-page__head">
      <div>
        <h1 class="fn-page__title">{{ config.profile.title }}</h1>
        <p class="fn-page__subtitle">{{ config.profile.subtitle }}</p>
      </div>
      <span class="fn-page__crumb">{{ config.profile.crumb }}</span>
    </div>

    <div class="fn-ficha">
      <div class="fn-photo">
        <span class="fn-photo__initials">{{ operator.avatarInitials }}</span>
        <span class="fn-photo__scan" aria-hidden="true"></span>
        <span class="fn-photo__label">{{ config.profile.photoLabel }}</span>
      </div>

      <div>
        <span class="fn-ficha__id">{{ operator.id }}</span>
        <div style="margin-top: 10px">
          <div v-for="row in cardRows" :key="row.id" class="fn-kv">
            <span class="fn-kv__label">{{ config.profile.cardLabels[row.id] }}</span>
            <span :class="cardRowClass(row.id)">{{ row.value }}</span>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; margin-top: 12px; flex-wrap: wrap">
          <button type="button" class="fn-btn" @click="tokenRequested = true">
            {{ config.profile.tokenButton }}
          </button>
        </div>
        <p v-if="tokenRequested" class="fn-note">{{ config.profile.tokenNote }}</p>
      </div>
    </div>

    <article class="fn-panel">
      <div class="fn-panel__title">
        <span><span class="fn-panel__title-marker">▌</span>{{ config.profile.historyTitle }}</span>
      </div>
      <div class="fn-table-wrap">
        <table class="fn-table">
          <thead>
            <tr>
              <th>{{ config.profile.historyColumns.datetime }}</th>
              <th>{{ config.profile.historyColumns.ip }}</th>
              <th>{{ config.profile.historyColumns.terminal }}</th>
              <th>{{ config.profile.historyColumns.result }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in accessHistory" :key="entry.datetime + entry.terminal">
              <td class="fn-table__dim">{{ entry.datetime }}</td>
              <td class="fn-table__mono">{{ entry.ip }}</td>
              <td>{{ entry.terminal }}</td>
              <td>
                <span class="fn-badge" :class="entry.denied ? 'fn-badge--red' : 'fn-badge--green'">
                  [{{ entry.result }}]
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>

<style scoped>
.fn-note {
  display: flex;
  gap: 8px;
  margin: 10px 0 0;
  padding: 8px 10px;
  border: 1px dashed rgba(0, 255, 102, 0.5);
  background: var(--fn-green-dim);
  color: var(--fn-green);
  font-size: 11.5px;
  line-height: 1.6;
}
</style>
