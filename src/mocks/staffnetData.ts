// Datos simulados de StaffNet (intranet corporativa de empleados, modo placeholder).

export interface StaffUser {
  name: string
  department: string
  id: string
  initials: string
  email: string
}

export interface StaffAnnouncement {
  id: string
  text: string
}

export interface ServiceCard {
  id: string
  icon: 'wallet' | 'calendar' | 'clock' | 'shield'
  title: string
  description: string
}

export interface StaffBulletin {
  id: string
  date: string
  day: string
  month: string
  title: string
  excerpt: string
}

export interface RecentDocument {
  id: string
  name: string
  folder: string
  modified: string
}

export interface StaffDepartment {
  id: string
  label: string
}

export type StaffStatus = 'office' | 'field' | 'lab'

export interface DirectoryStaffMember {
  id: string
  name: string
  role: string
  department: string
  extension: string
  email: string
  status: StaffStatus
}

export interface DocumentFolder {
  id: string
  name: string
  description: string
}

export type StaffDocType = 'PDF' | 'DOCX' | 'XLSX'

export interface StaffDocument {
  id: string
  folderId: string
  name: string
  type: StaffDocType
  size: string
  modified: string
  owner: string
  previewLines: string[]
}

export interface ItTicket {
  folio: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'progress' | 'resolved'
  updated: string
}

export const staffUser: StaffUser = {
  name: 'Dra. Elena Rostova',
  department: 'Evaluación de Suelos & Biopolímeros',
  id: 'EMP-4092',
  initials: 'ER',
  email: 'elena.rostova@fisinor.com.mx',
}

export const staffAnnouncements: StaffAnnouncement[] = [
  {
    id: 'ann-vaccination',
    text: 'Recordatorio: Campaña de Vacunación Anual y Revisión de Exposición Biológica en Sector 3 el próximo viernes.',
  },
  {
    id: 'ann-parking',
    text: 'El estacionamiento norte estará destinado a visitas de auditoría del 7 al 11 de octubre. Use el acceso este.',
  },
  {
    id: 'ann-cafeteria',
    text: 'La cafetería central amplía su horario de 07:00 a 19:00 h durante todo octubre.',
  },
]

export const serviceCards: ServiceCard[] = [
  {
    id: 'svc-viaticos',
    icon: 'wallet',
    title: 'Solicitud de Viáticos y Reembolsos',
    description: 'Registra gastos de viaje y adjunta tus comprobantes para reembolso quincenal.',
  },
  {
    id: 'svc-salones',
    icon: 'calendar',
    title: 'Reserva de Salones y Laboratorios',
    description: 'Agenda salas de junta, laboratorios húmedos y el invernadero de demostración.',
  },
  {
    id: 'svc-asistencia',
    icon: 'clock',
    title: 'Reporte de Asistencia y Turnos',
    description: 'Consulta tus checadas, turnos asignados y solicita cambios de jornada.',
  },
  {
    id: 'svc-bioseguridad',
    icon: 'shield',
    title: 'Formatos de Bioseguridad',
    description: 'Descarga los formatos vigentes de ingreso a áreas restringidas y manejo de muestras.',
  },
]

export const staffBulletins: StaffBulletin[] = [
  {
    id: 'bul-1',
    date: '02 OCT 2026',
    day: '02',
    month: 'OCT',
    title: 'Nuevos protocolos de empaque en almacén',
    excerpt:
      'A partir del lunes, todo material biológico que salga del almacén central debe llevar doble sellado y etiqueta de trazabilidad QR.',
  },
  {
    id: 'bul-2',
    date: '30 SEP 2026',
    day: '30',
    month: 'SEP',
    title: 'Menú de la cafetería central — primera quincena de octubre',
    excerpt:
      'Ya está disponible el menú rotativo de octubre. Recuerde que los platillos señalados con asterisco siguen el plan nutricional del programa TITAN.',
  },
  {
    id: 'bul-3',
    date: '26 SEP 2026',
    day: '26',
    month: 'SEP',
    title: 'Cambio de contraseña trimestral en StaffNet',
    excerpt:
      'El 15 de octubre expira el ciclo de contraseñas. Renueve su clave desde Ajustes antes de la fecha para conservar el acceso remoto.',
  },
  {
    id: 'bul-4',
    date: '19 SEP 2026',
    day: '19',
    month: 'SEP',
    title: 'Jornada de donación de sangre del IMSS en el Complejo Norte',
    excerpt:
      'El módulo itinerante estará en el estacionamiento este de 09:00 a 15:00 h. Presente identificación oficial y ayuno de 4 horas.',
  },
]

