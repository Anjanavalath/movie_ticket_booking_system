import React from 'react';
import { Check } from 'lucide-react';

const STEPS = ['Showtime', 'Seats', 'Summary', 'Payment', 'Ticket'];

export default function BookingSteps({ current }) {
  return (
    <div className="mx-auto mb-10 flex w-full max-w-2xl items-center">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const isDone = step < current;
        const isActive = step === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                  isDone
                    ? 'border-crimson-600 bg-crimson-600 text-cream-50'
                    : isActive
                    ? 'border-crimson-500 text-crimson-400'
                    : 'border-ink-500 text-cream-300/40'
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : step}
              </div>
              <span
                className={`hidden text-[11px] font-medium sm:block ${
                  isActive ? 'text-cream-100' : 'text-cream-300/40'
                }`}
              >
                {label}
              </span>
            </div>
            {step !== STEPS.length && (
              <div className={`mx-2 h-0.5 flex-1 rounded ${isDone ? 'bg-crimson-600' : 'bg-ink-500'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
