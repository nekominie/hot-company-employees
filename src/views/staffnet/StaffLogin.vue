<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { staffnetConfig } from '../../config/staffnetConfig'
import { loginEmployee } from '../../services/employeeAuth'

const config = staffnetConfig
const router = useRouter()

const employeeId = ref('')
const password = ref('')
const showPassword = ref(false)
const submitting = ref(false)
const error = ref('')

async function login() {
  if (submitting.value) return
  submitting.value = true
  error.value = ''
  try {
    await loginEmployee(employeeId.value, password.value)
    router.push({ name: 'staff-home' })
  } catch (err) {
    error.value = err instanceof Error ? err.message : config.login.errorFallback
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="sn-login">
    <!-- Fondo decorativo: retícula ERP -->
    <div class="sn-login__grid-bg" aria-hidden="true"></div>

    <!-- Tarjeta centrada en el viewport -->
    <main class="sn-login__panel">
      <div class="sn-login__card">
        <!-- Encabezado corporativo -->
        <header class="sn-login__head">
          <div class="sn-login__logo-card">
            <img
              src="/img/fisinor-logo-full.png"
              :alt="config.brand.companyName"
              class="sn-login__logo"
            />
          </div>
          <div class="sn-login__brand-text">
            <span class="sn-login__net">{{ config.brand.netName }}</span>
            <span class="sn-login__tagline">{{ config.login.brandTagline }}</span>
          </div>
        </header>

        <div class="sn-login__divider" role="presentation">
          <span class="sn-login__divider-label">{{ config.login.title }}</span>
        </div>

        <form class="sn-login__form" @submit.prevent="login">
          <div class="sn-login__field">
            <label class="sn-login__label" for="staff-login-id">{{ config.login.employeeIdLabel }}</label>
            <input
              id="staff-login-id"
              v-model="employeeId"
              class="sn-login__input"
              type="text"
              :placeholder="config.login.employeeIdPlaceholder"
              autocomplete="username"
            />
          </div>

          <div class="sn-login__field">
            <label class="sn-login__label" for="staff-login-password">{{ config.login.passwordLabel }}</label>
            <div class="sn-login__password">
              <input
                id="staff-login-password"
                v-model="password"
                class="sn-login__input"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="config.login.passwordPlaceholder"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="sn-login__toggle"
                :aria-label="showPassword ? config.login.hideLabel : config.login.showLabel"
                @click="showPassword = !showPassword"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <p v-if="error" class="sn-login__error" role="alert">{{ error }}</p>

          <button type="submit" class="sn-login__submit" :disabled="submitting">
            {{ submitting ? config.login.submittingLabel : config.login.submitLabel }}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </form>

        <div class="sn-login__note">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          {{ config.login.adminNote }}
        </div>

        <p class="sn-login__legal">{{ config.login.legalNote }}</p>
      </div>

      <!-- Pie ERP con módulos del portal -->
      <ul class="sn-login__modules" aria-label="Módulos del portal">
        <li v-for="highlight in config.login.highlights" :key="highlight">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="sn-login__check" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {{ highlight }}
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped>
.sn-login {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: 24px;
  background: var(--sn-bg);
  overflow: hidden;
}

/* Retícula técnica de fondo, sutil, estilo papel de formulario ERP */
.sn-login__grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(30, 58, 138, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(30, 58, 138, 0.055) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(ellipse 72% 68% at 50% 42%, #000 35%, transparent 100%);
}

/* ---------- Tarjeta centrada ---------- */
.sn-login__panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(430px, 100%);
}

.sn-login__card {
  width: 100%;
  padding: 28px 30px 24px;
  background: var(--sn-surface);
  border: 1px solid var(--sn-border);
  border-top: 3px solid var(--sn-navy);
  border-radius: 14px;
  box-shadow: 0 22px 48px -22px rgba(15, 23, 42, 0.4);
}

/* Encabezado de marca */
.sn-login__head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.sn-login__logo-card {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 76px;
  height: 76px;
  padding: 10px;
  border: 1px solid var(--sn-border);
  border-radius: 14px;
  background: #fff;
  box-shadow: var(--sn-shadow);
}

.sn-login__logo {
  width: 100%;
  height: auto;
}

.sn-login__brand-text {
  min-width: 0;
}

.sn-login__net {
  display: block;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--sn-ink);
}

.sn-login__tagline {
  display: block;
  margin-top: 3px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sn-ink-faint);
}

