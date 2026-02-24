import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sprout, Droplets, Sun, Plus, Pencil, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { usePlots, usePlotMutations } from "@/hooks/usePlots";
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
import type { Plot } from "@/types";

const CROP_KEYS = ["wheat", "rice", "soybean", "cotton", "sugarcane", "onion"] as const;
const stages = [
  { key: "plant", icon: Sprout, label: { mr: "पेरणी", en: "Planting" } },
  { key: "grow", icon: Droplets, label: { mr: "वाढ", en: "Growing" } },
  { key: "harvest", icon: Sun, label: { mr: "कापणी", en: "Harvest" } },
];

const PlotCard = ({
  plot,
  lang,
  i,
  onEdit,
  onDelete,
}: {
  plot: Plot;
  lang: "mr" | "en";
  i: number;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ delay: i * 0.05 }}
    className="bg-card rounded-2xl border border-border p-4 shadow-sm transition-shadow hover:shadow-md"
  >
    <div className="flex items-center gap-3 mb-3">
      <span className="text-3xl">🌾</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-foreground truncate">{plot.name}</p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin size={12} /> {plot.acres} {lang === "mr" ? "एकर" : "acres"}
        </p>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit">
          <Pencil size={16} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete" className="text-destructive">
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
    <div className="mb-2">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        {stages.map((s) => (
          <span key={s.key} className="flex items-center gap-0.5">
            <s.icon size={12} /> {s.label[lang]}
          </span>
        ))}
      </div>
      <Progress value={plot.stage} className="h-2.5" />
    </div>
    <p className="text-xs text-right text-muted-foreground">{plot.stage}%</p>
  </motion.div>
);

const LandCrops = () => {
  const { lang, tr } = useLang();
  const { toast } = useToast();
  const { data: plots = [], isLoading, error } = usePlots();
  const { createMutation, updateMutation, deleteMutation } = usePlotMutations();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", cropKey: "wheat", acres: 0, stage: 0 });

  const [searchParams, setSearchParams] = useSearchParams();

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: "", cropKey: "wheat", acres: 0, stage: 0 });
    setDialogOpen(true);
  };

  useEffect(() => {
    if (searchParams.get("add") === "1") {
      setEditingId(null);
      setForm({ name: "", cropKey: "wheat", acres: 0, stage: 0 });
      setDialogOpen(true);
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (plot: Plot) => {
    setEditingId(plot.id);
    setForm({ name: plot.name, cropKey: plot.cropKey, acres: plot.acres, stage: plot.stage });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: tr("error"), description: tr("plotName") + " required", variant: "destructive" });
      return;
    }
    if (form.acres <= 0) {
      toast({ title: tr("error"), description: "Acres must be > 0", variant: "destructive" });
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
          onError: (err) => {
            toast({ title: tr("error"), description: String(err), variant: "destructive" });
          },
        }
      );
    } else {
      createMutation.mutate(form, {
        onSuccess: () => {
          toast({ title: tr("saved") });
          setDialogOpen(false);
        },
        onError: (err) => {
          toast({ title: tr("error"), description: String(err), variant: "destructive" });
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: tr("deleted") });
        setDeleteId(null);
      },
      onError: (err) => {
        toast({ title: tr("error"), description: String(err), variant: "destructive" });
      },
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
    <div className="px-4 pb-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{tr("land")}</h2>
        <Button onClick={openAdd} size="sm" className="gap-1">
          <Plus size={18} /> {tr("addPlot")}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : plots.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground"
        >
          <p className="mb-3">{tr("noPlots")}</p>
          <Button onClick={openAdd} variant="outline" className="gap-2">
            <Plus size={18} /> {tr("addPlot")}
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          {plots.map((plot, i) => (
            <PlotCard
              key={plot.id}
              plot={plot}
              lang={lang}
              i={i}
              onEdit={() => openEdit(plot)}
              onDelete={() => setDeleteId(plot.id)}
            />
          ))}
        </AnimatePresence>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? tr("edit") : tr("addPlot")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{tr("plotName")}</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Plot 1 - Wheat"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{tr("crop")}</Label>
              <Select value={form.cropKey} onValueChange={(v) => setForm({ ...form, cropKey: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CROP_KEYS.map((k) => (
                    <SelectItem key={k} value={k}>
                      {tr(k)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{tr("acres")}</Label>
              <Input
                type="number"
                min={0.1}
                step={0.5}
                value={form.acres || ""}
                onChange={(e) => setForm({ ...form, acres: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>{tr("stage")}</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })}
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
            <AlertDialogDescription>
              {tr("delete")} this plot?
            </AlertDialogDescription>
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

export default LandCrops;
