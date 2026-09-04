// Datos simulados del módulo de Mensajes (StaffNet Chat, modo placeholder).

export interface ChatContact {
  id: string
  name: string
  role: string
  initials: string
  presence: 'online' | 'away' | 'busy' | 'offline'
  email: string
  extension: string
}

export interface ChatConversation {
  id: string
  contactId: string
  section: 'pinned' | 'recent'
  unread: number
  isGroup: boolean
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string // 'me' o el id de un contacto
  text: string
  time: string
  day: 'today' | 'yesterday'
}

export interface ChatSharedFile {
  conversationId: string
  name: string
  size: string
  modified: string
}

export const chatContacts: ChatContact[] = [
  {
    id: 'martha',
    name: 'Q.F. Martha Escalante',
    role: 'Jefa de Síntesis Molecular',
    initials: 'ME',
    presence: 'online',
    email: 'mescalante@fisinor.com.mx',
    extension: '4210',
  },
  {
    id: 'indira',
    name: 'C. Indira Gaxiola',
    role: 'Oficial de Bioseguridad',
    initials: 'IG',
    presence: 'busy',
    email: 'igaxiola@fisinor.com.mx',
    extension: '4055',
  },
  {
    id: 'pablo',
    name: 'Ing. Pablo Ceballos',
    role: 'Técnico de Redes',
    initials: 'PC',
    presence: 'online',
    email: 'pceballos@fisinor.com.mx',
    extension: '4166',
  },
  {
    id: 'karla',
    name: 'M. Karla Sandoval',
    role: 'Coordinadora de Recursos Humanos',
    initials: 'KS',
    presence: 'online',
    email: 'ksandoval@fisinor.com.mx',
    extension: '4021',
  },
  {
    id: 'ramon',
    name: 'L. Ramón Guerrero',
    role: 'Administrador de Credenciales',
    initials: 'RG',
    presence: 'away',
    email: 'rguerrero@fisinor.com.mx',
    extension: '4038',
  },
  {
    id: 'eder',
    name: 'BIO. Eder Valdez',
    role: 'Evaluador de Campo',
    initials: 'EV',
    presence: 'offline',
    email: 'evaldez@fisinor.com.mx',
    extension: '4225',
  },
]

export const chatConversations: ChatConversation[] = [
  { id: 'conv-martha', contactId: 'martha', section: 'pinned', unread: 2, isGroup: false },
  { id: 'conv-dep04', contactId: 'dep04', section: 'pinned', unread: 0, isGroup: true },
  { id: 'conv-indira', contactId: 'indira', section: 'recent', unread: 1, isGroup: false },
  { id: 'conv-pablo', contactId: 'pablo', section: 'recent', unread: 0, isGroup: false },
  { id: 'conv-karla', contactId: 'karla', section: 'recent', unread: 0, isGroup: false },
  { id: 'conv-ramon', contactId: 'ramon', section: 'recent', unread: 0, isGroup: false },
  { id: 'conv-eder', contactId: 'eder', section: 'recent', unread: 0, isGroup: false },
]

