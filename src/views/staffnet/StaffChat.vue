<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { staffnetConfig } from '../../config/staffnetConfig'
import {
  chatAutoReplies,
  chatContacts,
  chatConversations,
  chatMessages,
  chatSharedFiles,
  type ChatContact,
  type ChatMessage,
} from '../../mocks/chatData'
import { staffUser } from '../../mocks/staffnetData'

const config = staffnetConfig
const chat = computed(() => config.chat)

// --- Estado del chat ---
const conversations = ref(chatConversations.map((c) => ({ ...c })))
const messages = ref<ChatMessage[]>(chatMessages.map((m) => ({ ...m })))
const activeConversationId = ref<string | null>(null)
const searchQuery = ref('')
const composerText = ref('')
const showEmojiPicker = ref(false)
const showDetails = ref(false)
const showNewChat = ref(false)
const typingIn = ref<string | null>(null)
const attachNote = ref('')

let messageCounter = chatMessages.length
let typingTimer: ReturnType<typeof setTimeout> | undefined
let replyTimer: ReturnType<typeof setTimeout> | undefined

// --- Derivados ---
const contactById = (contactId: string): ChatContact | undefined =>
  chatContacts.find((contact) => contact.id === contactId)

interface ConversationView {
  id: string
  name: string
  initials: string
  presence: ChatContact['presence'] | null
  isGroup: boolean
  section: 'pinned' | 'recent'
  unread: number
  lastPreview: string
  lastTime: string
}

const conversationViews = computed<ConversationView[]>(() => {
  return conversations.value
    .map((conversation) => {
      const contact = contactById(conversation.contactId)
      const conversationMessages = messages.value.filter(
        (message) => message.conversationId === conversation.id,
      )
      const last = conversationMessages[conversationMessages.length - 1]
      let name: string
      let initials: string
      let presence: ChatContact['presence'] | null
      if (conversation.isGroup) {
        name = 'Equipo DEP-04 · Campo'
        initials = 'D4'
        presence = 'online'
      } else if (contact) {
        name = contact.name
        initials = contact.initials
        presence = contact.presence
      } else {
        name = conversation.contactId
        initials = '??'
        presence = null
      }
      const lastText = last ? last.text : ''
      const lastPrefix =
        last && last.senderId === 'me' ? `${chat.value.youLabel}: ` : conversation.isGroup && last ? `${contactById(last.senderId)?.name.split(' ').pop() ?? ''}: ` : ''
      return {
        id: conversation.id,
        name,
        initials,
        presence,
        isGroup: conversation.isGroup,
        section: conversation.section,
        unread: conversation.unread,
        lastPreview: (lastPrefix + lastText).slice(0, 64),
        lastTime: last ? last.time : '',
      }
    })
    .filter((view) => {
      const query = searchQuery.value.trim().toLowerCase()
      if (!query) return true
      return (
        view.name.toLowerCase().includes(query) ||
        view.lastPreview.toLowerCase().includes(query)
      )
    })
})

const pinnedConversations = computed(() =>
  conversationViews.value.filter((view) => view.section === 'pinned'),
)
const recentConversations = computed(() =>
  conversationViews.value.filter((view) => view.section === 'recent'),
)

const activeConversation = computed(() =>
  conversations.value.find((conversation) => conversation.id === activeConversationId.value) ?? null,
)

const activeContact = computed(() => {
  const conversation = activeConversation.value
  if (!conversation || conversation.isGroup) return null
  return contactById(conversation.contactId) ?? null
})

const activeName = computed(() => {
  const conversation = activeConversation.value
  if (!conversation) return ''
  if (conversation.isGroup) return 'Equipo DEP-04 · Campo'
  return activeContact.value?.name ?? ''
})

const activePresence = computed(() => {
  if (!activeConversation.value) return null
  if (activeConversation.value.isGroup) return 'online' as const
  return activeContact.value?.presence ?? null
})

const activeMessages = computed(() =>
  messages.value
    .filter((message) => message.conversationId === activeConversationId.value)
    .sort((a, b) => (a.day === b.day ? a.time.localeCompare(b.time) : a.day === 'yesterday' ? -1 : 1)),
)

const activeSharedFiles = computed(() =>
  chatSharedFiles.filter((file) => file.conversationId === activeConversationId.value),
)