export const recentDocuments: RecentDocument[] = [
  {
    id: 'rd-1',
    name: 'Formato_Bioseguridad_Ingreso_V8.pdf',
    folder: 'Manuales_de_Procedimiento/',
    modified: '01 OCT 2026',
  },
  {
    id: 'rd-2',
    name: 'Plantilla_Reembolso_Gastos_Q4.docx',
    folder: 'Plantillas_RH/',
    modified: '29 SEP 2026',
  },
  {
    id: 'rd-3',
    name: 'Informe_Trimestral_Biopolimeros_Q3.xlsx',
    folder: 'Informes_Trimestrales/',
    modified: '25 SEP 2026',
  },
  {
    id: 'rd-4',
    name: 'Protocolo_Mapeo_Parcela_Estandar.pdf',
    folder: 'Protocolos_de_Mapeo/',
    modified: '22 SEP 2026',
  },
  {
    id: 'rd-5',
    name: 'Manual_Procedimientos_Conservacion.docx',
    folder: 'Manuales_de_Procedimiento/',
    modified: '18 SEP 2026',
  },
]

export const staffDepartments: StaffDepartment[] = [
  { id: 'admin', label: 'Administración' },
  { id: 'biotech', label: 'Biotecnología' },
  { id: 'maintenance', label: 'Mantenimiento' },
  { id: 'security', label: 'Seguridad Interna' },
]

export const directoryStaff: DirectoryStaffMember[] = [
  {
    id: 'emp-4092',
    name: 'Dra. Elena Rostova',
    role: 'Investigadora Titular',
    department: 'Biotecnología',
    extension: '4102',
    email: 'elena.rostova@fisinor.com.mx',
    status: 'lab',
  },
  {
    id: 'emp-1188',
    name: 'Dr. Martin Vásquez Woolfolk',
    role: 'Director Ejecutivo',
    department: 'Administración',
    extension: '4001',
    email: 'mvasquez@fisinor.com.mx',
    status: 'office',
  },
  {
    id: 'emp-2077',
    name: 'Q.F. Martha Escalante Preciado',
    role: 'Jefa de Síntesis Molecular',
    department: 'Biotecnología',
    extension: '4210',
    email: 'mescalante@fisinor.com.mx',
    status: 'lab',
  },
  {
    id: 'emp-1544',
    name: 'C. Indira Gaxiola Murillo',
    role: 'Oficial Principal de Bioseguridad',
    department: 'Seguridad Interna',
    extension: '4055',
    email: 'igaxiola@fisinor.com.mx',
    status: 'office',
  },
  {
    id: 'emp-3320',
    name: 'L. Fernanda Ibarra Duarte',
    role: 'Contadora Corporativa',
    department: 'Administración',
    extension: '4033',
    email: 'fibarra@fisinor.com.mx',
    status: 'office',
  },
  {
    id: 'emp-3611',
    name: 'R. Ariel Peralta Ceballos',
    role: 'Supervisor de Mantenimiento',
    department: 'Mantenimiento',
    extension: '4160',
    email: 'aperalta@fisinor.com.mx',
    status: 'field',
  },
  {
    id: 'emp-2870',
    name: 'Ing. Pablo Ceballos Terrazas',
    role: 'Técnico de Redes',
    department: 'Mantenimiento',
    extension: '4166',
    email: 'pceballos@fisinor.com.mx',
    status: 'office',
  },
  {
    id: 'emp-2955',
    name: 'M. Karla Sandoval Ruiz',
    role: 'Coordinadora de Recursos Humanos',
    department: 'Administración',
    extension: '4021',
    email: 'ksandoval@fisinor.com.mx',
    status: 'office',
  },
  {
    id: 'emp-3102',
    name: 'BIO. Eder Valdez Contreras',
    role: 'Evaluador de Campo',
    department: 'Biotecnología',
    extension: '4225',
    email: 'evaldez@fisinor.com.mx',
    status: 'field',
  },
  {
    id: 'emp-2046',
    name: 'TTE. Óscar Bilbao Narváez',
    role: 'Jefe de Turno — Seguridad Perimetral',
    department: 'Seguridad Interna',
    extension: '4070',
    email: 'obilbao@fisinor.com.mx',
    status: 'field',
  },
]

export const documentFolders: DocumentFolder[] = [
  {
    id: 'f-manuales',
    name: 'Manuales_de_Procedimiento/',
    description: 'Procesos operativos estándar del personal de piso.',
  },
  {
    id: 'f-plantillas',
    name: 'Plantillas_RH/',
    description: 'Formatos de RH: reembolsos, vacaciones, constancias.',
  },
  {
    id: 'f-mapeo',
    name: 'Protocolos_de_Mapeo/',
    description: 'Protocolos de levantamiento y mapeo de parcelas.',
  },
  {
    id: 'f-informes',
    name: 'Informes_Trimestrales/',
    description: 'Reportes trimestrales por área y dirección.',
  },
]

