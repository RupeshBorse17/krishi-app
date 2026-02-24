import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sprout, MapPin, Wallet } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

const actions = [
  { icon: Sprout, labelKey: "addCrop", to: "/land?add=1", gradient: "gradient-primary" },
  { icon: MapPin, labelKey: "addLand", to: "/land?add=1", gradient: "gradient-harvest" },
  { icon: Wallet, labelKey: "addExpense", to: "/expenses?add=1", gradient: "gradient-earth" },
];

const QuickActions = () => {
  const { tr } = useLang();

  return (
    <div className="flex gap-3">
      {actions.map((a, i) => (
        <Link key={a.labelKey} to={a.to} className="flex-1 min-w-0">
          <motion.div
            whileTap={{ scale: 0.93 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className={`${a.gradient} flex-1 rounded-2xl p-4 flex flex-col items-center gap-2 text-primary-foreground shadow-md hover:shadow-lg transition-shadow min-h-[100px]`}
          >
            <a.icon size={28} />
            <span className="text-xs font-semibold">{tr(a.labelKey)}</span>
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