// Contactos disponibles para iniciar un chat nuevo (que no tengan conversación)
const newChatCandidates = computed(() =>
  chatContacts.filter(
    (contact) =>
      !conversations.value.some(
        (conversation) => conversation.contactId === contact.id && !conversation.isGroup,
      ),
  ),
)

const presenceLabel = computed(() => {
  if (!activePresence.value) return ''
  return chat.value.presenceLabels[activePresence.value]
})

// --- Interacciones ---
function openConversation(conversationId: string) {
  activeConversationId.value = conversationId
  const conversation = conversations.value.find((item) => item.id === conversationId)
  if (conversation) {
    conversation.unread = 0
  }
  showEmojiPicker.value = false
  mobileView.value = 'thread'
  scrollToBottom()
}

function senderName(senderId: string): string {
  if (senderId === 'me') return chat.value.youLabel
  return contactById(senderId)?.name ?? senderId
}

function senderInitials(senderId: string): string {
  if (senderId === 'me') return staffUser.initials
  return contactById(senderId)?.initials ?? '??'
}

function startNewChat(contactId: string) {
  const existing = conversations.value.find(
    (conversation) => conversation.contactId === contactId && !conversation.isGroup,
  )
  if (existing) {
    openConversation(existing.id)
    showNewChat.value = false
    return
  }
  conversations.value.unshift({
    id: `conv-${contactId}`,
    contactId,
    section: 'recent',
    unread: 0,
    isGroup: false,
  })
  openConversation(`conv-${contactId}`)
  showNewChat.value = false
}

function currentClock(): string {
  return new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function sendMessage() {
  const text = composerText.value.trim()
  const conversationId = activeConversationId.value
  const conversation = conversations.value.find((item) => item.id === conversationId)
  if (!text || !conversationId || !conversation) return

  messages.value.push({
    id: `msg-${++messageCounter}`,
    conversationId,
    senderId: 'me',
    text,
    time: currentClock(),
    day: 'today',
  })
  composerText.value = ''
  showEmojiPicker.value = false
  scrollToBottom()

  // Respuesta automática simulada del contacto
  const replies = chatAutoReplies[conversation.contactId]
  if (!replies || replies.length === 0) return

  typingIn.value = conversationId
  scrollToBottom()
  typingTimer = setTimeout(() => {
    const replyIndex = (replyIndexByConversation[conversationId] ?? 0) % replies.length
    const reply = replies[replyIndex]
    replyIndexByConversation[conversationId] = replyIndex + 1
    typingIn.value = null
    messages.value.push({
      id: `msg-${++messageCounter}`,
      conversationId,
      senderId: conversation.contactId,
      text: reply,
      time: currentClock(),
      day: 'today',
    })
    scrollToBottom()
  }, 1600 + Math.random() * 900)
}

const replyIndexByConversation: Record<string, number> = {}

function insertEmoji(emoji: string) {
  composerText.value += emoji
}

function simulateAttach() {
  attachNote.value = chat.value.attachNote
  setTimeout(() => {
    attachNote.value = ''
  }, 3500)
}

// --- Detalles del contacto ---
const detailContact = computed(() => {
  const conversation = activeConversation.value
  if (!conversation) return null
  return contactById(conversation.contactId) ?? null
})

// --- Agrupación de mensajes por día ---
interface MessageGroup {
  day: 'today' | 'yesterday'
  items: ChatMessage[]
}

const groupedMessages = computed<MessageGroup[]>(() => {
  const groups: MessageGroup[] = []
  for (const message of activeMessages.value) {
    const lastGroup = groups[groups.length - 1]
    if (lastGroup && lastGroup.day === message.day) {
      lastGroup.items.push(message)
    } else {
      groups.push({ day: message.day, items: [message] })
    }
  }
  return groups
})

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

onMounted(() => {
  openSelected()
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  if (typingTimer) clearTimeout(typingTimer)
  if (replyTimer) clearTimeout(replyTimer)
})

function onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.sn-chat__emoji-zone')) {
    showEmojiPicker.value = false
  }
  if (!target.closest('.sn-chat__newchat')) {
    showNewChat.value = false
  }
}
</script>

