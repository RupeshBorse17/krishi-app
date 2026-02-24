import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Sprout, Users, Wrench, FlaskConical, MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExpenses, useExpenseMutations } from "@/hooks/useExpenses";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Expense, ExpenseCategory } from "@/types";

const CATEGORIES: { key: ExpenseCategory; icon: typeof Sprout; color: string }[] = [
  { key: "seeds", icon: Sprout, color: "hsl(142, 55%, 35%)" },
  { key: "fertilizer", icon: FlaskConical, color: "hsl(42, 90%, 55%)" },
  { key: "labor", icon: Users, color: "hsl(25, 70%, 50%)" },
  { key: "equipment", icon: Wrench, color: "hsl(200, 80%, 55%)" },
  { key: "other", icon: MoreHorizontal, color: "hsl(150, 10%, 45%)" },
];

const Expenses = () => {
  const { tr } = useLang();
  const { toast } = useToast();
  const { data: expenses = [], isLoading, error } = useExpenses();
  const { createMutation, updateMutation, deleteMutation } = useExpenseMutations();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    category: "seeds" as ExpenseCategory,
    amount: 0,
    description: "",
    date: today,
  });

  const byCategory = CATEGORIES.map((c) => ({
    key: c.key,
    name: tr(c.key),
    amount: expenses.filter((e) => e.category === c.key).reduce((s, e) => s + e.amount, 0),
    color: c.color,
  })).filter((x) => x.amount > 0);

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = totalExpense * 1.8;
  const profit = totalIncome - totalExpense;

  const pieData = byCategory.length > 0
    ? byCategory.map((d) => ({ name: d.name, value: d.amount, color: d.color }))
    : [{ name: tr("other"), value: 1, color: "hsl(150, 10%, 70%)" }];

  const [searchParams, setSearchParams] = useSearchParams();

  const openAdd = () => {
    setEditingId(null);
    setForm({ category: "seeds", amount: 0, description: "", date: today });
    setDialogOpen(true);
  };

  useEffect(() => {
    if (searchParams.get("add") === "1") {
      setEditingId(null);
      setForm({ category: "seeds", amount: 0, description: "", date: today });
      setDialogOpen(true);
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (e: Expense) => {
    setEditingId(e.id);
    setForm({ category: e.category, amount: e.amount, description: e.description, date: e.date });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.amount <= 0) {
      toast({ title: tr("error"), description: tr("amount") + " must be > 0", variant: "destructive" });
      return;
    }

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, updates: form },
        {
          onSuccess: () => {
            toast({ title: tr("saved") });
            setDialogOpen(false);
          },
          onError: (err) => toast({ title: tr("error"), description: String(err), variant: "destructive" }),
        }
      );
    } else {
      createMutation.mutate(form, {
        onSuccess: () => {
          toast({ title: tr("saved") });
          setDialogOpen(false);
        },
        onError: (err) => toast({ title: tr("error"), description: String(err), variant: "destructive" }),
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: tr("deleted") });
        setDeleteId(null);
      },
      onError: (err) => toast({ title: tr("error"), description: String(err), variant: "destructive" }),
    });
  };

  if (error) {
    return (
      <div className="px-4 py-8 text-center text-destructive">
        <p>{tr("error")}: {String(error)}</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{tr("expenses")}</h2>
        <Button onClick={openAdd} size="sm" className="gap-1">
          <Plus size={18} /> {tr("addExpense")}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-[200px] rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: tr("totalIncome"), val: `₹${(totalIncome / 1000).toFixed(0)}K`, cls: "gradient-primary" },
              { label: tr("totalExpense"), val: `₹${(totalExpense / 1000).toFixed(0)}K`, cls: "gradient-earth" },
              { label: tr("netProfit"), val: `₹${(profit / 1000).toFixed(0)}K`, cls: "gradient-sky" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`${s.cls} rounded-xl p-3 text-primary-foreground text-center`}
              >
                <p className="text-[10px] opacity-80">{s.label}</p>
                <p className="text-lg font-bold">{s.val}</p>
              </motion.div>
            ))}
          </div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-4 border border-border shadow-sm"
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={3}
                >
                  {pieData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Expense List */}
          <div className="space-y-2">
            {expenses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground"
              >
                <p className="mb-3">{tr("noExpenses")}</p>
                <Button onClick={openAdd} variant="outline" className="gap-2">
                  <Plus size={18} /> {tr("addExpense")}
                </Button>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {expenses
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((e, i) => {
                    const cat = CATEGORIES.find((c) => c.key === e.category)!;
                    return (
                      <motion.div
                        key={e.id}
                        layout
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: cat.color }}
                        >
                          <cat.icon size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground">{tr(e.category)}</p>
                          <p className="text-xs text-muted-foreground truncate">{e.description || e.date}</p>
                        </div>
                        <p className="font-bold text-foreground shrink-0">₹{e.amount.toLocaleString("en-IN")}</p>
                        <div className="flex gap-1 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(e)} aria-label="Edit">
                            <Pencil size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(e.id)} aria-label="Delete" className="text-destructive">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            )}
          </div>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? tr("edit") : tr("addExpense")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{tr("amount")}</Label>
              <Input
                type="number"
                min={1}
                value={form.amount || ""}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) || 0 })}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as ExpenseCategory })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.key} value={c.key}>
                      {tr(c.key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{tr("description")}</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label>{tr("reminderDate")}</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                {tr("cancel")}
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {tr("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tr("delete")}</AlertDialogTitle>
            <AlertDialogDescription>Delete this expense?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tr("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {tr("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Expenses;
