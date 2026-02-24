import { useLocation, useNavigate } from "react-router-dom";
import { Home, Map, TrendingUp, Bell, Wallet, UserCircle } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: Home, labelKey: "dashboard" },
  { path: "/land", icon: Map, labelKey: "land" },
  { path: "/market", icon: TrendingUp, labelKey: "market" },
  { path: "/reminders", icon: Bell, labelKey: "reminders" },
  { path: "/expenses", icon: Wallet, labelKey: "expenses" },
  { path: "/profile", icon: UserCircle, labelKey: "profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tr } = useLang();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-2 min-w-[56px] rounded-xl transition-colors"
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 gradient-primary rounded-xl opacity-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon
                size={24}
                className={active ? "text-primary" : "text-muted-foreground"}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tr(item.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
