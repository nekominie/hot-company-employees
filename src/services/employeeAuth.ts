// Servicio de sesión del Portal de Personal (StaffNet): autentica al personal
// contra la API y comparte la sesión vía cookie de host + token local.

import { ref } from 'vue'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
const TOKEN_KEY = 'fisinor_employee_token'

export interface EmployeeAccountInfo {
  id: string
  employeeNumber: string
  email: string
  firstName: string
  lastNamePaternal: string | null
  position: string
}

interface EmployeeAuthPayload {
  token: string
  account: {
    id: string
    employeeNumber: string
    email: string
    firstName: string
    lastNamePaternal: string | null
    position: string
  }
}

const authToken = ref<string | null>(localStorage.getItem(TOKEN_KEY))
export const employeeAccount = ref<EmployeeAccountInfo | null>(null)
export const employeeChecked = ref(false)

function mapAccount(raw: EmployeeAuthPayload['account']): EmployeeAccountInfo {
  return {
    id: raw.id,
    employeeNumber: raw.employeeNumber,
    email: raw.email,
    firstName: raw.firstName,
    lastNamePaternal: raw.lastNamePaternal,
    position: raw.position,
  }
}

export function displayNameOf(account: EmployeeAccountInfo | null): string {
  if (!account) return ''
  return [account.firstName, account.lastNamePaternal]
    .filter((part) => part && part.trim().length > 0)
    .join(' ')
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  }
  if (authToken.value) {
    headers.Authorization = `Bearer ${authToken.value}`
  }
  if (init.body) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'message' in payload && String(payload.message)) ||
      `Error ${response.status}`
    throw new Error(message)
  }

  return payload as T
}

/// Login del personal: autentica y guarda la sesión.
export async function loginEmployee(identifier: string, password: string): Promise<void> {
  const auth = await apiFetch<EmployeeAuthPayload>('/v1/employee-auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  })
  authToken.value = auth.token
  employeeAccount.value = mapAccount(auth.account)
  localStorage.setItem(TOKEN_KEY, auth.token)
}

/// Carga el empleado de la sesión activa (cookie compartida o token local).
export async function fetchCurrentEmployee(): Promise<EmployeeAccountInfo | null> {
  try {
    const account = await apiFetch<EmployeeAccountInfo>('/v1/employee-auth/me')
    employeeAccount.value = mapAccount(account)
    return employeeAccount.value
  } catch {
    employeeAccount.value = null
    return null
  } finally {
    employeeChecked.value = true
  }
}

/// Cierra la sesión: revoca en la API y descarta el token local.
export async function logoutEmployee(): Promise<void> {
  try {
    await apiFetch<void>('/v1/employee-auth/logout', { method: 'POST' })
  } catch {
    // aunque la API falle, la sesión local se descarta
  }
  authToken.value = null
  employeeAccount.value = null
  localStorage.removeItem(TOKEN_KEY)
}
