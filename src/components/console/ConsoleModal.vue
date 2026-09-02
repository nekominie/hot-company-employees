<script setup lang="ts">
import { employeePortalConfig } from '../../config/employeePortalConfig'

defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const config = employeePortalConfig

function onBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fn-modal" @click="onBackdropClick">
      <div class="fn-modal__panel" role="dialog" aria-modal="true">
        <header class="fn-modal__head">
          <h3 class="fn-modal__title">{{ title }}</h3>
          <button type="button" class="fn-modal__close" :aria-label="config.common.close" @click="emit('close')">
            ✕
          </button>
        </header>
        <div class="fn-modal__body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
