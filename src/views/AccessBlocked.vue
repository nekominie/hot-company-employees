<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { staffnetConfig } from '../config/staffnetConfig'
import { hasPortalAccess } from '../services/accessGate'

const config = staffnetConfig.accessGate
const route = useRoute()
const router = useRouter()

const checking = ref(true)

async function verify() {
  checking.value = true
  try {
    if (await hasPortalAccess()) {
      const target = typeof route.query.from === 'string' && route.query.from.startsWith('/') ? route.query.from : null
      if (target) {
        await router.replace(target)
      } else {
        await router.replace({ name: 'staff-home' })
      }
      return
    }
  } catch {
    // sin red o sin servidor: se muestra el bloqueo
  } finally {
    checking.value = false
  }
}

onMounted(() => {
  void verify()
})
</script>

<template>
  <div class="sn-blocked">
    <main class="sn-blocked__card">
      <p class="sn-blocked__code">{{ config.code }}</p>
      <h1 class="sn-blocked__title">{{ config.title }}</h1>
      <p v-if="checking" class="sn-blocked__message">{{ config.checkingLabel }}</p>
      <template v-else>
        <p class="sn-blocked__message">{{ config.message }}</p>
        <p class="sn-blocked__hint">{{ config.hint }}</p>
        <div class="sn-blocked__actions">
          <button type="button" class="sn-blocked__retry" @click="verify">
            {{ config.retryLabel }}
          </button>
          <a class="sn-blocked__link" :href="config.clientsPortalUrl">
            {{ config.clientsLabel }}
          </a>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.sn-blocked {
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: 24px;
  background: linear-gradient(165deg, #f7fafd 0%, #eef3f9 55%, #e9f0f7 100%);
}
.sn-blocked__card {
  width: min(520px, 100%);
  padding: 32px 30px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-top: 3px solid #dc2626;
  border-radius: 14px;
  box-shadow: 0 24px 55px -26px rgba(15, 23, 42, 0.35);
  text-align: center;
}
.sn-blocked__code {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
}
.sn-blocked__title {
  margin: 14px 0 0;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}
.sn-blocked__message {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: #475569;
}
.sn-blocked__hint {
  margin: 10px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: #94a3b8;
}
.sn-blocked__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 22px;
}
.sn-blocked__retry {
  padding: 12px 20px;
  border: none;
  border-radius: 9px;
  background: linear-gradient(120deg, #0f172a, #1e293b);
  color: #fff;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
}
.sn-blocked__link {
  font-size: 13px;
  font-weight: 600;
  color: #0284c7;
  text-decoration: none;
}
.sn-blocked__link:hover {
  text-decoration: underline;
}
</style>
