// Datos simulados de FISINOR-NET (intranet de empleados, modo placeholder sin backend).

export interface EmployeeOperator {
  id: string
  name: string
  role: string
  department: string
  clearance: string
  since: string
  tokenStatus: string
  avatarInitials: string
}

export interface SubStation {
  id: string
  label: string
}

export interface DashboardStat {
  id: string
  label: string
  value: string
  plain?: boolean
}

export interface FileFolder {
  id: string
  name: string
  locked: boolean
}

export interface RepositoryFile {
  id: string
  folderId: string
  name: string
  size: string
  modified: string
  classification: 'INTERNO' | 'CONFIDENCIAL' | 'LEVEL3'
  accessLevel: 1 | 2 | 3
  content: string[]
}

export type IncidentStatus = 'pending' | 'investigating' | 'contained' | 'redtape'

export interface IncidentRecord {
  folio: string
  datetime: string
  sector: string
  classification: string
  status: IncidentStatus
}

export interface DirectoryEmployee {
  id: string
  name: string
  role: string
  department: string
  clearance: string
  status: 'active' | 'suspended' | 'terminated'
}

export interface AccessHistoryEntry {
  datetime: string
  ip: string
  terminal: string
  result: string
  denied?: boolean
}

export interface SystemLogTemplate {
  text: string
  severity: 'info' | 'ok' | 'warn' | 'error'
}

export interface SystemLogLine {
  time: string
  text: string
  severity: 'info' | 'ok' | 'warn' | 'error'
}

export const operator: EmployeeOperator = {
  id: 'INV-2091',
  name: 'ING. DENISSE ROBLES VALENZUELA',
  role: 'TÉCNICA DE SUPERVISIÓN BIOMIMÉTICA',
  department: 'DEP-04_EVALUACION_CAMPO',
  clearance: 'LEVEL 2',
  since: '12 MAR 2024',
  tokenStatus: 'ACTIVO',
  avatarInitials: 'DRV',
}

export const subStations: SubStation[] = [
  { id: 'planta-central', label: 'Planta Central Hermosillo' },
  { id: 'lab-norte', label: 'Laboratorio Bio-Sintético Norte' },
  { id: 'unidad-costa', label: 'Unidad Experimental Costa' },
  { id: 'movil-04', label: 'Estación Móvil 04' },
]

export const dashboardStats: DashboardStat[] = [
  { id: 'incidents', label: 'INCIDENTES_ACTIVOS', value: '3' },
  { id: 'files', label: 'ARCHIVOS_INDEXADOS', value: '1,842' },
  { id: 'nodes', label: 'NODOS_ONLINE', value: '4/4' },
  { id: 'uptime', label: 'UPTIME_DEL_NODO', value: '217d 14h 09m', plain: true },
]

export const fileFolders: FileFolder[] = [
  { id: 'f-dep01', name: '/DEP-01_SINTESIS_MOLECULAR/', locked: false },
  { id: 'f-dep04', name: '/DEP-04_EVALUACION_CAMPO/', locked: false },
  { id: 'f-inc', name: '/INCIDENTES_BIOMIMETICOS/', locked: false },
  { id: 'f-l3', name: '/ARCHIVOS_CENSURADOS_LEVEL3/', locked: true },
]

