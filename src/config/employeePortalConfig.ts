export interface EmployeePortalConfig {
  brand: {
    companyName: string
    netName: string
    version: string
    logo: string
  }
  documentTitles: {
    base: string
    pages: Record<string, string>
  }
  login: {
    title: string
    versionLabel: string
    alertLine: string
    fields: {
      employeeId: { label: string; placeholder: string }
      cryptoKey: { label: string; placeholder: string }
      subStation: { label: string; placeholder: string }
    }
    submitLabel: string
    demoLabel: string
    demoCredentials: { employeeId: string; cryptoKey: string }
    bootSequence: { text: string; tone: 'dim' | 'ok' }[]
    footerNote: string
  }
  systemBar: {
    onlineLabel: string
    nodeLabel: string
    userLabel: string
    clearanceLabel: string
    riskLabel: string
    clockLabel: string
    backLabel: string
    logoutLabel: string
  }
  sidebar: {
    nav: { id: string; label: string; routeName: string }[]
    footerLines: string[]
  }
  common: {
    close: string
    back: string
  }
  dashboard: {
    title: string
    crumb: string
    motd: {
      label: string
      lines: string[]
    }
    quickCommandsTitle: string
    recentIncidentsTitle: string
    viewAllLabel: string
    recentLogsTitle: string
    columns: {
      folio: string
      datetime: string
      sector: string
      status: string
    }
  }
  files: {
    title: string
    crumb: string
    subtitle: string
    foldersLabel: string
    filesCountLabel: string
    columns: Record<'name' | 'size' | 'modified' | 'classification', string>
    openLabel: string
    lockedLabel: string
    deniedTitle: string
    deniedText: string
    viewerClose: string
  }
  incidents: {
    title: string
    crumb: string
    subtitle: string
    columns: Record<'folio' | 'datetime' | 'sector' | 'classification' | 'status', string>
    statusLabels: Record<'pending' | 'investigating' | 'contained' | 'redtape', string>
  }
  directory: {
    title: string
    crumb: string
    subtitle: string
    columns: Record<'id' | 'name' | 'role' | 'department' | 'clearance' | 'status', string>
    statusLabels: Record<'active' | 'suspended' | 'terminated', string>
  }
  profile: {
    title: string
    crumb: string
    subtitle: string
    photoLabel: string
    cardLabels: Record<
      'id' | 'name' | 'role' | 'department' | 'clearance' | 'since' | 'token',
      string
    >
    historyTitle: string
    historyColumns: Record<'datetime' | 'ip' | 'terminal' | 'result', string>
    tokenButton: string
    tokenNote: string
  }
  logs: {
    title: string
    crumb: string
    subtitle: string
    liveLabel: string
    pauseLabel: string
    resumeLabel: string
    linesLabel: string
  }
}

