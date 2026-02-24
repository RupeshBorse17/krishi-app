import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Bug, FlaskConical, Wheat, Check, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReminders, useReminderMutations } from "@/hooks/useReminders";
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
import type { Reminder } from "@/types";

const CATEGORIES = [
  { key: "water" as const, icon: Droplets, label: { mr: "पाणी", en: "Water" }, color: "bg-sky" },
  { key: "fertilizer" as const, icon: FlaskConical, label: { mr: "खत", en: "Fertilizer" }, color: "bg-primary" },
  { key: "pesticide" as const, icon: Bug, label: { mr: "कीटकनाशक", en: "Pesticide" }, color: "bg-accent" },
  { key: "harvest" as const, icon: Wheat, label: { mr: "कापणी", en: "Harvest" }, color: "bg-harvest" },
  { key: "other" as const, icon: Droplets, label: { mr: "इतर", en: "Other" }, color: "bg-muted" },
];

const ReminderCard = ({
  r,
  lang,
  i,
  onToggle,
  onEdit,
  onDelete,
}: {
  r: Reminder;
  lang: "mr" | "en";
  i: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const cat = CATEGORIES.find((c) => c.key === r.category) ?? CATEGORIES[0];
  const Icon = cat.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: i * 0.05 }}
      className={`flex items-center gap-3 p-3 rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md ${r.done ? "opacity-60" : ""}`}
    >
      <button
        onClick={onToggle}
        className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center text-primary-foreground shrink-0`}
        aria-label={r.done ? "Mark undone" : "Mark done"}
      >
        {r.done ? <Check size={20} /> : <Icon size={20} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm text-foreground ${r.done ? "line-through" : ""}`}>{r.label}</p>
        <p className="text-xs text-muted-foreground">{r.time} • {r.date}</p>
      </div>
      <div className="flex gap-1 shrink-0">
        <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit">
          <Pencil size={16} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete" className="text-destructive">
          <Trash2 size={16} />
        </Button>
      </div>
    </motion.div>
  );
};

const Reminders = () => {
  const { lang, tr } = useLang();
  const { toast } = useToast();
  const { data: reminders = [], isLoading, error } = useReminders();
  const { createMutation, updateMutation, deleteMutation, toggleDoneMutation } = useReminderMutations();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toTimeString().slice(0, 5);
  const [form, setForm] = useState({ label: "", category: "water" as Reminder["category"], time: now, date: today });

  const todayList = reminders.filter((r) => r.date === today);
  const upcomingList = reminders.filter((r) => r.date !== today);

  const openAdd = () => {
    setEditingId(null);
    setForm({ label: "", category: "water", time: now, date: today });
    setDialogOpen(true);
  };

  const openEdit = (r: Reminder) => {
    setEditingId(r.id);
    setForm({ label: r.label, category: r.category, time: r.time, date: r.date });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label.trim()) {
      toast({ title: tr("error"), description: tr("reminderLabel") + " required", variant: "destructive" });
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
      createMutation.mutate({ ...form, done: false }, {
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
        <h2 className="text-xl font-bold text-foreground">{tr("reminders")}</h2>
        <Button onClick={openAdd} size="sm" className="gap-1">
          <Plus size={18} /> {tr("addReminder")}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : reminders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground"
        >
          <p className="mb-3">{tr("noReminders")}</p>
          <Button onClick={openAdd} variant="outline" className="gap-2">
            <Plus size={18} /> {tr("addReminder")}
          </Button>
        </motion.div>
      ) : (
        <>
          {todayList.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-2">{tr("today")}</h3>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {todayList.map((r, i) => (
                    <ReminderCard
                      key={r.id}
                      r={r}
                      lang={lang}
                      i={i}
                      onToggle={() => toggleDoneMutation.mutate(r.id)}
                      onEdit={() => openEdit(r)}
                      onDelete={() => setDeleteId(r.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
          {upcomingList.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-2">{tr("upcoming")}</h3>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {upcomingList.map((r, i) => (
                    <ReminderCard
                      key={r.id}
                      r={r}
                      lang={lang}
                      i={i}
                      onToggle={() => toggleDoneMutation.mutate(r.id)}
                      onEdit={() => openEdit(r)}
                      onDelete={() => setDeleteId(r.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? tr("edit") : tr("addReminder")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{tr("reminderLabel")}</Label>
              <Input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="e.g. Water wheat field"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Reminder["category"] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter((c) => c.key !== "other" || true).map((c) => (
                    <SelectItem key={c.key} value={c.key}>
                      {c.label[lang]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{tr("reminderDate")}</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{tr("reminderTime")}</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
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
            <AlertDialogDescription>Delete this reminder?</AlertDialogDescription>
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

export default Reminders;