export const repositoryFiles: RepositoryFile[] = [
  {
    id: 'file-001',
    folderId: 'f-dep01',
    name: 'INFORME_SINTESIS_Q3.LOG',
    size: '14 KB',
    modified: '29 SEP 2026',
    classification: 'INTERNO',
    accessLevel: 1,
    content: [
      '[FISINOR-NET // DEP-01 SINTESIS MOLECULAR]',
      'CICLO: Q3-2026 · LOTES PROCESADOS: 47',
      '',
      'RESUMEN: la línea de biopolímero activo mantuvo un rendimiento',
      'del 96.2%. El lote 204 presentó cristalización prematura; se',
      'descartó sin impacto en la cadena de suministro.',
      '',
      'NOTA DEL JEFE DE TURNO: el lote ██████████ fue transferido al',
      'sitio ███████████████ bajo orden verbal de la Dirección. No',
      'existe documentación de respaldo en este repositorio.',
      '',
      '[FIN DEL REGISTRO]',
    ],
  },
  {
    id: 'file-002',
    folderId: 'f-dep01',
    name: 'PROTOCOLO_CRIOPRESERVACION_REV7.TXT',
    size: '32 KB',
    modified: '12 SEP 2026',
    classification: 'INTERNO',
    accessLevel: 1,
    content: [
      '[PROTOCOLO DE CRIOPRESERVACIÓN — REV.7]',
      'APLICA A: muestras biológicas de uso agrícola y anexas.',
      '',
      '1. Temperatura de custodia: -196 °C (nitrógeno líquido).',
      '2. Toda apertura de criobox debe asentarse en bitácora física',
      '   y digital dentro de los primeros 4 minutos.',
      '3. Las muestras sin etiqueta ██████████ se consideran',
      '   material huérfano y pasan a custodia del Consejo.',
      '4. PROHIBIDO trasvasijar contenido entre crioboxes sin',
      '   autorización de DEP-01 y seguridad interna.',
      '',
      '[DOCUMENTO CONTROLADO — REVISIÓN 7 — VIGENTE]',
    ],
  },
  {
    id: 'file-003',
    folderId: 'f-dep04',
    name: 'BITACORA_CAMPO_SECTOR7.TXT',
    size: '8 KB',
    modified: '01 OCT 2026',
    classification: 'CONFIDENCIAL',
    accessLevel: 2,
    content: [
      '[DEP-04 EVALUACIÓN DE CAMPO — BITÁCORA SECTOR 7]',
      'TÉCNICA RESPONSABLE: INV-2091 ROBLES VALENZUELA, D.',
      '',
      'DÍA 14: Aplicación de TerraGen M2 completada. Germinación',
      'uniforme al 6º día. Sin observaciones.',
      '',
      'DÍA 22: El cuadrante norte presenta altura de tallo un 31%',
      'superior al modelo. Se envía muestra a DEP-01. Resultado:',
      '██████████ ████ ████████████ fuera de banda esperada.',
      '',
      'DÍA 23: El propietario colindante reporta que su perro',
      '"no vuelve a la casa desde el martes". Sin relación técnica',
      'establecida. Se archiva la nota por instructivo.',
      '',
      'DÍA 24: Presencia de ejemplar avícola con plumaje iridiscente',
      'no documentado en la zona. Fotografía adjunta ██████████.',
      'Solicito instrucciones. — DRV',
      '',
      '[FIN DE BITÁCORA — PÁGINA 4 DE 6]',
    ],
  },
  {
    id: 'file-004',
    folderId: 'f-dep04',
    name: 'EVALUACION_DERIVA_TASA_002.TXT',
    size: '6 KB',
    modified: '27 SEP 2026',
    classification: 'INTERNO',
    accessLevel: 2,
    content: [
      '[EVALUACIÓN DE DERIVA SINTÉTICA — TASA 0.02%]',
      'PERÍMETRO: Módulo V · Costa de Hermosillo',
      'SENSORES ACTIVOS: 8/8',
      '',
      'La tasa de deriva se mantiene dentro de parámetros normales',
      '(< 0.05%). Pico máximo registrado: 0.031% el 24 SEP a las',
      '14:00 h, coincidente con aplicación autorizada.',
      '',
      'RECOMENDACIÓN: mantener barrera vegetal perimetral. La red',
      'de sensores reporta ██████ ███ ██ lecturas fantasma en el',
      'nodo 6; se programó recalibración.',
      '',
      '[GENERADO AUTOMÁTICAMENTE POR EL SISTEMA DE MONITOREO 24/7]',
    ],
  },
  {
    id: 'file-005',
    folderId: 'f-inc',
    name: 'REP_ANOMALIA_LOTE_88.LOG',
    size: '3 KB',
    modified: '02 OCT 2026',
    classification: 'CONFIDENCIAL',
    accessLevel: 2,
    content: [
      '[REPORTE DE ANOMALÍA — LOTE 88 — PRIORIDAD ALTA]',
      'ORIGEN: monitoreo automático · CONFIRMADO POR: INV-2091',
      '',
      'OBSERVACIÓN: los sujetos de control del lote 88 presentan',
      'sincronización de movimiento en un radio de 40 metros.',
      'El patrón se intensifica entre las 03:00 y las 04:00 h.',
      '',
      'PATRÓN DETECTADO: ██████████ ███ ██████ ███████',
      '',
      'HIPÓTESIS: fallo en autonomía de control motor derivado del',
      'lote de solución de preservación ██████.',
      '',
      'ACCIÓN: escalamiento a DEP-04 y seguridad interna. Prohibido',
      'el acceso de personal no homologado al lote. Las cámaras del',
      'perímetro graban ████████████████████ en bucle.',
      '',
      '[ESCALADO — EN ESPERA DE DICTAMEN DEL CONSEJO]',
    ],
  },
  {
    id: 'file-006',
    folderId: 'f-inc',
    name: 'EXPEDIENTE_ESPECIMEN_09.TXT',
    size: '11 KB',
    modified: '20 SEP 2026',
    classification: 'CONFIDENCIAL',
    accessLevel: 2,
    content: [
      '[EXPEDIENTE DE ESPECÍMEN 09 — LECTURA PARCIAL]',
      '',
      'DESIGNACIÓN: SUJETO-09 / "EL DE LA PARADA"',
      'PROCEDENCIA: avistamiento civil · Parada de autobús, Centro.',
      'ESTADO FÍSICO: estable. Temperatura 36.1 °C constante, sin',
      'variación por exposición solar. Sin sudoración detectada.',
      '',
      'OBSERVACIONES CONDUCTUALES: períodos de inmovilidad con ojos',
      'abiertos superiores a 3 minutos. Respuestas automatizadas a',
      'estímulos verbales comunes ("buenos días", "¿qué hora es?").',
      '',
      'IDENTIDAD: ██████████████████████████████████████',
      'PROCEDENCIA REAL: ██████████ ███████ ████████████',
      'AUTORIZACIÓN DE CONTACTO: SOLO NIVEL 3.',
      '',
      'NOTA ADHERIDA (manuscrita, digitalizada): "no acaricies al',
      '09. ya pasó una vez." — sin firma legible.',
      '',
      '[LECTURA PARCIAL — EL 38% DEL DOCUMENTO ESTÁ CIFRADO]',
    ],
  },
  {
    id: 'file-007',
    folderId: 'f-l3',
    name: 'PLAN_MAESTRO_DUPLICACION.TXT',
    size: '██ KB',
    modified: '██ ███ 20██',
    classification: 'LEVEL3',
    accessLevel: 3,
    content: [],
  },
  {
    id: 'file-008',
    folderId: 'f-l3',
    name: 'REGISTRO_LOTES_TITAN.DB',
    size: '███ MB',
    modified: '██ ███ 20██',
    classification: 'LEVEL3',
    accessLevel: 3,
    content: [],
  },
]

