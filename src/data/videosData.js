/**
 * Frame Your Moments - Wedding Cinema & Reels Dataset
 * Synced with Supabase & LocalStorage for seamless Admin Panel management!
 */
import { supabase } from '../utils/supabaseClient';

export const DEFAULT_WEDDING_FILMS = [];
export const DEFAULT_QUICK_REELS = [];

// ─── Storage Helpers ────────────────────────────────────────────────────────────

export function getStoredFilms() {
  try {
    const saved = localStorage.getItem('fym_wedding_films');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading stored films', e);
  }
  return [];
}

export function saveStoredFilms(films) {
  try {
    localStorage.setItem('fym_wedding_films', JSON.stringify(films));
  } catch (e) {
    console.error('Error saving films to localStorage', e);
  }
}

export function getStoredReels() {
  try {
    const saved = localStorage.getItem('fym_wedding_reels');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading stored reels', e);
  }
  return [];
}

export function saveStoredReels(reels) {
  try {
    localStorage.setItem('fym_wedding_reels', JSON.stringify(reels));
  } catch (e) {
    console.error('Error saving reels to localStorage', e);
  }
}

/**
 * Fetch films from Supabase — always overwrites localStorage.
 */
export async function fetchFilmsFromSupabase() {
  try {
    const { data, error } = await supabase.from('fym_wedding_films').select('*');
    if (!error && Array.isArray(data)) {
      const mapped = data.map((row) => ({
        id: row.id,
        title: row.title,
        couple: row.couple,
        category: row.category,
        categoryLabel: row.category_label,
        duration: row.duration,
        location: row.location,
        thumbnail: row.thumbnail,
        videoUrl: row.video_url,
        youtubeId: row.youtube_id,
        description: row.description,
        featured: row.featured,
      }));
      saveStoredFilms(mapped);
      return mapped;
    }
  } catch (e) {
    console.warn('Supabase fetch for films failed', e);
  }
  return getStoredFilms();
}

/**
 * Fetch reels from Supabase — always overwrites localStorage.
 */
export async function fetchReelsFromSupabase() {
  try {
    const { data, error } = await supabase.from('fym_wedding_reels').select('*');
    if (!error && Array.isArray(data)) {
      const mapped = data.map((row) => ({
        id: row.id,
        title: row.title,
        couple: row.couple,
        duration: row.duration,
        views: row.views,
        thumbnail: row.thumbnail,
        videoUrl: row.video_url,
        youtubeId: row.youtube_id,
        instaCode: row.insta_code,
        category: row.category,
        aspect: row.aspect || '9:16',
      }));
      saveStoredReels(mapped);
      return mapped;
    }
  } catch (e) {
    console.warn('Supabase fetch for reels failed', e);
  }
  return getStoredReels();
}

/**
 * Delete a film from Supabase by its UUID id.
 */
export async function deleteFilmFromSupabase(id) {
  try {
    await supabase.from('fym_wedding_films').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete film error', e);
  }
}

/**
 * Delete a reel from Supabase by its UUID id.
 */
export async function deleteReelFromSupabase(id) {
  try {
    await supabase.from('fym_wedding_reels').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete reel error', e);
  }
}

/**
 * Update a film in Supabase by its UUID id.
 */
export async function updateFilmInSupabase(id, filmData) {
  try {
    await supabase.from('fym_wedding_films').update(filmData).eq('id', id);
  } catch (e) {
    console.warn('Supabase update film error', e);
  }
}

/**
 * Update a reel in Supabase by its UUID id.
 */
export async function updateReelInSupabase(id, reelData) {
  try {
    await supabase.from('fym_wedding_reels').update(reelData).eq('id', id);
  } catch (e) {
    console.warn('Supabase update reel error', e);
  }
}
