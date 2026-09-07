/**
 * Frame Your Moments — Testimonials & Reviews Dataset
 * Full Supabase synchronization + LocalStorage caching
 */
import { supabase } from '../utils/supabaseClient';

export const DEFAULT_TESTIMONIALS = [
  {
    id: 't1',
    name: 'Supriya & Rohan',
    location: 'Toronto, Canada',
    event: 'Destination Wedding',
    rating: 5,
    image: '',
    quote:
      "A wedding isn't about how much money has been put in, but about how many genuine emotions were shared. Rishav and the FYM team captured every unscripted laugh and silent tear. Looking at our album brings back every chill from that week.",
    fullStory:
      'From our initial Zoom call across continents to the final pheras in Canada, Frame Your Moments was incredible. They felt like family members who just happened to be master photographers. The editorial color grading is straight out of a luxury magazine!'
  },
  {
    id: 't2',
    name: 'Prasanta & Archana',
    location: 'Hyderabad, India',
    event: 'Royal Palace Wedding',
    rating: 5,
    image: '',
    quote:
      'Looks Amazing. The absolute best photography team I have ever seen. Exceptional job! The printed album quality and royal color grading are beyond our highest expectations.',
    fullStory:
      "We wanted a team that understood traditional South Indian royal ceremonies without making things feel stiff or artificial. Rishav's vision blended fine-art aesthetic with raw emotional moments. Every single frame tells a timeless story."
  },
  {
    id: 't3',
    name: 'Gayatri & Vikram',
    location: 'Kuala Lumpur, Malaysia',
    event: 'International Destination',
    rating: 5,
    image: '',
    quote:
      'Rishav... amazing work making this moment so special for us! The photos turned out really well. Thank you for turning our memories into timeless pieces of art.',
    fullStory:
      'Managing an overseas destination wedding had its stresses, but FYM handled our photography seamlessly. Their drone team and cinematographers captured the breathtaking beach sunsets and ritual details with unmatched elegance.'
  },
  {
    id: 't4',
    name: 'Ananya & Dev',
    location: 'Kolkata, India',
    event: 'Bengali Heritage Wedding',
    rating: 5,
    image: '',
    quote:
      'Frame Your Moments made us feel like royalty. The candid shots during the Sindoor Khela and Saat Paake Bandha are so full of soul and warmth.',
    fullStory:
      'Bengali weddings are filled with intense colors and emotions. FYM preserved the deep reds, golden ornaments, and spontaneous laughter of our family without interrupting any sacred ritual. Pure magic!'
  },
  {
    id: 't5',
    name: 'Pooja & Sameer',
    location: 'Mumbai, India',
    event: 'Pre-wedding & Sangeet',
    rating: 5,
    image: '',
    quote:
      'From our romantic pre-wedding session to the high-energy Sangeet night, FYM captured the electric atmosphere perfectly. Highly recommended!',
    fullStory:
      'The video highlight film brought happy tears to everyone at our reception. They captured moments we did not even realize were happening. The attention to detail and color palette is truly world-class.'
  }
];

/**
 * Fetch all testimonials — checks Supabase first, falls back to localStorage, then defaults
 */
export async function getTestimonials() {
  try {
    const { data, error } = await supabase.from('fym_testimonials').select('*');
    if (!error && Array.isArray(data) && data.length > 0) {
      const items = data.map((item) => ({
        id: item.id,
        name: item.name || item.couple_name || '',
        location: item.location || '',
        event: item.event || item.event_type || 'Wedding',
        rating: Number(item.rating) || 5,
        image: item.image || item.image_url || '',
        quote: item.quote || '',
        fullStory: item.full_story || item.fullStory || '',
        sortOrder: item.sort_order || 0
      }));

      localStorage.setItem('fym_testimonials', JSON.stringify(items));
      return items;
    }
  } catch (e) {
    console.warn('Supabase fetch for testimonials failed, using local/defaults', e);
  }

  try {
    const saved = localStorage.getItem('fym_testimonials');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // ignore
  }

  return DEFAULT_TESTIMONIALS;
}

/**
 * Save (insert or update) a single testimonial in Supabase and localStorage
 */
export async function saveTestimonial(testimonial) {
  const itemToSave = {
    ...testimonial,
    id: testimonial.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 't-' + Date.now())
  };

  // 1. Update localStorage immediately
  try {
    const current = await getTestimonials();
    const existingIndex = current.findIndex((t) => t.id === itemToSave.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = itemToSave;
    } else {
      updated = [itemToSave, ...current];
    }
    localStorage.setItem('fym_testimonials', JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating localStorage testimonials:', e);
  }

  // 2. Sync to Supabase
  try {
    const row = {
      name: itemToSave.name,
      location: itemToSave.location,
      event: itemToSave.event,
      rating: itemToSave.rating || 5,
      image: itemToSave.image || '',
      quote: itemToSave.quote || '',
      full_story: itemToSave.fullStory || itemToSave.full_story || '',
      sort_order: itemToSave.sortOrder || 0
    };

    // If item has a standard UUID id, pass it for upsert
    if (itemToSave.id && itemToSave.id.length === 36 && !itemToSave.id.startsWith('t-')) {
      row.id = itemToSave.id;
    }

    const { data, error } = await supabase.from('fym_testimonials').insert([row]);
    if (error) {
      console.warn('Supabase insert testimonial warning:', error);
    }
    return { success: true, data };
  } catch (e) {
    console.warn('Supabase save testimonial error:', e);
    return { success: false, error: e };
  }
}

/**
 * Delete a testimonial by ID
 */
export async function deleteTestimonial(id) {
  try {
    const current = await getTestimonials();
    const filtered = current.filter((t) => t.id !== id);
    localStorage.setItem('fym_testimonials', JSON.stringify(filtered));
  } catch (e) {
    console.error('Error updating localStorage on testimonial delete:', e);
  }

  try {
    if (id && id.length === 36 && !id.startsWith('t-')) {
      await supabase.from('fym_testimonials').delete('id', id);
    }
  } catch (e) {
    console.warn('Supabase delete testimonial error:', e);
  }
}

/**
 * Reset testimonials back to default seed data
 */
export async function resetTestimonials() {
  try {
    localStorage.setItem('fym_testimonials', JSON.stringify(DEFAULT_TESTIMONIALS));
    await supabase.from('fym_testimonials').delete('name', 'neq.empty_all_match');
  } catch (e) {
    console.warn('Error resetting testimonials:', e);
  }
  return DEFAULT_TESTIMONIALS;
}