export const incidentRecords: IncidentRecord[] = [
  {
    folio: 'INC-2026-0412',
    datetime: '02 OCT 2026 06:14',
    sector: 'SECTOR 4 / LOTE 12-B',
    classification: 'SINCRONIZACIÓN_MOTORA',
    status: 'investigating',
  },
  {
    folio: 'INC-2026-0409',
    datetime: '01 OCT 2026 22:47',
    sector: 'UNIDAD COSTA / VIVERO 3',
    classification: 'AUSENCIA_DE_PARPADEO',
    status: 'pending',
  },
  {
    folio: 'INC-2026-0401',
    datetime: '30 SEP 2026 15:03',
    sector: 'PLANTA CENTRAL / ALMACÉN FRÍO',
    classification: 'OLOR_ANTISÉPTICO',
    status: 'contained',
  },
  {
    folio: 'INC-2026-0396',
    datetime: '28 SEP 2026 11:32',
    sector: 'SECTOR 7 / INVERNADERO 2',
    classification: 'DUPLICADO_MORFOLÓGICO',
    status: 'investigating',
  },
  {
    folio: 'INC-2026-0388',
    datetime: '26 SEP 2026 19:58',
    sector: 'RUTA HERMOSILLO–COSTA',
    classification: 'AVISTAMIENTO_CIVIL',
    status: 'redtape',
  },
  {
    folio: 'INC-2026-0374',
    datetime: '21 SEP 2026 08:11',
    sector: 'COMPLEJO NORTE / LAB 2',
    classification: 'FALLO_CRIOPRESERVACIÓN',
    status: 'contained',
  },
  {
    folio: 'INC-2026-0369',
    datetime: '18 SEP 2026 13:26',
    sector: 'MÓDULO V / PUERTA 2',
    classification: 'VOICE_PITCH_ANOMALY',
    status: 'pending',
  },
  {
    folio: 'INC-2026-0355',
    datetime: '12 SEP 2026 07:44',
    sector: 'SECTOR 9 / CIELO ABIERTO',
    classification: 'RECONOCIMIENTO_FACIAL_FALLIDO',
    status: 'redtape',
  },
]

