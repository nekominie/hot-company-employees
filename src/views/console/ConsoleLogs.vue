<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { employeePortalConfig } from '../../config/employeePortalConfig'
import { recentSystemLogs, systemLogPool, type SystemLogLine } from '../../mocks/employeePortalData'

const config = employeePortalConfig

const MAX_BUFFER = 80

const lines = ref<SystemLogLine[]>([...recentSystemLogs])
const paused = ref(false)
const consoleEl = ref<HTMLElement | null>(null)
let poolIndex = Math.floor(Math.random() * systemLogPool.length)
let timer: number | undefined

function timestamp(): string {
  return new Date().toLocaleTimeString('es-MX', { hour12: false })
}

async function pushLine() {
  if (paused.value) return
  const template = systemLogPool[poolIndex % systemLogPool.length]
  poolIndex += 1
  lines.value.push({ time: timestamp(), text: template.text, severity: template.severity })
  if (lines.value.length > MAX_BUFFER) {
    lines.value.splice(0, lines.value.length - MAX_BUFFER)
  }
  await nextTick()
  if (consoleEl.value) {
    consoleEl.value.scrollTop = consoleEl.value.scrollHeight
  }
}

onMounted(() => {
  void pushLine()
  timer = window.setInterval(() => void pushLine(), 2200)
})

onUnmounted(() => {
  if (timer !== undefined) {
    window.clearInterval(timer)
  }
})
</script>

<template>
  <section class="fn-stack">
    <div class="fn-page__head">
      <div>
        <h1 class="fn-page__title">{{ config.logs.title }}</h1>
        <p class="fn-page__subtitle">{{ config.logs.subtitle }}</p>
      </div>
      <span class="fn-page__crumb">{{ config.logs.crumb }}</span>
    </div>

    <article class="fn-panel">
      <div class="fn-panel__title">
        <span>
          <span class="fn-panel__title-marker">▌</span>{{ config.logs.liveLabel }}
          <span v-if="paused" class="fn-badge fn-badge--amber" style="margin-left: 6px">{{ config.logs.pauseLabel }}</span>
        </span>
        <span class="fn-panel__title-note">
          {{ config.logs.linesLabel }}: {{ lines.length }} · HERMOSILLO-SRV-02
        </span>
      </div>
      <div class="fn-panel__body">
        <div class="fn-console__controls" style="margin-bottom: 10px">
          <button type="button" class="fn-btn fn-btn--sm" @click="paused = !paused">
            {{ paused ? config.logs.resumeLabel : config.logs.pauseLabel }}
          </button>
        </div>

        <div ref="consoleEl" class="fn-console" aria-live="polite">
          <p
            v-for="(line, index) in lines"
            :key="`${line.time}-${index}`"
            class="fn-console__line"
            :class="{
              'fn-console__line--ok': line.severity === 'ok',
              'fn-console__line--warn': line.severity === 'warn',
              'fn-console__line--error': line.severity === 'error',
            }"
          >
            <span class="fn-console__time">[{{ line.time }}]</span>
            {{ line.text }}
          </p>
        </div>
      </div>
    </article>
  </section>
</template>
