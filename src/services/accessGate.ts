// Puerta de acceso al Portal de Empleados: la decisión vive en el servidor.
// Dos niveles: el pase de cliente solo permite LLEGAR al login; dentro de las
// vistas solo manda una sesión de personal válida. Las sesiones son separadas:
// aquí la cuenta de cliente nunca es identidad, solo un permiso de paso.

import { fetchCurrentEmployee } from './employeeAuth'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export type PortalEntry = 'inner' | 'login' | 'blocked'

/** Sesión de personal válida (decide la entrada a las vistas). */
export async function hasEmployeeSession(): Promise<boolean> {
  try {
    return (await fetchCurrentEmployee()) !== null
  } catch {
    return false
  }
}

/** Pase de cliente vigente (decide si se puede ver el login). Usa la cookie compartida. */
export async function fetchEmployeesAccess(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/v1/client-portal/employees-access`, {
      credentials: 'include',
    })
    if (!response.ok) return false
    const payload = (await response.json()) as { allowed?: boolean }
    return payload.allowed === true
  } catch {
    return false
  }
}

/** Nivel de acceso actual, verificado con el servidor en cada llamada. */
export async function resolveEntry(): Promise<PortalEntry> {
  if (await hasEmployeeSession()) return 'inner'
  try {
    if (await fetchEmployeesAccess()) return 'login'
  } catch {
    // sin red o sin servidor: bloqueado
  }
  return 'blocked'
}