export const employeePortalConfig: EmployeePortalConfig = {
  brand: {
    companyName: 'FISINOR S.A. DE C.V.',
    netName: 'FISINOR-NET',
    version: 'v4.08',
    logo: '/img/icon_fisinor.png',
  },
  documentTitles: {
    base: 'FISINOR-NET // TERMINAL DE EMPLEADOS',
    pages: {
      'console-login': 'ACCESO',
      'console-dashboard': 'MAIN_CONSOLE',
      'console-files': 'EXPLORADOR_ARCHIVOS',
      'console-incidents': 'REGISTRO_INCIDENTES',
      'console-directory': 'DIRECTORIO_PERSONAL',
      'console-profile': 'PERFIL_SEGURIDAD',
      'console-logs': 'LOGS_SISTEMA',
    },
  },
  login: {
    title: 'FISINOR S.A. DE C.V. // TERMINAL DE ACCESO RESTRINGIDO',
    versionLabel: 'v4.08',
    alertLine: '[!] USO EXCLUSIVO PARA PERSONAL HOMOLOGADO. TODA ACTIVIDAD ES REGISTRADA.',
    fields: {
      employeeId: { label: 'FICHA / ID DE EMPLEADO', placeholder: 'FS-8830-TECH' },
      cryptoKey: { label: 'CLAVE DE ACCESO CRIPTOGRÁFICA', placeholder: '••••••••••••' },
      subStation: { label: 'MENÚ DE SUB-ESTACIÓN / SECTOR', placeholder: '— SELECCIONE SUB-ESTACIÓN —' },
    },
    submitLabel: '[ INICIAR SESIÓN DE TERMINAL ]',
    demoLabel: '[ ACCESO DEMO ]',
    demoCredentials: { employeeId: 'FS-8830-TECH', cryptoKey: 'demo-demo-demo' },
    bootSequence: [
      { text: '> Autenticando token...', tone: 'dim' },
      { text: '> Verificando clearance nivel 2...', tone: 'dim' },
      { text: '> Sincronizando con nodo HERMOSILLO-SRV-02...', tone: 'dim' },
      { text: '> ACCESO CONCEDIDO', tone: 'ok' },
    ],
    footerNote: 'FISINOR-NET // Nodo HERMOSILLO-SRV-02 · Conexión monitoreada por el Dpto. de Seguridad Interna.',
  },
  systemBar: {
    onlineLabel: '[ ONLINE ]',
    nodeLabel: 'Node:',
    userLabel: 'User:',
    clearanceLabel: 'Nivel 2',
    riskLabel: 'NIVEL DE RIESGO BIOMIMÉTICO: NORMAL (0.01%)',
    clockLabel: 'UTC-7 / MST',
    backLabel: '[ ← STAFFNET ]',
    logoutLabel: '[ CERRAR SESIÓN / LOCK ]',
  },
  sidebar: {
    nav: [
      { id: 'dashboard', label: '[00] MAIN_CONSOLE', routeName: 'console-dashboard' },
      { id: 'files', label: '[01] EXPLORADOR_ARCHIVOS', routeName: 'console-files' },
      { id: 'incidents', label: '[02] REGISTRO_INCIDENTES', routeName: 'console-incidents' },
      { id: 'directory', label: '[03] DIRECTORIO_PERSONAL', routeName: 'console-directory' },
      { id: 'profile', label: '[04] PERFIL_SEGURIDAD', routeName: 'console-profile' },
      { id: 'logs', label: '[05] LOGS_SISTEMA', routeName: 'console-logs' },
    ],
    footerLines: ['CLEARANCE: LEVEL 2', 'SESION CIFRADA AES-256', 'FISINOR-NET v4.08'],
  },
  common: {
    close: '[ CERRAR ]',
    back: '[ VOLVER ]',
  },
  dashboard: {
    title: 'MAIN_CONSOLE',
    crumb: '/empleados/dashboard',
    motd: {
      label: 'MENSAJE DE LA DIRECCIÓN OPERATIVA',
      lines: [
        'Personal: el mantenimiento de la red de aspersión sintética en Sector 4 (12–14 Oct) implica el cierre temporal de válvulas maestras. Coordine muestreos con anticipación.',
        'Circular 41-B: recuerde que los lotes tratados con inóculos de Nivel 3 deben permanecer sellados 72 h después de la aplicación. El incumplimiento se registra en su expediente.',
      ],
    },
    quickCommandsTitle: 'COMANDOS_RÁPIDOS',
    recentIncidentsTitle: 'ÚLTIMOS_INCIDENTES',
    viewAllLabel: '[ VER_REGISTRO_COMPLETO ]',
    recentLogsTitle: 'EVENTOS_RECIENTES',
    columns: {
      folio: 'FOLIO',
      datetime: 'FECHA/HORA',
      sector: 'SECTOR',
      status: 'ESTADO',
    },
  },
  files: {
    title: 'EXPLORADOR_ARCHIVOS',
    crumb: '/empleados/archivos',
    subtitle: 'Repositorio de expedientes operativos. El acceso a documentos queda asentado en su bitácora personal.',
    foldersLabel: 'DIRECTORIOS',
    filesCountLabel: 'archivos',
    columns: {
      name: 'NOMBRE',
      size: 'TAMAÑO',
      modified: 'MODIFICADO',
      classification: 'CLASIFICACIÓN',
    },
    openLabel: '[ ABRIR ]',
    lockedLabel: '[🔒 NIVEL 3]',
    deniedTitle: '[ ACCESO DENEGADO ]',
    deniedText:
      'Su clearance (LEVEL 2) es insuficiente para abrir este documento (LEVEL 3). Solicite la credencial correspondiente a Administración de Credenciales. Este intento ha quedado registrado en el log de seguridad.',
    viewerClose: '[ CERRAR_VISOR ]',
  },
  incidents: {
    title: 'REGISTRO_INCIDENTES',
    crumb: '/empleados/incidentes',
    subtitle: 'Bitácora de reportes de anomalías remitidos por personal de campo y por el formulario público de aseguramiento.',
    columns: {
      folio: 'FOLIO',
      datetime: 'FECHA/HORA',
      sector: 'SECTOR',
      classification: 'CLASIFICACIÓN',
      status: 'ESTADO',
    },
    statusLabels: {
      pending: '[PENDIENTE]',
      investigating: '[EN INVESTIGACIÓN]',
      contained: '[CONTAINED]',
      redtape: '[REDTAPE]',
    },
  },
  directory: {
    title: 'DIRECTORIO_PERSONAL',
    crumb: '/empleados/directorio',
    subtitle: 'Personal homologado activo en el nodo HERMOSILLO-SRV-02 y sub-estaciones.',
    columns: {
      id: 'ID',
      name: 'NOMBRE',
      role: 'CARGO',
      department: 'DEPARTAMENTO',
      clearance: 'CLEARANCE',
      status: 'ESTADO',
    },
    statusLabels: {
      active: '[ACTIVO]',
      suspended: '[SUSPENDIDO]',
      terminated: '[BAJA]',
    },
  },
  profile: {
    title: 'PERFIL_SEGURIDAD',
    crumb: '/empleados/perfil',
    subtitle: 'Ficha digital del operador y credencial de acceso al nodo.',
    photoLabel: 'FOTO_EXPEDIENTE',
    cardLabels: {
      id: 'ID DE OPERADOR',
      name: 'NOMBRE',
      role: 'CARGO',
      department: 'DEPARTAMENTO',
      clearance: 'CLEARANCE',
      since: 'INGRESO',
      token: 'TOKEN_CRIPTOGRÁFICO',
    },
    historyTitle: 'HISTORIAL_DE_ACCESOS',
    historyColumns: {
      datetime: 'FECHA/HORA',
      ip: 'IP_INTERNA',
      terminal: 'TERMINAL',
      result: 'RESULTADO',
    },
    tokenButton: '[ REGENERAR_TOKEN_CRIPTOGRÁFICO ]',
    tokenNote: 'Solicitud de token encolada. Entrega presencial en Administración de Credenciales (Edificio B, módulo 7).',
  },
  logs: {
    title: 'LOGS_SISTEMA',
    crumb: '/empleados/logs',
    subtitle: 'Consola de eventos del servidor en vivo. Flujo de solo lectura.',
    liveLabel: '● EN VIVO',
    pauseLabel: '[ PAUSA ]',
    resumeLabel: '[ REANUDAR ]',
    linesLabel: 'LÍNEAS EN BUFFER',
  },
}
