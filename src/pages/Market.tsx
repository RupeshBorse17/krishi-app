import { useLang } from "@/contexts/LanguageContext";
import MarketTickerCard from "@/components/MarketTickerCard";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const marketData = [
  { nameKey: "wheat", price: 2450, change: 2.3 },
  { nameKey: "rice", price: 3200, change: 0.8 },
  { nameKey: "soybean", price: 4820, change: -1.5 },
  { nameKey: "cotton", price: 7150, change: 3.1 },
  { nameKey: "sugarcane", price: 3100, change: 1.2 },
  { nameKey: "onion", price: 1890, change: -4.2 },
];

const barColors = [
  "hsl(142, 55%, 35%)",
  "hsl(42, 90%, 55%)",
  "hsl(25, 70%, 50%)",
  "hsl(200, 80%, 55%)",
  "hsl(142, 45%, 45%)",
  "hsl(0, 72%, 51%)",
];

const Market = () => {
  const { tr } = useLang();

  const chartData = marketData.map((m) => ({
    name: tr(m.nameKey),
    price: m.price,
  }));

  return (
    <div className="px-4 pb-4 space-y-4">
      <h2 className="text-xl font-bold text-foreground">{tr("todayMarket")}</h2>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-2xl p-4 border border-border shadow-sm"
      >
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(150,10%,45%)" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(150,10%,45%)" />
            <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
            <Bar dataKey="price" radius={[8, 8, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={barColors[i % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* List */}
      <div className="space-y-2">
        {marketData.map((m, i) => (
          <MarketTickerCard key={m.nameKey} name={tr(m.nameKey)} price={m.price} change={m.change} unit={`₹ ${tr("perQuintal")}`} delay={i * 0.05} />
        ))}
      </div>
    </div>
  );
};

export default Market;
