export interface StaffNetConfig {
  brand: {
    companyName: string
    netName: string
    subLabel: string
    logo: string
  }
  documentTitles: {
    base: string
    pages: Record<string, string>
  }
  header: {
    searchPlaceholder: string
    userTitle: string
  }
  banner: {
    label: string
  }
  sidebar: {
    menuLabel: string
    nav: { id: string; label: string; routeName: string }[]
    systemsLabel: string
    consoleItem: {
      label: string
      note: string
    }
  }
  consoleWarning: {
    title: string
    lines: string[]
    meta: string[]
    enterLabel: string
    cancelLabel: string
  }
  login: {
    brandTagline: string
    title: string
    subtitle: string
    employeeIdLabel: string
    employeeIdPlaceholder: string
    passwordLabel: string
    passwordPlaceholder: string
    showLabel: string
    hideLabel: string
    submitLabel: string
    adminNote: string
    legalNote: string
  }
  home: {
    title: string
    subtitle: string
    servicesTitle: string
    demoNotice: string
    bulletinsTitle: string
    bulletinsSubtitle: string
    recentDocsTitle: string
    recentDocsSubtitle: string
    openLabel: string
  }
  directory: {
    title: string
    subtitle: string
    filterAllLabel: string
    columns: Record<'name' | 'department' | 'extension' | 'email' | 'status', string>
    statusLabels: Record<'office' | 'field' | 'lab', string>
  }
  documents: {
    title: string
    subtitle: string
    foldersLabel: string
    columns: Record<'name' | 'type' | 'size' | 'modified' | 'owner' | 'actions', string>
    viewLabel: string
    downloadLabel: string
    emptyFolder: string
    downloadNote: string
    previewClassification: string
  }
  services: {
    title: string
    subtitle: string
    formTitle: string
    formSubtitle: string
    fields: {
      category: string
      categoryPlaceholder: string
      priority: string
      description: string
      descriptionPlaceholder: string
      contact: string
      submit: string
    }
    categories: { id: string; label: string }[]
    priorities: { id: string; label: string }[]
    priorityLabels: Record<'low' | 'medium' | 'high' | 'critical', string>
    statusLabels: Record<'open' | 'progress' | 'resolved', string>
    successNote: string
    ticketsTitle: string
    ticketsSubtitle: string
    ticketColumns: Record<'folio' | 'category' | 'priority' | 'status' | 'updated', string>
    knownTitle: string
    knownItems: { id: string; label: string }[]
  }
  chat: {
    title: string
    subtitle: string
    searchPlaceholder: string
    newChatLabel: string
    newChatTitle: string
    pinnedLabel: string
    recentLabel: string
    emptyListLabel: string
    selectConversationHint: string
    typingLabel: string
    composerPlaceholder: string
    sendLabel: string
    youLabel: string
    todayLabel: string
    yesterdayLabel: string
    presenceLabels: Record<'online' | 'away' | 'busy' | 'offline', string>
    detailsTitle: string
    detailsEmailLabel: string
    detailsExtensionLabel: string
    detailsFilesLabel: string
    attachNote: string
    demoNote: string
  }
}

