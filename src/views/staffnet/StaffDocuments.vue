<script setup lang="ts">
import { computed, ref } from 'vue'
import { staffnetConfig } from '../../config/staffnetConfig'
import { documentFolders, staffDocuments, type StaffDocument } from '../../mocks/staffnetData'

const config = staffnetConfig

const activeFolderId = ref(documentFolders[0]?.id ?? '')
const previewDoc = ref<StaffDocument | null>(null)
const downloadNote = ref('')

const folderDocs = computed(() =>
  staffDocuments.filter((doc) => doc.folderId === activeFolderId.value),
)

const activeFolder = computed(() =>
  documentFolders.find((folder) => folder.id === activeFolderId.value),
)

function folderCount(folderId: string): number {
  return staffDocuments.filter((doc) => doc.folderId === folderId).length
}

function selectFolder(folderId: string) {
  activeFolderId.value = folderId
}

function openPreview(doc: StaffDocument) {
  previewDoc.value = doc
}

function closePreview() {
  previewDoc.value = null
}

function simulateDownload(doc: StaffDocument) {
  downloadNote.value = config.documents.downloadNote.replace('{name}', doc.name)
  setTimeout(() => {
    downloadNote.value = ''
  }, 3500)
}

const typeChipClass: Record<string, string> = {
  PDF: 'sn-doc-type--pdf',
  DOCX: 'sn-doc-type--docx',
  XLSX: 'sn-doc-type--xlsx',
}
</script>

<template>
  <section class="sn-stack">
    <div class="sn-page__head">
      <h1 class="sn-page__title">{{ config.documents.title }}</h1>
      <p class="sn-page__subtitle">{{ config.documents.subtitle }}</p>
    </div>

    <p class="sn-sidebar__label" style="padding: 0 0 8px">{{ config.documents.foldersLabel }}</p>
    <div class="sn-folders">
      <button
        v-for="folder in documentFolders"
        :key="folder.id"
        type="button"
        class="sn-folder"
        :class="{ 'sn-folder--active': activeFolderId === folder.id }"
        @click="selectFolder(folder.id)"
      >
        <span class="sn-folder__icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
        </span>
        <span>
          <span class="sn-folder__name">{{ folder.name }}</span>
          <span class="sn-folder__count">{{ folderCount(folder.id) }} documentos · {{ folder.description }}</span>
        </span>
      </button>
    </div>

    <article class="sn-card">
      <div class="sn-card__header">
        <div>
          <h2 class="sn-card__title">{{ activeFolder?.name }}</h2>
          <p class="sn-card__subtitle">{{ activeFolder?.description }}</p>
        </div>
      </div>

      <p v-if="downloadNote" class="sn-note" style="margin: 12px 18px 0" role="status">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ downloadNote }}
      </p>

      <div class="sn-table-wrap">
        <table class="sn-table">
          <thead>
            <tr>
              <th>{{ config.documents.columns.name }}</th>
              <th>{{ config.documents.columns.type }}</th>
              <th>{{ config.documents.columns.size }}</th>
              <th>{{ config.documents.columns.modified }}</th>
              <th>{{ config.documents.columns.owner }}</th>
              <th>{{ config.documents.columns.actions }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in folderDocs" :key="doc.id">
              <td style="font-weight: 600">{{ doc.name }}</td>
              <td><span class="sn-doc-type" :class="typeChipClass[doc.type]">{{ doc.type }}</span></td>
              <td class="sn-table__dim">{{ doc.size }}</td>
              <td class="sn-table__dim">{{ doc.modified }}</td>
              <td>{{ doc.owner }}</td>
              <td>
                <div style="display: flex; gap: 8px">
                  <button type="button" class="sn-btn sn-btn--secondary sn-btn--sm" @click="openPreview(doc)">
                    {{ config.documents.viewLabel }}
                  </button>
                  <button type="button" class="sn-btn sn-btn--primary sn-btn--sm" @click="simulateDownload(doc)">
                    {{ config.documents.downloadLabel }}
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="folderDocs.length === 0">
              <td colspan="6" class="sn-table__dim" style="color: var(--sn-ink-faint)">
                {{ config.documents.emptyFolder }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

    <!-- Vista previa de documento -->
    <div v-if="previewDoc" class="sn-modal" @click.self="closePreview">
      <div class="sn-modal__panel" role="dialog" aria-modal="true">
        <div class="sn-modal__head">
          <h3 class="sn-modal__title">{{ previewDoc.name }}</h3>
          <button type="button" class="sn-modal__close" aria-label="Cerrar" @click="closePreview">✕</button>
        </div>
        <div class="sn-modal__body">
          <p class="sn-note" style="margin: 0 0 14px">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {{ config.documents.previewClassification }}
          </p>
          <div class="sn-card" style="background: var(--sn-bg-soft)">
            <div class="sn-card__body">
              <pre style="margin: 0; white-space: pre-wrap; font-family: var(--sn-font); font-size: 12.5px; line-height: 1.7; color: var(--sn-ink-soft)">{{ previewDoc.previewLines.join('\n') }}</pre>
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px">
            <button type="button" class="sn-btn sn-btn--secondary" @click="closePreview">Cerrar</button>
            <button type="button" class="sn-btn sn-btn--primary" @click="simulateDownload(previewDoc); closePreview()">
              {{ config.documents.downloadLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
