<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { staffnetConfig } from '../../config/staffnetConfig'
import {
  employeeDocDownloadUrl,
  employeeDocPreviewUrl,
  fetchEmployeeDocs,
  type EmployeeDocFile,
  type EmployeeDocFolder,
  type EmployeeDocsTree,
} from '../../services/employeePortal'

const config = staffnetConfig
const docs = computed(() => config.documents)

const tree = ref<EmployeeDocsTree>({ folders: [], files: [] })
const loading = ref(true)
const loadError = ref<string | null>(null)
const currentFolderId = ref<string | null>(null) // null = raíz
const previewDoc = ref<EmployeeDocFile | null>(null)
const downloadNote = ref('')

let downloadNoteTimer: ReturnType<typeof setTimeout> | undefined

async function loadDocs() {
  loadError.value = null
  try {
    tree.value = await fetchEmployeeDocs()
  } catch (err) {
    loadError.value = (err as Error).message || docs.value.loadError
  } finally {
    loading.value = false
  }
}

// --- Navegación de carpetas ---
const currentFolder = computed(() =>
  currentFolderId.value ? tree.value.folders.find((folder) => folder.id === currentFolderId.value) ?? null : null,
)

const folderFiles = computed(() =>
  tree.value.files.filter((file) =>
    file.folderId === currentFolderId.value ||
    (currentFolderId.value === null && file.folderId === null),
  ),
)

const breadcrumb = computed(() => {
  const trail: EmployeeDocFolder[] = []
  let cursor = currentFolder.value
  while (cursor) {
    trail.unshift(cursor)
    cursor = cursor.parentFolderId
      ? tree.value.folders.find((folder) => folder.id === cursor!.parentFolderId) ?? null
      : null
  }
  return trail
})

// Carpetas en orden jerárquico (DFS), con prefijo visual según profundidad
interface FolderView extends EmployeeDocFolder {
  depth: number
  label: string
}

const folderViews = computed<FolderView[]>(() => {
  const result: FolderView[] = []
  const walk = (parentId: string | null, depth: number) => {
    const children = tree.value.folders
      .filter((folder) => folder.parentFolderId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name, 'es'))
    for (const folder of children) {
      result.push({ ...folder, depth, label: `${'↳ '.repeat(depth)}${folder.name}` })
      walk(folder.id, depth + 1)
    }
  }
  walk(null, 0)
  return result
})

function selectFolder(folderId: string | null) {
  currentFolderId.value = folderId
}

// --- Documentos ---
function isPreviewable(file: EmployeeDocFile): boolean {
  const type = file.contentType ?? ''
  return (
    type.startsWith('image/') ||
    type.startsWith('video/') ||
    type.toLowerCase() === 'application/pdf'
  )
}

function previewKindOf(file: EmployeeDocFile): 'image' | 'pdf' | 'video' | null {
  const type = file.contentType ?? ''
  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type.toLowerCase() === 'application/pdf') return 'pdf'
  return null
}

function typeLabelOf(file: EmployeeDocFile): string {
  const extension = (file.name.split('.').pop() ?? '').toUpperCase()
  if (extension) return extension
  return file.contentType?.split('/').pop()?.toUpperCase() ?? 'FILE'
}

const typeChipClass: Record<string, string> = {
  PDF: 'sn-doc-type--pdf',
  DOCX: 'sn-doc-type--docx',
  DOC: 'sn-doc-type--docx',
  XLSX: 'sn-doc-type--xlsx',
  XLS: 'sn-doc-type--xlsx',
}

