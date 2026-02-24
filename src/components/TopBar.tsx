import { useLang } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";
import { motion } from "framer-motion";

const TopBar = () => {
  const { lang, toggleLang, tr } = useLang();

  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🌾</span>
        <h1 className="text-lg font-bold text-foreground">{tr("appName")}</h1>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleLang}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm font-semibold text-foreground border border-border"
      >
        <Languages size={16} />
        {lang === "mr" ? "EN" : "मरा"}
      </motion.button>
    </header>
  );
};

export default TopBar;
