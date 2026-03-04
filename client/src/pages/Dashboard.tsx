import { Header } from "@/components/dashboard/Header";
import { TemperatureCard } from "@/components/dashboard/TemperatureCard";
import { HeaterCard } from "@/components/dashboard/HeaterCard";
import { BatteryCard } from "@/components/dashboard/BatteryCard";
import { SolarCard } from "@/components/dashboard/SolarCard";
import { motion } from "framer-motion";

export default function Dashboard() {
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
            <TemperatureCard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-full">
            <HeaterCard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="h-full">
            <BatteryCard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="h-full">
            <SolarCard />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}