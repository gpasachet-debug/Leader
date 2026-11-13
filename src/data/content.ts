import imgAccountingDesk from '../assets/images/accounting_ledger_desk_1794215304892.webp';
import imgMonthlyAccounting from '../assets/images/monthly_accounting_spreadsheets_1794215659747.webp';
import imgTaxAdvisory from '../assets/images/tax_advisory_charts_1794215304966.webp';
import imgPayrollHr from '../assets/images/payroll_hr_management_1794215306711.webp';
import imgTaxDebt from '../assets/images/tax_debt_settlement_docs_1794215660495.webp';
import imgBusinessGrowth from '../assets/images/business_growth_meeting_1794215306152.webp';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  badge: string;
  benefits: string[];
  deliverables: string[];
  iconName: string;
  image?: string;
}

export interface TargetAudience {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  examples: string;
  keyHelp: string[];
  icon: string;
}

export const LEADER_INFO = {
  name: "Leader",
  tagline: "Tu tranquilidad tributaria, nuestra prioridad",
  subtagline: "Tax, accounting & business consulting",
  heroDescription:
    "Te acompañamos en el crecimiento de tu negocio con soluciones contables y tributarias a tu medida en Chincha y todo el Perú. Más de 25 años de experiencia transformando obligaciones complejas en tranquilidad y rentabilidad.",
  advisorName: "Jorge Pasache",
  advisorRole: "Consultor Principal & Especialista Tributario",
  yearsExperience: "Más de 25 años",
  phonePrimary: "913 150 524",
  phoneSecondary: "933 884 597",
  whatsappUrlPrimary: "https://wa.me/51913150524",
  whatsappUrlSecondary: "https://wa.me/51933884597",
  location: "Chincha, Ica - Perú",
  email: "contacto@leaderconsultores.pe",
};

