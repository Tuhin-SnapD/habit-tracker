import { useUIStore } from '../store/useUIStore';
import { useHabitStore } from '../store/useHabitStore';
import {
  formatHuman,
  toDateKey,
  getForwardDate,
  getBackwardDate,
} from '../lib/dates';

type Props = { step: 'day' | 'week' | 'month' };

export function DateNav({ step }: Props) {
  const selectedDate = useUIStore((s) => s.selectedDate);
  const setSelectedDate = useUIStore((s) => s.setSelectedDate);
  const goToday = useUIStore((s) => s.goToday);
  const weekStartsOn = useHabitStore((s) => s.settings.weekStartsOn);

  const fmt =
    step === 'month' ? 'MMMM yyyy' : step === 'week' ? "'Week of' MMM d" : 'EEEE, MMM d';

  const forwardTarget = getForwardDate(step, selectedDate, weekStartsOn);
  const canForward = forwardTarget !== null;
  const isToday = selectedDate === toDateKey();

  const moveBack = () => setSelectedDate(getBackwardDate(step, selectedDate));
  const moveForward = () => {
    if (forwardTarget) setSelectedDate(forwardTarget);
  };

  return (
    <div className="card flex items-center justify-center gap-1 p-1 w-fit mx-auto">
      <button
        onClick={moveBack}
        className="w-10 h-10 rounded-full hover:bg-muted/10 text-lg transition flex items-center justify-center"
        aria-label={`Previous ${step}`}
      >
        ‹
      </button>
      <div
        className={`px-3 py-1 min-w-[12rem] text-center ${
          step === 'month' ? 'display text-lg' : 'text-sm font-medium'
        }`}
      >
        {formatHuman(selectedDate, fmt)}
      </div>
      <button
        onClick={moveForward}
        disabled={!canForward}
        aria-label={`Next ${step}`}
        title={canForward ? undefined : "Can't navigate past today"}
        className="w-10 h-10 rounded-full hover:bg-muted/10 text-lg transition flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        ›
      </button>
      <button
        onClick={goToday}
        disabled={isToday}
        className={`ml-1 px-3 py-1.5 rounded-full text-sm transition ${
          isToday
            ? 'opacity-40 cursor-default'
            : 'hover:bg-muted/10 text-accent-purple font-medium'
        }`}
        aria-label="Jump to today"
      >
        Today
      </button>
    </div>
  );
}
