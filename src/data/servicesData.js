/**
 * Frame Your Moments — Service Gallery Dataset
 * Each service has a slug, display info, banner config, and gallery images.
 * Synced with Supabase & LocalStorage so the Admin Panel can add/edit/delete images easily.
 */
import { supabase } from '../utils/supabaseClient';

export const SERVICES_META = [
  {
    id: 'pre-wedding',
    slug: 'pre-wedding',
    title: 'Pre-Wedding',
    subtitle: 'Photography',
    tagline: 'Where love stories begin — before the vows.',
    description:
      'Our pre-wedding shoots are crafted to capture the raw, unscripted chemistry between you and your partner. From misty hill stations to heritage havelis, every frame tells your unique love story.',
    bannerImage: '',
    accentColor: '#E64A6E',
    icon: '💑',
    stats: [
      { label: 'Shoots Done', value: '200+' },
      { label: 'Locations', value: '40+' },
      { label: 'Happy Couples', value: '180+' },
    ],
  },
  {
    id: 'wedding',
    slug: 'wedding',
    title: 'Premium Wedding',
    subtitle: 'Photography',
    tagline: 'Every moment. Every emotion. Forever preserved.',
    description:
      'From the sacred rituals to the grand celebrations, our wedding photography team ensures nothing is missed. We blend documentary storytelling with fine-art aesthetics to deliver timeless masterpieces.',
    bannerImage: '',
    accentColor: '#C5A059',
    icon: '💍',
    stats: [
      { label: 'Weddings Shot', value: '500+' },
      { label: 'Awards Won', value: '12' },
      { label: 'Years of Craft', value: '8+' },
    ],
  },
  {
    id: 'engagement',
    slug: 'engagement',
    title: 'Engagement Sessions',
    subtitle: 'Photography',
    tagline: 'A ring, a promise, a lifetime of memories.',
    description:
      'Engagement shoots celebrate the joy of saying yes. Our photographers create an intimate, relaxed atmosphere that lets your genuine happiness and connection shine through every photograph.',
    bannerImage: '',
    accentColor: '#9B51E0',
    icon: '💎',
    stats: [
      { label: 'Engagements', value: '300+' },
      { label: 'Edited Shots', value: '150+' },
      { label: 'Locations', value: '25+' },
    ],
  },
  {
    id: 'event',
    slug: 'event',
    title: 'Event Photography',
    subtitle: 'Photography',
    tagline: 'Celebrations big and small, captured with elegance.',
    description:
      'From corporate galas to intimate birthday soirées, our event photography team captures the energy, décor, and candid moments that make every occasion unforgettable.',
    bannerImage: '',
    accentColor: '#00A896',
    icon: '🎉',
    stats: [
      { label: 'Events Covered', value: '800+' },
      { label: 'Client Rating', value: '4.9★' },
      { label: 'Cities', value: '15+' },
    ],
  },
];

// ─── NO DEFAULT GALLERY IMAGES ─────────────────────────────────────────────────
export const DEFAULT_GALLERIES = {
  'pre-wedding': [],
  'wedding': [],
  'engagement': [],
  'event': [],
};

// ─── Storage helpers ────────────────────────────────────────────────────────────

