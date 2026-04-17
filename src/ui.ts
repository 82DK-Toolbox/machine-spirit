import { SHIFTS, SHIFT_TIMEZONE } from './config.js';
import type { TimeOfDay } from './config.js';
import type { ShiftState } from './store.js';

type SlotKey = Exclude<keyof ShiftState, 'reserve'>;

function mention(id: string | null): string {
  return id ? `<@${id}>` : '_\u2014_';
}

function slotKey(id: number, slot: 'main' | 'secondary'): SlotKey {
  return `shift${id}_${slot}` as SlotKey;
}

function unixTimestampTodayAt(t: TimeOfDay, timeZone: string): number {
  const now = new Date();
  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const hhmm = `${String(t.hour).padStart(2, '0')}:${String(t.minute).padStart(2, '0')}`;
  const guessMs = Date.parse(`${ymd}T${hhmm}:00Z`);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(guessMs));
  const part = (type: string): number =>
    Number(parts.find((p) => p.type === type)!.value);
  const asIfUtc = Date.UTC(
    part('year'),
    part('month') - 1,
    part('day'),
    part('hour'),
    part('minute'),
    part('second'),
  );
  const offsetMs = asIfUtc - guessMs;
  return Math.floor((guessMs - offsetMs) / 1000);
}

function discordTime(t: TimeOfDay): string {
  return `<t:${unixTimestampTodayAt(t, SHIFT_TIMEZONE)}:t>`;
}

export function buildEmbed(state: ShiftState): Record<string, unknown> {
  const shiftBlocks = SHIFTS.map((s) => {
    const main = state[slotKey(s.id, 'main')];
    const sec = state[slotKey(s.id, 'secondary')];
    const end = s.end ? discordTime(s.end) : 'End';
    return [
      `**Shift ${s.id} - ${s.label}** (${discordTime(s.start)} \u2192 ${end})`,
      `\u2003\u2003Main Officer = ${mention(main)}`,
      `\u2003\u2003Secondary Officer = ${mention(sec)}`,
    ].join('\n');
  }).join('\n\n');

  const reserveList =
    state.reserve.length === 0
      ? '_\u2014_'
      : state.reserve.map((id) => `<@${id}>`).join(', ');

  const description = [
    shiftBlocks,
    '',
    `**Reserve officers:** ${reserveList}`,
    '',
    `**Special Role Tank Squire** = ${mention(state.tank_squire)}`,
    '',
    '_Please indicate your attendance with the buttons below._',
  ].join('\n');

  return {
    title: 'Shift Sign-Up',
    description,
    color: 0x2b2d31,
  };
}

interface Component {
  type: number;
  style?: number;
  label?: string;
  custom_id?: string;
  components?: Component[];
}

function row(components: Component[]): Component {
  return { type: 1, components };
}

function btn(custom_id: string, label: string, style = 1): Component {
  return { type: 2, style, label, custom_id };
}

export function buildComponents(): Component[] {
  return [
    row([btn('s:1:m', 'Shift 1 Main'), btn('s:1:s', 'Shift 1 Secondary')]),
    row([btn('s:2:m', 'Shift 2 Main'), btn('s:2:s', 'Shift 2 Secondary')]),
    row([btn('s:3:m', 'Shift 3 Main'), btn('s:3:s', 'Shift 3 Secondary')]),
    row([btn('ts', 'Tank Squire', 3)]),
    row([btn('r', 'Toggle Reserve', 2)]),
  ];
}
