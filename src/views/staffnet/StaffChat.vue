<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { staffnetConfig } from '../../config/staffnetConfig'
import { employeeAccount } from '../../services/employeeAuth'
import {
  fetchEmployeeDirectory,
  fetchMyChats,
  sendChatMessage,
  type EmployeeDirectoryMember,
  type PortalChat,
} from '../../services/employeePortal'

const config = staffnetConfig
const chat = computed(() => config.chat)

// --- Estado del chat ---
const chats = ref<PortalChat[]>([])
const directory = ref<EmployeeDirectoryMember[]>([])
const loading = ref(true)
const loadError = ref<string | null>(null)
const activeConversationId = ref<string | null>(null)
const searchQuery = ref('')
const composerText = ref('')
const showEmojiPicker = ref(false)
const showDetails = ref(false)
const attachNote = ref('')
const sending = ref(false)

// --- Derivados ---
const meId = computed(() => employeeAccount.value?.id ?? '')

const initialsOf = (name: string): string =>
  name
    .replace(/^(Dr\.|Dra\.|Q\.F\.|BIO\.|Ing\.|TTE\.|L\.|C\.|M\.|R\.|S\.)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '??'

// El estado del directorio se traduce a la presencia visual del chat.
const presenceOf = (status: string): 'online' | 'away' | 'busy' | 'offline' => {
  switch (status) {
    case 'disponible':
      return 'online'
    case 'ocupado':
      return 'busy'
    case 'ausente':
    case 'fuera_oficina':
      return 'away'
    default:
      return 'offline'
  }
}

interface ConversationView {
  id: string
  name: string
  initials: string
  presence: 'online' | 'away' | 'busy' | 'offline'
  lastPreview: string
  lastTime: string
}

const conversationViews = computed<ConversationView[]>(() => {
  return chats.value.map((conversation) => {
    const last = conversation.messages[conversation.messages.length - 1]
    const lastPrefix = last && last.senderEmployeeId === meId.value ? `${chat.value.youLabel}: ` : ''
    return {
      id: conversation.id,
      name: conversation.otherName,
      initials: initialsOf(conversation.otherName),
      presence: presenceOf(conversation.otherStatus),
      lastPreview: (lastPrefix + (last ? last.body : '')).slice(0, 64),
      lastTime: last ? formatTime(last.sentAt) : '',
    }
  }).filter((view) => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return true
    return view.name.toLowerCase().includes(query) || view.lastPreview.toLowerCase().includes(query)
  })
})

const activeChat = computed(() =>
  chats.value.find((conversation) => conversation.id === activeConversationId.value) ?? null,
)

const activeMessages = computed(() => activeChat.value?.messages ?? [])

interface MessageGroup {
  label: string
  items: PortalChat['messages']
}

const groupedMessages = computed<MessageGroup[]>(() => {
  const groups: MessageGroup[] = []
  for (const message of activeMessages.value) {
    const label = dayLabelOf(message.sentAt)
    const lastGroup = groups[groups.length - 1]
    if (lastGroup && lastGroup.label === label) {
      lastGroup.items.push(message)
    } else {
      groups.push({ label, items: [message] })
    }
  }
  return groups
})

// --- Utilerías ---
function formatTime(value: string): string {
  try {
    return new Date(value).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })
  } catch {
    return value
  }
}

function dayLabelOf(value: string): string {
  const date = new Date(value)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  if (sameDay(date, today)) return chat.value.todayLabel
  if (sameDay(date, yesterday)) return chat.value.yesterdayLabel
  try {
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })
  } catch {
    return value
  }
}

// --- Interacciones ---
function openConversation(conversationId: string) {
  activeConversationId.value = conversationId
  showEmojiPicker.value = false
  mobileView.value = 'thread'
  scrollToBottom()
}

async function loadChats() {
  loadError.value = null
  try {
    chats.value = await fetchMyChats()
  } catch (err) {
    loadError.value = (err as Error).message || 'No se pudieron cargar los chats.'
  }
}

async function sendMessage() {
  const text = composerText.value.trim()
  const conversation = activeChat.value
  if (!text || !conversation || sending.value) return

  sending.value = true
  try {
    const created = await sendChatMessage(conversation.id, text)
    conversation.messages.push(created)
    composerText.value = ''
    showEmojiPicker.value = false
    scrollToBottom()
  } catch (err) {
    attachNote.value = (err as Error).message || 'No se pudo enviar el mensaje.'
    setTimeout(() => {
      attachNote.value = ''
    }, 3500)
  } finally {
    sending.value = false
  }
}