export const chatMessages: ChatMessage[] = [
  // Conversación con Martha (hoy)
  {
    id: 'm-01',
    conversationId: 'conv-martha',
    senderId: 'martha',
    text: 'Elena, buen día. ¿Los lotes del criobox 7 ya pasaron a custodia de DEP-01?',
    time: '08:42',
    day: 'today',
  },
  {
    id: 'm-02',
    conversationId: 'conv-martha',
    senderId: 'me',
    text: 'Buen día, Martha. Sí, quedaron registrados a las 07:50. Te comparto el folio de la bitácora.',
    time: '08:45',
    day: 'today',
  },
  {
    id: 'm-03',
    conversationId: 'conv-martha',
    senderId: 'martha',
    text: 'Perfecto. El Consejo pidió recontar las muestras del lote 88 antes del viernes.',
    time: '08:46',
    day: 'today',
  },
  {
    id: 'm-04',
    conversationId: 'conv-martha',
    senderId: 'martha',
    text: 'Necesito tu firma en el formato de custodia. ¿Puedes pasar por DEP-01 antes del mediodía?',
    time: '08:47',
    day: 'today',
  },

  // Grupo DEP-04 (hoy)
  {
    id: 'm-10',
    conversationId: 'conv-dep04',
    senderId: 'eder',
    text: 'La estación móvil 04 ya está posicionada en Miguel Alemán.',
    time: '07:58',
    day: 'today',
  },
  {
    id: 'm-11',
    conversationId: 'conv-dep04',
    senderId: 'martha',
    text: 'Recuerden sellar los lotes Nivel 3 inmediatamente después de aplicar.',
    time: '08:03',
    day: 'today',
  },
  {
    id: 'm-12',
    conversationId: 'conv-dep04',
    senderId: 'me',
    text: 'Copiado. Subo el reporte de jornada al gestor antes de las 12:00 h.',
    time: '08:10',
    day: 'today',
  },

  // Indira (ayer)
  {
    id: 'm-20',
    conversationId: 'conv-indira',
    senderId: 'indira',
    text: 'Elena, mañana tengo agendada la auditoría del perímetro norte.',
    time: '16:22',
    day: 'yesterday',
  },
  {
    id: 'm-21',
    conversationId: 'conv-indira',
    senderId: 'indira',
    text: 'Necesito tu bitácora de campo antes de las 14:00 h. Sin excepciones: el Consejo revisa esa zona.',
    time: '16:24',
    day: 'yesterday',
  },

  // Pablo (hoy)
  {
    id: 'm-30',
    conversationId: 'conv-pablo',
    senderId: 'pablo',
    text: 'Tu ticket SN-2026-0231 ya está en proceso. La VPN del edificio B cae por un switch dañado.',
    time: '09:12',
    day: 'today',
  },
  {
    id: 'm-31',
    conversationId: 'conv-pablo',
    senderId: 'pablo',
    text: 'Mientras tanto, usa el cable directo del cubículo 14.',
    time: '09:13',
    day: 'today',
  },

  // Karla (ayer)
  {
    id: 'm-40',
    conversationId: 'conv-karla',
    senderId: 'me',
    text: 'Karla, ¿ya está publicado el menú de la cafetería de octubre?',
    time: '11:30',
    day: 'yesterday',
  },
  {
    id: 'm-41',
    conversationId: 'conv-karla',
    senderId: 'karla',
    text: 'Sí, entró esta mañana al boletín de StaffNet.',
    time: '11:41',
    day: 'yesterday',
  },

  // Ramón (hoy)
  {
    id: 'm-50',
    conversationId: 'conv-ramon',
    senderId: 'ramon',
    text: 'Tu solicitud de Licencia Nivel 3 sigue en revisión. No puedo acelerar el trámite.',
    time: '07:55',
    day: 'today',
  },
  {
    id: 'm-51',
    conversationId: 'conv-ramon',
    senderId: 'me',
    text: 'Entendido, Ramón. Quedo atento. ¿Sabes si la auditoría presencial ya tiene fecha?',
    time: '07:58',
    day: 'today',
  },

  // Eder (ayer)
  {
    id: 'm-60',
    conversationId: 'conv-eder',
    senderId: 'eder',
    text: 'Mañana cubro mi ruta de la costa. Si necesitas muestras del vivero 3, avísame hoy.',
    time: '17:02',
    day: 'yesterday',
  },
]

export const chatAutoReplies: Record<string, string[]> = {
  martha: [
    'Entendido, lo reviso en un momento y te confirmo.',
    'Perfecto. Dejo constancia en la bitácora del turno.',
  ],
  indira: [
    'Anotado. Cualquier hallazgo repórtalo por el canal de bioseguridad.',
    'Recibido. Mantén el perímetro sellado mientras llega el equipo.',
  ],
  pablo: [
    'Dame 20 minutos y reinicio el switch del edificio B.',
    'Listo, ya tienes conexión de nuevo. Si falla, reabre el ticket.',
  ],
  karla: [
    'Con gusto. Cualquier duda de RH me escribes por aquí.',
    'Lo agendo para la próxima circular interna.',
  ],
  ramon: [
    'Los trámites de credenciales tardan 48 h hábiles.',
    'Tu solicitud sigue en revisión por la Dirección Operativa.',
  ],
  eder: [
    'Copiado. Te confirmo desde la unidad móvil.',
    'En camino al punto de distribución.',
  ],
  dep04: ['Recibido, equipo.', 'Anotado en la bitácora de campo.'],
}

export const chatSharedFiles: ChatSharedFile[] = [
  {
    conversationId: 'conv-martha',
    name: 'Inventario_Criobox7_OCT.xlsx',
    size: '240 KB',
    modified: 'hoy',
  },
  {
    conversationId: 'conv-martha',
    name: 'Protocolo_Custodia_Muestras.pdf',
    size: '1.1 MB',
    modified: 'ayer',
  },
  {
    conversationId: 'conv-pablo',
    name: 'Diagnostico_VPN_EdificioB.pdf',
    size: '580 KB',
    modified: 'hoy',
  },
  {
    conversationId: 'conv-dep04',
    name: 'Reporte_Jornada_0610.docx',
    size: '95 KB',
    modified: 'hoy',
  },
]
