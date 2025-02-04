import { formatISO, startOfDay } from "date-fns";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkSession {
  date: string;
  duration: number;
}

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number;
  records: Record<string, WorkSession>;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      records: {},

      startTimer: () => {
        const { isRunning, startTime } = get();
        if (!isRunning) {
          set({
            isRunning: true,
            startTime: startTime ?? Date.now(), 
          });
        }
      },

      stopTimer: () => {
        const { startTime, elapsedTime, records, isRunning } = get();
        if (startTime && isRunning) {
          const now = Date.now();
          const sessionDuration = now - startTime; // Tempo da sessão atual
          const totalElapsed = elapsedTime + sessionDuration; // Tempo total atualizado

          const today = formatISO(startOfDay(new Date()), { representation: "date" }); // Usa date-fns para formatar a data corretamente

          const existingRecord = records[today] || { date: today, duration: 0 };

          set({
            isRunning: false,
            startTime: null,
            elapsedTime: totalElapsed,
            records: {
              ...records,
              [today]: {
                date: today,
                duration: existingRecord.duration + sessionDuration,
              },
            },
          });
        }
      },

      resetTimer: () => {
        set({ isRunning: false, startTime: null, elapsedTime: 0 });
      },
    }),
    { name: "work-timer-storage" }
  )
);