function insertEmoji(emoji: string) {
  composerText.value += emoji
}

// --- Vista móvil ---
const mobileView = ref<'list' | 'thread'>('list')

// --- Scroll automático del hilo ---
const threadEl = ref<HTMLElement | null>(null)

async function scrollToBottom() {
  await nextTick()
  if (threadEl.value) {
    threadEl.value.scrollTop = threadEl.value.scrollHeight
  }
}

function openSelected() {
  if (!activeConversationId.value && conversationViews.value.length > 0) {
    openConversation(conversationViews.value[0].id)
  }
}

onMounted(async () => {
  document.addEventListener('click', onDocumentClick)
  loading.value = true
  try {
    await Promise.all([loadChats(), fetchEmployeeDirectory().then((entries) => { directory.value = entries }).catch(() => { })])
  } finally {
    loading.value = false
    openSelected()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})

function onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.sn-chat__emoji-zone')) {
    showEmojiPicker.value = false
  }
}
</script>

<template>
  <section class="sn-stack">
    <div class="sn-page__head">
      <h1 class="sn-page__title">{{ chat.title }}</h1>
      <p class="sn-page__subtitle">{{ chat.subtitle }}</p>
    </div>

    <p v-if="loadError" class="sn-note" role="alert">{{ loadError }}</p>

    <div class="sn-chat" :class="{ 'sn-chat--thread-open': mobileView === 'thread' }">
      <!-- Columna 1: lista de conversaciones -->
      <aside class="sn-chat__list">
        <div class="sn-chat__list-head">
          <div class="sn-search sn-chat__search">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" class="sn-search__icon" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input v-model="searchQuery" class="sn-search__input" type="text" :placeholder="chat.searchPlaceholder" />
          </div>
        </div>

        <div class="sn-chat__conversations">
          <p class="sn-chat__section-label">{{ chat.recentLabel }}</p>
          <button
            v-for="view in conversationViews"
            :key="view.id"
            type="button"
            class="sn-chat__item"
            :class="{ 'sn-chat__item--active': view.id === activeConversationId }"
            @click="openConversation(view.id)"
          >
            <span class="sn-chat__avatar-wrap">
              <span class="sn-chat__avatar" aria-hidden="true">{{ view.initials }}</span>
              <span
                class="sn-chat__presence"
                :class="`sn-chat__presence--${view.presence}`"
                aria-hidden="true"
              ></span>
            </span>
            <span class="sn-chat__item-text">
              <span class="sn-chat__item-top">
                <span class="sn-chat__item-name">{{ view.name }}</span>
                <span class="sn-chat__item-time">{{ view.lastTime }}</span>
              </span>
              <span class="sn-chat__item-preview">{{ view.lastPreview }}</span>
            </span>
          </button>

          <p v-if="!loading && conversationViews.length === 0" class="sn-chat__empty">{{ chat.emptyListLabel }}</p>
          <div v-if="loading" class="sn-chat__empty">
            <span class="sn-chat__empty">Cargando conversaciones...</span>
          </div>
        </div>
      </aside>

      <!-- Columna 2: conversación -->
      <section class="sn-chat__thread-panel">
        <template v-if="activeChat">
          <header class="sn-chat__thread-head">
            <button type="button" class="sn-chat__back" aria-label="Volver" @click="mobileView = 'list'">←</button>
            <span class="sn-chat__avatar-wrap">
              <span class="sn-chat__avatar" aria-hidden="true">{{ initialsOf(activeChat.otherName) }}</span>
              <span
                class="sn-chat__presence"
                :class="`sn-chat__presence--${presenceOf(activeChat.otherStatus)}`"
                aria-hidden="true"
              ></span>
            </span>
            <div class="sn-chat__thread-title">
              <span class="sn-chat__thread-name">{{ activeChat.otherName }}</span>
              <span class="sn-chat__thread-presence">
                {{ chat.presenceLabels[presenceOf(activeChat.otherStatus)] }}
              </span>
            </div>
            <div class="sn-chat__thread-actions">
              <button
                type="button"
                class="sn-chat__action"
                :class="{ 'sn-chat__action--active': showDetails }"
                :aria-pressed="showDetails"
                title="Detalles"
                @click="showDetails = !showDetails"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </button>
            </div>
          </header>

          <div ref="threadEl" class="sn-chat__thread">
            <template v-for="group in groupedMessages" :key="group.label + group.items[0]?.id">
              <div class="sn-chat__divider">
                <span>{{ group.label }}</span>
              </div>

              <div
                v-for="(message, index) in group.items"
                :key="message.id"
                class="sn-chat__row"
                :class="message.senderEmployeeId === meId ? 'sn-chat__row--me' : 'sn-chat__row--them'"
              >
                <span
                  v-if="message.senderEmployeeId !== meId && (index === 0 || group.items[index - 1].senderEmployeeId !== message.senderEmployeeId)"
                  class="sn-chat__msg-avatar"
                  aria-hidden="true"
                >
                  {{ initialsOf(activeChat.otherName) }}
                </span>
                <span v-else-if="message.senderEmployeeId !== meId" class="sn-chat__msg-avatar sn-chat__msg-avatar--ghost"></span>

                <div class="sn-chat__bubble-block">
                  <div class="sn-chat__bubble">
                    {{ message.body }}
                    <span class="sn-chat__stamp">
                      {{ formatTime(message.sentAt) }}
                      <svg v-if="message.senderEmployeeId === meId" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4" class="sn-chat__check" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <p v-if="attachNote" class="sn-note" style="margin: 8px 0 0" role="status">{{ attachNote }}</p>

          <footer class="sn-chat__composer">
            <button
              type="button"
              class="sn-chat__composer-btn sn-chat__emoji-zone"
              :aria-label="chat.sendLabel"
              title="Emoji"
              @click.stop="showEmojiPicker = !showEmojiPicker"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a5.25 5.25 0 01-7.424 0M12 6.75h.008v.008H12V6.75zm.375 3a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 3a.375.375 0 11-.75 0 .375.375 0 01.75 0zM10.05 2.25a4.5 4.5 0 00-4.108 6.28L5.35 15.4a4.5 4.5 0 004.748 5.792 44.16 44.16 0 003.804-.077 44.16 44.16 0 003.804.077 4.5 4.5 0 004.748-5.792l-.592-6.87a4.5 4.5 0 00-4.108-6.28H10.05z" />
              </svg>
            </button>

            <input
              v-model="composerText"
              class="sn-chat__input"
              type="text"
              :placeholder="chat.composerPlaceholder"
              @keydown.enter.prevent="sendMessage"
            />

            <button
              type="button"
              class="sn-chat__send"
              :aria-label="chat.sendLabel"
              :disabled="composerText.trim() === '' || sending"
              @click="sendMessage"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>

            <div v-if="showEmojiPicker" class="sn-chat__emoji-zone sn-chat__emoji-pop">
              <button
                v-for="emoji in ['👍', '✅', '🙏', '🔥', '📋', '🧪', '⚠️', '🚚', '☀️', '😅', '🧬', '📞', '🧊', '📊', '🛰️', '🩺']"
                :key="emoji"
                type="button"
                class="sn-chat__emoji"
                @click="insertEmoji(emoji)"
              >
                {{ emoji }}
              </button>
            </div>
          </footer>
        </template>

        <div v-else class="sn-chat__empty-thread">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.4" class="sn-chat__empty-icon" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
          </svg>
          <p>{{ chat.selectConversationHint }}</p>
        </div>
      </section>

      <!-- Columna 3: detalles del contacto -->
      <aside v-if="showDetails && activeChat" class="sn-chat__details">
        <div class="sn-chat__details-head">
          <span class="sn-chat__avatar sn-chat__avatar--lg" aria-hidden="true">{{ initialsOf(activeChat.otherName) }}</span>
          <div>
            <p class="sn-chat__details-name">{{ activeChat.otherName }}</p>
            <p class="sn-chat__details-role">{{ activeChat.otherPosition }}</p>
            <p class="sn-chat__details-presence">
              <span
                class="sn-chat__presence"
                :class="`sn-chat__presence--${presenceOf(activeChat.otherStatus)}`"
                aria-hidden="true"
              ></span>
              {{ chat.presenceLabels[presenceOf(activeChat.otherStatus)] }}
            </p>
          </div>
        </div>

        <div class="sn-chat__details-block">
          <p class="sn-kv__label">{{ chat.detailsEmailLabel }}</p>
          <p class="sn-table__mono">{{ activeChat.otherEmail }}</p>
        </div>
        <div class="sn-chat__details-block">
          <p class="sn-kv__label">{{ chat.detailsExtensionLabel }}</p>
          <p class="sn-table__mono">{{ activeChat.otherEmployeeNumber }}</p>
        </div>
        <div class="sn-chat__details-block">
          <p class="sn-kv__label">{{ chat.detailsDepartmentLabel }}</p>
          <p class="sn-table__mono">{{ activeChat.otherDepartment || '—' }}</p>
        </div>
      </aside>
    </div>
  </section>
</template>
