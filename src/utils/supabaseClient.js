/**
 * src/utils/supabaseClient.js
 * Vice City Heist: Central Dispatch & Player Surveillance Backend
 * Connects to Supabase for real-time multiplayer synchronization & password tracking.
 */
import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://tqtjjddihvjzutdhrrlx.supabase.co";
const DEFAULT_SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGpqZGRpaHZqenV0ZGhycmx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDk4MTEsImV4cCI6MjA5ODMyNTgxMX0.R7sopijD-FfqSkt59qrOY1I6-CdjSO88uqF3dn5XsWQ";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

/**
 * Upsert player progress and live password to Supabase.
 * Tracks current password and password history as requested.
 */
export async function syncPlayerToSupabase(player) {
  if (!player || !player.id) return null;

  // STRICT: Only sync registered players from the lobby onwards with real names
  const trimmedName = (player.name || "").trim();
  if (
    !trimmedName ||
    trimmedName === "Anonymous Agent" ||
    trimmedName.startsWith("Station ") ||
    player.status === "NAME_ENTRY" ||
    player.isRegistered === false
  ) {
    return null;
  }

  try {
    const payload = {
      id: player.id,
      name: trimmedName,
      alias: (player.alias || "").trim() || trimmedName,
      college: (player.college || "").trim() || "Vice City Bank",
      status: player.status || "IN_LOBBY",
      current_level: Number(player.currentLevel) || 1,
      rules_cleared: Number(player.rulesCleared) || 0,
      score: Number(player.score) || 0,
      time_left: Number.isFinite(Number(player.timeLeft)) ? Number(player.timeLeft) : 600,
      is_breached: Boolean(player.isBreached),
      is_frozen: Boolean(player.isFrozen),
      current_password: player.currentPassword || player.password || "",
      level_times: player.levelTimes || player.level_times || {},
      round_submissions: player.roundSubmissions || player.round_submissions || {},
      completion_stats: player.completionStats || player.completion_stats || {},
      last_seen: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("vch_players")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.warn("[Supabase] syncPlayer error:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("[Supabase] syncPlayer exception:", err);
    return null;
  }
}

/**
 * Fetch all active players from Supabase.
 */
export async function fetchPlayersFromSupabase() {
  try {
    const { data, error } = await supabase
      .from("vch_players")
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      console.warn("[Supabase] fetchPlayers error:", error.message);
      return [];
    }

    return (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      alias: p.alias || p.name || `Station ${p.id.slice(-4)}`,
      college: p.college,
      chapter: p.current_level || 1,
      currentLevel: p.current_level || 1,
      rulesCleared: p.rules_cleared || 0,
      score: p.score || 0,
      timeLeft: p.time_left,
      status: p.status || "IN_LOBBY",
      isBreached: Boolean(p.is_breached),
      isFrozen: Boolean(p.is_frozen),
      currentPassword: p.current_password || "",
      passwordHistory: p.password_history || [],
      levelTimes: p.level_times || {},
      roundSubmissions: p.round_submissions || {},
      completionStats: p.completion_stats || {},
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      lastSeen: p.last_seen,
      isMock: false,
    }));
  } catch (err) {
    console.warn("[Supabase] fetchPlayers exception:", err);
    return [];
  }
}

/**
 * Fetch global game state (lockdown, active command).
 */
export async function fetchGameStateFromSupabase() {
  try {
    const { data, error } = await supabase
      .from("vch_game_state")
      .select("*")
      .eq("id", "global")
      .maybeSingle();

    if (error) {
      console.warn("[Supabase] fetchGameState error:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("[Supabase] fetchGameState exception:", err);
    return null;
  }
}

/**
 * Broadcast an admin command to all terminals via Supabase.
 */
export async function sendAdminCommandToSupabase(command) {
  try {
    const payload = {
      id: "global",
      active_command: {
        ...command,
        timestamp: Date.now(),
      },
      updated_at: new Date().toISOString(),
    };

    if (typeof command.globalFreeze === "boolean") {
      payload.global_freeze = command.globalFreeze;
    }

    const { error } = await supabase
      .from("vch_game_state")
      .upsert(payload, { onConflict: "id" });

    if (error) console.warn("[Supabase] sendAdminCommand error:", error.message);
  } catch (err) {
    console.warn("[Supabase] sendAdminCommand exception:", err);
  }
}

/**
 * Update player access flags (e.g. freeze, promote, unfreeze, disqualify).
 */
export async function updatePlayerInSupabase(playerId, patch) {
  try {
    const payload = {
      updated_at: new Date().toISOString(),
    };

    if (patch.isFrozen !== undefined) payload.is_frozen = Boolean(patch.isFrozen);
    if (patch.isBreached !== undefined) payload.is_breached = Boolean(patch.isBreached);
    if (patch.currentLevel !== undefined) payload.current_level = Number(patch.currentLevel);
    if (patch.status !== undefined) payload.status = patch.status;
    if (patch.currentPassword !== undefined) payload.current_password = patch.currentPassword;

    const { error } = await supabase
      .from("vch_players")
      .update(payload)
      .eq("id", playerId);

    if (error) console.warn("[Supabase] updatePlayer error:", error.message);
  } catch (err) {
    console.warn("[Supabase] updatePlayer exception:", err);
  }
}

/**
 * Delete / Eject player from Supabase.
 */
export async function deletePlayerFromSupabase(playerId) {
  if (!playerId) return false;
  try {
    const { error } = await supabase
      .from("vch_players")
      .delete()
      .eq("id", playerId);

    if (error) {
      console.warn("[Supabase] deletePlayer error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[Supabase] deletePlayer exception:", err);
    return false;
  }
}

/**
 * Reset all players to lobby in Supabase.
 */
export async function resetAllPlayersInSupabase() {
  try {
    const { error } = await supabase
      .from("vch_players")
      .update({
        status: "IN_LOBBY",
        current_level: 1,
        rules_cleared: 0,
        score: 0,
        time_left: 600,
        is_breached: false,
        is_frozen: false,
        current_password: "",
        updated_at: new Date().toISOString(),
      })
      .neq("id", "none");

    if (error) console.warn("[Supabase] resetAllPlayers error:", error.message);
  } catch (err) {
    console.warn("[Supabase] resetAllPlayers exception:", err);
  }
}

/**
 * Permanently delete all player entries from Supabase to start a clean tournament.
 */
export async function clearAllPlayersFromSupabase() {
  try {
    const { error } = await supabase
      .from("vch_players")
      .delete()
      .neq("id", "___NEVER_MATCH_ALL___");

    if (error) {
      console.warn("[Supabase] clearAllPlayers error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[Supabase] clearAllPlayers exception:", err);
    return false;
  }
}

