'use client'

import { useTimerStore } from "@/store/timer-store";
import { useEffect, useState } from "react";
import { isSameWeek, isSameMonth, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { CalendarClockIcon } from "lucide-react";
import { formatDuration, HOURLY_RATE } from "@/lib/utils";


export default function Report() {
  const { records } = useTimerStore();
  const [weeklyHours, setWeeklyHours] = useState("0.00");
  const [monthlyHours, setMonthlyHours] = useState("0.00");
  const [weeklyProfit, setWeeklyProfit] = useState("R$ 0,00");
  const [monthlyProfit, setMonthlyProfit] = useState("R$ 0,00");
  const [weeklyDays, setWeeklyDays] = useState(0);
  const [monthlyDays, setMonthlyDays] = useState(0);
  const [weekPeriod, setWeekPeriod] = useState("");
  const [monthPeriod, setMonthPeriod] = useState("");

  useEffect(() => {
    const today = new Date();

    // Definir período da semana
    const firstDayOfWeek = startOfWeek(today, { weekStartsOn: 1 }); // Segunda-feira
    const lastDayOfWeek = endOfWeek(today, { weekStartsOn: 1 });

    // Definir período do mês
    const firstDayOfMonth = startOfMonth(today);
    const lastDayOfMonth = endOfMonth(today);

    let weeklyTotal = 0;
    let monthlyTotal = 0;
    let weeklyCount = 0;
    let monthlyCount = 0;

    Object.keys(records).forEach((date) => {
      const record = records[date];
      const recordDate = parseISO(date);

      if (isSameWeek(recordDate, today, { weekStartsOn: 1 })) {
        weeklyTotal += record.duration;
        weeklyCount++;
      }

      if (isSameMonth(recordDate, today)) {
        monthlyTotal += record.duration;
        monthlyCount++;
      }
    });

    // Cálculo do lucro
    const weeklyEarnings = (weeklyTotal / 3600000) * HOURLY_RATE;
    const monthlyEarnings = (monthlyTotal / 3600000) * HOURLY_RATE;

    setWeeklyHours(formatDuration(weeklyTotal));
    setMonthlyHours(formatDuration(monthlyTotal));
    setWeeklyProfit(`R$ ${weeklyEarnings.toFixed(2)}`);
    setMonthlyProfit(`R$ ${monthlyEarnings.toFixed(2)}`);
    setWeeklyDays(weeklyCount);
    setMonthlyDays(monthlyCount);
    setWeekPeriod(`${format(firstDayOfWeek, "dd/MM", { locale: ptBR })} - ${format(lastDayOfWeek, "dd/MM", { locale: ptBR })}`);
    setMonthPeriod(`${format(firstDayOfMonth, "dd/MM", { locale: ptBR })} - ${format(lastDayOfMonth, "dd/MM", { locale: ptBR })}`);
  }, [records]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <CalendarClockIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>📊 Relatório de Horas</DialogTitle>
          <DialogDescription>
            Veja um resumo do seu tempo trabalhado e o valor ganho.
          </DialogDescription>
        </DialogHeader>

        {/* Relatório Semanal */}
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h4 className="text-lg font-semibold">📅 Semana: <span className="text-gray-700">{weekPeriod}</span></h4>
          <p className="text-blue-600 text-2xl font-bold">{weeklyHours}</p>
          <p className="text-gray-600">Registrado em {weeklyDays} dias</p>
          <p className="text-green-600 font-bold">💰 Lucro: {weeklyProfit}</p>
        </div>

        {/* Relatório Mensal */}
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h4 className="text-lg font-semibold">📅 Mês: <span className="text-gray-700">{monthPeriod}</span></h4>
          <p className="text-blue-600 text-2xl font-bold">{monthlyHours}</p>
          <p className="text-gray-600">Registrado em {monthlyDays} dias</p>
          <p className="text-green-600 font-bold">💰 Lucro: {monthlyProfit}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
