<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { employeePortalConfig } from '../../config/employeePortalConfig'
import { subStations } from '../../mocks/employeePortalData'

const router = useRouter()
const config = employeePortalConfig

const employeeId = ref('')
const cryptoKey = ref('')
const subStation = ref('')
const bootLines = ref<{ text: string; tone: 'dim' | 'ok' }[]>([])
const booting = ref(false)
const bootLogEl = ref<HTMLElement | null>(null)

function fillDemo() {
  employeeId.value = config.login.demoCredentials.employeeId
  cryptoKey.value = config.login.demoCredentials.cryptoKey
  subStation.value = subStations[0]?.id ?? ''
  void runBootSequence()
}

async function runBootSequence() {
  if (booting.value) return
  booting.value = true
  bootLines.value = []

  for (const line of config.login.bootSequence) {
    bootLines.value.push(line)
    await nextTick()
    if (bootLogEl.value) {
      bootLogEl.value.scrollTop = bootLogEl.value.scrollHeight
    }
    await new Promise((resolve) => setTimeout(resolve, 650 + Math.random() * 350))
  }

  await new Promise((resolve) => setTimeout(resolve, 500))
  router.push({ name: 'console-dashboard' })
}
</script>

<template>
  <div class="fn-theme fn-login">
    <div class="fn-login__box">
      <header class="fn-login__head">
        <h1 class="fn-login__title">{{ config.login.title }}</h1>
        <span class="fn-login__version">{{ config.login.versionLabel }}</span>
      </header>

      <div class="fn-login__body">
        <p class="fn-login__alert">{{ config.login.alertLine }}</p>

        <form class="fn-stack" style="gap: 10px" @submit.prevent="runBootSequence">
          <div class="fn-field">
            <label class="fn-field__label" for="login-employee-id">{{ config.login.fields.employeeId.label }}</label>
            <input
              id="login-employee-id"
              v-model="employeeId"
              class="fn-input"
              type="text"
              :placeholder="config.login.fields.employeeId.placeholder"
              autocomplete="username"
              :disabled="booting"
            />
          </div>

          <div class="fn-field">
            <label class="fn-field__label" for="login-crypto-key">{{ config.login.fields.cryptoKey.label }}</label>
            <input
              id="login-crypto-key"
              v-model="cryptoKey"
              class="fn-input"
              type="password"
              :placeholder="config.login.fields.cryptoKey.placeholder"
              autocomplete="current-password"
              :disabled="booting"
            />
          </div>

          <div class="fn-field">
            <label class="fn-field__label" for="login-substation">{{ config.login.fields.subStation.label }}</label>
            <div class="fn-field__control">
              <select
                id="login-substation"
                v-model="subStation"
                class="fn-select"
                :disabled="booting"
              >
                <option value="" disabled>{{ config.login.fields.subStation.placeholder }}</option>
                <option v-for="station in subStations" :key="station.id" :value="station.id">
                  {{ station.label }}
                </option>
              </select>
              <svg class="fn-field__chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div class="fn-login__actions">
            <button type="submit" class="fn-btn fn-btn--primary" :disabled="booting">
              {{ config.login.submitLabel }}
            </button>
            <button type="button" class="fn-btn" :disabled="booting" @click="fillDemo">
              {{ config.login.demoLabel }}
            </button>
          </div>
        </form>

        <div ref="bootLogEl" class="fn-login__boot" aria-live="polite">
          <template v-if="bootLines.length === 0">
            <p class="fn-login__boot-line fn-login__boot-line--dim">&gt; _</p>
          </template>
          <template v-else>
            <p
              v-for="(line, index) in bootLines"
              :key="index"
              class="fn-login__boot-line"
              :class="line.tone === 'ok' ? 'fn-login__boot-line--ok' : 'fn-login__boot-line--dim'"
            >
              {{ line.text }}<span v-if="index === bootLines.length - 1 && booting" class="fn-blink">█</span>
            </p>
          </template>
        </div>
      </div>

      <footer class="fn-login__footer">{{ config.login.footerNote }}</footer>
    </div>
  </div>
</template>
