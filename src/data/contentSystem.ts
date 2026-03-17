// ═══════════════════════════════════════════════════════
// CELIXIR CONTENT COMMAND CENTER — Data Layer
// ═══════════════════════════════════════════════════════

export const MENSAJE_MADRE = {
  declaracion: "El maquillaje no te cambia la cara. Te devuelve a ti misma.",
  promesa: "Celixir ayuda a mujeres de 30–55 años a reconectar con su confianza y presencia personal a través de rituales simples de maquillaje con propósito.",
  esencia: "No vendemos técnica. Vendemos el regreso a una misma.",
};

export type PilarId = 'despertar' | 'cotidiana' | 'tecnica' | 'transformacion';

export interface Pilar {
  id: PilarId;
  emoji: string;
  nombre: string;
  descripcion: string;
  intencion: string;
  formatos: string[];
}

export const PILARES: Pilar[] = [
  {
    id: "despertar",
    emoji: "✨",
    nombre: "Despertar Consciente",
    descripcion: "Mentalidad, autoestima, presencia. El 'por qué' detrás del maquillaje.",
    intencion: "Que confíen",
    formatos: ["Reflexión corta", "Pregunta poderosa", "Afirmación visual"],
  },
  {
    id: "cotidiana",
    emoji: "☀️",
    nombre: "Vida Real & Soluciones",
    descripcion: "Maquillaje funcional para el día a día. Rapidez, practicidad, resultados.",
    intencion: "Que me recuerden",
    formatos: ["Tutorial rápido", "Hack de vida real", "Antes/después"],
  },
  {
    id: "tecnica",
    emoji: "💄",
    nombre: "Técnica con Propósito",
    descripcion: "Productos, acabados, texturas. El 'cómo' explicado en simple.",
    intencion: "Que entiendan",
    formatos: ["Reseña honesta", "Comparativa", "Explicación visual"],
  },
  {
    id: "transformacion",
    emoji: "🌿",
    nombre: "Transformación Celixir",
    descripcion: "Resultados reales, testimonios, la escalera de valor de la marca.",
    intencion: "Que elijan",
    formatos: ["Testimonio", "Caso de éxito", "Invitación a actuar"],
  },
];

export interface HookVariant {
  version: string;
  etiqueta: string;
  tipo: string;
  texto: string;
  notas: string;
}

export interface ContentDay {
  dia: string;
  nombre: string;
  fecha: string;
  especial: boolean;
  etiqueta: string;
  emoji: string;
  pilar: string;
  pilarId: PilarId;
  formato: string;
  recurso: string;
  intencion: string;
  tema: string;
  hooks: HookVariant[];
  cta: string;
  kpi: string;
}

export interface ContentWeek {
  id: string;
  titulo: string;
  subtitulo: string;
  fechaRango: string;
  estrategia: string;
  dias: ContentDay[];
}

