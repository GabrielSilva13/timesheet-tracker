import { useTimerStore } from "@/store/timer-store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Clock } from "lucide-react";
import { formatDateWithWeekday, formatDuration, HOURLY_RATE } from "@/lib/utils";

export default function DailyLog() {
  const { records } = useTimerStore();
  const noRecords = Object.keys(records).length === 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon"><Clock /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>📊 Relatório de horas diárias</DialogTitle>
          <DialogDescription>
            Veja o tempo trabalhado e o valor arrecadado por dia.
          </DialogDescription>
        </DialogHeader>

        {noRecords ? (
          <p className="text-lg text-gray-500 text-center py-4">Nenhum registro encontrado.</p>
        ) : (
          <ul>
            {Object.keys(records).map((date) => {
              const { duration } = records[date];
              const dailyEarnings = (duration / 3600000) * HOURLY_RATE;

              return (
                <li key={date} className="border-b py-2 flex justify-between">
                  <strong className="text-gray-800">{formatDateWithWeekday(date)}</strong>
                  <span className="font-medium text-blue-600">{formatDuration(duration)}</span>
                  <span className="text-green-600 font-bold">💰 R$ {dailyEarnings.toFixed(2)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
