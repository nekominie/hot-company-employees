<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { staffnetConfig } from '../../config/staffnetConfig'

const config = staffnetConfig
const router = useRouter()

const employeeId = ref('')
const password = ref('')
const showPassword = ref(false)

function login() {
  // Solo interfaz: sin validaciones ni backend por ahora.
  router.push({ name: 'staff-home' })
}
</script>

<template>
  <div class="sn-login">
    <!-- Panel de marca -->
    <aside class="sn-login__brand">
      <div class="sn-login__brand-inner">
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

        <ul class="sn-login__highlights">
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" class="sn-login__check" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Recursos Humanos, nómina y asistencia
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" class="sn-login__check" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Gestor documental y protocolos internos
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" class="sn-login__check" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Mensajería y mesa de ayuda de TI
          </li>
        </ul>
      </div>
    </aside>

    <!-- Formulario de acceso -->
    <main class="sn-login__panel">
      <div class="sn-login__card">
        <h1 class="sn-login__title">{{ config.login.title }}</h1>
        <p class="sn-login__subtitle">{{ config.login.subtitle }}</p>

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

          <button type="submit" class="sn-login__submit">
            {{ config.login.submitLabel }}
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
    </main>
  </div>
</template>

<style scoped>
.sn-login {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  min-height: 100dvh;
  background: var(--sn-bg);
}

/* ---------- Panel de marca ---------- */
.sn-login__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  background:
    radial-gradient(46rem 30rem at 120% 115%, rgba(2, 132, 199, 0.28), transparent 60%),
    linear-gradient(160deg, var(--sn-navy) 0%, #0f172a 100%);
}

.sn-login__brand-inner {
  width: min(400px, 100%);
}

.sn-login__logo-card {
  display: grid;
  place-items: center;
  width: 100%;
  padding: 30px 24px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 24px 48px -20px rgba(2, 8, 20, 0.65);
}

.sn-login__logo {
  width: 230px;
  height: auto;
}

.sn-login__brand-text {
  margin-top: 26px;
}

.sn-login__net {
  display: block;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
}

.sn-login__tagline {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
}

.sn-login__highlights {
  list-style: none;
  margin: 26px 0 0;
  padding: 22px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  display: grid;
  gap: 12px;
}

.sn-login__highlights li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.82);
}

.sn-login__check {
  width: 16px;
  height: 16px;
  color: var(--sn-green);
  flex-shrink: 0;
}

/* ---------- Formulario ---------- */
.sn-login__panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 28px;
  background: var(--sn-bg);
}

.sn-login__card {
  width: min(400px, 100%);
}

.sn-login__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--sn-ink);
}

.sn-login__subtitle {
  margin: 8px 0 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--sn-ink-soft);
}

.sn-login__form {
  margin-top: 28px;
  display: grid;
  gap: 18px;
}

.sn-login__field {
  display: grid;
  gap: 6px;
}

.sn-login__label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--sn-ink);
}

.sn-login__input {
  width: 100%;
  padding: 11px 13px;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  background: #fff;
  font-family: var(--sn-font);
  font-size: 13.5px;
  color: var(--sn-ink);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.sn-login__input::placeholder {
  color: var(--sn-ink-faint);
}

.sn-login__input:focus {
  outline: none;
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
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 7px;
  background: none;
  color: var(--sn-ink-faint);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.sn-login__toggle svg {
  width: 18px;
  height: 18px;
}

.sn-login__toggle:hover {
  color: var(--sn-blue);
  background: var(--sn-blue-soft);
}

.sn-login__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 6px;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(120deg, var(--sn-navy), #0f172a);
  color: #fff;
  font-family: var(--sn-font);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px -12px rgba(15, 23, 42, 0.5);
  transition: transform 0.15s, box-shadow 0.15s;
}

.sn-login__submit svg {
  width: 16px;
  height: 16px;
  transition: transform 0.15s;
}

.sn-login__submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 32px -14px rgba(15, 23, 42, 0.6);
}

.sn-login__submit:hover svg {
  transform: translateX(3px);
}

.sn-login__note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 22px;
  padding: 10px 13px;
  border: 1px solid rgba(30, 58, 138, 0.2);
  border-radius: 10px;
  background: var(--sn-navy-soft);
  font-size: 12px;
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
  margin: 18px 0 0;
  font-size: 10.5px;
  text-align: center;
  color: var(--sn-ink-faint);
}

/* ---------- Responsivo ---------- */
@media (max-width: 900px) {
  .sn-login {
    grid-template-columns: 1fr;
  }

  .sn-login__brand {
    padding: 30px 24px;
  }

  .sn-login__highlights {
    display: none;
  }

  .sn-login__logo-card {
    width: fit-content;
    padding: 16px 22px;
  }

  .sn-login__logo {
    width: 170px;
  }

  .sn-login__panel {
    align-items: flex-start;
    padding-top: 28px;
  }
}
</style>
