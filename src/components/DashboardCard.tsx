import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  gradient: string;
  delay?: number;
};

const DashboardCard = ({ icon: Icon, label, value, sub, gradient, delay = 0 }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    className={`${gradient} rounded-2xl p-4 text-primary-foreground shadow-lg min-h-[110px] flex flex-col justify-between`}
  >
    <div className="flex items-center gap-2 mb-2">
      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
        <Icon size={20} />
      </div>
      <span className="text-sm font-medium opacity-90">{label}</span>
    </div>
    <div>
      <p className="text-2xl font-bold leading-tight">{value}</p>
      {sub && <p className="text-xs opacity-80 mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

export default DashboardCard;