/* Divisor de sección tipo expediente */
.sn-login__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 18px;
}

.sn-login__divider::before,
.sn-login__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--sn-border);
}

.sn-login__divider-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--sn-navy);
  white-space: nowrap;
}

/* ---------- Formulario ---------- */
.sn-login__form {
  display: grid;
  gap: 16px;
}

.sn-login__field {
  display: grid;
  gap: 5px;
}

.sn-login__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--sn-ink);
}

.sn-login__input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--sn-border);
  border-radius: 8px;
  background: var(--sn-bg-soft);
  font-family: var(--sn-font);
  font-size: 13.5px;
  color: var(--sn-ink);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.sn-login__input::placeholder {
  color: var(--sn-ink-faint);
}

.sn-login__input:focus {
  outline: none;
  background: #fff;
  border-color: var(--sn-blue);
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.sn-login__password {
  position: relative;
  display: flex;
}

.sn-login__password .sn-login__input {
  padding-right: 44px;
}

.sn-login__toggle {
  position: absolute;
  top: 50%;
  right: 8px;
  translate: 0 -50%;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 7px;
  background: none;
  color: var(--sn-ink-faint);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.sn-login__toggle svg {
  width: 17px;
  height: 17px;
}

.sn-login__toggle:hover {
  color: var(--sn-blue);
  background: var(--sn-blue-soft);
}

.sn-login__error {
  padding: 8px 11px;
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  background: var(--sn-red-soft);
  color: #991b1b;
  font-size: 12px;
  font-weight: 600;
}

.sn-login__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 4px;
  padding: 12px 20px;
  border: none;
  border-radius: 9px;
  background: linear-gradient(120deg, var(--sn-navy), #0f172a);
  color: #fff;
  font-family: var(--sn-font);
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 26px -14px rgba(15, 23, 42, 0.55);
  transition: transform 0.15s, box-shadow 0.15s;
}

.sn-login__submit svg {
  width: 15px;
  height: 15px;
  transition: transform 0.15s;
}

.sn-login__submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 16px 34px -16px rgba(15, 23, 42, 0.65);
}

.sn-login__submit:hover:not(:disabled) svg {
  transform: translateX(3px);
}

.sn-login__submit:disabled {
  opacity: 0.65;
  cursor: wait;
}

/* ---------- Notas ---------- */
.sn-login__note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 20px;
  padding: 10px 13px;
  border: 1px solid rgba(30, 58, 138, 0.18);
  border-radius: 9px;
  background: var(--sn-navy-soft);
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--sn-navy);
}

.sn-login__note svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  margin-top: 2px;
}

.sn-login__legal {
  margin: 14px 0 0;
  font-size: 10px;
  text-align: center;
  color: var(--sn-ink-faint);
}

/* ---------- Pie con módulos ---------- */
.sn-login__modules {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 20px;
}

.sn-login__modules li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--sn-ink-soft);
}

.sn-login__check {
  width: 13px;
  height: 13px;
  color: var(--sn-green);
  flex-shrink: 0;
}

/* ---------- Responsivo ---------- */
@media (max-width: 520px) {
  .sn-login {
    padding: 16px;
  }

  .sn-login__card {
    padding: 22px 20px 20px;
  }

  .sn-login__head {
    flex-direction: column;
    text-align: center;
  }

  .sn-login__modules {
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
}
</style>
