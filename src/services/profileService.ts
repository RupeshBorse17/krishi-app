import { supabase } from "@/integrations/supabase/client";

export type ProfileData = {
  full_name: string;
  farm_name: string;
  location: string;
  total_land_acres: number;
};

export async function fetchProfile(userId: string): Promise<ProfileData | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, farm_name, location, total_land_acres")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    if (typeof console !== "undefined" && console.error) {
      console.error("[Farmmate] Profile fetch error:", error.message);
    }
    throw error;
  }
  return data;
}

export async function upsertProfile(userId: string, profile: ProfileData): Promise<{ error: Error | null }> {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  const payload = {
    user_id: userId,
    full_name: profile.full_name,
    farm_name: profile.farm_name,
    location: profile.location,
    total_land_acres: profile.total_land_acres,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { error } = await supabase.from("profiles").update(payload).eq("id", existing.id);
    if (error) {
      if (typeof console !== "undefined" && console.error) {
        console.error("[Farmmate] Profile update error:", error.message);
      }
      return { error };
    }
    return { error: null };
  }

  const { error } = await supabase.from("profiles").insert({ ...payload, created_at: new Date().toISOString() });
  if (error) {
    if (typeof console !== "undefined" && console.error) {
      console.error("[Farmmate] Profile insert error:", error.message);
    }
    return { error };
  }
  return { error: null };
}
