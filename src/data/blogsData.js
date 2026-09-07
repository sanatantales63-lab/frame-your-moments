import { supabase } from '../utils/supabaseClient';

export const DEFAULT_BLOGS = [
  {
    id: 'b1',
    title: 'The Ultimate Guide to Pre-Wedding Shoots in Royal Rajasthan',
    slug: 'pre-wedding-guide-royal-rajasthan',
    category: 'Pre-Wedding',
    cover_image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=85',
    excerpt: 'From the grand courtyards of Udaipur palaces to the golden dunes of Jaisalmer, discover how to plan a cinematic, unforgettable pre-wedding story.',
    content: `
      <h2>The Magic of Royal Heritage</h2>
      <p>Rajasthan offers a timeless, majestic canvas for couples who dream of regal pre-wedding cinema. Every archway, carved jharokha, and reflection in the lakes of Udaipur tells a story of royalty, romance, and enduring heritage.</p>
      
      <p style="color: #C5A059; font-weight: 600; font-size: 1.15em;">"A pre-wedding shoot isn't just about poses; it's about freezing the quiet anticipation before two families become one."</p>

      <h2>Best Time of the Year for Rajasthan Shoots</h2>
      <p>The ideal window spans from <strong>October to March</strong>, when the desert air is cool and the golden hour sunlight bathes marble palaces in warm, amber hues. Early morning sunrise shoots at Lake Pichola allow for intimate, undisturbed frames without tourist crowds.</p>

      <h2>Curating Outfits That Complement the Architecture</h2>
      <p>When shooting against ornate stone facades, choose rich jewel tones like deep emerald green, ruby crimson, or regal ivory with gold zari. Flowing fabrics like georgette and organza catch the desert breeze beautifully for dramatic cinematic slow-motion captures.</p>
    `,
    author: 'Frame Your Moments Editorial',
    author_role: 'Lead Cinematographer',
    read_time: '4 min read',
    tags: ['Pre-Wedding', 'Rajasthan', 'Royal', 'Outfits'],
    published: true,
    created_at: '2026-02-15T10:00:00.000Z',
    updated_at: '2026-02-15T10:00:00.000Z'
  },
  {
    id: 'b2',
    title: 'Fine-Art Wedding Photography: Why Timeless Tones Trump Fleeting Trends',
    slug: 'fine-art-wedding-photography-timeless-tones',
    category: 'Wedding Tips',
    cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    excerpt: 'Discover why classic color grading, natural skin tones, and unposed emotional depth will ensure your wedding album feels just as breath-taking in 30 years.',
    content: `
      <h2>Beyond Filters and Ephemeral Trends</h2>
      <p>Trendy filter presets and heavy orange-teal color grades come and go, but authentic emotion captured with true-to-life colors remains timeless forever. When you open your wedding album on your 25th anniversary, your memories should evoke the exact warmth and splendor of that magical day.</p>

      <blockquote style="border-left: 3px solid #E64A6E; padding-left: 1rem; margin: 1.5rem 0; color: #E64A6E; font-style: italic;">
        Fine art wedding photography is not merely documenting an event; it is translating raw, unscripted human devotion into gallery-worthy heirloom art.
      </blockquote>

      <h2>The Essence of Natural Light & Genuine Emotion</h2>
      <p>We believe in observing rather than orchestrating. The tear rolling down a father's cheek during the Kanyadaan, the secret glance between the bride and groom during pheras, the joyful laughter during Haldi — these are the spontaneous masterpieces we live to frame.</p>
    `,
    author: 'Frame Your Moments Studio',
    author_role: 'Creative Director',
    read_time: '5 min read',
    tags: ['Fine Art', 'Photography', 'Wedding Tips'],
    published: true,
    created_at: '2026-02-10T12:00:00.000Z',
    updated_at: '2026-02-10T12:00:00.000Z'
  },
  {
    id: 'b3',
    title: 'How to Plan Your Wedding Day Timeline for Cinematic Golden Hour Portraits',
    slug: 'wedding-day-timeline-golden-hour-portraits',
    category: 'Guides',
    cover_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
    excerpt: 'A seamless schedule breakdown to ensure you get dreamy, sun-kissed portraits with zero wedding day stress or rushing.',
    content: `
      <h2>The Sacred 45 Minutes: Golden Hour Magic</h2>
      <p>Golden hour — the hour just before sunset — is the holy grail of wedding cinematography. The soft, diffused lighting creates a natural halo around the couple, accentuating every sequin, embroidery detail, and loving expression without harsh shadows.</p>

      <h2>Sample Timeline for Effortless Photography</h2>
      <ul style="list-style-type: disc; padding-left: 1.5rem; line-height: 1.8;">
        <li><strong>3:30 PM - 4:15 PM:</strong> Bridal & Groom Solo Portraits (Indoors with controlled lighting)</li>
        <li><strong>4:30 PM - 5:15 PM:</strong> Couple's First Look & Outdoor Golden Hour Session</li>
        <li><strong>5:30 PM - 6:30 PM:</strong> Barat Arrival & Sunset Welcome</li>
        <li><strong>7:00 PM onwards:</strong> Varmala & Pheras under ambient night lighting</li>
      </ul>

      <p style="color: #059669; font-weight: 500;">Tip: Always buffer 15 minutes between bridal makeup completion and portrait sessions to ensure you feel calm, relaxed, and glowing.</p>
    `,
    author: 'Frame Your Moments Editorial',
    author_role: 'Lead Cinematographer',
    read_time: '6 min read',
    tags: ['Timeline', 'Golden Hour', 'Guides'],
    published: true,
    created_at: '2026-01-28T09:00:00.000Z',
    updated_at: '2026-01-28T09:00:00.000Z'
  }
];

