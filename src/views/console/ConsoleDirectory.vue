<script setup lang="ts">
import { employeePortalConfig } from '../../config/employeePortalConfig'
import { directoryEmployees } from '../../mocks/employeePortalData'

const config = employeePortalConfig

const statusChipClass: Record<string, string> = {
  active: 'fn-badge--green',
  suspended: 'fn-badge--amber',
  terminated: 'fn-badge--red',
}
</script>

<template>
  <section class="fn-stack">
    <div class="fn-page__head">
      <div>
        <h1 class="fn-page__title">{{ config.directory.title }}</h1>
        <p class="fn-page__subtitle">{{ config.directory.subtitle }}</p>
      </div>
      <span class="fn-page__crumb">{{ config.directory.crumb }}</span>
    </div>

    <article class="fn-panel">
      <div class="fn-panel__title">
        <span>
          <span class="fn-panel__title-marker">▌</span>{{ directoryEmployees.length }}
          <span class="fn-panel__title-note">registros de personal</span>
        </span>
      </div>
      <div class="fn-table-wrap">
        <table class="fn-table">
          <thead>
            <tr>
              <th>{{ config.directory.columns.id }}</th>
              <th>{{ config.directory.columns.name }}</th>
              <th>{{ config.directory.columns.role }}</th>
              <th>{{ config.directory.columns.department }}</th>
              <th>{{ config.directory.columns.clearance }}</th>
              <th>{{ config.directory.columns.status }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in directoryEmployees" :key="employee.id">
              <td class="fn-table__mono">{{ employee.id }}</td>
              <td>{{ employee.name }}</td>
              <td class="fn-table__dim">{{ employee.role }}</td>
              <td>{{ employee.department }}</td>
              <td>
                <span class="fn-badge" :class="employee.clearance === 'LEVEL 3' ? 'fn-badge--amber' : 'fn-badge--gray'">
                  {{ employee.clearance }}
                </span>
              </td>
              <td>
                <span class="fn-badge" :class="statusChipClass[employee.status]">
                  {{ config.directory.statusLabels[employee.status] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>