export const SEMANAS: ContentWeek[] = [
  {
    id: "semana-8-13-marzo",
    titulo: "La Mujer que Vuelve a Elegirse",
    subtitulo: "Construido sobre el 8M · 3 vídeos ya grabados · 1 test listo",
    fechaRango: "8 – 13 Marzo",
    estrategia: "Semana de tema único × Día Internacional de la Mujer × Activación de 3 recursos listos",
    dias: [
      {
        dia: "DOM 8M", nombre: "Domingo", fecha: "8 de marzo", especial: true,
        etiqueta: "DÍA INTERNACIONAL DE LA MUJER", emoji: "🌸",
        pilar: "Despertar Consciente", pilarId: "despertar",
        formato: "Reel emocional + Story con enlace",
        recurso: "Guía gratuita «Códigos Celixir»",
        intencion: "Celebrar + Captar leads",
        tema: "«Hoy me elijo a mí»",
        hooks: [
          { version: "A", etiqueta: "Emocional · Para el reel", tipo: "Identidad", texto: "Nadie te enseñó que maquillarte podía ser un acto de amor. Hoy empieza ese aprendizaje.", notas: "Pausa dramática entre «amor» y «Hoy». Mírala directo a la cámara." },
          { version: "B", etiqueta: "Disruptor · Para el caption", tipo: "Contraintuitivo", texto: "No es vanidad. No es superficialidad. Es elegirte. Por primera vez en mucho tiempo.", notas: "Frases cortas. Ritmo de golpe. Ideal para primeras 3 líneas del caption." },
          { version: "C", etiqueta: "Pregunta · Para la Story", tipo: "Activación", texto: "¿Cuándo fue la última vez que te pusiste a ti la primera en la lista?", notas: "Sola en pantalla. Fondo oscuro. Sin música. Solo la pregunta." },
        ],
        cta: "Descarga gratis «Los 5 Códigos Celixir» — enlace en bio",
        kpi: "Descargas del lead magnet + guardados del reel",
      },
      {
        dia: "LUN 9", nombre: "Lunes", fecha: "9 de marzo", especial: false,
        etiqueta: "PRESENCIA", emoji: "✨",
        pilar: "Despertar Consciente", pilarId: "despertar",
        formato: "Carrusel o texto largo",
        recurso: "—",
        intencion: "Inspirar + Generar confianza",
        tema: "La diferencia entre maquillarte y prepararte",
        hooks: [
          { version: "A", etiqueta: "Reflexión · Carrusel portada", tipo: "Filosófico", texto: "Maquillarte 5 minutos no es vanidad. Es el único momento del día en que nadie te necesita.", notas: "Portada del carrusel. Letra grande. Sin imagen distractora." },
          { version: "B", etiqueta: "Contraste · Para el caption", tipo: "Antes/Después mental", texto: "Prepararse es diferente a maquillarse. Una es técnica. La otra es un ritual de presencia.", notas: "Primera línea del caption + idea del slide 2." },
          { version: "C", etiqueta: "Historia · Para X o newsletter", tipo: "Narrativo", texto: "Hay mañanas en que el espejo te devuelve a alguien que ya no reconoces. Estas son las mañanas más importantes.", notas: "Apertura perfecta para hilo de X o email de la semana." },
        ],
        cta: "Cuéntame en los comentarios: ¿cómo es tu ritual de mañana?",
        kpi: "Comentarios + tiempo de visualización en carrusel",
      },
      {
        dia: "MAR 10", nombre: "Martes", fecha: "10 de marzo", especial: false,
        etiqueta: "VIDA REAL", emoji: "🌙",
        pilar: "Vida Real & Soluciones", pilarId: "cotidiana",
        formato: "Reel auténtico (vídeo YA grabado)",
        recurso: "🎬 Vídeo de las 23h · LISTO",
        intencion: "Identificación masiva + Nuevas seguidoras",
        tema: "Mi maquillaje a las 11 de la noche (el vídeo real)",
        hooks: [
          { version: "A", etiqueta: "Confesión · Reel voz en off", tipo: "Identificación directa", texto: "Eran casi las 11 de la noche. Y mi maquillaje seguía intacto. Esto es lo que uso yo.", notas: "Plano cerrado de tu cara a las 23h. Deja que la imagen hable 2 segundos." },
          { version: "B", etiqueta: "Problema · Caption primera línea", tipo: "Agitación del dolor", texto: "¿Por qué a las 3 horas pareces otra persona y a mí me dura todo el día?", notas: "Pregunta que pican. Ideal para máximo alcance." },
          { version: "C", etiqueta: "Storytelling · TikTok o X", tipo: "Narrativo cotidiano", texto: "Llegué a casa a las 11 de la noche después de 14 horas fuera. Me miré al espejo y pensé: esto hay que enseñarlo.", notas: "TikTok: di esto mirando a cámara, sin música al principio." },
        ],
        cta: "Guarda este vídeo para cuando lo necesites recordar 👇",
        kpi: "Reproducciones + compartidos + guardados",
      },
      {
        dia: "MIÉ 11", nombre: "Miércoles", fecha: "11 de marzo", especial: false,
        etiqueta: "PRODUCTO", emoji: "🧴",
        pilar: "Técnica con Propósito", pilarId: "tecnica",
        formato: "Reel educativo (vídeo YA grabado)",
        recurso: "🎬 Vídeo The Ordinary · LISTO",
        intencion: "Autoridad + SEO Instagram + Visitas al perfil",
        tema: "Lo que nadie te dice de The Ordinary para pieles de 35+",
        hooks: [
          { version: "A", etiqueta: "Secreto · Primeras palabras reel", tipo: "Curiosidad + Autoridad", texto: "Llevo dos años usando The Ordinary y esto es lo que nadie te cuenta si tienes más de 35.", notas: "Sosteniendo los productos en mano. Sin música al principio." },
          { version: "B", etiqueta: "SEO · Caption primera línea", tipo: "Búsqueda directa", texto: "The Ordinary para pieles maduras: mi selección honesta después de dos años de prueba.", notas: "Esta línea te posiciona en búsquedas de Instagram." },
          { version: "C", etiqueta: "Contraintuitivo · TikTok o historia", tipo: "Disrupción de creencia", texto: "The Ordinary no es solo para piel joven. Es para pieles que ya saben lo que necesitan.", notas: "Frase visual en pantalla 2 segundos al inicio." },
        ],
        cta: "Guarda este vídeo · Cuéntame qué usas tú ahora mismo",
        kpi: "Guardados + visitas al perfil + clics en bio",
      },
      {
        dia: "JUE 12", nombre: "Jueves", fecha: "12 de marzo", especial: false,
        etiqueta: "BIG IDEA", emoji: "🔮",
        pilar: "Transformación Celixir", pilarId: "transformacion",
        formato: "Reel o carrusel + Story con link",
        recurso: "🔮 Test de Arquetipo · LISTO",
        intencion: "Curiosidad + Lead magnet + Captación",
        tema: "¿Cuál es tu esencia Celixir? (lanzamiento del test)",
        hooks: [
          { version: "A", etiqueta: "Intriga · Reel de lanzamiento", tipo: "Identidad + Misterio", texto: "Hay un tipo de maquillaje que habla de quién eres. Llevo semanas creando algo para ayudarte a descubrirlo.", notas: "Plano de tus manos trabajando en algo. Sin revelar nada todavía." },
          { version: "B", etiqueta: "Directo · Story con swipe up", tipo: "CTA de curiosidad", texto: "¿Eres Luminosa, Íntima, Libre o Esencial? Descubre tu arquetipo Celixir. (Tarda 2 minutos.)", notas: "Texto en pantalla. Flecha animada señalando el link." },
          { version: "C", etiqueta: "Filosófico · X o newsletter", tipo: "Reflexión profunda", texto: "Tu maquillaje no es un accidente. Es un lenguaje. Y tiene una gramática que puedes aprender.", notas: "Para abrir el email de la semana o hilo de X." },
        ],
        cta: "Haz el test gratuito → enlace en bio",
        kpi: "Clics al test + Leads captados + Respuestas en stories",
      },
      {
        dia: "VIE 13", nombre: "Viernes", fecha: "13 de marzo", especial: false,
        etiqueta: "VIRAL CELIXIR", emoji: "🔥",
        pilar: "Vida Real & Soluciones", pilarId: "cotidiana",
        formato: "Reel trending adaptado",
        recurso: "—",
        intencion: "Alcance orgánico + Nuevas seguidoras",
        tema: "Un trend viral con el universo Celixir",
        hooks: [
          { version: "A", etiqueta: "Trend con giro · Texto en pantalla", tipo: "Formato viral adaptado", texto: "POV: llevas años maquillándote sin saber que en realidad te estabas eligiendo a ti misma.", notas: "Formato POV. Plano fijo de espejo. Transición suave." },
          { version: "B", etiqueta: "Lista · Alta retención", tipo: "Listicle emocional", texto: "3 cosas que cambian cuando empiezas a maquillarte con propósito (y ninguna tiene que ver con la técnica).", notas: "Carrusel rápido o reel con texto superpuesto." },
          { version: "C", etiqueta: "Declaración · Máxima compartibilidad", tipo: "Statement de identidad", texto: "No sé quién necesita oír esto hoy: 5 minutos delante del espejo no es un lujo. Es un derecho.", notas: "Tipografía sola. Sin vídeo. Fondo Celixir." },
        ],
        cta: "Etiqueta a la mujer que también merece escuchar esto hoy 💛",
        kpi: "Compartidos en stories + Nuevas seguidoras",
      },
    ],
  },
  {
    id: "semana-16-22-marzo",
    titulo: "Intención Diaria · Madrid Edition",
    subtitulo: "6 piezas de contenido + plan de stories desde Madrid",
    fechaRango: "16 – 22 Marzo",
    estrategia: "Semana de intención diaria con viaje a Madrid como hilo conductor",
    dias: [
      {
        dia: "LUN 17", nombre: "Lunes", fecha: "17 de marzo", especial: false,
        etiqueta: "CONSCIENCIA", emoji: "🌸",
        pilar: "Despertar Consciente", pilarId: "despertar",
        formato: "Carrusel reflexivo o texto largo",
        recurso: "—",
        intencion: "Inspirar + Generar confianza",
        tema: "Ser dama de honor: El honor de cuidar a otra mujer",
        hooks: [
          { version: "A", etiqueta: "Video a cámara · emotivo", tipo: "Identificación", texto: "Nadie te va a dar permiso para elegirte. Eso solo lo puedes hacer tú.", notas: "Hablar directo a cámara. Tono íntimo." },
          { version: "B", etiqueta: "Pregunta poderosa", tipo: "Activación", texto: "¿Cuándo fue la última vez que te pusiste delante del espejo y te dijiste 'hoy me elijo a mí'?", notas: "Frase en pantalla sola." },
          { version: "C", etiqueta: "Afirmación Celixir", tipo: "Statement", texto: "El ritual de maquillarte no es vanidad. Es el único momento del día en que tú eres tuya.", notas: "Fondo Celixir. Música suave." },
        ],
        cta: "Guarda este post si esto te ha resonado",
        kpi: "Guardados + comentarios emocionales",
      },
      {
        dia: "MAR 18", nombre: "Martes", fecha: "18 de marzo", especial: false,
        etiqueta: "VIDA REAL", emoji: "⚡",
        pilar: "Vida Real & Soluciones", pilarId: "cotidiana",
        formato: "Reel corto · 30–45 seg",
        recurso: "—",
        intencion: "Identificación + Recordar",
        tema: "Delineado en párpados caídos (por qué siempre te queda raro)",
        hooks: [
          { version: "A", etiqueta: "Problema directo", tipo: "Agitación", texto: "Lo que nadie te dice del delineado en párpados caídos (y por qué siempre te queda raro).", notas: "Plano cerrado en ojos. 2 partes: error + solución." },
          { version: "B", etiqueta: "Curiosidad + solución", tipo: "Pregunta retórica", texto: "¿Por qué el mismo delineado que le queda perfecto a ella a ti te hace el ojo más pequeño?", notas: "Empezar con la pregunta y luego demostrar." },
          { version: "C", etiqueta: "Autoridad + empatía", tipo: "Expertise", texto: "Si tienes más de 35 años y usas el mismo delineado de cuando tenías 25, esto es para ti.", notas: "Tono de amiga experta, no de profesora." },
        ],
        cta: "Comenta DELINEADO y te mando el paso a paso",
        kpi: "Reproducciones + comentarios + compartidos",
      },
      {
        dia: "MIÉ 19", nombre: "Miércoles", fecha: "19 de marzo", especial: false,
        etiqueta: "BIG IDEA", emoji: "💡",
        pilar: "Transformación Celixir", pilarId: "transformacion",
        formato: "Reel reflexivo o carrusel conversacional",
        recurso: "Los 5 Códigos Celixir",
        intencion: "Curiosidad + Lead magnet",
        tema: "Los 5 minutos que cambié en mi mañana",
        hooks: [
          { version: "A", etiqueta: "Tiempo para ti", tipo: "Historia personal", texto: "Los 5 minutos que cambié en mi mañana y que lo cambiaron todo lo demás.", notas: "Sentada, cercana, sin mucho setup. Tono íntimo." },
          { version: "B", etiqueta: "Favoritos no-maquillaje", tipo: "Lista sorpresa", texto: "Este mes mis aliadas no han sido de belleza. Han sido: una libreta, una vela y un podcast de 20 minutos.", notas: "Formato carrusel con cada elemento." },
          { version: "C", etiqueta: "La pregunta que me cambió", tipo: "Reflexión profunda", texto: "¿Estoy maquillándome para el mundo o para mí? La respuesta fue incómoda. Y también liberadora.", notas: "Para abrir conversación profunda." },
        ],
        cta: "Descarga Los 5 Códigos Celixir · Link en bio",
        kpi: "Clics al lead magnet + guardados",
      },
      {
        dia: "JUE 20", nombre: "Jueves", fecha: "20 de marzo", especial: false,
        etiqueta: "PRODUCTOS", emoji: "🧴",
        pilar: "Técnica con Propósito", pilarId: "tecnica",
        formato: "Reel de producto · texturas + aplicación",
        recurso: "—",
        intencion: "Autoridad + SEO",
        tema: "Lo que me gasto al mes en skincare (la verdad)",
        hooks: [
          { version: "A", etiqueta: "Transparencia económica", tipo: "Datos reales", texto: "Lo que me gasto al mes en skincare básico y si vale la pena (te digo la verdad).", notas: "Mostrar productos con precios reales." },
          { version: "B", etiqueta: "Kit de inicio", tipo: "Guía práctica", texto: "Si empezaras tu skincare desde cero hoy, ¿qué comprarías? Te armo el kit.", notas: "4 productos, un orden, un resultado." },
          { version: "C", etiqueta: "Producto tendencia", tipo: "Reseña honesta", texto: "Todo el mundo habla de [producto]. Yo lo probé 3 semanas. Te cuento si es hype o funciona.", notas: "3 semanas de uso real. Resultados honestos." },
        ],
        cta: "Guarda este video para cuando vayas a comprar",
        kpi: "Guardados + visitas al perfil",
      },
      {
        dia: "VIE 21", nombre: "Viernes", fecha: "21 de marzo", especial: true,
        etiqueta: "VIRAL · MADRID", emoji: "🔥",
        pilar: "Vida Real & Soluciones", pilarId: "cotidiana",
        formato: "Reel getting ready · cámara profesional",
        recurso: "Contenido estrella de la semana",
        intencion: "Alcance máximo + Nuevas seguidoras",
        tema: "Labios rojos + escolta de honor. Esto está pasando.",
        hooks: [
          { version: "A", etiqueta: "Lookin Taylor era (viral)", tipo: "Getting ready", texto: "Labios rojos. Cabello recogido. Escolta de honor para recibir a la novia.", notas: "Cámara profesional + aro de luz. El momento del look ES el contenido." },
          { version: "B", etiqueta: "Detrás del look", tipo: "Behind the scenes", texto: "El look que uso cuando tengo 30 minutos y necesito que diga todo.", notas: "Mostrar proceso real de preparación." },
          { version: "C", etiqueta: "Reel trending", tipo: "Trend adaptado", texto: "Ese trend de 'getting ready' pero en versión real: despedida, labios rojos que lo dicen todo.", notas: "Formato POV. Getting ready → recogido → salida." },
        ],
        cta: "Etiqueta a esa amiga que necesita un look como este",
        kpi: "Compartidos en stories + nuevas seguidoras",
      },
      {
        dia: "SÁB 22", nombre: "Sábado", fecha: "22 de marzo", especial: false,
        etiqueta: "KIT · LIBRE", emoji: "🎨",
        pilar: "Técnica con Propósito", pilarId: "tecnica",
        formato: "Reel o carrusel educativo",
        recurso: "—",
        intencion: "Educar + Comunidad",
        tema: "Lo que nadie limpia en su kit de maquillaje",
        hooks: [
          { version: "A", etiqueta: "Limpieza del kit", tipo: "Tutorial práctico", texto: "Lo que nadie limpia en su kit de maquillaje (y por qué importa más de lo que crees).", notas: "Mostrar proceso real de limpieza de brochas." },
          { version: "B", etiqueta: "Herramientas clave", tipo: "Educativo", texto: "No es el producto. Son las herramientas. Con las brochas correctas el mismo corrector hace 3 cosas distintas.", notas: "Mostrar las 4 brochas que usas a diario." },
          { version: "C", etiqueta: "Behind the scenes Madrid", tipo: "Narrativo", texto: "Esta semana fui maquilladora y dama de honor. Lo que preparé, lo que llevé y lo que aprendí.", notas: "Conecta viaje con mensaje Celixir." },
        ],
        cta: "¿Cuándo limpiaste tus brochas? Cuéntame en comentarios",
        kpi: "Comentarios + compartidos",
      },
    ],
  },
];

