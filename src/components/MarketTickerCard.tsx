import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  name: string;
  price: number;
  change: number;
  unit: string;
  delay?: number;
};

const MarketTickerCard = ({ name, price, change, unit, delay = 0 }: Props) => {
  const up = change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="bg-card rounded-xl p-3 border border-border flex items-center justify-between shadow-sm"
    >
      <div>
        <p className="font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{unit}</p>
      </div>
      <div className="text-right flex items-center gap-2">
        <span className="text-lg font-bold text-foreground">₹{price.toLocaleString("en-IN")}</span>
        <span
          className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
            up
              ? "bg-profit/15 text-profit"
              : "bg-loss/15 text-loss"
          }`}
        >
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {up ? "+" : ""}
          {change}%
        </span>
      </div>
    </motion.div>
  );
};

export default MarketTickerCard;