export const staffnetConfig: StaffNetConfig = {
  brand: {
    companyName: 'FISINOR S.A. de C.V.',
    netName: 'StaffNet',
    subLabel: 'Portal de Personal',
    logo: '/img/icon_fisinor.png',
  },
  documentTitles: {
    base: 'FISINOR StaffNet // Portal de Personal',
    pages: {
      'staff-login': 'Acceso',
      'staff-home': 'Inicio',
      'staff-chat': 'Mensajes',
      'staff-directory': 'Directorio de Personal',
      'staff-documents': 'Documentos y Plantillas',
      'staff-services': 'Mesa de Ayuda IT',
    },
  },
  header: {
    searchPlaceholder: 'Buscar en el directorio, documentos o procedimientos...',
    userTitle: 'Sesión activa',
  },
  banner: {
    label: 'Comunicado interno',
  },
  sidebar: {
    menuLabel: 'Menú',
    nav: [
      { id: 'home', label: 'Inicio / Dashboard General', routeName: 'staff-home' },
      { id: 'chat', label: 'Mensajes', routeName: 'staff-chat' },
      { id: 'directory', label: 'Directorio de Personal', routeName: 'staff-directory' },
      { id: 'documents', label: 'Gestor de Documentos y Plantillas', routeName: 'staff-documents' },
      { id: 'services', label: 'Mesa de Ayuda y Solicitudes IT', routeName: 'staff-services' },
    ],
    systemsLabel: 'Sistemas internos',
    consoleItem: {
      label: 'Consola de Mantenimiento / Terminal SCADA',
      note: 'Requiere privilegios de Administrador de Red',
    },
  },
  consoleWarning: {
    title: '[!] ADVERTENCIA DE SISTEMA',
    lines: [
      'Está saliendo de la Intranet StaffNet.',
      'Ingresando a la Consola de Diagnóstico de Servidor Central (Termingrid v4.08).',
      'Se requieren privilegios de Administrador de Red.',
    ],
    meta: ['TERMINGRID v4.08', 'PRIVILEGIOS: ADMIN_RED', 'REGISTRO DE SESIÓN: ACTIVADO'],
    enterLabel: '[ INGRESAR A LA CONSOLA ]',
    cancelLabel: 'Cancelar',
  },

  login: {
    brandTagline: 'Portal de Personal · FISINOR S.A. de C.V.',
    title: 'Acceso al portal',
    subtitle: 'Ingresa con tus credenciales institucionales para continuar.',
    employeeIdLabel: 'Correo institucional o N.º de empleado',
    employeeIdPlaceholder: 'nombre@fisinor.com.mx · EMP-0000',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Tu contraseña de StaffNet',
    showLabel: 'Mostrar contraseña',
    hideLabel: 'Ocultar contraseña',
    submitLabel: 'Iniciar sesión',
    adminNote:
      'Las cuentas de StaffNet son administradas por Recursos Humanos y el Dpto. de Credenciales. Para obtener acceso, contacta a tu coordinador de área.',
    legalNote: '© FISINOR S.A. de C.V. — Acceso monitoreado. Uso exclusivo del personal homologado.',
  },

  home: {
    title: 'Inicio / Dashboard General',
    subtitle: 'Bienvenida a StaffNet, Dra. Rostova. Este es su tablero de servicios internos.',
    servicesTitle: 'Servicios Internos',
    demoNotice: 'Vista de demostración: este módulo se conectará al backend en una fase posterior.',
    bulletinsTitle: 'Avisos de Recursos Humanos y Dirección',
    bulletinsSubtitle: 'Boletines corporativos vigentes para todo el personal.',
    recentDocsTitle: 'Documentos Recientes',
    recentDocsSubtitle: 'Acceso rápido a los archivos que ha consultado su área.',
    openLabel: 'Abrir',
  },
  directory: {
    title: 'Directorio de Personal',
    subtitle: 'Personal activo en las instalaciones y sub-estaciones de FISINOR.',
    filterAllLabel: 'Todos los departamentos',
    columns: {
      name: 'Nombre',
      department: 'Departamento',
      extension: 'Extensión',
      email: 'Correo',
      status: 'Estatus',
    },
    statusLabels: {
      office: 'En oficina',
      field: 'En campo',
      lab: 'En laboratorio',
    },
  },
  documents: {
    title: 'Gestor de Documentos y Plantillas',
    subtitle: 'Repositorio corporativo de manuales, plantillas y protocolos de uso interno.',
    foldersLabel: 'Carpetas',
    columns: {
      name: 'Nombre',
      type: 'Tipo',
      size: 'Tamaño',
      modified: 'Modificado',
      owner: 'Responsable',
      actions: 'Acciones',
    },
    viewLabel: 'Ver',
    downloadLabel: 'Descargar',
    emptyFolder: 'No hay documentos en esta carpeta.',
    downloadNote: 'La descarga de "{name}" se simuló correctamente (modo de demostración).',
    previewClassification: 'Documento de uso interno — Prohibida su distribución fuera de FISINOR.',
  },
  services: {
    title: 'Mesa de Ayuda y Solicitudes IT',
    subtitle: 'Levante solicitudes de soporte y dé seguimiento a sus tickets.',
    formTitle: 'Nueva solicitud',
    formSubtitle: 'Respuesta estimada del equipo de IT: 4 horas hábiles.',
    fields: {
      category: 'Categoría',
      categoryPlaceholder: 'Seleccione la categoría',
      priority: 'Prioridad',
      description: 'Descripción del problema',
      descriptionPlaceholder: 'Describa el problema, el equipo involucrado y los pasos para reproducirlo.',
      contact: 'Correo de contacto',
      submit: 'Enviar solicitud',
    },
    categories: [
      { id: 'hardware', label: 'Equipo de cómputo' },
      { id: 'network', label: 'Red y VPN' },
      { id: 'software', label: 'Software y licencias' },
      { id: 'access', label: 'Accesos y credenciales' },
    ],
    priorities: [
      { id: 'low', label: 'Baja' },
      { id: 'medium', label: 'Media' },
      { id: 'high', label: 'Alta' },
      { id: 'critical', label: 'Crítica' },
    ],
    priorityLabels: {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      critical: 'Crítica',
    },
    statusLabels: {
      open: 'Abierto',
      progress: 'En proceso',
      resolved: 'Resuelto',
    },
    successNote: 'Solicitud {folio} registrada. El equipo de IT le contactará por correo.',
    ticketsTitle: 'Mis solicitudes',
    ticketsSubtitle: 'Tickets abiertos a nombre de su cuenta.',
    ticketColumns: {
      folio: 'Folio',
      category: 'Categoría',
      priority: 'Prioridad',
      status: 'Estado',
      updated: 'Actualizado',
    },
    knownTitle: 'Soluciones rápidas',
    knownItems: [
      { id: 'k-1', label: '¿Sin acceso a la VPN? Verifique su token en el portal de credenciales.' },
      { id: 'k-2', label: 'Impresora del área administrativa: reinicie la cola desde el panel de Mantenimiento.' },
      { id: 'k-3', label: 'Para licencias de software nuevo, adjunte la autorización de su jefe de departamento.' },
    ],
  },

  chat: {
    title: 'Mensajes',
    subtitle: 'Comunícate con el personal del campus en tiempo real.',
    searchPlaceholder: 'Buscar conversaciones o personas',
    newChatLabel: 'Nuevo chat',
    newChatTitle: 'Iniciar una conversación',
    pinnedLabel: 'Anclados',
    recentLabel: 'Mensajes',
    emptyListLabel: 'Sin conversaciones que coincidan con la búsqueda.',
    selectConversationHint: 'Selecciona un chat para comenzar a conversar.',
    typingLabel: 'Escribiendo...',
    composerPlaceholder: 'Escribe un mensaje...',
    sendLabel: 'Enviar mensaje',
    youLabel: 'Tú',
    todayLabel: 'Hoy',
    yesterdayLabel: 'Ayer',
    presenceLabels: {
      online: 'En línea',
      away: 'Ausente',
      busy: 'Ocupado',
      offline: 'Desconectado',
    },
    detailsTitle: 'Detalles del contacto',
    detailsEmailLabel: 'Correo',
    detailsExtensionLabel: 'Extensión',
    detailsFilesLabel: 'Archivos compartidos',
    attachNote: 'El envío de archivos estará disponible en una fase posterior.',
    demoNote: 'Chat simulado — las respuestas se generan automáticamente (modo demostración).',
  },
}