export const directoryEmployees: DirectoryEmployee[] = [
  {
    id: 'DIR-0001',
    name: 'DR. MARTIN VÁSQUEZ WOOLFOLK',
    role: 'DIRECTOR EJECUTIVO Y FUNDADOR',
    department: 'DIRECCIÓN_GENERAL',
    clearance: 'LEVEL 5',
    status: 'active',
  },
  {
    id: 'TEC-1187',
    name: 'Q.F. MARTHA ESCALANTE PRECIADO',
    role: 'JEFA DE SÍNTESIS MOLECULAR',
    department: 'DEP-01_SINTESIS_MOLECULAR',
    clearance: 'LEVEL 3',
    status: 'active',
  },
  {
    id: 'SEG-0773',
    name: 'C. INDIRA GAXIOLA MURILLO',
    role: 'OFICIAL PRINCIPAL DE BIOSEGURIDAD',
    department: 'SEGURIDAD_INTERNA',
    clearance: 'LEVEL 3',
    status: 'active',
  },
  {
    id: 'INV-2091',
    name: 'ING. DENISSE ROBLES VALENZUELA',
    role: 'TÉCNICA DE SUPERVISIÓN BIOMIMÉTICA',
    department: 'DEP-04_EVALUACION_CAMPO',
    clearance: 'LEVEL 2',
    status: 'active',
  },
  {
    id: 'INV-2204',
    name: 'BIO. EDER VALDEZ CONTRERAS',
    role: 'EVALUADOR DE CAMPO JR.',
    department: 'DEP-04_EVALUACION_CAMPO',
    clearance: 'LEVEL 1',
    status: 'active',
  },
  {
    id: 'ADM-0338',
    name: 'L. RAMÓN GUERRERO OCHOA',
    role: 'ADMINISTRADOR DE CREDENCIALES',
    department: 'IT_REDES',
    clearance: 'LEVEL 2',
    status: 'active',
  },
  {
    id: 'TEC-1290',
    name: 'S. ERICKA MONTAÑO RIVAS',
    role: 'OPERADORA DE CRIOPRESERVACIÓN',
    department: 'DEP-01_SINTESIS_MOLECULAR',
    clearance: 'LEVEL 2',
    status: 'suspended',
  },
  {
    id: 'INV-2311',
    name: '█████████ ██████████',
    role: '█████████████',
    department: 'DEP-04_EVALUACION_CAMPO',
    clearance: 'LEVEL 3',
    status: 'terminated',
  },
]

export const accessHistory: AccessHistoryEntry[] = [
  { datetime: '02 OCT 2026 07:58', ip: '10.240.12.88', terminal: 'TERM-04-B', result: 'OK' },
  { datetime: '01 OCT 2026 08:03', ip: '10.240.12.88', terminal: 'TERM-04-B', result: 'OK' },
  { datetime: '30 SEP 2026 16:41', ip: '10.240.9.17', terminal: 'TERM-COSTA-01', result: 'OK' },
  {
    datetime: '29 SEP 2026 21:12',
    ip: '10.240.12.88',
    terminal: 'TERM-04-B',
    result: 'DENEGADO',
    denied: true,
  },
  { datetime: '28 SEP 2026 07:49', ip: '10.240.12.88', terminal: 'TERM-04-B', result: 'OK' },
]

export const recentSystemLogs: SystemLogLine[] = [
  { time: '07:41:03', text: 'BACKUP_INCREMENTAL completado — 14.2 GB a nodo OBREGON-BAK-01', severity: 'ok' },
  { time: '07:38:51', text: 'Sensor de deriva 6/8 reporta lecturas fantasma — recalibración programada', severity: 'warn' },
  { time: '07:36:20', text: 'Sesión iniciada por INV-2091 desde TERM-04-B (10.240.12.88)', severity: 'info' },
  { time: '07:22:47', text: 'Intento de lectura LEVEL3 bloqueado — usuario INV-2091 — ARCHIVOS_CENSURADOS_LEVEL3', severity: 'error' },
  { time: '07:15:09', text: 'Réplica de base de datos de expedientes verificada (checksum OK)', severity: 'ok' },
]

export const systemLogPool: SystemLogTemplate[] = [
  { text: 'Heartbeat de sub-estación UNIDAD-COSTA-01 recibido (latencia 12 ms)', severity: 'info' },
  { text: 'Heartbeat de sub-estación LAB-NORTE-02 recibido (latencia 8 ms)', severity: 'info' },
  { text: 'Heartbeat de ESTACION-MOVIL-04 recibido (latencia 41 ms — enlace celular)', severity: 'info' },
  { text: 'Job de indexación de expedientes completado — 42 documentos', severity: 'ok' },
  { text: 'Checksum de integridad del archivo maestro verificado', severity: 'ok' },
  { text: 'Escaneo biométrico de perímetro sin desviaciones', severity: 'ok' },
  { text: 'Cámara LOTE-88-CAM-03 reiniciada por pérdida de señal', severity: 'warn' },
  { text: 'Sensor de deriva 6/8 fuera de banda — colas de recalibración', severity: 'warn' },
  { text: 'Temperatura de criobox 7 por encima de umbral — alarma desactivada por operador', severity: 'warn' },
  { text: 'Purga de registros temporales completada — 0 anomalías', severity: 'ok' },
  { text: 'Intento de acceso a ARCHIVOS_CENSURADOS_LEVEL3 bloqueado', severity: 'error' },
  { text: 'Firma biométrica rechazada en puerta biológica B — reintentos permitidos: 2', severity: 'error' },
  { text: 'Sincronización NTP con HERMOSILLO-SRV-01 correcta', severity: 'info' },
  { text: 'Tráfico de red dentro de lo esperado — 0 picos anómalos', severity: 'ok' },
  { text: 'Advertencia: patrón de sincronización detectado en cámaras del lote 88 — revisar INC-2026-0412', severity: 'warn' },
]
