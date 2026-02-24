import { useLang } from "@/contexts/LanguageContext";
import DashboardCard from "@/components/DashboardCard";
import QuickActions from "@/components/QuickActions";
import MarketTickerCard from "@/components/MarketTickerCard";
import ProfitChart from "@/components/ProfitChart";
import { MapPin, Sprout, TrendingUp, BarChart3, Wheat } from "lucide-react";
import { motion } from "framer-motion";
import farmHero from "@/assets/farm-hero.jpg";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const marketData = [
  { nameKey: "wheat", price: 2450, change: 2.3 },
  { nameKey: "soybean", price: 4820, change: -1.5 },
  { nameKey: "cotton", price: 7150, change: 3.1 },
  { nameKey: "onion", price: 1890, change: -4.2 },
];

const Index = () => {
  const { tr } = useLang();
  const { totalLand, activeCrops, expectedYield, totalExpense, totalIncome, netProfit } = useDashboardStats();

  const profitDisplay = netProfit >= 0 ? `₹${(netProfit / 1000).toFixed(0)}K` : `-₹${Math.abs(netProfit) / 1000}K`;

  return (
    <div className="pb-4 space-y-5">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-40 rounded-b-3xl overflow-hidden -mt-0 mx-0"
      >
        <img src={farmHero} alt="Farm" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-primary-foreground">
          <p className="text-lg font-bold">{tr("welcome")}</p>
          <p className="text-sm opacity-90">🌾 {tr("appName")}</p>
        </div>
      </motion.div>

      <div className="px-4 space-y-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <DashboardCard icon={MapPin} label={tr("totalLand")} value={totalLand > 0 ? String(totalLand) : "—"} sub={tr("acres")} gradient="gradient-primary" delay={0.05} />
          <DashboardCard icon={Sprout} label={tr("activeCrops")} value={String(activeCrops)} sub={tr("crops")} gradient="gradient-harvest" delay={0.1} />
          <DashboardCard icon={Wheat} label={tr("expectedYield")} value={expectedYield > 0 ? String(expectedYield) : "—"} sub={tr("quintals")} gradient="gradient-earth" delay={0.15} />
          <DashboardCard icon={BarChart3} label={tr("profitSummary")} value={totalExpense > 0 ? profitDisplay : "₹0"} sub="" gradient="gradient-sky" delay={0.2} />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-bold text-foreground mb-2 text-base">{tr("quickActions")}</h2>
          <QuickActions />
        </div>

        {/* Market Rates */}
        <div>
          <h2 className="font-bold text-foreground mb-2 text-base">{tr("todayMarket")}</h2>
          <div className="space-y-2">
            {marketData.map((m, i) => (
              <MarketTickerCard key={m.nameKey} name={tr(m.nameKey)} price={m.price} change={m.change} unit={tr("perQuintal")} delay={0.1 + i * 0.06} />
            ))}
          </div>
        </div>

        {/* Profit Chart */}
        <ProfitChart />
      </div>
    </div>
  );
};

export default Index;
