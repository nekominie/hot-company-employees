// Puerta de acceso al Portal de Empleados: la decisión vive en el servidor.
// Se permite entrar con sesión de personal válida O con pase otorgado desde el
// Portal de Clientes. Nada en localStorage otorga acceso por sí solo.

import { fetchCurrentEmployee } from './employeeAuth'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export interface EmployeesAccess {
  allowed: boolean
  authenticated: boolean
}

/** Pregunta al servidor si la sesión de cliente actual tiene pase (usa la cookie compartida). */
export async function fetchEmployeesAccess(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/v1/client-portal/employees-access`, {
      credentials: 'include',
    })
    if (!response.ok) return false
    const payload = (await response.json()) as EmployeesAccess
    return payload.allowed === true
  } catch {
    return false
  }
}

/**
 * Verificación completa: sesión de personal válida o pase de cliente vigente.
 * Se ejecuta en cada navegación protegida; el cliente nunca decide solo.
 */
export async function hasPortalAccess(): Promise<boolean> {
  try {
    const employee = await fetchCurrentEmployee()
    if (employee) return true
  } catch {
    // sin sesión de personal: se evalúa el pase de cliente
  }
  return fetchEmployeesAccess()
}
