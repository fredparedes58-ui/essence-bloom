import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MENSAJE_MADRE, PILARES, SEMANAS, HOOK_REGLAS, INTENCIONES,
  RECURSOS, RITUAL_PRODUCCION,
  type ContentWeek, type ContentDay, type HookVariant, type PilarId,
} from '@/data/contentSystem';
import {
  Sparkles, ChevronDown, ChevronRight, Copy, Check, Zap, Target,
  Calendar, BookOpen, ArrowLeft, Flame, Eye, Lightbulb, Layers,
} from 'lucide-react';
import { toast } from 'sonner';

type View = 'hub' | 'week' | 'day';

const PILAR_COLORS: Record<PilarId, string> = {
  despertar: 'bg-primary/15 text-primary border-primary/30',
  cotidiana: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  tecnica: 'bg-accent/15 text-accent border-accent/30',
  transformacion: 'bg-sage/15 text-sage border-sage/30',
};

const PILAR_ACCENT: Record<PilarId, string> = {
  despertar: 'border-l-primary',
  cotidiana: 'border-l-amber-500',
  tecnica: 'border-l-accent',
  transformacion: 'border-l-sage',
};

export default function AdminContenidoPage() {
  const [view, setView] = useState<View>('hub');
  const [activeWeek, setActiveWeek] = useState<ContentWeek | null>(null);
  const [activeDay, setActiveDay] = useState<ContentDay | null>(null);
  const [expandedHook, setExpandedHook] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activePilar, setActivePilar] = useState<PilarId | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    toast.success('Copiado al portapapeles');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const goToWeek = (week: ContentWeek) => {
    setActiveWeek(week);
    setView('week');
    setActiveDay(null);
  };

  const goToDay = (day: ContentDay) => {
    setActiveDay(day);
    setView('day');
  };

  const goBack = () => {
    if (view === 'day') { setView('week'); setActiveDay(null); }
    else if (view === 'week') { setView('hub'); setActiveWeek(null); }
  };

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Breadcrumb */}
      {view !== 'hub' && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={goBack}
          className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {view === 'week' ? 'Command Center' : activeWeek?.titulo}
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {view === 'hub' && <HubView key="hub" onSelectWeek={goToWeek} activePilar={activePilar} setActivePilar={setActivePilar} />}
        {view === 'week' && activeWeek && (
          <WeekView
            key={activeWeek.id}
            week={activeWeek}
            onSelectDay={goToDay}
          />
        )}
        {view === 'day' && activeDay && (
          <DayView
            key={activeDay.dia}
            day={activeDay}
            expandedHook={expandedHook}
            setExpandedHook={setExpandedHook}
            copiedText={copiedText}
            onCopy={copyToClipboard}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// HUB VIEW — The Command Center
// ═══════════════════════════════════════════════════════
function HubView({
  onSelectWeek,
  activePilar,
  setActivePilar,
}: {
  onSelectWeek: (w: ContentWeek) => void;
  activePilar: PilarId | null;
  setActivePilar: (p: PilarId | null) => void;
}) {
  const [showReglas, setShowReglas] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      {/* Hero — Mensaje Madre */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-foreground to-foreground/90 p-7"
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-body font-bold tracking-[0.3em] uppercase text-primary">
              Mensaje Madre — No cambia. Nunca.
            </span>
          </div>
          <blockquote className="font-display text-2xl md:text-3xl text-primary-foreground leading-tight mb-4 font-medium italic">
            "{MENSAJE_MADRE.declaracion}"
          </blockquote>
          <p className="font-body text-sm text-primary-foreground/60 leading-relaxed mb-4">
            {MENSAJE_MADRE.promesa}
          </p>
          <div className="pt-4 border-t border-primary-foreground/10">
            <span className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-primary mr-2">Esencia:</span>
            <span className="font-body text-sm text-primary-foreground/70 italic">{MENSAJE_MADRE.esencia}</span>
          </div>
        </div>
      </motion.div>

      {/* Pilares */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-accent" />
          Pilares Editoriales
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {PILARES.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setActivePilar(activePilar === p.id ? null : p.id)}
              className={`text-left rounded-2xl p-4 border-2 transition-all duration-300 ${
                activePilar === p.id
                  ? `${PILAR_COLORS[p.id]} shadow-soft`
                  : 'bg-petal border-border hover:border-primary/20'
              }`}
            >
              <span className="text-2xl block mb-2">{p.emoji}</span>
              <p className="font-display text-sm font-semibold text-foreground">{p.nombre}</p>
              <p className="text-[11px] font-body text-muted-foreground mt-1">{p.intencion}</p>
              <AnimatePresence>
                {activePilar === p.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs font-body text-muted-foreground mt-3 pt-3 border-t border-border">
                      {p.descripcion}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.formatos.map(f => (
                        <span key={f} className="text-[10px] font-body px-2 py-0.5 rounded-full bg-background border border-border">
                          {f}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Intenciones */}
      <div className="grid grid-cols-2 gap-2">
        {INTENCIONES.map((item, i) => (
          <motion.div
            key={item.intencion}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="rounded-xl bg-petal border border-border p-3"
          >
            <p className="font-display text-sm font-bold text-foreground">{item.intencion}</p>
            <p className="text-[10px] font-body text-muted-foreground mt-1">{item.cuando}</p>
          </motion.div>
        ))}
      </div>

      {/* Reglas del Hook */}
      <motion.button
        onClick={() => setShowReglas(!showReglas)}
        className="w-full text-left rounded-2xl bg-foreground/5 border border-border p-4 hover:bg-foreground/10 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-display text-sm font-semibold text-foreground">Las 4 Reglas del Hook Celixir</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showReglas ? 'rotate-180' : ''}`} />
        </div>
        <AnimatePresence>
          {showReglas && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3">
                {HOOK_REGLAS.map(r => (
                  <div key={r.num} className="flex gap-3">
                    <span className="text-xs font-body font-bold text-primary tracking-wider flex-shrink-0">{r.num}</span>
                    <p className="text-xs font-body text-muted-foreground leading-relaxed">{r.texto}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Semanas */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Semanas de Contenido
        </h3>
        <div className="space-y-3">
          {SEMANAS.map((week, i) => (
            <motion.button
              key={week.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              onClick={() => onSelectWeek(week)}
              className="w-full text-left rounded-2xl bg-petal border border-border p-5 hover:border-primary/30 hover:shadow-soft transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-primary">{week.fechaRango}</span>
                    <span className="text-[10px] font-body px-2 py-0.5 rounded-full bg-primary/10 text-primary">{week.dias.length} días</span>
                  </div>
                  <h4 className="font-display text-base font-semibold text-foreground">{week.titulo}</h4>
                  <p className="text-xs font-body text-muted-foreground mt-1">{week.subtitulo}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recursos */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sage" />
          Recursos Disponibles
        </h3>
        <div className="grid gap-2">
          {RECURSOS.map((r, i) => (
            <motion.div
              key={r.nombre}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.06 }}
              className="flex items-center gap-3 rounded-xl bg-petal border border-border p-3"
            >
              <span className="text-lg">{r.icono}</span>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-foreground truncate">{r.nombre}</p>
                <p className="text-[10px] font-body text-muted-foreground">{r.canal}</p>
              </div>
              <span className={`text-[10px] font-body font-semibold px-2.5 py-1 rounded-full ${
                r.estado === 'activo' ? 'bg-sage/15 text-sage' :
                r.estado === 'listo' ? 'bg-primary/15 text-primary' :
                'bg-muted text-muted-foreground'
              }`}>
                {r.estado}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ritual de Producción */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Flame className="w-5 h-5 text-primary" />
          Ritual de Producción Semanal
        </h3>
        <div className="space-y-3">
          {RITUAL_PRODUCCION.map((step, i) => (
            <motion.div
              key={step.paso}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="rounded-2xl bg-petal border border-border p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">
                  {step.icono}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-sm font-semibold text-foreground">{step.titulo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-body text-muted-foreground mb-2">
                    <span>{step.dia}</span>
                    <span>·</span>
                    <span>{step.duracion}</span>
                  </div>
                  <ul className="space-y-1">
                    {step.acciones.map((a, j) => (
                      <li key={j} className="text-xs font-body text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// WEEK VIEW — Timeline
// ═══════════════════════════════════════════════════════
function WeekView({ week, onSelectDay }: { week: ContentWeek; onSelectDay: (d: ContentDay) => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
      {/* Week Header */}
      <div className="rounded-2xl bg-gradient-ritual p-6">
        <span className="text-[10px] font-body font-bold tracking-[0.3em] uppercase text-primary-foreground/70">
          {week.fechaRango}
        </span>
        <h2 className="font-display text-2xl font-semibold text-primary-foreground mt-1">{week.titulo}</h2>
        <p className="font-body text-sm text-primary-foreground/70 mt-2">{week.estrategia}</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-3">
          {week.dias.map((day, i) => (
            <motion.button
              key={day.dia}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onSelectDay(day)}
              className={`w-full text-left relative pl-12 pr-4 py-4 rounded-2xl border transition-all duration-300 group hover:shadow-soft ${
                day.especial
                  ? 'bg-primary/5 border-primary/30 hover:border-primary/50'
                  : 'bg-petal border-border hover:border-primary/20'
              }`}
            >
              {/* Timeline dot */}
              <div className={`absolute left-3 top-5 w-4 h-4 rounded-full border-2 z-10 ${
                day.especial
                  ? 'bg-primary border-primary animate-streak-glow'
                  : 'bg-petal border-border group-hover:border-primary group-hover:bg-primary/10'
              }`} />

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-lg">{day.emoji}</span>
                    <span className="text-[10px] font-body font-bold tracking-[0.15em] uppercase text-primary">
                      {day.dia}
                    </span>
                    <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${PILAR_COLORS[day.pilarId]}`}>
                      {day.etiqueta}
                    </span>
                    {day.especial && (
                      <span className="text-[9px] font-body font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        ★ DESTACADO
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-sm font-semibold text-foreground mb-1 truncate">
                    {day.tema}
                  </h4>
                  <p className="text-xs font-body text-muted-foreground italic line-clamp-1">
                    «{day.hooks[0].texto}»
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-body text-muted-foreground">{day.formato}</span>
                    {day.recurso !== '—' && (
                      <span className="text-[10px] font-body font-semibold text-primary">{day.recurso}</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// DAY VIEW — Hook Laboratory
// ═══════════════════════════════════════════════════════
function DayView({
  day,
  expandedHook,
  setExpandedHook,
  copiedText,
  onCopy,
}: {
  day: ContentDay;
  expandedHook: string | null;
  setExpandedHook: (h: string | null) => void;
  copiedText: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
      {/* Day Header */}
      <div className={`rounded-2xl p-6 ${day.especial ? 'bg-gradient-ritual' : 'bg-petal border border-border'}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{day.emoji}</span>
          <span className={`text-[10px] font-body font-bold tracking-[0.2em] uppercase ${
            day.especial ? 'text-primary-foreground/70' : 'text-primary'
          }`}>
            {day.dia} · {day.pilar}
          </span>
        </div>
        <h2 className={`font-display text-xl font-semibold ${day.especial ? 'text-primary-foreground' : 'text-foreground'}`}>
          {day.tema}
        </h2>
        <div className={`flex items-center gap-3 mt-3 flex-wrap`}>
          <span className={`text-[10px] font-body px-2.5 py-1 rounded-full ${
            day.especial ? 'bg-primary-foreground/20 text-primary-foreground' : `${PILAR_COLORS[day.pilarId]}`
          }`}>
            {day.formato}
          </span>
          <span className={`text-[10px] font-body ${day.especial ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
            {day.intencion}
          </span>
        </div>
      </div>

      {/* Context Grid */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Pilar', valor: day.pilar, icon: Layers },
          { label: 'Intención', valor: day.intencion, icon: Target },
          { label: 'KPI', valor: day.kpi, icon: Eye },
        ].map(item => (
          <div key={item.label} className="rounded-xl bg-petal border border-border p-3">
            <item.icon className="w-3.5 h-3.5 text-muted-foreground mb-1.5" />
            <p className="text-[9px] font-body font-bold tracking-[0.15em] uppercase text-muted-foreground">{item.label}</p>
            <p className="text-xs font-body font-medium text-foreground mt-1 leading-tight">{item.valor}</p>
          </div>
        ))}
      </div>

      {/* Hooks — The Lab */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-primary" />
          <h3 className="font-display text-base font-semibold text-foreground">3 Variantes de Hook</h3>
        </div>
        <div className="space-y-3">
          {day.hooks.map((hook) => {
            const hookId = `${day.dia}-${hook.version}`;
            const isExpanded = expandedHook === hookId;
            const isCopied = copiedText === hookId;

            return (
              <motion.div
                key={hook.version}
                layout
                className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                  isExpanded ? `border-l-4 ${PILAR_ACCENT[day.pilarId]} border-primary/30 shadow-soft` : 'border-border'
                }`}
              >
                <button
                  onClick={() => setExpandedHook(isExpanded ? null : hookId)}
                  className="w-full text-left p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-body font-bold flex-shrink-0 transition-colors ${
                      isExpanded ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {hook.version}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="text-[10px] font-body font-bold uppercase tracking-wider text-primary">{hook.etiqueta}</span>
                        <span className="text-[10px] font-body px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{hook.tipo}</span>
                      </div>
                      <p className="font-display text-sm text-foreground italic leading-relaxed">
                        «{hook.texto}»
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 border-t border-border">
                        <div className="pt-3">
                          <p className="text-[9px] font-body font-bold tracking-[0.15em] uppercase text-primary mb-1.5">
                            Nota de producción
                          </p>
                          <p className="text-xs font-body text-muted-foreground leading-relaxed">{hook.notas}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCopy(hook.texto, hookId);
                            }}
                            className="mt-3 flex items-center gap-1.5 text-[11px] font-body font-medium px-3 py-1.5 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-sage" /> : <Copy className="w-3 h-3" />}
                            {isCopied ? 'Copiado ✓' : 'Copiar hook'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl bg-sage/10 border border-sage/30 p-4">
        <div className="flex items-start gap-2.5">
          <Target className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[9px] font-body font-bold tracking-[0.15em] uppercase text-sage mb-1">CTA Recomendado</p>
            <p className="text-sm font-body text-foreground">{day.cta}</p>
          </div>
        </div>
      </div>

      {/* Recurso */}
      {day.recurso !== '—' && (
        <div className="rounded-xl bg-primary/8 border border-primary/20 p-4">
          <div className="flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] font-body font-bold tracking-[0.15em] uppercase text-primary mb-1">Recurso a activar</p>
              <p className="text-sm font-body text-foreground">{day.recurso}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
