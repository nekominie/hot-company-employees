<script setup lang="ts">
import { computed, ref } from 'vue'
import { employeePortalConfig } from '../../config/employeePortalConfig'
import { fileFolders, repositoryFiles, type RepositoryFile } from '../../mocks/employeePortalData'
import ConsoleModal from '../../components/console/ConsoleModal.vue'

const config = employeePortalConfig

const OPERATOR_CLEARANCE = 2

const activeFolderId = ref(fileFolders[0]?.id ?? '')
const openedFile = ref<RepositoryFile | null>(null)

const folderFiles = computed(() =>
  repositoryFiles.filter((file) => file.folderId === activeFolderId.value),
)

const activeFolder = computed(() =>
  fileFolders.find((folder) => folder.id === activeFolderId.value),
)

function folderFileCount(folderId: string): number {
  return repositoryFiles.filter((file) => file.folderId === folderId).length
}

function selectFolder(folderId: string) {
  activeFolderId.value = folderId
  openedFile.value = null
}

function openFile(file: RepositoryFile) {
  openedFile.value = file
}

function closeViewer() {
  openedFile.value = null
}

const accessDenied = computed(
  () => openedFile.value !== null && openedFile.value.accessLevel > OPERATOR_CLEARANCE,
)

const classbarClass = computed(() => {
  if (!openedFile.value) return ''
  if (openedFile.value.classification === 'LEVEL3') return 'fn-doc__classbar--red'
  if (openedFile.value.classification === 'CONFIDENCIAL') return 'fn-doc__classbar--amber'
  return 'fn-doc__classbar--green'
})

const classificationChip: Record<string, string> = {
  INTERNO: 'fn-badge--gray',
  CONFIDENCIAL: 'fn-badge--amber',
  LEVEL3: 'fn-badge--red',
}
</script>

<template>
  <section class="fn-stack">
    <div class="fn-page__head">
      <div>
        <h1 class="fn-page__title">{{ config.files.title }}</h1>
        <p class="fn-page__subtitle">{{ config.files.subtitle }}</p>
      </div>
      <span class="fn-page__crumb">{{ config.files.crumb }}</span>
    </div>

    <div class="fn-grid-files">
      <div class="fn-panel">
        <div class="fn-panel__title">
          <span><span class="fn-panel__title-marker">▌</span>{{ config.files.foldersLabel }}</span>
        </div>
        <div class="fn-panel__body">
          <div class="fn-folders">
            <button
              v-for="folder in fileFolders"
              :key="folder.id"
              type="button"
              class="fn-folder"
              :class="{ 'fn-folder--active': activeFolderId === folder.id }"
              @click="selectFolder(folder.id)"
            >
              {{ folder.name }}
              <span v-if="folder.locked" class="fn-folder__lock">{{ config.files.lockedLabel }}</span>
              <span class="fn-folder__count">
                {{ folderFileCount(folder.id) }} {{ config.files.filesCountLabel }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <article class="fn-panel">
        <div class="fn-panel__title">
          <span>
            <span class="fn-panel__title-marker">▌</span>{{ activeFolder?.name }}
            <span class="fn-panel__title-note">// CLEARANCE LEVEL 2</span>
          </span>
        </div>
        <div class="fn-table-wrap">
          <table class="fn-table">
            <thead>
              <tr>
                <th>{{ config.files.columns.name }}</th>
                <th>{{ config.files.columns.size }}</th>
                <th>{{ config.files.columns.modified }}</th>
                <th>{{ config.files.columns.classification }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="file in folderFiles" :key="file.id">
                <td class="fn-table__mono">
                  {{ file.name }}
                  <span v-if="file.accessLevel > 2" class="fn-folder__lock">🔒</span>
                </td>
                <td class="fn-table__dim">{{ file.size }}</td>
                <td class="fn-table__dim">{{ file.modified }}</td>
                <td>
                  <span class="fn-badge" :class="classificationChip[file.classification]">
                    {{ file.classification }}
                  </span>
                </td>
                <td>
                  <button type="button" class="fn-btn fn-btn--sm" @click="openFile(file)">
                    {{ config.files.openLabel }}
                  </button>
                </td>
              </tr>
              <tr v-if="folderFiles.length === 0">
                <td colspan="5" class="fn-table__dim">// directorio vacío</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>

    <ConsoleModal :open="openedFile !== null" :title="openedFile?.name ?? ''" @close="closeViewer">
      <template v-if="openedFile">
        <!-- Acceso denegado para LEVEL3 -->
        <div v-if="accessDenied" class="fn-denied" role="alert">
          <p class="fn-denied__title">{{ config.files.deniedTitle }}</p>
          <p class="fn-denied__text">{{ config.files.deniedText }}</p>
          <div style="display: flex; gap: 10px; margin-top: 6px">
            <span class="fn-badge fn-badge--red">CLEARANCE_OPERADOR: LEVEL 2</span>
            <span class="fn-badge fn-badge--gray">DOCUMENTO: LEVEL 3</span>
          </div>
        </div>

        <!-- Visor de documento -->
        <div v-else class="fn-doc">
          <div class="fn-doc__classbar" :class="classbarClass">
            <span>CLASIFICACIÓN: {{ openedFile.classification }}</span>
            <span>DOC-REF: {{ openedFile.id.toUpperCase() }}-{{ openedFile.accessLevel }}0{{ openedFile.name.length % 10 }}</span>
          </div>
          <pre class="fn-doc__content">{{ openedFile.content.join('\n') }}</pre>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 12px">
          <button type="button" class="fn-btn" @click="closeViewer">{{ config.files.viewerClose }}</button>
        </div>
      </template>
    </ConsoleModal>
  </section>
</template>