function sizeLabelOf(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function dateLabelOf(value: string): string {
  try {
    return new Date(value).toLocaleDateString('es-MX', { dateStyle: 'medium' })
  } catch {
    return value
  }
}

function openPreview(file: EmployeeDocFile) {
  previewDoc.value = file
}

function closePreview() {
  previewDoc.value = null
}

function noteDownload(file: EmployeeDocFile) {
  downloadNote.value = docs.value.downloadNote.replace('{name}', file.name)
  clearTimeout(downloadNoteTimer)
  downloadNoteTimer = setTimeout(() => {
    downloadNote.value = ''
  }, 3500)
}

onMounted(() => {
  void loadDocs()
})
</script>

<template>
  <section class="sn-stack">
    <div class="sn-page__head">
      <h1 class="sn-page__title">{{ docs.title }}</h1>
      <p class="sn-page__subtitle">{{ docs.subtitle }}</p>
    </div>

    <p v-if="loadError" class="sn-note" role="alert">{{ loadError }}</p>

    <p class="sn-sidebar__label" style="padding: 0 0 8px">{{ docs.foldersLabel }}</p>
    <div class="sn-folders">
      <button
        type="button"
        class="sn-folder"
        :class="{ 'sn-folder--active': currentFolderId === null }"
        @click="selectFolder(null)"
      >
        <span class="sn-folder__icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
        </span>
        <span>
          <span class="sn-folder__name">{{ docs.rootLabel }}</span>
          <span class="sn-folder__count">
            {{ tree.files.filter((file) => file.folderId === null).length }} documentos
          </span>
        </span>
      </button>
      <button
        v-for="folder in folderViews"
        :key="folder.id"
        type="button"
        class="sn-folder"
        :class="{ 'sn-folder--active': currentFolderId === folder.id }"
        @click="selectFolder(folder.id)"
      >
        <span class="sn-folder__icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
        </span>
        <span>
          <span class="sn-folder__name">{{ folder.label }}</span>
          <span class="sn-folder__count">
            {{ tree.files.filter((file) => file.folderId === folder.id).length }} documentos
          </span>
        </span>
      </button>
    </div>

    <article class="sn-card">
      <div class="sn-card__header">
        <div>
          <h2 class="sn-card__title">{{ currentFolder?.name ?? docs.rootLabel }}</h2>
          <p class="sn-card__subtitle">
            <template v-for="(crumb, index) in breadcrumb" :key="crumb.id">
              {{ crumb.name }}<span v-if="index < breadcrumb.length - 1"> / </span>
            </template>
          </p>
        </div>
      </div>

      <p v-if="downloadNote" class="sn-note" style="margin: 12px 18px 0" role="status">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ downloadNote }}
      </p>

      <div v-if="loading" class="sn-doc-row__meta" style="padding: 32px; text-align: center">
        Cargando documentos...
      </div>

      <div v-else class="sn-table-wrap">
        <table class="sn-table">
          <thead>
            <tr>
              <th>{{ docs.columns.name }}</th>
              <th>{{ docs.columns.type }}</th>
              <th>{{ docs.columns.size }}</th>
              <th>{{ docs.columns.modified }}</th>
              <th>{{ docs.columns.owner }}</th>
              <th>{{ docs.columns.actions }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="file in folderFiles" :key="file.id">
              <td style="font-weight: 600">{{ file.name }}</td>
              <td><span class="sn-doc-type" :class="typeChipClass[typeLabelOf(file)]">{{ typeLabelOf(file) }}</span></td>
              <td class="sn-table__dim">{{ sizeLabelOf(file.sizeBytes) }}</td>
              <td class="sn-table__dim">{{ dateLabelOf(file.updatedAt) }}</td>
              <td>{{ file.ownerName }}</td>
              <td>
                <div style="display: flex; gap: 8px">
                  <button
                    v-if="isPreviewable(file)"
                    type="button"
                    class="sn-btn sn-btn--secondary sn-btn--sm"
                    @click="openPreview(file)"
                  >
                    {{ docs.viewLabel }}
                  </button>
                  <a
                    :href="employeeDocDownloadUrl(file.id)"
                    class="sn-btn sn-btn--primary sn-btn--sm"
                    :download="file.name"
                    @click="noteDownload(file)"
                  >
                    {{ docs.downloadLabel }}
                  </a>
                </div>
              </td>
            </tr>
            <tr v-if="folderFiles.length === 0">
              <td colspan="6" class="sn-table__dim" style="color: var(--sn-ink-faint)">
                {{ docs.emptyFolder }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

    <!-- Vista previa de documento -->
    <div v-if="previewDoc" class="sn-modal" @click.self="closePreview">
      <div class="sn-modal__panel" role="dialog" aria-modal="true" style="width: min(860px, 100%)">
        <div class="sn-modal__head">
          <h3 class="sn-modal__title">{{ previewDoc.name }}</h3>
          <button type="button" class="sn-modal__close" aria-label="Cerrar" @click="closePreview">✕</button>
        </div>
        <div class="sn-modal__body">
          <p class="sn-note" style="margin: 0 0 14px">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {{ docs.previewClassification }}
          </p>

          <div class="sn-card" style="background: var(--sn-bg-soft)">
            <div class="sn-card__body" style="display: grid; place-items: center; min-height: 240px">
              <img
                v-if="previewKindOf(previewDoc) === 'image'"
                :src="employeeDocPreviewUrl(previewDoc.id)"
                :alt="previewDoc.name"
                style="max-width: 100%; max-height: 60vh; border-radius: 10px; object-fit: contain"
              />
              <video
                v-else-if="previewKindOf(previewDoc) === 'video'"
                :src="employeeDocPreviewUrl(previewDoc.id)"
                controls
                preload="metadata"
                style="max-width: 100%; max-height: 60vh; width: 100%; border-radius: 10px; background: #000"
              ></video>
              <iframe
                v-else-if="previewKindOf(previewDoc) === 'pdf'"
                :src="employeeDocPreviewUrl(previewDoc.id)"
                :title="previewDoc.name"
                style="width: 100%; height: 62vh; border: none; border-radius: 10px; background: #fff"
              ></iframe>
              <p v-else class="sn-table__dim" style="text-align: center">{{ docs.previewNotSupported }}</p>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px">
            <button type="button" class="sn-btn sn-btn--secondary" @click="closePreview">Cerrar</button>
            <a
              :href="employeeDocDownloadUrl(previewDoc.id)"
              class="sn-btn sn-btn--primary"
              :download="previewDoc.name"
              @click="noteDownload(previewDoc)"
            >
              {{ docs.downloadLabel }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
