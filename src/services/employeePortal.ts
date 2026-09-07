// Datos del portal de personal respaldados por la API: directorio y chats de StaffNet.

import { apiFetch } from './employeeAuth'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export interface EmployeeDirectoryMember {
  id: string
  employeeNumber: string
  firstName: string
  lastNamePaternal: string | null
  position: string
  department: string | null
  email: string
  status: string
}

export interface PortalChatMessage {
  id: string
  senderEmployeeId: string
  body: string
  sentAt: string
}

export interface PortalChat {
  id: string
  otherEmployeeId: string
  otherEmployeeNumber: string
  otherName: string
  otherPosition: string
  otherDepartment: string | null
  otherEmail: string
  otherStatus: string
  messages: PortalChatMessage[]
}

export function fetchEmployeeDirectory(): Promise<EmployeeDirectoryMember[]> {
  return apiFetch<EmployeeDirectoryMember[]>('/v1/employee-directory')
}

export function fetchMyChats(): Promise<PortalChat[]> {
  return apiFetch<PortalChat[]>('/v1/employee-chats')
}

export function sendChatMessage(chatId: string, body: string): Promise<PortalChatMessage> {
  return apiFetch<PortalChatMessage>(`/v1/employee-chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  })
}

// --- Gestor de documentos y plantillas (directorio personal del empleado) ---

export interface EmployeeDocFolder {
  id: string
  parentFolderId: string | null
  name: string
  createdAt: string
}

export interface EmployeeDocFile {
  id: string
  folderId: string | null
  name: string
  contentType: string | null
  sizeBytes: number
  ownerName: string
  updatedAt: string
  createdAt: string
}

export interface EmployeeDocsTree {
  folders: EmployeeDocFolder[]
  files: EmployeeDocFile[]
}

export function fetchEmployeeDocs(): Promise<EmployeeDocsTree> {
  return apiFetch<EmployeeDocsTree>('/v1/employee-docs')
}

export function employeeDocDownloadUrl(fileId: string): string {
  return `${API_BASE}/v1/employee-docs/files/${fileId}/download`
}

export function employeeDocPreviewUrl(fileId: string): string {
  return `${API_BASE}/v1/employee-docs/files/${fileId}/preview`
}

// --- Avisos de Recursos Humanos y Dirección (boletines del dashboard) ---

export interface StaffBulletin {
  id: string
  title: string
  message: string
  /** Fecha mostrada en el boletín: la de inicio programado o la de creación. */
  publishedAt: string
}

export function fetchStaffBulletins(): Promise<StaffBulletin[]> {
  return apiFetch<StaffBulletin[]>('/v1/staff-announcements')
}
