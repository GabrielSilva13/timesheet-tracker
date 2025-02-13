'use client'

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTimerStore } from "@/store/timer-store";
import { cn } from "@/lib/utils";
import Report from "./report";
import DailyLog from "./daily-log";
import { Button } from "./ui/button";

export default function Timer() {
  const { isRunning, startTimer, stopTimer, elapsedTime, startTime, resetTimer } = useTimerStore();
  const [timeDigits, setTimeDigits] = useState(["00", "00", "00"]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        const totalElapsed = elapsedTime + (startTime ? now - startTime : 0);

        const totalSeconds = Math.floor(totalElapsed / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");

        setTimeDigits([hours, minutes, seconds]);
      }, 1000);
    } else {
      const totalSeconds = Math.floor(elapsedTime / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      const seconds = String(totalSeconds % 60).padStart(2, "0");

      setTimeDigits([hours, minutes, seconds]);
    }

    return () => clearInterval(interval);
  }, [isRunning, elapsedTime, startTime]);

  return (
    <div className="flex flex-col items-center justify-center border rounded-lg p-2 shadow-md max-w-screen-lg w-full">
      <div className="w-full flex flex-col items-center justify-center p-12">
        <h2 className="text-xl font-semibold mb-4">Registro de Horas</h2>

        <div className="text-5xl font-mono mb-4 flex space-x-2">
          {timeDigits.map((digit, index) => (
            <div key={index} className="flex items-center">
              <motion.span
                key={`${digit}-${index}`}
                className="inline-block tracking-widest -mx-2 text-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {digit}
              </motion.span>
              {index < 2 && <span className="text-gray-700 text-5xl">:</span>}
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <motion.button
            onClick={isRunning ? stopTimer : startTimer}
            className={cn(
              "px-6 py-3 text-white rounded-lg transition-all",
              isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRunning ? "Parar" : "Iniciar"}
          </motion.button>
        </div>
      </div>

      <div className="flex items-end justify-end w-full mt-auto gap-3">
        <Button size="icon" variant="outline" onClick={resetTimer}>
            <svg xmlns="XXXXXXXXXXXXXXXXXXXXXXXXXX" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
        </Button>
        <DailyLog />
        <Report />
      </div>
    </div>
  );
}