export function getServiceGallery(slug) {
  try {
    const key = `fym_gallery_${slug}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading service gallery from localStorage', e);
  }
  return [];
}

export function saveServiceGallery(slug, images) {
  try {
    localStorage.setItem(`fym_gallery_${slug}`, JSON.stringify(images));
  } catch (e) {
    console.error('Error saving service gallery to localStorage', e);
  }
}

/**
 * Fetch gallery from Supabase — this is the single source of truth.
 * Always updates localStorage with Supabase data.
 */
export async function fetchServiceGalleryFromSupabase(slug) {
  try {
    const { data, error } = await supabase.from('fym_services_gallery').select('*');
    if (!error && Array.isArray(data)) {
      const filtered = data
        .filter((item) => item.service_slug === slug)
        .map((row) => ({
          id: row.id,
          src: row.url,
          caption: row.caption || '',
          isCompressed: row.is_compressed || false,
          originalSize: row.original_size || 0,
          compressedSize: row.compressed_size || 0
        }));

      saveServiceGallery(slug, filtered);
      return filtered;
    } else if (error) {
      console.warn('Supabase fetch returned error for service gallery:', error);
    }
  } catch (e) {
    console.warn('Supabase fetch for service gallery failed', e);
  }
  return getServiceGallery(slug);
}

/**
 * Save new service images directly to Supabase table fym_services_gallery.
 */
export async function saveServiceImagesToSupabase(slug, newImages) {
  try {
    const items = Array.isArray(newImages) ? newImages : [newImages];
    const rows = items.map((item) => ({
      service_slug: slug,
      url: item.src || item.url,
      caption: item.caption || '',
      is_compressed: item.isCompressed || false,
      original_size: item.originalSize || 0,
      compressed_size: item.compressedSize || 0
    }));

    const { data, error } = await supabase.from('fym_services_gallery').insert(rows);
    if (error) {
      console.error('Failed to insert service images to Supabase:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (e) {
    console.error('Error saving service gallery to Supabase:', e);
    return { success: false, error: e };
  }
}

/**
 * Delete a single service gallery image from Supabase by its UUID id or URL.
 */
export async function deleteServiceImageFromSupabase(item) {
  try {
    if (item.id && item.id.length === 36) {
      await supabase.from('fym_services_gallery').delete('id', item.id);
    } else if (item.src || item.url) {
      await supabase.from('fym_services_gallery').delete('url', item.src || item.url);
    }
  } catch (e) {
    console.warn('Supabase delete error for service image', e);
  }
}

export function getServiceMeta(slug) {
  const meta = SERVICES_META.find((s) => s.slug === slug);
  if (!meta) return null;
  const banner = getServiceBanner(slug);
  return {
    ...meta,
    bannerImage: banner || meta.bannerImage || ''
  };
}

// ─── SERVICE HERO BANNER HELPERS ───────────────────────────────────────────────

export function getServiceBanner(slug) {
  try {
    const key = `fym_service_banner_${slug}`;
    const saved = localStorage.getItem(key);
    if (saved) return saved;
  } catch (e) {
    // ignore
  }
  const meta = SERVICES_META.find((s) => s.slug === slug);
  return meta?.bannerImage || '';
}

export function saveServiceBanner(slug, bannerUrl) {
  try {
    if (bannerUrl) {
      localStorage.setItem(`fym_service_banner_${slug}`, bannerUrl);
    } else {
      localStorage.removeItem(`fym_service_banner_${slug}`);
    }
  } catch (e) {
    console.error('Error saving service banner to localStorage', e);
  }
}

/**
 * Fetch all service banners from Supabase (fym_service_banners table).
 */
export async function fetchAllServiceBannersFromSupabase() {
  const bannersMap = {};

  // 1. Try dedicated fym_service_banners table
  try {
    const { data, error } = await supabase.from('fym_service_banners').select('*');
    if (!error && Array.isArray(data) && data.length > 0) {
      data.forEach((row) => {
        if (row.service_slug && row.url) {
          bannersMap[row.service_slug] = {
            id: row.id,
            url: row.url,
            caption: row.caption || '',
            isCompressed: row.is_compressed || false,
            originalSize: row.original_size || 0,
            compressedSize: row.compressed_size || 0
          };
          saveServiceBanner(row.service_slug, row.url);
        }
      });
      return bannersMap;
    }
  } catch (e) {
    // fallback to fym_media
  }

  // 2. Fallback to fym_media table — fetch all, filter by section client-side
  try {
    const { data, error } = await supabase.from('fym_media').select('*');
    if (!error && Array.isArray(data)) {
      data
        .filter((row) => row.section === 'service_banner')
        .forEach((row) => {
          const slug = row.category || row.meta?.slug;
          if (slug && row.url) {
            bannersMap[slug] = {
              id: row.id,
              url: row.url,
              caption: row.caption || '',
              isCompressed: row.is_compressed || false,
              originalSize: row.original_size || 0,
              compressedSize: row.compressed_size || 0
            };
            saveServiceBanner(slug, row.url);
          }
        });
    }
  } catch (e) {
    console.warn('Supabase fetch for service banners failed', e);
  }

  return bannersMap;
}

/**
 * Fetch a specific service banner from Supabase.
 */
export async function fetchServiceBannerFromSupabase(slug) {
  // 1. Try dedicated fym_service_banners table — fetch all, filter client-side
  try {
    const { data, error } = await supabase.from('fym_service_banners').select('*');
    if (!error && Array.isArray(data)) {
      const row = data.find((r) => r.service_slug === slug);
      if (row && row.url) {
        saveServiceBanner(slug, row.url);
        return {
          id: row.id,
          url: row.url,
          caption: row.caption || '',
          isCompressed: row.is_compressed || false,
          originalSize: row.original_size || 0,
          compressedSize: row.compressed_size || 0
        };
      }
    }
  } catch (e) {
    // fallback
  }

  // 2. Fallback to fym_media table — fetch all, filter client-side
  try {
    const { data, error } = await supabase.from('fym_media').select('*');
    if (!error && Array.isArray(data)) {
      const row = data.find(
        (r) => r.section === 'service_banner' && (r.category === slug || r.meta?.slug === slug)
      );
      if (row && row.url) {
        saveServiceBanner(slug, row.url);
        return {
          id: row.id,
          url: row.url,
          caption: row.caption || '',
          isCompressed: row.is_compressed || false,
          originalSize: row.original_size || 0,
          compressedSize: row.compressed_size || 0
        };
      }
    }
  } catch (e) {
    console.warn(`Supabase fetch failed for service banner ${slug}`, e);
  }

  const cached = getServiceBanner(slug);
  if (cached) return { url: cached };
  return null;
}

/**
 * Save / replace service banner in Supabase.
 * Uses check-then-insert/update (no upsert) for reliability.
 */
export async function saveServiceBannerToSupabase(slug, bannerData) {
  const bannerUrl = bannerData.src || bannerData.url;

  // Always save to localStorage immediately
  saveServiceBanner(slug, bannerUrl);

  const payload = {
    service_slug: slug,
    url: bannerUrl,
    caption: bannerData.caption || `${slug} Hero Banner`,
    is_compressed: bannerData.isCompressed || false,
    original_size: bannerData.originalSize || 0,
    compressed_size: bannerData.compressedSize || 0,
    updated_at: new Date().toISOString()
  };

  try {
    // Step 1: Check if a record already exists for this slug
    const { data: existing, error: fetchErr } = await supabase
      .from('fym_service_banners')
      .select('*');

    if (fetchErr) {
      console.warn('Could not check existing banners:', fetchErr);
    }

    const existingRow = Array.isArray(existing)
      ? existing.find((r) => r.service_slug === slug)
      : null;

    if (existingRow) {
      // Step 2a: Record exists → UPDATE it
      const { data, error } = await supabase
        .from('fym_service_banners')
        .update(payload, 'service_slug', slug);

      if (error) {
        console.error('Failed to UPDATE service banner in Supabase:', error);
        return { success: false, error };
      }
      return { success: true, data };
    } else {
      // Step 2b: No record → INSERT fresh
      const { data, error } = await supabase
        .from('fym_service_banners')
        .insert([payload]);

      if (error) {
        console.error('Failed to INSERT service banner in Supabase:', error);
        return { success: false, error };
      }
      return { success: true, data };
    }
  } catch (e) {
    console.error('Error in saveServiceBannerToSupabase:', e);
    return { success: false, error: e };
  }
}

/**
 * Delete service banner from Supabase and local storage.
 */
export async function deleteServiceBannerFromSupabase(slug) {
  try {
    saveServiceBanner(slug, '');
    await supabase.from('fym_service_banners').delete('service_slug', slug);
    await supabase.from('fym_media').delete('category', slug);
    return { success: true };
  } catch (e) {
    console.warn('Error deleting service banner from Supabase', e);
    return { success: false, error: e };
  }
}


