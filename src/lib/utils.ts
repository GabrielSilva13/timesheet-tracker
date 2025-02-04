import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";


export const HOURLY_RATE = 40;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export function formatDuration(milliseconds: number) {
  const totalMinutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  } else {
    return `${minutes}min`;
  }
}



export function formatDateWithWeekday(dateString: string) {
  const date = parseISO(dateString);
  return format(date, "dd/MM/yyyy (EEEEEE)", { locale: ptBR });
}