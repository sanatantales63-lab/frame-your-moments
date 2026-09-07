/**
 * Frame Your Moments — Central Media Data Manager (Supabase-first, no localStorage cache confusion)
 */
import { supabase } from '../utils/supabaseClient';

// ─── EMPTY DEFAULTS (No local placeholder images) ──────────────────────────────
export const DEFAULT_HERO_PHOTOS = [];
export const DEFAULT_GRID_PHOTOS = [];

// ─── HERO PHOTOS GETTERS & SETTERS ──────────────────────────────────────────────
export async function getHeroPhotos() {
  try {
    const { data, error } = await supabase.from('fym_media').select('*');
    if (!error && Array.isArray(data)) {
      const heroItems = data
        .filter((item) => item.section === 'hero')
        .map((item) => ({
          id: item.id,
          src: item.url || item.src,
          caption: item.caption || '',
          column: item.meta?.column || 1,
          isCompressed: item.is_compressed || false,
          originalSize: item.original_size || 0,
          compressedSize: item.compressed_size || 0
        }));

      localStorage.setItem('fym_hero_photos', JSON.stringify(heroItems));
      return heroItems;
    }
  } catch (e) {
    console.warn('Supabase fetch failed for hero photos, using cache', e);
  }

  try {
    const cached = localStorage.getItem('fym_hero_photos');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({ ...item, src: item.src || item.url }));
      }
    }
  } catch (e) {
    // ignore
  }

  return [];
}

export async function saveHeroPhotos(newPhotosOnly) {
  try {
    const itemsToInsert = Array.isArray(newPhotosOnly) ? newPhotosOnly : [newPhotosOnly];
    const rows = itemsToInsert
      .filter((item) => item && (item.src || item.url))
      .map((item) => ({
        section: 'hero',
        category: 'hero_scroll',
        url: item.src || item.url,
        caption: item.caption || '',
        meta: { column: item.column || 1 },
        is_compressed: item.isCompressed || false,
        original_size: item.originalSize || 0,
        compressed_size: item.compressedSize || 0
      }));

    if (rows.length > 0) {
      const { data, error } = await supabase.from('fym_media').insert(rows);
      if (error) console.error('Error inserting hero photos to Supabase:', error);
      return { success: !error, data };
    }
  } catch (e) {
    console.error('Error saving hero photos to Supabase', e);
  }
}

export async function deleteHeroPhoto(item) {
  try {
    if (item.id && !item.id.startsWith('h-') && item.id.length === 36) {
      await supabase.from('fym_media').delete('id', item.id);
    } else if (item.url || item.src) {
      await supabase.from('fym_media').delete('url', item.url || item.src);
    }
  } catch (e) {
    console.warn('Delete hero photo Supabase error', e);
  }
}

export async function resetHeroPhotos() {
  try {
    localStorage.removeItem('fym_hero_photos');
    await supabase.from('fym_media').delete('section', 'hero');
  } catch (e) {
    console.warn('Error resetting hero photos', e);
  }
  return [];
}

// ─── GRID SHOWCASE GETTERS & SETTERS ────────────────────────────────────────────
export async function getGridPhotos() {
  try {
    const { data, error } = await supabase.from('fym_media').select('*');
    if (!error && Array.isArray(data)) {
      const gridItems = data
        .filter((item) => item.section === 'grid_showcase')
        .map((item) => ({
          id: item.id,
          src: item.url || item.src,
          isBW: item.meta?.isBW || false,
          caption: item.caption || '',
          isCompressed: item.is_compressed || false,
          originalSize: item.original_size || 0,
          compressedSize: item.compressed_size || 0
        }));

      localStorage.setItem('fym_grid_photos', JSON.stringify(gridItems));
      return gridItems;
    }
  } catch (e) {
    console.warn('Supabase fetch failed for grid photos', e);
  }

  try {
    const cached = localStorage.getItem('fym_grid_photos');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({ ...item, src: item.src || item.url }));
      }
    }
  } catch (e) {
    // ignore
  }

  return [];
}

export async function saveGridPhotos(newPhotosOnly) {
  try {
    const itemsToInsert = Array.isArray(newPhotosOnly) ? newPhotosOnly : [newPhotosOnly];
    const rows = itemsToInsert
      .filter((item) => item && (item.src || item.url))
      .map((item) => ({
        section: 'grid_showcase',
        category: 'grid_square',
        url: item.src || item.url,
        caption: item.caption || '',
        meta: { isBW: item.isBW || false },
        is_compressed: item.isCompressed || false,
        original_size: item.originalSize || 0,
        compressed_size: item.compressedSize || 0
      }));

    if (rows.length > 0) {
      const { data, error } = await supabase.from('fym_media').insert(rows);
      if (error) console.error('Error inserting grid photos to Supabase:', error);
      return { success: !error, data };
    }
  } catch (e) {
    console.error('Error saving grid photos to Supabase', e);
  }
}

export async function deleteGridPhoto(item) {
  try {
    if (item.id && !item.id.startsWith('g-') && item.id.length === 36) {
      await supabase.from('fym_media').delete('id', item.id);
    } else if (item.url || item.src) {
      await supabase.from('fym_media').delete('url', item.url || item.src);
    }
  } catch (e) {
    console.warn('Delete grid photo Supabase error', e);
  }
}

export async function resetGridPhotos() {
  try {
    localStorage.removeItem('fym_grid_photos');
    await supabase.from('fym_media').delete('section', 'grid_showcase');
  } catch (e) {
    console.warn('Error resetting grid photos', e);
  }
  return [];
}
