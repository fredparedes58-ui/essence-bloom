import type { RitualStep, Archetype } from '@/stores/appStore';

export interface Ritual {
  id: string;
  title: string;
  subtitle: string;
  duration: number; // minutes
  archetype: Archetype | 'all';
  steps: RitualStep[];
}

export const rituals: Ritual[] = [
  {
    id: 'despertar-consciente',
    title: 'Despertar Consciente',
    subtitle: 'Empieza el día conectando contigo',
    duration: 5,
    archetype: 'all',
    steps: [
      { id: 's1', title: 'Respira', description: 'Cierra los ojos. 3 respiraciones profundas. Siente tu rostro.', duration: 30, icon: '🌬️' },
      { id: 's2', title: 'Hidrata', description: 'Aplica tu crema con movimientos circulares ascendentes. Masajea suavemente.', duration: 45, icon: '💧' },
      { id: 's3', title: 'Protege', description: 'Protector solar. Cada gesto es un acto de cuidado hacia ti misma.', duration: 30, icon: '☀️' },
      { id: 's4', title: 'Color', description: 'Un toque de color en labios o mejillas. El color que TÚ elijas hoy.', duration: 45, icon: '🎨' },
      { id: 's5', title: 'Intención', description: 'Mírate al espejo. Sonríe. Di tu intención del día en voz alta.', duration: 30, icon: '✨' },
    ],
  },
  {
    id: 'ritual-guerrera',
    title: 'Ritual de la Guerrera',
    subtitle: 'Fuerza y determinación en cada trazo',
    duration: 7,
    archetype: 'guerrera',
    steps: [
      { id: 'g1', title: 'Prepara tu espacio', description: 'Ordena tu espacio. Este es TU momento. Mereces este tiempo.', duration: 30, icon: '🪞' },
      { id: 'g2', title: 'Base firme', description: 'Aplica tu base con decisión. Cada pasada es una afirmación de tu fuerza.', duration: 60, icon: '💪' },
      { id: 'g3', title: 'Mirada definida', description: 'Delinea tus ojos. La guerrera mira de frente, sin disculparse.', duration: 60, icon: '👁️' },
      { id: 'g4', title: 'Labios poderosos', description: 'Color intenso en labios. Tu voz importa, y tus labios lo reflejan.', duration: 45, icon: '💋' },
      { id: 'g5', title: 'Afirmación', description: '"Soy capaz de todo lo que me proponga hoy." Repítelo tres veces.', duration: 30, icon: '🔥' },
    ],
  },
  {
    id: 'ritual-sabia',
    title: 'Ritual de la Sabia',
    subtitle: 'Calma y claridad interior',
    duration: 6,
    archetype: 'sabia',
    steps: [
      { id: 'w1', title: 'Silencio', description: 'Un minuto de silencio. Escucha tu respiración.', duration: 60, icon: '🧘' },
      { id: 'w2', title: 'Cuidado esencial', description: 'Solo lo necesario. Sérum + hidratante. Menos es más.', duration: 45, icon: '🍃' },
      { id: 'w3', title: 'Cejas con intención', description: 'Peina tus cejas. Enmarcan tu sabiduría y tu mirada al mundo.', duration: 30, icon: '✏️' },
      { id: 'w4', title: 'Toque natural', description: 'Un toque de iluminador en los puntos altos. Brilla desde dentro.', duration: 30, icon: '💫' },
      { id: 'w5', title: 'Gratitud', description: 'Nombra 3 cosas por las que estás agradecida hoy.', duration: 45, icon: '🙏' },
    ],
  },
  {
    id: 'ritual-creadora',
    title: 'Ritual de la Creadora',
    subtitle: 'Expresión libre y color',
    duration: 8,
    archetype: 'creadora',
    steps: [
      { id: 'c1', title: 'Inspírate', description: 'Mira algo bello: una foto, una flor, el cielo. Deja que el color te hable.', duration: 30, icon: '🌸' },
      { id: 'c2', title: 'Lienzo limpio', description: 'Limpia e hidrata tu rostro. Es tu lienzo y hoy pintas algo nuevo.', duration: 45, icon: '🎭' },
      { id: 'c3', title: 'Color libre', description: 'Elige un color que NO suelas usar. Atrévete. Sombra, labial, lo que sientas.', duration: 60, icon: '🎨' },
      { id: 'c4', title: 'Juega', description: 'Mezcla, difumina, experimenta. No hay errores, solo arte.', duration: 90, icon: '✍️' },
      { id: 'c5', title: 'Firma', description: 'Tu look de hoy es tu firma creativa. Toma una foto si quieres recordarlo.', duration: 30, icon: '📸' },
    ],
  },
];

export function getRitualsForArchetype(archetype: Archetype): Ritual[] {
  if (!archetype) return rituals.filter(r => r.archetype === 'all');
  return rituals.filter(r => r.archetype === 'all' || r.archetype === archetype);
}
