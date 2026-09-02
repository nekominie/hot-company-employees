<script setup lang="ts">
import { ref } from 'vue'
import { staffnetConfig } from '../../config/staffnetConfig'
import { itTickets, staffUser, type ItTicket } from '../../mocks/staffnetData'

const config = staffnetConfig

const category = ref('')
const priority = ref('medium')
const description = ref('')
const contact = ref(staffUser.email)
const submittedNote = ref('')
const tickets = ref<ItTicket[]>([...itTickets])

const priorityChipClass: Record<string, string> = {
  low: 'sn-badge--gray',
  medium: 'sn-badge--blue',
  high: 'sn-badge--amber',
  critical: 'sn-badge--red',
}

const statusChipClass: Record<string, string> = {
  open: 'sn-badge--amber',
  progress: 'sn-badge--blue',
  resolved: 'sn-badge--green',
}

const categoryLabel = (categoryId: string): string =>
  config.services.categories.find((categoryOption) => categoryOption.id === categoryId)?.label ?? categoryId

function onSubmit() {
  const consecutive = Math.floor(100 + Math.random() * 900)
  tickets.value.unshift({
    folio: `SN-2026-0${consecutive}`,
    category: category.value,
    priority: priority.value as ItTicket['priority'],
    status: 'open',
    updated: 'justo ahora',
  })
  submittedNote.value = config.services.successNote.replace(
    '{folio}',
    tickets.value[0].folio,
  )
  category.value = ''
  priority.value = 'medium'
  description.value = ''
  setTimeout(() => {
    submittedNote.value = ''
  }, 5000)
}
</script>

<template>
  <section class="sn-stack">
    <div class="sn-page__head">
      <h1 class="sn-page__title">{{ config.services.title }}</h1>
      <p class="sn-page__subtitle">{{ config.services.subtitle }}</p>
    </div>

    <div class="sn-grid-2">
      <article class="sn-card">
        <div class="sn-card__header">
          <div>
            <h2 class="sn-card__title">{{ config.services.formTitle }}</h2>
            <p class="sn-card__subtitle">{{ config.services.formSubtitle }}</p>
          </div>
        </div>
        <div class="sn-card__body">
          <form class="sn-form-grid" @submit.prevent="onSubmit">
            <div class="sn-field">
              <label class="sn-field__label" for="it-category">{{ config.services.fields.category }}</label>
              <div class="sn-field__control">
                <select id="it-category" v-model="category" class="sn-select" required>
                  <option value="" disabled>{{ config.services.fields.categoryPlaceholder }}</option>
                  <option v-for="option in config.services.categories" :key="option.id" :value="option.id">
                    {{ option.label }}
                  </option>
                </select>
                <svg class="sn-field__chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div class="sn-field">
              <label class="sn-field__label" for="it-priority">{{ config.services.fields.priority }}</label>
              <div class="sn-field__control">
                <select id="it-priority" v-model="priority" class="sn-select">
                  <option v-for="priorityOption in config.services.priorities" :key="priorityOption.id" :value="priorityOption.id">
                    {{ priorityOption.label }}
                  </option>
                </select>
                <svg class="sn-field__chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div class="sn-field sn-field--full">
              <label class="sn-field__label" for="it-description">{{ config.services.fields.description }}</label>
              <textarea
                id="it-description"
                v-model="description"
                class="sn-textarea"
                :placeholder="config.services.fields.descriptionPlaceholder"
                required
              ></textarea>
            </div>

            <div class="sn-field sn-field--full">
              <label class="sn-field__label" for="it-contact">{{ config.services.fields.contact }}</label>
              <input id="it-contact" v-model="contact" class="sn-input" type="email" required />
            </div>

            <div class="sn-field--full" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap">
              <span v-if="submittedNote" class="sn-saved">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {{ submittedNote }}
              </span>
              <button type="submit" class="sn-btn sn-btn--primary" style="margin-left: auto">
                {{ config.services.fields.submit }}
              </button>
            </div>
          </form>
        </div>
      </article>

      <article class="sn-card">
        <div class="sn-card__header">
          <h2 class="sn-card__title">{{ config.services.knownTitle }}</h2>
        </div>
        <div class="sn-card__body">
          <div class="sn-stack" style="gap: 10px">
            <p v-for="item in config.services.knownItems" :key="item.id" class="sn-note" style="margin: 0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
              {{ item.label }}
            </p>
          </div>
        </div>
      </article>
    </div>

    <article class="sn-card">
      <div class="sn-card__header">
        <div>
          <h2 class="sn-card__title">{{ config.services.ticketsTitle }}</h2>
          <p class="sn-card__subtitle">{{ config.services.ticketsSubtitle }}</p>
        </div>
      </div>
      <div class="sn-table-wrap">
        <table class="sn-table">
          <thead>
            <tr>
              <th>{{ config.services.ticketColumns.folio }}</th>
              <th>{{ config.services.ticketColumns.category }}</th>
              <th>{{ config.services.ticketColumns.priority }}</th>
              <th>{{ config.services.ticketColumns.status }}</th>
              <th>{{ config.services.ticketColumns.updated }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in tickets" :key="ticket.folio">
              <td class="sn-table__mono">{{ ticket.folio }}</td>
              <td>{{ categoryLabel(ticket.category) }}</td>
              <td>
                <span class="sn-badge" :class="priorityChipClass[ticket.priority]">
                  {{ config.services.priorityLabels[ticket.priority] }}
                </span>
              </td>
              <td>
                <span class="sn-badge" :class="statusChipClass[ticket.status]">
                  {{ config.services.statusLabels[ticket.status] }}
                </span>
              </td>
              <td class="sn-table__dim">{{ ticket.updated }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>