export const HOOK_REGLAS = [
  { num: "01", texto: "El hook no describe el contenido. Crea una herida emocional que solo el contenido puede cerrar." },
  { num: "02", texto: "Las primeras 3 palabras son las más importantes. Acción, tensión o dato concreto." },
  { num: "03", texto: "Nunca empieces con «Hoy os traigo» o «En este vídeo». Empieza en el problema, la historia o la promesa." },
  { num: "04", texto: "Cada hook activa UNA palanca: curiosidad, identificación, autoridad o transformación." },
];

export const INTENCIONES = [
  { intencion: "Que entiendan", cuando: "Contenido educativo, técnica, explicación" },
  { intencion: "Que confíen", cuando: "Reflexión, opinión profesional, proceso" },
  { intencion: "Que me recuerden", cuando: "Historia personal, meme, trend con propósito" },
  { intencion: "Que elijan", cuando: "CTA directa, oferta, testimonio, resultado" },
];

export const RECURSOS = [
  { nombre: "Guía de Automaquillaje", estado: "activo", canal: "Linktree", icono: "📖" },
  { nombre: "Los 5 Códigos Celixir", estado: "activo", canal: "Linktree", icono: "✨" },
  { nombre: "Vídeo The Ordinary", estado: "listo", canal: "Pendiente publicar", icono: "🧴" },
  { nombre: "Vídeo maquillaje 23h intacto", estado: "listo", canal: "Pendiente publicar", icono: "🌙" },
  { nombre: "Test de Arquetipo", estado: "listo", canal: "Pendiente activar", icono: "🔮" },
  { nombre: "Asistente Celixir (diagnóstico)", estado: "próximo", canal: "Próximo lanzamiento", icono: "🤖" },
];

export const RITUAL_PRODUCCION = [
  { paso: "1", dia: "Viernes", duracion: "30 min", icono: "🧠", titulo: "Elige el tema de la semana", acciones: ["Revisa tus pilares", "Decide: ¿tema único o intención diaria?", "Escoge el recurso a activar", "Anota el hook de cada publicación"] },
  { paso: "2", dia: "Sábado AM", duracion: "2–3h", icono: "🎬", titulo: "Graba todo el contenido", acciones: ["Graba los 3–5 vídeos en una sola sesión", "Mismo fondo/luz para coherencia", "Autenticidad > perfección", "Incluye al menos 1 CTA verbal"] },
  { paso: "3", dia: "Sábado PM", duracion: "1–2h", icono: "✂️", titulo: "Edita y programa", acciones: ["Edita los vídeos", "Escribe captions con hook + cuerpo + CTA", "Programa en Meta Business", "Prepara 3–5 stories de refuerzo"] },
];
