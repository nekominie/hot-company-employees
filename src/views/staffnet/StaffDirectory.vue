<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { staffnetConfig } from '../../config/staffnetConfig'
import { fetchEmployeeDirectory, type EmployeeDirectoryMember } from '../../services/employeePortal'

const config = staffnetConfig

const staff = ref<EmployeeDirectoryMember[]>([])
const loading = ref(true)
const loadError = ref<string | null>(null)
const activeDepartment = ref('all')

const departments = computed(() => {
  const values = new Set<string>()
  for (const member of staff.value) {
    if (member.department) values.add(member.department)
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b, 'es'))
})

const filteredStaff = computed(() =>
  activeDepartment.value === 'all'
    ? staff.value
    : staff.value.filter((member) => member.department === activeDepartment.value),
)

const fullNameOf = (member: EmployeeDirectoryMember): string =>
  [member.firstName, member.lastNamePaternal].filter(Boolean).join(' ')

const initials = (name: string): string =>
  name
    .replace(/^(Dr\.|Dra\.|Q\.F\.|BIO\.|Ing\.|TTE\.|L\.|C\.|M\.|R\.|S\.)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

const statusLabel = (status: string): string =>
  config.directory.statusLabels[status as keyof typeof config.directory.statusLabels] ?? status

const statusChipClass = (status: string): string =>
  config.directory.statusChipClasses[status as keyof typeof config.directory.statusChipClasses] ?? 'sn-badge--gray'

onMounted(async () => {
  try {
    staff.value = await fetchEmployeeDirectory()
  } catch (err) {
    loadError.value = (err as Error).message || 'No se pudo cargar el directorio de personal.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="sn-stack">
    <div class="sn-page__head">
      <h1 class="sn-page__title">{{ config.directory.title }}</h1>
      <p class="sn-page__subtitle">{{ config.directory.subtitle }}</p>
    </div>

    <p v-if="loadError" class="sn-note" role="alert">{{ loadError }}</p>

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
            v-for="department in departments"
            :key="department"
            type="button"
            class="sn-filter"
            :class="{ 'sn-filter--active': activeDepartment === department }"
            @click="activeDepartment = department"
          >
            {{ department }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="sn-doc-row__meta" style="padding: 32px; text-align: center">
        Cargando personal...
      </div>

      <div v-else class="sn-table-wrap">
        <table class="sn-table">
          <thead>
            <tr>
              <th>{{ config.directory.columns.name }}</th>
              <th>{{ config.directory.columns.department }}</th>
              <th>{{ config.directory.columns.employeeNumber }}</th>
              <th>{{ config.directory.columns.email }}</th>
              <th>{{ config.directory.columns.status }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in filteredStaff" :key="member.id">
              <td>
                <div class="sn-person">
                  <span class="sn-person__avatar" aria-hidden="true">{{ initials(fullNameOf(member)) }}</span>
                  <div>
                    <div class="sn-person__name">{{ fullNameOf(member) }}</div>
                    <div class="sn-doc-row__meta">{{ member.position }}</div>
                  </div>
                </div>
              </td>
              <td>{{ member.department || '—' }}</td>
              <td class="sn-table__mono">{{ member.employeeNumber }}</td>
              <td class="sn-table__mono">{{ member.email }}</td>
              <td>
                <span class="sn-badge" :class="statusChipClass(member.status)">
                  <span class="sn-badge__dot" aria-hidden="true"></span>
                  {{ statusLabel(member.status) }}
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
