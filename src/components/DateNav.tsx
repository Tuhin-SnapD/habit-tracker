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

  const moveBack = () => setSelectedDate(getBackwardDate(step, selectedDate));
  const moveForward = () => {
    if (forwardTarget) setSelectedDate(forwardTarget);
  };

  return (
    <div className="card flex items-center justify-center gap-1 p-1 w-fit mx-auto">
      <button
        onClick={moveBack}
        className="w-9 h-9 rounded-full hover:bg-muted/10 text-lg"
        aria-label="Previous"
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
        aria-label="Next"
        title={canForward ? undefined : "Can't navigate past today"}
        className="w-9 h-9 rounded-full hover:bg-muted/10 text-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        ›
      </button>
      <button
        onClick={goToday}
        disabled={selectedDate === toDateKey()}
        className="ml-1 px-3 py-1 rounded-full text-sm hover:bg-muted/10 disabled:opacity-40"
      >
        Today
      </button>
    </div>
  );
}