export const SERVICES: ServiceItem[] = [
  {
    id: "declaraciones-sunat",
    number: "01",
    title: "Declaraciones Mensuales SUNAT",
    badge: "Obligatorio & Crítico",
    shortDesc: "Presentación puntual y rigurosa de PDT 621, declaraciones juradas mensuales y anuales, evitando contingencias.",
    fullDesc:
      "Garantizamos la correcta determinación del IGV y Renta mensual, validación previa de comprobantes electrónicos, cruce de información para evitar inconsistencias y presentación oportuna antes de la fecha de vencimiento según el último dígito de tu RUC.",
    benefits: [
      "Cero multas por presentación fuera de plazo",
      "Validación de crédito fiscal y detracciones",
      "Presentación en plataformas oficiales SUNAT (PDT y Declara Fácil)",
      "Reporte mensual de tributos por pagar con anticipación",
    ],
    deliverables: [
      "Constancia de presentación SUNAT oficial",
      "Guía para el pago de tributos con anticipación",
      "Papel de trabajo con detalle de compras y ventas calculadas",
    ],
    iconName: "FileCheck",
    image: imgAccountingDesk,
  },
  {
    id: "contabilidad-mensual",
    number: "02",
    title: "Contabilidad Mensual",
    badge: "Información Clara",
    shortDesc: "Información contable clara y estructurada para que conozcas la salud financiera y rentabilidad de tu negocio.",
    fullDesc:
      "Llevamos los libros y registros contables físicos y electrónicos (SIRE / PLE), registro riguroso de compras y ventas, conciliación bancaria y emisión de Estados Financieros comprensibles que te sirven para créditos bancarios e inversión.",
    benefits: [
      "Estados financieros actualizados para entidades bancarias",
      "Control exhaustivo de costos, márgenes y gastos deducibles",
      "Implementación y gestión del SIRE (Sistema Integrado de Registros Electrónicos)",
      "Asesoría gerencial para interpretar tus números",
    ],
    deliverables: [
      "Balance de comprobación mensual",
      "Registro de compras y ventas electrónico validado",
      "Resumen ejecutivo de ingresos, egresos y margen neto",
    ],
    iconName: "Calculator",
    image: imgMonthlyAccounting,
  },
  {
    id: "asesoria-tributaria",
    number: "03",
    title: "Asesoría Tributaria Estratégica",
    badge: "Prevención y Soluciones",
    shortDesc: "Prevención de riesgos, planeamiento tributario legal y defensa frente a notificaciones y fiscalizaciones de SUNAT.",
    fullDesc:
      "Analizamos la estructura de tu empresa para aplicar los beneficios tributarios que otorga la ley peruana. Te protegemos ante cartas inductivas, esquelas de citación y fiscalizaciones parciales o definitivas de SUNAT.",
    benefits: [
      "Planeamiento tributario dentro del estricto marco legal",
      "Atención inmediata de requerimientos y esquelas SUNAT",
      "Auditorías preventivas de comprobantes y bancarización",
      "Acompañamiento en fiscalizaciones electrónicas y presenciales",
    ],
    deliverables: [
      "Diagnóstico tributario del ejercicio",
      "Respuesta técnica fundamentada a cartas inductivas",
      "Estrategia de optimización de costos tributarios",
    ],
    iconName: "ShieldAlert",
    image: imgTaxAdvisory,
  },
  {
    id: "planillas-laborales",
    number: "04",
    title: "Planillas y Obligaciones Laborales",
    badge: "Cumplimiento Normativo",
    shortDesc: "Gestión completa de T-Registro, PLAME, cálculo de remuneraciones, gratificaciones, CTS y AFP sin riesgos laborales.",
    fullDesc:
      "Te aseguramos el cumplimiento de la normativa laboral peruana (SUNAFIL y SUNAT). Gestionamos altas y bajas de personal, cálculo de boletas de pago, aportes de Essalud, ONP/AFP, liquidación de beneficios y contratos de trabajo.",
    benefits: [
      "Elaboración de boletas de pago y declaración mensual PLAME",
      "Cálculo exacto de CTS, Gratificaciones, Vacaciones y Liquidaciones",
      "Registro oportuno de altas y bajas en el T-Registro",
      "Prevención de denuncias y sanciones ante SUNAFIL",
    ],
    deliverables: [
      "Boletas de pago digitales listas para firma",
      "Declaración y constancia mensual PLAME",
      "Archivo de cálculo para aportes AFPnet y Essalud",
    ],
    iconName: "Users2",
    image: imgPayrollHr,
  },
  {
    id: "regularizacion-deudas",
    number: "05",
    title: "Regularización de Deudas y Declaraciones",
    badge: "Evaluamos Tu Caso",
    shortDesc: "Saneamiento de omisiones tributarias, fraccionamiento de deudas y defensa contra cobranzas coactivas de SUNAT.",
    fullDesc:
      "Si tienes declaraciones pendientes, valores emitidos (órdenes de pago, resoluciones de determinación) o retenciones bancarias en cobranza coactiva, realizamos un diagnóstico integral y tramitamos fraccionamientos (Art. 36 C.T.) o refinanciamientos.",
    benefits: [
      "Diagnóstico gratuito de situación en el buzón electrónico SUNAT",
      "Trámite de aplazamiento y fraccionamiento de deuda tributaria",
      "Liberación de retenciones en cuentas bancarias por coactiva",
      "Rectificatorias oportunas para reducir importes erróneos",
    ],
    deliverables: [
      "Informe del estado de la deuda y opciones de acogimiento",
      "Solicitud de fraccionamiento presentada y aprobada",
      "Cronograma mensual de cuotas fraccionadas",
    ],
    iconName: "AlertCircle",
    image: imgTaxDebt,
  },
  {
    id: "formalizacion-empresas",
    number: "06",
    title: "Constitución y Formalización de Empresas",
    badge: "Te Acompañamos Desde el Inicio",
    shortDesc: "Crea tu empresa de forma rápida y segura (SAC, EIRL, SRL) y elige el régimen tributario que realmente te conviene.",
    fullDesc:
      "Te guiamos en todo el proceso de constitución: reserva de nombre en SUNARP, redacción de estatutos y minuta notarial, obtención de RUC, clave SOL y elección inteligente del régimen tributario (Nuevo RUS, RER, Régimen MYPE Tributario o Régimen General).",
    benefits: [
      "Asesoría para elegir el tipo de sociedad (SAC, EIRL, SRL, SA)",
      "Selección del régimen tributario idóneo para pagar lo justo",
      "Tramitación completa de RUC y habilitación de facturación electrónica",
      "Protección de tu patrimonio personal frente a deudas comerciales",
    ],
    deliverables: [
      "Testimonio de escritura pública inscrita en SUNARP",
      "Ficha RUC activa y habida con Clave SOL",
      "Padrón de libros y sistema de emisión electrónica activado",
    ],
    iconName: "Building",
    image: imgBusinessGrowth,
  },
];

