import { Header } from "@/components/dashboard/Header";
import { TemperatureCard } from "@/components/dashboard/TemperatureCard";
import { HeaterCard } from "@/components/dashboard/HeaterCard";
import { BatteryCard } from "@/components/dashboard/BatteryCard";
import { SolarCard } from "@/components/dashboard/SolarCard";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { cabinApi } from "@/lib/api";
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [heaterPollingPaused, setHeaterPollingPaused] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLocation("/login");
    }
  }, [setLocation]);

  const pauseHeaterPolling = useCallback(() => setHeaterPollingPaused(true), []);
  const resumeHeaterPolling = useCallback(() => setHeaterPollingPaused(false), []);

  const { data: tempData, dataUpdatedAt: tempUpdatedAt } = useQuery({
    queryKey: ["/temperature/status"],
    queryFn: cabinApi.getTemperatureStatus,
    refetchInterval: 10000,
  });

  const { data: heaterData, dataUpdatedAt: heaterUpdatedAt } = useQuery({
    queryKey: ["/heater/status"],
    queryFn: cabinApi.getHeaterStatus,
    refetchInterval: heaterPollingPaused ? false as const : 10000,
  });

  const { data: batteryData, dataUpdatedAt: batteryUpdatedAt } = useQuery({
    queryKey: ["/battery/status"],
    queryFn: cabinApi.getBatteryStatus,
    refetchInterval: 10000,
  });

  const { data: mpptData, dataUpdatedAt: mpptUpdatedAt } = useQuery({
    queryKey: ["/mppt/status"],
    queryFn: cabinApi.getMpptStatus,
    refetchInterval: 10000,
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="h-full">
            <TemperatureCard data={tempData} lastFetch={tempUpdatedAt} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-full">
            <HeaterCard data={heaterData} lastFetch={heaterUpdatedAt} onActionStart={pauseHeaterPolling} onActionEnd={resumeHeaterPolling} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="h-full">
            <BatteryCard data={batteryData} lastFetch={batteryUpdatedAt} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="h-full">
            <SolarCard data={mpptData} lastFetch={mpptUpdatedAt} />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