const LOCAL_STORAGE_KEY = 'fym_blogs_data';

export function getBlogsFromLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading blogs from localStorage', e);
  }
  return DEFAULT_BLOGS;
}

export function saveBlogsToLocal(blogs) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blogs));
  } catch (e) {
    console.error('Error saving blogs to localStorage', e);
  }
}

/**
 * Fetch all published blogs from Supabase table `fym_blogs`.
 */
export async function fetchBlogsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('fym_blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      saveBlogsToLocal(data);
      return data;
    }
  } catch (e) {
    console.warn('Supabase fetch blogs failed, falling back to local', e);
  }
  return getBlogsFromLocal();
}

/**
 * Fetch single blog by slug from Supabase
 */
export async function fetchBlogBySlugFromSupabase(slug) {
  try {
    const { data, error } = await supabase
      .from('fym_blogs')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.warn(`Supabase fetch blog by slug ${slug} failed`, e);
  }
  const localBlogs = getBlogsFromLocal();
  return localBlogs.find((b) => b.slug === slug) || null;
}

/**
 * Save or update blog post in Supabase and local storage.
 */
export async function saveBlogToSupabase(blogData) {
  const currentBlogs = getBlogsFromLocal();
  const slug = blogData.slug || blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const payload = {
    title: blogData.title,
    slug: slug,
    category: blogData.category || 'Wedding Tips',
    cover_image: blogData.cover_image || blogData.coverImage || '',
    excerpt: blogData.excerpt || '',
    content: blogData.content || '',
    author: blogData.author || 'Frame Your Moments Editorial',
    author_role: blogData.author_role || blogData.authorRole || 'Lead Cinematographer',
    read_time: blogData.read_time || blogData.readTime || '5 min read',
    tags: Array.isArray(blogData.tags) ? blogData.tags : [blogData.category || 'Wedding'],
    published: blogData.published !== undefined ? blogData.published : true,
    updated_at: new Date().toISOString()
  };

  if (blogData.id && !blogData.id.startsWith('b')) {
    payload.id = blogData.id;
  }

  // Update localStorage immediately
  const existingIdx = currentBlogs.findIndex((b) => b.id === blogData.id || b.slug === slug);
  let updatedBlogs = [];
  const localItem = {
    ...payload,
    id: blogData.id || `b_${Date.now()}`,
    created_at: blogData.created_at || new Date().toISOString()
  };

  if (existingIdx >= 0) {
    updatedBlogs = [...currentBlogs];
    updatedBlogs[existingIdx] = { ...updatedBlogs[existingIdx], ...localItem };
  } else {
    updatedBlogs = [localItem, ...currentBlogs];
  }
  saveBlogsToLocal(updatedBlogs);

  // Sync to Supabase
  try {
    const { data, error } = await supabase
      .from('fym_blogs')
      .upsert(payload, { onConflict: 'slug' })
      .select();

    if (error) {
      console.error('Supabase error saving blog:', error);
      return { success: false, error, localData: localItem };
    }
    return { success: true, data: data?.[0] || localItem };
  } catch (e) {
    console.error('Error saving blog to Supabase:', e);
    return { success: false, error: e, localData: localItem };
  }
}

/**
 * Delete a blog post from Supabase and localStorage.
 */
export async function deleteBlogFromSupabase(id, slug) {
  const currentBlogs = getBlogsFromLocal();
  const filtered = currentBlogs.filter((b) => b.id !== id && b.slug !== slug);
  saveBlogsToLocal(filtered);

  try {
    if (id && !id.startsWith('b')) {
      await supabase.from('fym_blogs').delete().eq('id', id);
    } else if (slug) {
      await supabase.from('fym_blogs').delete().eq('slug', slug);
    }
    return { success: true };
  } catch (e) {
    console.warn('Error deleting blog from Supabase', e);
    return { success: false, error: e };
  }
}

/**
 * Reset blogs to default
 */
export function resetBlogsToDefault() {
  saveBlogsToLocal(DEFAULT_BLOGS);
  return DEFAULT_BLOGS;
}