export const TARGET_AUDIENCES: TargetAudience[] = [
  {
    id: "mypes",
    title: "MYPES y Pequeños Negocios",
    subtitle: "Tranquilidad para crecer día a día",
    description:
      "Bodegas, ferreterías, bazares, talleres, restaurantes y negocios de barrio en Chincha que necesitan cumplir con SUNAT sin complicaciones ni costos excesivos.",
    examples: "Bodegas, boticas, restaurantes, talleres mecánicos, salones de belleza",
    keyHelp: [
      "Régimen Nuevo RUS o Especial de Renta (RER)",
      "Emisión sencilla de boletas y facturas electrónicas",
      "Recordatorios de pago antes de vencimiento",
    ],
    icon: "Store",
  },
  {
    id: "empresas",
    title: "Empresas Constituidas",
    subtitle: "Estructura contable sólida y estratégica",
    description:
      "Sociedades (SAC, SRL, EIRL) con personal en planilla, inventarios, ventas al por mayor y operaciones comerciales continuas que demandan control riguroso.",
    examples: "Distribuidoras, constructoras, servicios agrícolas, empresas de transporte",
    keyHelp: [
      "Gestión de planillas PLAME y contratos laborales",
      "Implementación obligatoria del SIRE y libros contables",
      "Planeamiento tributario para reinversión de utilidades",
    ],
    icon: "Building2",
  },
  {
    id: "comerciantes",
    title: "Comerciantes y Emprendedores",
    subtitle: "Formalízate y multiplica tus ventas",
    description:
      "Emprendedores que venden por redes sociales, importadores minoristas y comerciantes de mercados que quieren acceder a créditos y licitaciones.",
    examples: "Tiendas de ropa, comercio electrónico, venta por catálogo, distribuidores",
    keyHelp: [
      "Constitución rápida de empresa con RUC 20 o 10",
      "Manejo de billeteras digitales (Yape, Plin) sin contingencias",
      "Bancarización y sustento de origen de fondos",
    ],
    icon: "ShoppingBag",
  },
  {
    id: "independientes",
    title: "Profesionales y Trabajadores Independientes",
    subtitle: "Rentas de 4ta y 5ta categoría ordenadas",
    description:
      "Ingenieros, médicos, abogados, docentes, técnicos y consultores que emiten recibos por honorarios o perciben rentas mixtas.",
    examples: "Médicos, ingenieros, arquitectos, programadores, asesores",
    keyHelp: [
      "Declaración jurada anual de personas naturales",
      "Aprovechamiento de las 3 UIT adicionales deducibles",
      "Devolución de pagos en exceso de impuesto a la renta",
    ],
    icon: "Briefcase",
  },
];

export const WHY_LEADER_BENEFITS = [
  {
    title: "Mayor control de tus finanzas",
    desc: "Sabrás con exactitud tus ingresos, costos reales y márgenes netos en cada cierre mensual.",
    stat: "100%",
    statLabel: "Claridad financiera",
  },
  {
    title: "Cumplimiento estricto con SUNAT",
    desc: "Presentación puntual de PDTs, SIRE y libros electrónicos antes de cada fecha límite.",
    stat: "0",
    statLabel: "Multas por retraso",
  },
  {
    title: "Menos riesgos y multas",
    desc: "Auditoría previa de compras y bancarización para evitar reparos y pérdida de crédito fiscal.",
    stat: "25+",
    statLabel: "Años de experiencia",
  },
  {
    title: "Más tiempo para tu negocio",
    desc: "Delega la complejidad de los trámites y enfócate en tus clientes, ventas y crecimiento.",
    stat: "100%",
    statLabel: "Acompañamiento cercano",
  },
];

export const VENCIMIENTOS_TIPS = [
  {
    title: "No esperes al último momento",
    desc: "El sistema SUNAT se satura en los días finales del cronograma. Presentar 48 horas antes asegura tu confirmación sin estrés.",
    icon: "Clock",
  },
  {
    title: "Revisa tus compras, ventas y comprobantes",
    desc: "Verifica que todos los comprobantes recibidos estén validados en el padrón de comprobantes de pago de SUNAT y con detracción cancelada si aplica.",
    icon: "FileSearch",
  },
  {
    title: "Recuerda que tu fecha depende del último dígito de tu RUC",
    desc: "Los buenos contribuyentes y cada dígito del 0 al 9 tienen una fecha establecida mensual. Nuestro equipo te notifica tu turno con días de anticipación.",
    icon: "Calendar",
  },
];

export const SUNAT_EMERGENCY_INFO = {
  headline: "SUNAT Recuerda: Facilidades Tributarias Vigentes",
  subheadline: "Para contribuyentes en zonas declaradas en estado de emergencia por desastres naturales",
  measures: [
    "Postergación de declaraciones juradas mensuales y anuales",
    "Prórroga en cronogramas de pagos tributarios sin intereses moratorios",
    "Acceso a solicitudes de fraccionamiento especial con condiciones flexibles",
    "El beneficio se aplica a contribuyentes con domicilio fiscal en distritos comprendidos",
  ],
  warnings: [
    "No es una condonación de deudas, sino una prórroga oficial.",
    "No aplica de manera general a todos los contribuyentes del país.",
    "Es indispensable verificar si el domicilio fiscal de tu negocio califica en el padrón.",
  ],
  howWeHelp: [
    "Revisamos tus obligaciones tributarias actuales",
    "Determinamos si tu empresa califica para acogerse",
    "Mantenemos tu negocio al día con SUNAT y evitamos cobranzas coactivas",
    "Brindamos asesoría personalizada y tramitación formal",
  ],
};