export const staffDocuments: StaffDocument[] = [
  {
    id: 'doc-101',
    folderId: 'f-manuales',
    name: 'Formato_Bioseguridad_Ingreso_V8.pdf',
    type: 'PDF',
    size: '1.2 MB',
    modified: '01 OCT 2026',
    owner: 'Seguridad Interna',
    previewLines: [
      'FORMATO DE INGRESO A ÁREAS RESTRINGIDAS (V8)',
      '',
      '1. Presente este formato impreso en la puerta biológica junto con su gafete.',
      '2. Todo visitante debe contar con un responsable de área que lo acompañe.',
      '3. Los objetos personales se resguardan en los casilleros del vestíbulo.',
      '4. El incumplimiento de este protocolo se reporta a Seguridad Interna.',
    ],
  },
  {
    id: 'doc-102',
    folderId: 'f-manuales',
    name: 'Manual_Procedimientos_Conservacion.docx',
    type: 'DOCX',
    size: '3.8 MB',
    modified: '18 SEP 2026',
    owner: 'DEP-01 Síntesis Molecular',
    previewLines: [
      'MANUAL DE PROCEDIMIENTOS DE CONSERVACIÓN (REV. 12)',
      '',
      'Capítulo 1: Custodia de muestras en frío.',
      'Capítulo 2: Cadena de custody y bitácoras.',
      'Capítulo 3: Disposición final de material biológico.',
      'Anexo A: Tabla de temperaturas por tipo de muestra.',
    ],
  },
  {
    id: 'doc-201',
    folderId: 'f-plantillas',
    name: 'Plantilla_Reembolso_Gastos_Q4.docx',
    type: 'DOCX',
    size: '420 KB',
    modified: '29 SEP 2026',
    owner: 'Recursos Humanos',
    previewLines: [
      'SOLICITUD DE REEMBOLSO DE GASTOS — Q4 2026',
      '',
      'Nombre del solicitante: ____________',
      'Departamento: ____________ Nº de empleado: ____________',
      'Concepto / Monto / Comprobante fiscal: (tabla adjunta)',
      'Firma del jefe inmediato: ____________',
    ],
  },
  {
    id: 'doc-202',
    folderId: 'f-plantillas',
    name: 'Constancia_No_Antiguedad.docx',
    type: 'DOCX',
    size: '180 KB',
    modified: '02 SEP 2026',
    owner: 'Recursos Humanos',
    previewLines: [
      'CONSTANCIA DE NO ANTIGÜEDAD LABORAL (PLANTILLA INTERNA)',
      '',
      'Por medio de la presente se hace constar que ______ no registra',
      'antigüedad previa en los programas de evaluación de campo.',
      'Este documento se expide a solicitud del interesado.',
    ],
  },
  {
    id: 'doc-301',
    folderId: 'f-mapeo',
    name: 'Protocolo_Mapeo_Parcela_Estandar.pdf',
    type: 'PDF',
    size: '2.6 MB',
    modified: '22 SEP 2026',
    owner: 'DEP-04 Evaluación de Campo',
    previewLines: [
      'PROTOCOLO DE MAPEO DE PARCELA ESTÁNDAR',
      '',
      '1. Delimite el cuadrante con estacas cada 20 metros.',
      '2. Registre coordenadas GPS y altura de manto vegetal.',
      '3. Fotografíe los puntos de control y adjúntelos al informe.',
      '4. Toda anomalia visual se reporta al INC-2026 de la semana.',
    ],
  },
  {
    id: 'doc-401',
    folderId: 'f-informes',
    name: 'Informe_Trimestral_Biopolimeros_Q3.xlsx',
    type: 'XLSX',
    size: '840 KB',
    modified: '25 SEP 2026',
    owner: 'Dirección Operativa',
    previewLines: [
      'INFORME TRIMESTRAL — BIOPOLÍMEROS (Q3 2026)',
      '',
      'Hojas: Resumen ejecutivo · Producción por lote · Deriva sintética',
      'Notas: los lotes marcados en rojo requieren seguimiento de DEP-04.',
      'Distribución: Dirección Operativa y jefaturas de departamento.',
    ],
  },
  {
    id: 'doc-402',
    folderId: 'f-informes',
    name: 'Informe_Auditoria_Interna_Ago.xlsx',
    type: 'XLSX',
    size: '610 KB',
    modified: '05 SEP 2026',
    owner: 'Auditoría Interna',
    previewLines: [
      'INFORME DE AUDITORÍA INTERNA — AGOSTO 2026',
      '',
      'Hallazgos: 12 (9 cerrados, 3 en proceso).',
      'Observación recurrente: bitácoras de criobox sin firma del turno.',
      'Compromiso: capacitación de recordatorio el 20 de octubre.',
    ],
  },
]

export const itTickets: ItTicket[] = [
  {
    folio: 'SN-2026-0231',
    category: 'Red y VPN',
    priority: 'high',
    status: 'progress',
    updated: 'hace 2 h',
  },
  {
    folio: 'SN-2026-0224',
    category: 'Software y licencias',
    priority: 'medium',
    status: 'open',
    updated: 'ayer',
  },
  {
    folio: 'SN-2026-0198',
    category: 'Equipo de cómputo',
    priority: 'low',
    status: 'resolved',
    updated: 'hace 5 días',
  },
]
