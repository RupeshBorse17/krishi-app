import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchProfile, upsertProfile } from "@/services/profileService";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { User, MapPin, Tractor, LogOut, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { tr } = useLang();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    farm_name: "",
    location: "",
    total_land_acres: 0,
  });
  const [email, setEmail] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }
        setEmail(user.email || "");
        const data = await fetchProfile(user.id);
        if (data) {
          setProfile({
            full_name: data.full_name || "",
            farm_name: data.farm_name || "",
            location: data.location || "",
            total_land_acres: data.total_land_acres ?? 0,
          });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load profile";
        toast({ title: tr("error"), description: msg, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate, toast, tr]);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await upsertProfile(user.id, {
        full_name: profile.full_name,
        farm_name: profile.farm_name,
        location: profile.location,
        total_land_acres: profile.total_land_acres,
      });
      if (error) {
        toast({ title: tr("error"), description: error.message, variant: "destructive" });
      } else {
        toast({ title: tr("profileSaved") });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      toast({ title: tr("error"), description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "FM";

  return (
    <div className="px-4 py-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-4">
          <Avatar className="w-20 h-20 mb-2">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-bold text-foreground">{profile.full_name || tr("farmer")}</h2>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>

        {/* Profile Form */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User size={18} className="text-primary" /> {tr("profileDetails")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{tr("fullName")}</Label>
              <Input
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder={tr("fullNamePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Tractor size={14} /> {tr("farmName")}
              </Label>
              <Input
                value={profile.farm_name}
                onChange={(e) => setProfile({ ...profile, farm_name: e.target.value })}
                placeholder={tr("farmNamePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <MapPin size={14} /> {tr("locationLabel")}
              </Label>
              <Input
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder={tr("locationPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label>{tr("totalLandAcres")}</Label>
              <Input
                type="number"
                value={profile.total_land_acres}
                onChange={(e) => setProfile({ ...profile, total_land_acres: Number(e.target.value) })}
                min={0}
                step={0.5}
              />
            </div>
            <Button onClick={handleSave} className="w-full" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {tr("saveProfile")}
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button variant="outline" className="w-full mt-4" onClick={handleLogout}>
          <LogOut size={18} /> {tr("logout")}
        </Button>
      </motion.div>
    </div>
  );
};

export default Profile;