<template>
  <section class="sn-stack">
    <div class="sn-page__head">
      <h1 class="sn-page__title">{{ chat.title }}</h1>
      <p class="sn-page__subtitle">{{ chat.subtitle }}</p>
    </div>

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
          <div class="sn-chat__newchat">
            <button
              type="button"
              class="sn-chat__newchat-btn"
              :aria-label="chat.newChatLabel"
              @click="showNewChat = !showNewChat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="sn-chat__newchat-icon" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            <div v-if="showNewChat" class="sn-chat__newchat-pop">
              <p class="sn-chat__newchat-title">{{ chat.newChatTitle }}</p>
              <button
                v-for="contact in newChatCandidates"
                :key="contact.id"
                type="button"
                class="sn-chat__newchat-item"
                @click="startNewChat(contact.id)"
              >
                <span class="sn-person__avatar" aria-hidden="true">{{ contact.initials }}</span>
                <span>
                  <span class="sn-person__name">{{ contact.name }}</span>
                  <span class="sn-doc-row__meta">{{ contact.role }}</span>
                </span>
              </button>
              <p v-if="newChatCandidates.length === 0" class="sn-doc-row__meta" style="padding: 6px 10px">
                {{ chat.emptyListLabel }}
              </p>
            </div>
          </div>
        </div>

        <div class="sn-chat__conversations">
          <template v-if="pinnedConversations.length > 0">
            <p class="sn-chat__section-label">{{ chat.pinnedLabel }}</p>
            <button
              v-for="view in pinnedConversations"
              :key="view.id"
              type="button"
              class="sn-chat__item"
              :class="{ 'sn-chat__item--active': view.id === activeConversationId }"
              @click="openConversation(view.id)"
            >
              <span class="sn-chat__avatar-wrap">
                <span class="sn-chat__avatar" :class="{ 'sn-chat__avatar--group': view.isGroup }" aria-hidden="true">
                  {{ view.initials }}
                </span>
                <span
                  v-if="view.presence"
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
              <span v-if="view.unread > 0" class="sn-chat__unread">{{ view.unread }}</span>
            </button>
          </template>

          <p class="sn-chat__section-label">{{ chat.recentLabel }}</p>
          <button
            v-for="view in recentConversations"
            :key="view.id"
            type="button"
            class="sn-chat__item"
            :class="{ 'sn-chat__item--active': view.id === activeConversationId }"
            @click="openConversation(view.id)"
          >
            <span class="sn-chat__avatar-wrap">
              <span class="sn-chat__avatar" :class="{ 'sn-chat__avatar--group': view.isGroup }" aria-hidden="true">
                {{ view.initials }}
              </span>
              <span
                v-if="view.presence"
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
            <span v-if="view.unread > 0" class="sn-chat__unread">{{ view.unread }}</span>
          </button>

          <p v-if="conversationViews.length === 0" class="sn-chat__empty">{{ chat.emptyListLabel }}</p>
        </div>
      </aside>

      <!-- Columna 2: conversación -->
      <section class="sn-chat__thread-panel">
        <template v-if="activeConversation">
          <header class="sn-chat__thread-head">
            <button type="button" class="sn-chat__back" aria-label="Volver" @click="mobileView = 'list'">←</button>
            <span class="sn-chat__avatar-wrap">
              <span class="sn-chat__avatar" :class="{ 'sn-chat__avatar--group': activeConversation.isGroup }" aria-hidden="true">
                {{ activeConversation.isGroup ? 'D4' : activeContact?.initials }}
              </span>
              <span
                v-if="activePresence"
                class="sn-chat__presence"
                :class="`sn-chat__presence--${activePresence}`"
                aria-hidden="true"
              ></span>
            </span>
            <div class="sn-chat__thread-title">
              <span class="sn-chat__thread-name">{{ activeName }}</span>
              <span class="sn-chat__thread-presence">
                {{ typingIn === activeConversationId ? chat.typingLabel : presenceLabel }}
              </span>
            </div>
            <div class="sn-chat__thread-actions">
              <button type="button" class="sn-chat__action" :aria-label="chat.demoNote" title="Llamada">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </button>
              <button type="button" class="sn-chat__action" title="Videollamada">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </button>
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
            <template v-for="group in groupedMessages" :key="group.day">
              <div class="sn-chat__divider">
                <span>{{ group.day === 'today' ? chat.todayLabel : chat.yesterdayLabel }}</span>
              </div>

              <div
                v-for="(message, index) in group.items"
                :key="message.id"
                class="sn-chat__row"
                :class="message.senderId === 'me' ? 'sn-chat__row--me' : 'sn-chat__row--them'"
              >
                <span
                  v-if="message.senderId !== 'me' && (index === 0 || group.items[index - 1].senderId !== message.senderId)"
                  class="sn-chat__msg-avatar"
                  aria-hidden="true"
                >
                  {{ senderInitials(message.senderId) }}
                </span>
                <span v-else-if="message.senderId !== 'me'" class="sn-chat__msg-avatar sn-chat__msg-avatar--ghost"></span>

                <div class="sn-chat__bubble-block">
                  <span
                    v-if="message.senderId !== 'me' && activeConversation.isGroup && (index === 0 || group.items[index - 1].senderId !== message.senderId)"
                    class="sn-chat__sender"
                  >
                    {{ senderName(message.senderId) }}
                  </span>
                  <div class="sn-chat__bubble">
                    {{ message.text }}
                    <span class="sn-chat__stamp">
                      {{ message.time }}
                      <svg v-if="message.senderId === 'me'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4" class="sn-chat__check" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </template>

            <div v-if="typingIn === activeConversationId" class="sn-chat__row sn-chat__row--them">
              <span class="sn-chat__msg-avatar" aria-hidden="true">
                {{ activeConversation.isGroup ? 'D4' : activeContact?.initials }}
              </span>
              <div class="sn-chat__bubble sn-chat__bubble--typing">
                <span class="sn-typing-dot"></span>
                <span class="sn-typing-dot"></span>
                <span class="sn-typing-dot"></span>
              </div>
            </div>
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
            <button
              type="button"
              class="sn-chat__composer-btn"
              :aria-label="chat.attachNote"
              title="Adjuntar"
              @click="simulateAttach"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
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
              :disabled="composerText.trim() === ''"
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

          <p class="sn-chat__demo">{{ chat.demoNote }}</p>
        </template>

        <div v-else class="sn-chat__empty-thread">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.4" class="sn-chat__empty-icon" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
          </svg>
          <p>{{ chat.selectConversationHint }}</p>
        </div>
      </section>

      <!-- Columna 3: detalles del contacto -->
      <aside v-if="showDetails && activeConversation" class="sn-chat__details">
        <template v-if="!activeConversation.isGroup && detailContact">
          <div class="sn-chat__details-head">
            <span class="sn-chat__avatar sn-chat__avatar--lg" aria-hidden="true">{{ detailContact.initials }}</span>
            <div>
              <p class="sn-chat__details-name">{{ detailContact.name }}</p>
              <p class="sn-chat__details-role">{{ detailContact.role }}</p>
              <p class="sn-chat__details-presence">
                <span
                  class="sn-chat__presence"
                  :class="`sn-chat__presence--${detailContact.presence}`"
                  aria-hidden="true"
                ></span>
                {{ chat.presenceLabels[detailContact.presence] }}
              </p>
            </div>
          </div>

          <div class="sn-chat__details-block">
            <p class="sn-kv__label">{{ chat.detailsEmailLabel }}</p>
            <p class="sn-table__mono">{{ detailContact.email }}</p>
          </div>
          <div class="sn-chat__details-block">
            <p class="sn-kv__label">{{ chat.detailsExtensionLabel }}</p>
            <p class="sn-table__mono">EXT. {{ detailContact.extension }}</p>
          </div>
        </template>

        <template v-else>
          <div class="sn-chat__details-head">
            <span class="sn-chat__avatar sn-chat__avatar--lg sn-chat__avatar--group" aria-hidden="true">D4</span>
            <div>
              <p class="sn-chat__details-name">Equipo DEP-04 · Campo</p>
              <p class="sn-chat__details-role">Chat de grupo · 3 participantes</p>
            </div>
          </div>
        </template>

        <div class="sn-chat__details-block">
          <p class="sn-kv__label">{{ chat.detailsFilesLabel }}</p>
          <div class="sn-stack" style="gap: 8px; margin-top: 6px">
            <div v-for="file in activeSharedFiles" :key="file.name" class="sn-doc-row">
              <span class="sn-doc-row__icon">DOC</span>
              <div>
                <span class="sn-doc-row__name">{{ file.name }}</span>
                <span class="sn-doc-row__meta">{{ file.size }} · {{ file.modified }}</span>
              </div>
            </div>
            <p v-if="activeSharedFiles.length === 0" class="sn-doc-row__meta">Sin archivos compartidos.</p>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>
