<script setup lang="ts">
import { computed, ref } from 'vue'
import { staffnetConfig } from '../../config/staffnetConfig'
import { directoryStaff, staffDepartments } from '../../mocks/staffnetData'

const config = staffnetConfig

const activeDepartment = ref('all')

const filteredStaff = computed(() =>
  activeDepartment.value === 'all'
    ? directoryStaff
    : directoryStaff.filter((member) => member.department === activeDepartment.value),
)

const statusChipClass: Record<string, string> = {
  office: 'sn-badge--green',
  field: 'sn-badge--blue',
  lab: 'sn-badge--amber',
}

const initials = (name: string): string =>
  name
    .replace(/^(Dr\.|Dra\.|Q\.F\.|BIO\.|Ing\.|TTE\.|L\.|C\.|M\.|R\.|S\.)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
</script>

<template>
  <section class="sn-stack">
    <div class="sn-page__head">
      <h1 class="sn-page__title">{{ config.directory.title }}</h1>
      <p class="sn-page__subtitle">{{ config.directory.subtitle }}</p>
    </div>

    <article class="sn-card">
      <div class="sn-card__body" style="padding-bottom: 12px">
        <div class="sn-filters">
          <button
            type="button"
            class="sn-filter"
            :class="{ 'sn-filter--active': activeDepartment === 'all' }"
            @click="activeDepartment = 'all'"
          >
            {{ config.directory.filterAllLabel }}
          </button>
          <button
            v-for="department in staffDepartments"
            :key="department.id"
            type="button"
            class="sn-filter"
            :class="{ 'sn-filter--active': activeDepartment === department.label }"
            @click="activeDepartment = department.label"
          >
            {{ department.label }}
          </button>
        </div>
      </div>

      <div class="sn-table-wrap">
        <table class="sn-table">
          <thead>
            <tr>
              <th>{{ config.directory.columns.name }}</th>
              <th>{{ config.directory.columns.department }}</th>
              <th>{{ config.directory.columns.extension }}</th>
              <th>{{ config.directory.columns.email }}</th>
              <th>{{ config.directory.columns.status }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in filteredStaff" :key="member.id">
              <td>
                <div class="sn-person">
                  <span class="sn-person__avatar" aria-hidden="true">{{ initials(member.name) }}</span>
                  <div>
                    <div class="sn-person__name">{{ member.name }}</div>
                    <div class="sn-doc-row__meta">{{ member.role }}</div>
                  </div>
                </div>
              </td>
              <td>{{ member.department }}</td>
              <td class="sn-table__mono">EXT. {{ member.extension }}</td>
              <td class="sn-table__mono">{{ member.email }}</td>
              <td>
                <span class="sn-badge" :class="statusChipClass[member.status]">
                  <span class="sn-badge__dot" aria-hidden="true"></span>
                  {{ config.directory.statusLabels[member.status] }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredStaff.length === 0">
              <td colspan="5" class="sn-table__dim">Sin resultados para el departamento seleccionado.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>
