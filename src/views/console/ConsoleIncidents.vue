<script setup lang="ts">
import { employeePortalConfig } from '../../config/employeePortalConfig'
import { incidentRecords } from '../../mocks/employeePortalData'

const config = employeePortalConfig

const statusChipClass: Record<string, string> = {
  pending: 'fn-badge--amber',
  investigating: 'fn-badge--blue',
  contained: 'fn-badge--green',
  redtape: 'fn-badge--gray',
}
</script>

<template>
  <section class="fn-stack">
    <div class="fn-page__head">
      <div>
        <h1 class="fn-page__title">{{ config.incidents.title }}</h1>
        <p class="fn-page__subtitle">{{ config.incidents.subtitle }}</p>
      </div>
      <span class="fn-page__crumb">{{ config.incidents.crumb }}</span>
    </div>

    <article class="fn-panel">
      <div class="fn-panel__title">
        <span>
          <span class="fn-panel__title-marker">▌</span>{{ incidentRecords.length }}
          <span class="fn-panel__title-note">registros en bitácora</span>
        </span>
      </div>
      <div class="fn-table-wrap">
        <table class="fn-table">
          <thead>
            <tr>
              <th>{{ config.incidents.columns.folio }}</th>
              <th>{{ config.incidents.columns.datetime }}</th>
              <th>{{ config.incidents.columns.sector }}</th>
              <th>{{ config.incidents.columns.classification }}</th>
              <th>{{ config.incidents.columns.status }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="incident in incidentRecords" :key="incident.folio">
              <td class="fn-table__mono">{{ incident.folio }}</td>
              <td class="fn-table__dim">{{ incident.datetime }}</td>
              <td>{{ incident.sector }}</td>
              <td>{{ incident.classification }}</td>
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
  </section>
</template>
