import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Film,
  Sparkles,
  UploadCloud,
  Trash2,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock,
  Eye,
  LogOut,
  ExternalLink,
  Plus,
  RefreshCw,
  Layers,
  Grid,
  Image as ImageIcon,
  Play,
  Copy,
  Check,
  Zap,
  Sliders,
  ChevronRight,
  Info,
  BookOpen,
  FileText,
  Type,
  Palette,
  Heading,
  Quote,
  List,
  Link2,
  Edit3,
  Bold,
  Italic,
  Underline,
  Star,
  MessageSquare,
  User,
  X
} from 'lucide-react';
import {
  compressImage,
  uploadToCloudinary,
  formatBytes,
  extractYouTubeId,
  extractInstagramCode,
  getInstagramEmbedUrl
} from '../utils/mediaUploader';
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../utils/supabaseClient';
import {
  SERVICES_META,
  getServiceGallery,
  saveServiceGallery,
  fetchServiceGalleryFromSupabase,
  saveServiceImagesToSupabase,
  deleteServiceImageFromSupabase,
  getServiceBanner,
  saveServiceBanner,
  fetchServiceBannerFromSupabase,
  fetchAllServiceBannersFromSupabase,
  saveServiceBannerToSupabase,
  deleteServiceBannerFromSupabase
} from '../data/servicesData';
import {
  getStoredFilms,
  saveStoredFilms,
  getStoredReels,
  saveStoredReels,
  fetchFilmsFromSupabase,
  fetchReelsFromSupabase,
  deleteFilmFromSupabase,
  deleteReelFromSupabase,
  updateFilmInSupabase,
  updateReelInSupabase
} from '../data/videosData';
import {
  getHeroPhotos,
  saveHeroPhotos,
  resetHeroPhotos,
  deleteHeroPhoto,
  getGridPhotos,
  saveGridPhotos,
  resetGridPhotos,
  deleteGridPhoto,
  getAboutPhotos,
  saveAboutPhoto
} from '../data/siteMediaData';
import {
  getTestimonials,
  saveTestimonial,
  deleteTestimonial,
  resetTestimonials
} from '../data/testimonialsData';
import {
  getBlogsFromLocal,
  fetchBlogsFromSupabase,
  saveBlogToSupabase,
  deleteBlogFromSupabase,
  resetBlogsToDefault
} from '../data/blogsData';

// ─── SQL SCHEMA SCRIPT FOR SUPABASE ───────────────────────────────────────────
const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- Frame Your Moments: Supabase Schema Migration Script
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/vhbspahnxahzilfgjlsg/sql
-- ==============================================================================

-- 1. General Site Media Table (Hero Marquee, Grid Showcase, Service Banners)
CREATE TABLE IF NOT EXISTS public.fym_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section TEXT NOT NULL,          -- 'hero', 'grid_showcase', 'service_banner', etc.
    category TEXT DEFAULT 'general', -- 'pre-wedding', 'wedding', 'engagement', 'event' for service_banner
    url TEXT NOT NULL,
    caption TEXT DEFAULT '',
    sort_order INT DEFAULT 0,
    is_compressed BOOLEAN DEFAULT FALSE,
    original_size BIGINT DEFAULT 0,
    compressed_size BIGINT DEFAULT 0,
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Services Galleries Table (Pre-Wedding, Wedding, Engagement, Event Photos)
CREATE TABLE IF NOT EXISTS public.fym_services_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_slug TEXT NOT NULL,     -- 'pre-wedding', 'wedding', 'engagement', 'event'
    url TEXT NOT NULL,
    caption TEXT DEFAULT '',
    sort_order INT DEFAULT 0,
    is_compressed BOOLEAN DEFAULT FALSE,
    original_size BIGINT DEFAULT 0,
    compressed_size BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dedicated Service Banners Table
CREATE TABLE IF NOT EXISTS public.fym_service_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_slug TEXT NOT NULL UNIQUE, -- 'pre-wedding', 'wedding', 'engagement', 'event'
    url TEXT NOT NULL,
    caption TEXT DEFAULT '',
    is_compressed BOOLEAN DEFAULT FALSE,
    original_size BIGINT DEFAULT 0,
    compressed_size BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Wedding Films Table (4K YouTube / Direct Cinema)
CREATE TABLE IF NOT EXISTS public.fym_wedding_films (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    couple TEXT DEFAULT '',
    category TEXT DEFAULT 'wedding_films',
    category_label TEXT DEFAULT 'Wedding Film',
    duration TEXT DEFAULT '4:00',
    location TEXT DEFAULT '',
    thumbnail TEXT DEFAULT '',
    video_url TEXT DEFAULT '',
    youtube_id TEXT DEFAULT '',
    description TEXT DEFAULT '',
    featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Quick Reels Table (Instagram Embeds & YouTube Shorts)
CREATE TABLE IF NOT EXISTS public.fym_wedding_reels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    couple TEXT DEFAULT '',
    duration TEXT DEFAULT '0:45',
    views TEXT DEFAULT '100K',
    thumbnail TEXT DEFAULT '',
    video_url TEXT DEFAULT '',
    youtube_id TEXT DEFAULT '',
    insta_code TEXT DEFAULT '',
    category TEXT DEFAULT 'Wedding Moments',
    aspect TEXT DEFAULT '9:16',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Journal & Blogs Table (Fine Art Wedding Guides & Stories)
CREATE TABLE IF NOT EXISTS public.fym_blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT DEFAULT 'Wedding Tips',
    cover_image TEXT NOT NULL,
    excerpt TEXT DEFAULT '',
    content TEXT NOT NULL,
    author TEXT DEFAULT 'Frame Your Moments Editorial',
    author_role TEXT DEFAULT 'Lead Cinematographer',
    read_time TEXT DEFAULT '5 min read',
    tags TEXT[] DEFAULT ARRAY['Wedding', 'Photography'],
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Client Reviews & Testimonials Table
CREATE TABLE IF NOT EXISTS public.fym_testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT DEFAULT '',
    event TEXT DEFAULT 'Destination Wedding',
    rating INT DEFAULT 5,
    image TEXT DEFAULT '',
    quote TEXT NOT NULL,
    full_story TEXT DEFAULT '',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Access Policies for Anon Client
ALTER TABLE public.fym_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fym_services_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fym_service_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fym_wedding_films ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fym_wedding_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fym_blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fym_testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent 'already exists' errors
DROP POLICY IF EXISTS "Allow public read fym_media" ON public.fym_media;
DROP POLICY IF EXISTS "Allow public write fym_media" ON public.fym_media;
DROP POLICY IF EXISTS "Allow public read fym_services_gallery" ON public.fym_services_gallery;
DROP POLICY IF EXISTS "Allow public write fym_services_gallery" ON public.fym_services_gallery;
DROP POLICY IF EXISTS "Allow public read fym_service_banners" ON public.fym_service_banners;
DROP POLICY IF EXISTS "Allow public write fym_service_banners" ON public.fym_service_banners;
DROP POLICY IF EXISTS "Allow public read fym_wedding_films" ON public.fym_wedding_films;
DROP POLICY IF EXISTS "Allow public write fym_wedding_films" ON public.fym_wedding_films;
DROP POLICY IF EXISTS "Allow public read fym_wedding_reels" ON public.fym_wedding_reels;
DROP POLICY IF EXISTS "Allow public write fym_wedding_reels" ON public.fym_wedding_reels;
DROP POLICY IF EXISTS "Allow public read fym_blogs" ON public.fym_blogs;
DROP POLICY IF EXISTS "Allow public write fym_blogs" ON public.fym_blogs;
DROP POLICY IF EXISTS "Allow public read fym_testimonials" ON public.fym_testimonials;
DROP POLICY IF EXISTS "Allow public write fym_testimonials" ON public.fym_testimonials;

-- Allow anon public read/write for instant website syncing
CREATE POLICY "Allow public read fym_media" ON public.fym_media FOR SELECT USING (true);
CREATE POLICY "Allow public write fym_media" ON public.fym_media FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read fym_services_gallery" ON public.fym_services_gallery FOR SELECT USING (true);
CREATE POLICY "Allow public write fym_services_gallery" ON public.fym_services_gallery FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read fym_service_banners" ON public.fym_service_banners FOR SELECT USING (true);
CREATE POLICY "Allow public write fym_service_banners" ON public.fym_service_banners FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read fym_wedding_films" ON public.fym_wedding_films FOR SELECT USING (true);
CREATE POLICY "Allow public write fym_wedding_films" ON public.fym_wedding_films FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read fym_wedding_reels" ON public.fym_wedding_reels FOR SELECT USING (true);
CREATE POLICY "Allow public write fym_wedding_reels" ON public.fym_wedding_reels FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read fym_blogs" ON public.fym_blogs FOR SELECT USING (true);
CREATE POLICY "Allow public write fym_blogs" ON public.fym_blogs FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read fym_testimonials" ON public.fym_testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public write fym_testimonials" ON public.fym_testimonials FOR ALL USING (true) WITH CHECK (true);
`;

export default function AdminPanel({ onBackToHome, onNavigateToVideos, onNavigateToService, onNavigateToBlogs }) {
  // ── Supabase Auth State ──
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('fym_admin_auth') === 'true';
  });
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);


  // ── Active Tab ──
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'hero' | 'grid' | 'videos' | 'sql'
  const [activeServiceSlug, setActiveServiceSlug] = useState('pre-wedding');

  // ── Data States ──
  const [serviceGallery, setServiceGallery] = useState([]);
  const [serviceBanners, setServiceBanners] = useState({}); // { [slug]: { url, isCompressed, originalSize, compressedSize } }
  const [heroPhotos, setHeroPhotos] = useState([]);
  const [gridPhotos, setGridPhotos] = useState([]);
  const [films, setFilms] = useState([]);
  const [reels, setReels] = useState([]);

  // ── Upload & Compression States (Gallery) ──
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  // ── Banner Upload States ──
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [bannerUploadProgress, setBannerUploadProgress] = useState(0);
  const [bannerUploadStatus, setBannerUploadStatus] = useState('');
  const bannerFileInputRef = useRef(null);

  // ── New Video / Reel Modal Form State ──
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoFormType, setVideoFormType] = useState('film'); // 'film' | 'reel'
  const [filmForm, setFilmForm] = useState({
    title: '',
    couple: '',
    category: 'wedding_films',
    categoryLabel: 'Wedding Film',
    duration: '4:15',
    location: 'Kolkata, India',
    thumbnail: '',
    videoUrl: '/featured_wedding_film.mp4',
    youtubeId: '',
    description: '',
    featured: false
  });

  const [reelForm, setReelForm] = useState({
    title: '',
    couple: '',
    duration: '0:45',
    views: '120K',
    thumbnail: '',
    videoUrl: '/featured_wedding_film.mp4',
    youtubeId: '',
    instaCode: '',
    category: 'Wedding Moments'
  });

  const [editingVideoId, setEditingVideoId] = useState(null);
  const [isUploadingVideoThumb, setIsUploadingVideoThumb] = useState(false);
  const [videoThumbProgress, setVideoThumbProgress] = useState(0);
  const [videoThumbStatus, setVideoThumbStatus] = useState('');
  const videoThumbInputRef = useRef(null);

  // ── Blogs & Editorial Journal State ──
  const [blogs, setBlogs] = useState(getBlogsFromLocal);
  const [isWritingBlog, setIsWritingBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogEditorTab, setBlogEditorTab] = useState('write'); // 'write' | 'preview'
  const [isUploadingBlogCover, setIsUploadingBlogCover] = useState(false);
  const [blogCoverProgress, setBlogCoverProgress] = useState(0);
  const [isUploadingContentImg, setIsUploadingContentImg] = useState(false);
  const [contentImgProgress, setContentImgProgress] = useState(0);

  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    category: 'Wedding Tips',
    cover_image: '',
    excerpt: '',
    content: '',
    author: 'Frame Your Moments Editorial',
    author_role: 'Lead Cinematographer',
    read_time: '5 min read',
    tags: 'Wedding, Photography',
    published: true
  });

  // ── About Section Photos State ──
  const [aboutPhotos, setAboutPhotos] = useState({
    about_main: '',
    about_detail: '',
    about_founder: '',
    video_poster: ''
  });
  const [isUploadingAbout, setIsUploadingAbout] = useState('');
  const [aboutUploadProgress, setAboutUploadProgress] = useState(0);
  const [aboutUploadStatus, setAboutUploadStatus] = useState('');

  // ── Testimonials / Reviews State ──
  const [testimonials, setTestimonials] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [isUploadingReviewImg, setIsUploadingReviewImg] = useState(false);
  const [reviewImgProgress, setReviewImgProgress] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    location: '',
    event: 'Destination Wedding',
    rating: 5,
    image: '',
    quote: '',
    fullStory: ''
  });

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const blogCoverInputRef = useRef(null);
  const blogContentImgInputRef = useRef(null);
  const contentTextAreaRef = useRef(null);

  // ── Load Data (always from Supabase — it is the single source of truth) ──
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load Services Gallery — Supabase first, localStorage only while loading
    setServiceGallery(getServiceGallery(activeServiceSlug));
    fetchServiceGalleryFromSupabase(activeServiceSlug).then((data) => {
      setServiceGallery(data); // Always set, even if empty array
    });

    // Load Service Banners
    fetchAllServiceBannersFromSupabase().then((banners) => {
      if (banners && Object.keys(banners).length > 0) {
        setServiceBanners(banners);
      }
    });

    // Load Blogs & Stories
    fetchBlogsFromSupabase().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setBlogs(data);
      }
    });

    // Load Hero & Grid — Supabase always overwrites
    getHeroPhotos().then(setHeroPhotos);
    getGridPhotos().then(setGridPhotos);

    // Load About Section Photos
    getAboutPhotos().then((data) => {
      if (data) setAboutPhotos(data);
    });

    // Load Testimonials / Reviews
    getTestimonials().then((data) => {
      if (Array.isArray(data)) setTestimonials(data);
    });

    // Load Videos & Reels — Supabase always overwrites localStorage
    fetchFilmsFromSupabase().then((data) => {
      setFilms(data); // Always set, even if empty
    });
    fetchReelsFromSupabase().then((data) => {
      setReels(data); // Always set, even if empty
    });
  }, [isAuthenticated, activeServiceSlug]);

  // ── Service Hero Banner Upload Handler ──
  const handleBannerSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    setBannerUploadProgress(15);
    setBannerUploadStatus(`Optimizing banner: ${file.name}...`);

    try {
      // Step 1: Compress high-res landscape banner
      const compressionResult = await compressImage(file, {
        maxSizeKB: 700,
        quality: 0.88
      });

      setBannerUploadProgress(45);
      setBannerUploadStatus('Uploading banner to Cloudinary...');

      // Step 2: Upload to Cloudinary
      const uploadRes = await uploadToCloudinary(compressionResult.file, {
        onProgress: (percent) => {
          setBannerUploadProgress(45 + Math.round(percent * 0.45));
        }
      });

      if (uploadRes.success) {
        setBannerUploadProgress(92);
        setBannerUploadStatus('Saving banner to Supabase...');

        const bannerData = {
          src: uploadRes.url,
          caption: `${SERVICES_META.find((s) => s.slug === activeServiceSlug)?.title || activeServiceSlug} Hero Banner`,
          isCompressed: compressionResult.wasCompressed,
          originalSize: compressionResult.originalSize,
          compressedSize: compressionResult.compressedSize
        };

        // Step 3: Save to Supabase & localStorage
        await saveServiceBannerToSupabase(activeServiceSlug, bannerData);

        setServiceBanners((prev) => ({
          ...prev,
          [activeServiceSlug]: {
            url: uploadRes.url,
            isCompressed: compressionResult.wasCompressed,
            originalSize: compressionResult.originalSize,
            compressedSize: compressionResult.compressedSize
          }
        }));

        setBannerUploadProgress(100);
        setBannerUploadStatus('Hero Banner Updated Successfully!');
      } else {
        alert('Failed to upload banner to Cloudinary. Please check connection.');
      }
    } catch (err) {
      console.error('Failed to upload service banner:', err);
      alert('Error uploading banner: ' + (err.message || 'Unknown error'));
    }

    setTimeout(() => {
      setIsUploadingBanner(false);
      setBannerUploadProgress(0);
      setBannerUploadStatus('');
    }, 1500);

    if (e.target) e.target.value = '';
  };

  // ── Delete Service Banner Handler ──
  const handleDeleteBanner = async () => {
    const serviceName = SERVICES_META.find((s) => s.slug === activeServiceSlug)?.title || activeServiceSlug;
    if (!window.confirm(`Are you sure you want to remove the custom Hero Banner for "${serviceName}"?`)) return;

    // Optimistic state update
    setServiceBanners((prev) => {
      const copy = { ...prev };
      delete copy[activeServiceSlug];
      return copy;
    });

    await deleteServiceBannerFromSupabase(activeServiceSlug);
  };

  // ── Handle Upload About Photo with Smart Compression ──
  const handleUploadAboutPhoto = async (key, file) => {
    if (!file) return;
    setIsUploadingAbout(key);
    setAboutUploadProgress(20);
    setAboutUploadStatus(`Compressing & optimizing ${file.name}...`);

    try {
      const compressionResult = await compressImage(file, {
        maxSizeKB: key === 'about_founder' ? 300 : 700,
        quality: 0.85
      });

      setAboutUploadProgress(50);
      setAboutUploadStatus('Uploading to Cloudinary...');

      const uploadRes = await uploadToCloudinary(compressionResult.file, {
        onProgress: (percent) => {
          setAboutUploadProgress(50 + Math.round(percent * 0.45));
        }
      });

      if (uploadRes.success) {
        setAboutUploadProgress(95);
        setAboutUploadStatus('Saving to Supabase...');

        const photoData = {
          url: uploadRes.url,
          title: key,
          isCompressed: compressionResult.wasCompressed,
          originalSize: compressionResult.originalSize,
          compressedSize: compressionResult.compressedSize
        };

        await saveAboutPhoto(key, photoData);
        setAboutPhotos((prev) => ({ ...prev, [key]: uploadRes.url }));
        setAboutUploadProgress(100);
        setAboutUploadStatus('Saved successfully!');
      } else {
        alert('Failed to upload image. Please check network.');
      }
    } catch (err) {
      console.error('About photo upload error:', err);
      alert('Error: ' + (err.message || 'Failed to upload'));
    }

    setTimeout(() => {
      setIsUploadingAbout('');
      setAboutUploadProgress(0);
      setAboutUploadStatus('');
    }, 1200);
  };

  // ── Delete About Photo ──
  const handleDeleteAboutPhoto = async (key, label) => {
    if (!window.confirm(`Are you sure you want to remove the image for "${label}"?`)) return;
    setAboutPhotos((prev) => ({ ...prev, [key]: '' }));
    await saveAboutPhoto(key, { url: '', title: key });
  };

  // ── Handle Review Couple Image Upload with Smart Compression ──
  const handleReviewPhotoSelected = async (file) => {
    if (!file) return;
    setIsUploadingReviewImg(true);
    setReviewImgProgress(25);

    try {
      const compressionResult = await compressImage(file, {
        maxSizeKB: 400,
        quality: 0.85
      });

      setReviewImgProgress(55);
      const uploadRes = await uploadToCloudinary(compressionResult.file, {
        onProgress: (percent) => {
          setReviewImgProgress(55 + Math.round(percent * 0.4));
        }
      });

      if (uploadRes.success) {
        setReviewForm((prev) => ({ ...prev, image: uploadRes.url }));
        setReviewImgProgress(100);
      } else {
        alert('Failed to upload couple photo.');
      }
    } catch (err) {
      console.error('Review image upload failed:', err);
      alert('Upload failed: ' + err.message);
    }

    setTimeout(() => {
      setIsUploadingReviewImg(false);
      setReviewImgProgress(0);
    }, 800);
  };

  // ── Save Review (Add / Edit) ──
  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.quote) {
      alert('Please provide Couple Names and a Review Quote.');
      return;
    }

    const reviewToSave = {
      ...reviewForm,
      id: editingReviewId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 't-' + Date.now()),
      rating: Number(reviewForm.rating) || 5
    };

    await saveTestimonial(reviewToSave);
    const fresh = await getTestimonials();
    setTestimonials(fresh);

    setReviewModalOpen(false);
    setEditingReviewId(null);
    setReviewForm({
      name: '',
      location: '',
      event: 'Destination Wedding',
      rating: 5,
      image: '',
      quote: '',
      fullStory: ''
    });
  };

  // ── Edit Review Modal Open ──
  const handleOpenEditReview = (item) => {
    setEditingReviewId(item.id);
    setReviewForm({
      name: item.name || '',
      location: item.location || '',
      event: item.event || 'Destination Wedding',
      rating: item.rating || 5,
      image: item.image || '',
      quote: item.quote || '',
      fullStory: item.fullStory || item.full_story || ''
    });
    setReviewModalOpen(true);
  };

  // ── Delete Review ──
  const handleDeleteReview = async (id, name) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    await deleteTestimonial(id);
    const fresh = await getTestimonials();
    setTestimonials(fresh);
  };

  // ── Reset Reviews ──
  const handleResetReviews = async () => {
    if (!window.confirm('Reset all reviews to default initial stories?')) return;
    const fresh = await resetTestimonials();
    setTestimonials(fresh);
  };

  // ── Handle Supabase Email+Password Login ──
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setIsLoggingIn(true);
    setAuthError('');

    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput.trim()
        })
      });

      const json = await res.json();

      if (res.ok && json.access_token) {
        setIsAuthenticated(true);
        sessionStorage.setItem('fym_admin_auth', 'true');
        sessionStorage.setItem('fym_admin_token', json.access_token);
        setAuthError('');
      } else {
        const msg = json?.error_description || json?.msg || 'Invalid email or password.';
        setAuthError(msg);
      }
    } catch (err) {
      setAuthError('Network error. Please check your connection.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('fym_admin_auth');
    sessionStorage.removeItem('fym_admin_token');
    setEmailInput('');
    setPasswordInput('');
  };

  // ── Multi-File Upload & Auto-Compress Handler ──
  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const uploadedResults = [];
    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      setUploadStatusText(`Compressing image ${i + 1} of ${totalFiles}: ${file.name}...`);

      try {
        // Step 1: Client-side compression (if > 500KB)
        const compressionResult = await compressImage(file, {
          maxSizeKB: 500,
          quality: 0.84
        });

        setUploadStatusText(`Uploading to Cloudinary ${i + 1} of ${totalFiles}...`);

        // Step 2: Upload to Cloudinary
        const uploadRes = await uploadToCloudinary(compressionResult.file, {
          onProgress: (percent) => {
            const overall = Math.round(((i + percent / 100) / totalFiles) * 100);
            setUploadProgress(overall);
          }
        });

        if (uploadRes.success) {
          const newMediaItem = {
            id: `media-${Date.now()}-${i}`,
            src: uploadRes.url,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            isCompressed: compressionResult.wasCompressed,
            originalSize: compressionResult.originalSize,
            compressedSize: compressionResult.compressedSize,
            savedPercent: compressionResult.savedPercent
          };

          uploadedResults.push(newMediaItem);
        }
      } catch (err) {
        console.error(`Failed to process ${file.name}:`, err);
      }
    }

    // Step 3: Append to Active Tab data and save
    if (uploadedResults.length > 0) {
      if (activeTab === 'services') {
        const updated = [...uploadedResults, ...serviceGallery];
        setServiceGallery(updated);
        saveServiceGallery(activeServiceSlug, updated);

        // Sync to Supabase
        await saveServiceImagesToSupabase(activeServiceSlug, uploadedResults);
        // Refresh with real Supabase rows (with UUIDs)
        const fresh = await fetchServiceGalleryFromSupabase(activeServiceSlug);
        if (fresh && fresh.length > 0) {
          setServiceGallery(fresh);
        }
      } else if (activeTab === 'hero') {
        const updated = [...uploadedResults, ...heroPhotos];
        setHeroPhotos(updated);
        localStorage.setItem('fym_hero_photos', JSON.stringify(updated));
        await saveHeroPhotos(uploadedResults);
        const fresh = await getHeroPhotos();
        if (fresh && fresh.length > 0) {
          setHeroPhotos(fresh);
        }
      } else if (activeTab === 'grid') {
        const updated = [...uploadedResults, ...gridPhotos];
        setGridPhotos(updated);
        localStorage.setItem('fym_grid_photos', JSON.stringify(updated));
        await saveGridPhotos(uploadedResults);
        const fresh = await getGridPhotos();
        if (fresh && fresh.length > 0) {
          setGridPhotos(fresh);
        }
      }
    }

    setIsUploading(false);
    setUploadProgress(100);
    setUploadStatusText('Upload & Sync Completed!');
    if (e.target) e.target.value = '';
  };

  // ── Delete Service Image Handler ──
  const handleDeleteServiceImage = async (id, src) => {
    if (!window.confirm('Are you sure you want to remove this photo?')) return;
    const itemToDelete = serviceGallery.find((item) => item.id === id);
    const filtered = serviceGallery.filter((item) => item.id !== id);
    // Optimistic UI update
    setServiceGallery(filtered);
    saveServiceGallery(activeServiceSlug, filtered);
    // Permanent Supabase delete
    if (itemToDelete) await deleteServiceImageFromSupabase(itemToDelete);
  };

  // ── Reset Handlers ──
  const handleResetHero = async () => {
    if (!window.confirm('Clear ALL Hero Marquee photos from Supabase? This cannot be undone.')) return;
    const def = await resetHeroPhotos();
    setHeroPhotos(def);
  };

  const handleResetGrid = async () => {
    if (!window.confirm('Clear ALL Grid Showcase photos from Supabase? This cannot be undone.')) return;
    const def = await resetGridPhotos();
    setGridPhotos(def);
  };

  // ── Delete Hero Photo Handler ──
  const handleDeleteHeroPhoto = async (idx, item) => {
    const filtered = heroPhotos.filter((_, i) => i !== idx);
    // Optimistic UI update
    setHeroPhotos(filtered);
    localStorage.setItem('fym_hero_photos', JSON.stringify(filtered));
    // Permanent Supabase delete
    await deleteHeroPhoto(item);
  };

  // ── Delete Grid Photo Handler ──
  const handleDeleteGridPhoto = async (idx, item) => {
    const filtered = gridPhotos.filter((_, i) => i !== idx);
    // Optimistic UI update
    setGridPhotos(filtered);
    localStorage.setItem('fym_grid_photos', JSON.stringify(filtered));
    // Permanent Supabase delete
    await deleteGridPhoto(item);
  };

  // ── Handle Video/Reel Thumbnail Upload with Smart Compression ──
  const handleThumbnailSelected = async (file, type = 'reel') => {
    if (!file) return;
    setIsUploadingVideoThumb(true);
    setVideoThumbProgress(20);
    setVideoThumbStatus(`Compressing & optimizing ${file.name}...`);

    try {
      // Smart Client-Side Compression (threshold: compresses if > 500KB)
      const compressionResult = await compressImage(file, {
        maxSizeKB: 500,
        quality: 0.85
      });

      setVideoThumbProgress(50);
      setVideoThumbStatus(
        compressionResult.wasCompressed
          ? `Compressed (${formatBytes(compressionResult.originalSize)} → ${formatBytes(compressionResult.compressedSize)}). Uploading...`
          : 'Uploading to Cloudinary...'
      );

      // Direct Cloudinary Upload
      const uploadRes = await uploadToCloudinary(compressionResult.file, {
        onProgress: (percent) => {
          setVideoThumbProgress(50 + Math.round(percent * 0.45));
        }
      });

      if (uploadRes.success) {
        if (type === 'film') {
          setFilmForm((prev) => ({ ...prev, thumbnail: uploadRes.url }));
        } else {
          setReelForm((prev) => ({ ...prev, thumbnail: uploadRes.url }));
        }
        setVideoThumbProgress(100);
        setVideoThumbStatus('Thumbnail uploaded successfully!');
      } else {
        alert('Failed to upload thumbnail. Please check network connection.');
      }
    } catch (err) {
      console.error('Thumbnail upload error:', err);
      alert('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setTimeout(() => {
        setIsUploadingVideoThumb(false);
        setVideoThumbProgress(0);
        setVideoThumbStatus('');
      }, 1000);
    }
  };

  // ── Edit Film Handler ──
  const handleEditFilm = (film) => {
    setEditingVideoId(film.id);
    setVideoFormType('film');
    setFilmForm({
      title: film.title || '',
      couple: film.couple || '',
      category: film.category || 'wedding_films',
      categoryLabel: film.categoryLabel || 'Wedding Film',
      duration: film.duration || '4:15',
      location: film.location || '',
      thumbnail: film.thumbnail || '',
      videoUrl: film.videoUrl || '/featured_wedding_film.mp4',
      youtubeId: film.youtubeId || '',
      description: film.description || '',
      featured: film.featured || false
    });
    setVideoModalOpen(true);
  };

  // ── Edit Reel Handler ──
  const handleEditReel = (reel) => {
    setEditingVideoId(reel.id);
    setVideoFormType('reel');
    setReelForm({
      title: reel.title || '',
      couple: reel.couple || '',
      duration: reel.duration || '0:45',
      views: reel.views || '120K',
      thumbnail: reel.thumbnail || '',
      videoUrl: reel.videoUrl || '/featured_wedding_film.mp4',
      youtubeId: reel.youtubeId || '',
      instaCode: reel.instaCode || '',
      category: reel.category || 'Wedding Moments'
    });
    setVideoModalOpen(true);
  };

  // ── Save Film Handler (Add or Update) ──
  const handleSaveFilm = async (e) => {
    e.preventDefault();
    const ytId = extractYouTubeId(filmForm.youtubeId);

    if (editingVideoId) {
      const updatedFilm = {
        id: editingVideoId,
        ...filmForm,
        youtubeId: ytId || filmForm.youtubeId,
        thumbnail: filmForm.thumbnail || ''
      };

      const updated = films.map((f) => (f.id === editingVideoId ? updatedFilm : f));
      setFilms(updated);
      saveStoredFilms(updated);

      await updateFilmInSupabase(editingVideoId, {
        title: updatedFilm.title,
        couple: updatedFilm.couple,
        category: updatedFilm.category,
        category_label: updatedFilm.categoryLabel,
        duration: updatedFilm.duration,
        location: updatedFilm.location,
        thumbnail: updatedFilm.thumbnail,
        video_url: updatedFilm.videoUrl,
        youtube_id: updatedFilm.youtubeId,
        description: updatedFilm.description,
        featured: updatedFilm.featured
      });
    } else {
      const newFilm = {
        id: `film-${Date.now()}`,
        ...filmForm,
        youtubeId: ytId || filmForm.youtubeId,
        thumbnail: filmForm.thumbnail || ''
      };

      const updated = [newFilm, ...films];
      setFilms(updated);
      saveStoredFilms(updated);

      try {
        await supabase.from('fym_wedding_films').insert({
          title: newFilm.title,
          couple: newFilm.couple,
          category: newFilm.category,
          category_label: newFilm.categoryLabel,
          duration: newFilm.duration,
          location: newFilm.location,
          thumbnail: newFilm.thumbnail,
          video_url: newFilm.videoUrl,
          youtube_id: newFilm.youtubeId,
          description: newFilm.description,
          featured: newFilm.featured
        });
      } catch (e) {
        console.warn('Supabase film insert error', e);
      }
    }

    setEditingVideoId(null);
    setVideoModalOpen(false);
  };

  // ── Save Reel Handler (Add or Update) ──
  const handleSaveReel = async (e) => {
    e.preventDefault();
    const ytId = extractYouTubeId(reelForm.youtubeId);
    const instaCode = extractInstagramCode(reelForm.instaCode);

    if (editingVideoId) {
      const updatedReel = {
        id: editingVideoId,
        ...reelForm,
        youtubeId: ytId || reelForm.youtubeId,
        instaCode: instaCode || reelForm.instaCode,
        thumbnail: reelForm.thumbnail || ''
      };

      const updated = reels.map((r) => (r.id === editingVideoId ? updatedReel : r));
      setReels(updated);
      saveStoredReels(updated);

      await updateReelInSupabase(editingVideoId, {
        title: updatedReel.title,
        couple: updatedReel.couple,
        duration: updatedReel.duration,
        views: updatedReel.views,
        thumbnail: updatedReel.thumbnail,
        video_url: updatedReel.videoUrl,
        youtube_id: updatedReel.youtubeId,
        insta_code: updatedReel.instaCode,
        category: updatedReel.category
      });
    } else {
      const newReel = {
        id: `reel-${Date.now()}`,
        ...reelForm,
        youtubeId: ytId || reelForm.youtubeId,
        instaCode: instaCode || reelForm.instaCode,
        thumbnail: reelForm.thumbnail || ''
      };

      const updated = [newReel, ...reels];
      setReels(updated);
      saveStoredReels(updated);

      try {
        await supabase.from('fym_wedding_reels').insert({
          title: newReel.title,
          couple: newReel.couple,
          duration: newReel.duration,
          views: newReel.views,
          thumbnail: newReel.thumbnail,
          video_url: newReel.videoUrl,
          youtube_id: newReel.youtubeId,
          insta_code: newReel.instaCode,
          category: newReel.category
        });
      } catch (e) {
        console.warn('Supabase reel insert error', e);
      }
    }

    setEditingVideoId(null);
    setVideoModalOpen(false);
  };

  // ── Delete Video/Reel Handler ──
  const handleDeleteFilm = async (id) => {
    if (!window.confirm('Delete this wedding film?')) return;
    const updated = films.filter((f) => f.id !== id);
    // Optimistic UI update
    setFilms(updated);
    saveStoredFilms(updated);
    // Permanent Supabase delete
    await deleteFilmFromSupabase(id);
  };

  const handleDeleteReel = async (id) => {
    if (!window.confirm('Delete this reel?')) return;
    const updated = reels.filter((r) => r.id !== id);
    // Optimistic UI update
    setReels(updated);
    saveStoredReels(updated);
    // Permanent Supabase delete
    await deleteReelFromSupabase(id);
  };

  // ── Blogs & Journal Handlers ──
  const handleNewBlogClick = () => {
    setEditingBlogId(null);
    setBlogForm({
      title: '',
      slug: '',
      category: 'Wedding Tips',
      cover_image: '',
      excerpt: '',
      content: `<h2>The Heart of the Story</h2>\n<p>Write your wedding thoughts, tips, or experiences here...</p>\n`,
      author: 'Frame Your Moments Editorial',
      author_role: 'Lead Cinematographer',
      read_time: '5 min read',
      tags: 'Wedding, Photography',
      published: true
    });
    setBlogEditorTab('write');
    setIsWritingBlog(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog.id);
    setBlogForm({
      title: blog.title || '',
      slug: blog.slug || '',
      category: blog.category || 'Wedding Tips',
      cover_image: blog.cover_image || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      author: blog.author || 'Frame Your Moments Editorial',
      author_role: blog.author_role || 'Lead Cinematographer',
      read_time: blog.read_time || '5 min read',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || 'Wedding, Photography'),
      published: blog.published !== false
    });
    setBlogEditorTab('write');
    setIsWritingBlog(true);
  };

  const handleDeleteBlog = async (id, slug) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    const updated = blogs.filter((b) => b.id !== id && b.slug !== slug);
    setBlogs(updated);
    await deleteBlogFromSupabase(id, slug);
  };

  const handleBlogCoverSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBlogCover(true);
    setBlogCoverProgress(20);

    try {
      const comp = await compressImage(file, { maxSizeKB: 700, quality: 0.88 });
      setBlogCoverProgress(50);
      const res = await uploadToCloudinary(comp.file, {
        onProgress: (p) => setBlogCoverProgress(50 + Math.round(p * 0.45))
      });

      if (res.success) {
        setBlogCoverProgress(100);
        setBlogForm((prev) => ({ ...prev, cover_image: res.url }));
      }
    } catch (err) {
      console.error('Error uploading blog cover', err);
    } finally {
      setIsUploadingBlogCover(false);
      setBlogCoverProgress(0);
      if (blogCoverInputRef.current) blogCoverInputRef.current.value = '';
    }
  };

  const handleContentImageSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingContentImg(true);
    setContentImgProgress(20);

    try {
      const comp = await compressImage(file, { maxSizeKB: 600, quality: 0.85 });
      setContentImgProgress(50);
      const res = await uploadToCloudinary(comp.file, {
        onProgress: (p) => setContentImgProgress(50 + Math.round(p * 0.45))
      });

      if (res.success) {
        setContentImgProgress(100);
        const imgTag = `\n<img src="${res.url}" alt="${blogForm.title || 'Wedding Story Photo'}" style="width: 100%; border-radius: 1rem; margin: 1.5rem 0; box-shadow: 0 10px 25px rgba(0,0,0,0.15);" />\n`;

        const textarea = contentTextAreaRef.current;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const currentText = blogForm.content;
          const newContent = currentText.substring(0, start) + imgTag + currentText.substring(end);
          setBlogForm((prev) => ({ ...prev, content: newContent }));
        } else {
          setBlogForm((prev) => ({ ...prev, content: prev.content + imgTag }));
        }
      }
    } catch (err) {
      console.error('Error inserting content image', err);
    } finally {
      setIsUploadingContentImg(false);
      setContentImgProgress(0);
      if (blogContentImgInputRef.current) blogContentImgInputRef.current.value = '';
    }
  };

  const applyTextFormatting = (type, customStyle = '') => {
    const textarea = contentTextAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = blogForm.content;
    const selectedText = currentText.substring(start, end) || 'Sample text';

    let formatted = '';
    switch (type) {
      case 'bold':
        formatted = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formatted = `<em>${selectedText}</em>`;
        break;
      case 'underline':
        formatted = `<u>${selectedText}</u>`;
        break;
      case 'h2':
        formatted = `\n<h2>${selectedText}</h2>\n`;
        break;
      case 'h3':
        formatted = `\n<h3>${selectedText}</h3>\n`;
        break;
      case 'p':
        formatted = `\n<p>${selectedText}</p>\n`;
        break;
      case 'quote':
        formatted = `\n<blockquote style="border-left: 3px solid #E64A6E; padding-left: 1rem; margin: 1.5rem 0; color: #E64A6E; font-style: italic;">\n  ${selectedText}\n</blockquote>\n`;
        break;
      case 'list':
        formatted = `\n<ul style="list-style-type: disc; padding-left: 1.5rem; line-height: 1.8;">\n  <li>${selectedText}</li>\n  <li>Second key point</li>\n</ul>\n`;
        break;
      case 'color':
        formatted = `<span style="color: ${customStyle}; font-weight: 600;">${selectedText}</span>`;
        break;
      default:
        formatted = selectedText;
    }

    const newContent = currentText.substring(0, start) + formatted + currentText.substring(end);
    setBlogForm((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formatted.length, start + formatted.length);
    }, 50);
  };

  const handleSaveBlogSubmit = async (e) => {
    e.preventDefault();
    if (!blogForm.title.trim()) {
      alert('Please enter an article title');
      return;
    }

    const autoSlug = blogForm.slug.trim() || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tagsArray = typeof blogForm.tags === 'string'
      ? blogForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : (blogForm.tags || ['Wedding']);

    const payload = {
      id: editingBlogId || `b_${Date.now()}`,
      title: blogForm.title,
      slug: autoSlug,
      category: blogForm.category || 'Wedding Tips',
      cover_image: blogForm.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
      excerpt: blogForm.excerpt,
      content: blogForm.content,
      author: blogForm.author || 'Frame Your Moments Editorial',
      author_role: blogForm.author_role || 'Lead Cinematographer',
      read_time: blogForm.read_time || '5 min read',
      tags: tagsArray,
      published: blogForm.published !== false
    };

    // Optimistic UI update
    const existingIndex = blogs.findIndex((b) => b.id === payload.id || b.slug === payload.slug);
    let updatedList = [];
    if (existingIndex >= 0) {
      updatedList = [...blogs];
      updatedList[existingIndex] = payload;
    } else {
      updatedList = [payload, ...blogs];
    }
    setBlogs(updatedList);

    // Save to Supabase
    await saveBlogToSupabase(payload);
    setIsWritingBlog(false);
    setEditingBlogId(null);
  };

  // ── Copy SQL ──
  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // ── Clear All Local Cache (Force Supabase Re-sync) ──
  const handleClearAllCache = () => {
    if (!window.confirm('Clear all local browser cache and reload fresh from Supabase? This will NOT delete any Supabase data.')) return;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('fym_')) keysToRemove.push(key);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // ── SUPABASE AUTH LOGIN VIEW ──
  // ═════════════════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6 relative selection:bg-[#E64A6E] selection:text-white">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-[#141210] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 text-center"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#C5A059] to-[#E64A6E] p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#141210] rounded-2xl flex items-center justify-center">
                <Lock size={26} className="text-[#C5A059]" />
              </div>
            </div>
          </div>

          <h2 className="font-serif-luxury text-3xl font-light text-white mb-2">
            Owner Access
          </h2>
          <p className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-[#A8A29E] mb-8">
            Frame Your Moments • Control Panel
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2 text-left">
              <label className="font-cinzel text-[10px] tracking-wider uppercase text-white/70">
                Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="owner@example.com"
                autoFocus
                autoComplete="email"
                disabled={isLoggingIn}
                className="w-full px-5 py-4 rounded-xl bg-black/50 border border-white/15 text-white font-sans text-sm placeholder:text-white/25 focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all disabled:opacity-50"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2 text-left">
              <label className="font-cinzel text-[10px] tracking-wider uppercase text-white/70">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoggingIn}
                className="w-full px-5 py-4 rounded-xl bg-black/50 border border-white/15 text-white font-mono text-center tracking-[0.3em] text-xl placeholder:text-white/20 focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all disabled:opacity-50"
              />
            </div>

            {/* Error Message */}
            {authError && (
              <p className="text-red-400 text-xs flex items-center gap-1.5 pt-1">
                <AlertCircle size={13} />
                <span>{authError}</span>
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E2C275] to-[#B38728] text-[#1C1917] font-cinzel text-xs tracking-[0.2em] uppercase font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Unlock Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-end text-xs text-white/40">
            <button
              onClick={onBackToHome}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ← Back to Site
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // ── MAIN ADMIN DASHBOARD VIEW ──
  // ═════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0E0D0C] text-white flex flex-col selection:bg-[#E64A6E] selection:text-white">
      {/* ── Hidden File & Folder Inputs ── */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFilesSelected}
        multiple
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFilesSelected}
        multiple
        webkitdirectory=""
        directory=""
        className="hidden"
      />
      <input
        type="file"
        ref={bannerFileInputRef}
        onChange={handleBannerSelected}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={blogCoverInputRef}
        onChange={handleBlogCoverSelected}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={blogContentImgInputRef}
        onChange={handleContentImageSelected}
        accept="image/*"
        className="hidden"
      />

      {/* ── TOP HEADER BAR ── */}
      <header className="sticky top-0 z-40 bg-[#141210]/95 backdrop-blur-md border-b border-white/10 px-5 sm:px-10 h-18 flex items-center justify-between">
        {/* Left Studio Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C5A059] to-[#E64A6E] p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-[#141210] rounded-xl flex items-center justify-center font-cinzel text-xs font-bold text-[#E2C275]">
              FYM
            </div>
          </div>
          <div>
            <h1 className="font-serif-luxury text-xl font-medium text-white leading-tight">
              Frame Your Moments
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-cinzel text-[9px] tracking-wider uppercase text-[#A8A29E]">
                Cloudinary & Supabase Connected
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-cinzel text-[10px] tracking-widest uppercase font-semibold transition-all cursor-pointer"
          >
            <Eye size={13} />
            <span className="hidden sm:inline">View Website</span>
          </button>
          <button
            onClick={handleClearAllCache}
            title="Clear browser cache & reload fresh from Supabase"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-cinzel text-[10px] tracking-widest uppercase transition-all cursor-pointer"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Clear Cache</span>
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-red-500/15 hover:bg-red-500/25 text-red-300 font-cinzel text-[10px] tracking-widest uppercase transition-all cursor-pointer"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </header>

      {/* ── TABS NAVIGATION BAR (Responsive) ── */}
      <div className="bg-[#181614] border-b border-white/10 px-5 sm:px-10 overflow-x-auto scrollbar-none py-2.5">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2 sm:gap-3 min-w-max">
          {[
            { id: 'services', label: 'Service Galleries', icon: Layers },
            { id: 'blogs', label: 'Blogs & Journal', icon: BookOpen },
            { id: 'hero', label: 'Hero Marquee', icon: Camera },
            { id: 'grid', label: 'Grid Showcase', icon: Grid },
            { id: 'about', label: 'About & Story', icon: Sparkles },
            { id: 'reviews', label: 'Reviews & Stories', icon: Star },
            { id: 'videos', label: 'Videos & Reels', icon: Film },
            { id: 'sql', label: 'Supabase SQL', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-cinzel text-[11px] tracking-wider uppercase font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C5A059] to-[#AA771C] text-[#1C1917] border-[#E2C275] shadow-md font-bold'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-5 sm:p-10 space-y-8">
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: SERVICE GALLERIES                                                */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'services' && (() => {
          const activeServiceMeta = SERVICES_META.find((s) => s.slug === activeServiceSlug) || SERVICES_META[0];
          const currentBannerData = serviceBanners[activeServiceSlug];
          const currentBannerUrl = currentBannerData?.url || getServiceBanner(activeServiceSlug);

          return (
          <div className="space-y-8">
            {/* Sub-Service Selector Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                {SERVICES_META.map((s) => {
                  const isSelected = activeServiceSlug === s.slug;
                  return (
                    <button
                      key={s.slug}
                      onClick={() => setActiveServiceSlug(s.slug)}
                      className={`px-4 py-2 rounded-lg font-cinzel text-[10px] sm:text-[11px] tracking-wider uppercase font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-white text-[#1C1917] border-white shadow-sm scale-105'
                          : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {s.title}
                    </button>
                  );
                })}
              </div>

              {/* Quick Preview Link */}
              <button
                onClick={() => onNavigateToService && onNavigateToService(activeServiceSlug)}
                className="inline-flex items-center gap-1.5 text-xs text-[#C5A059] hover:underline font-cinzel tracking-wider uppercase"
              >
                <span>Live Page</span>
                <ExternalLink size={13} />
              </button>
            </div>

            {/* ── 1. HERO BANNER COVER MANAGER CARD ── */}
            <div className="bg-[#141210] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
              {/* Accent Glow */}
              <div
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20"
                style={{ background: activeServiceMeta.accentColor }}
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: activeServiceMeta.accentColor }}
                    />
                    <span className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-[#A8A29E]">
                      Service Hero Banner Cover
                    </span>
                    {currentBannerUrl ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[9px]">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[9px]">
                        Default Gradient
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium">
                    {activeServiceMeta.title} Banner
                  </h3>
                  <p className="font-sans text-xs text-[#A8A29E] mt-1 max-w-xl">
                    Upload a high-resolution widescreen photograph (16:9 / 21:9) for the top hero cover of the <strong className="text-white">{activeServiceMeta.title}</strong> page.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => bannerFileInputRef.current?.click()}
                    disabled={isUploadingBanner}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#AA771C] text-[#1C1917] font-cinzel text-xs tracking-wider uppercase font-bold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <UploadCloud size={16} />
                    <span>{currentBannerUrl ? 'Change Banner' : 'Upload Banner'}</span>
                  </button>

                  {currentBannerUrl && (
                    <button
                      onClick={handleDeleteBanner}
                      disabled={isUploadingBanner}
                      className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/20 text-red-300 font-cinzel text-xs tracking-wider uppercase transition-all cursor-pointer disabled:opacity-50"
                      title="Remove custom banner and use default gradient"
                    >
                      <Trash2 size={15} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Banner Upload Progress */}
              {isUploadingBanner && (
                <div className="space-y-2 pt-2 border-t border-white/10 relative z-10">
                  <div className="flex justify-between text-xs font-mono text-emerald-400">
                    <span>{bannerUploadStatus}</span>
                    <span>{bannerUploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 via-[#C5A059] to-[#E64A6E]"
                      style={{ width: `${bannerUploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* ── Live Banner Preview Mockup ── */}
              {currentBannerUrl ? (
                <div className="relative w-full rounded-xl overflow-hidden border border-white/15 shadow-2xl group">
                  <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] min-h-[220px] max-h-[340px] bg-black overflow-hidden">
                    <img
                      src={currentBannerUrl}
                      alt={activeServiceMeta.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Real cinematic vignette replica */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'radial-gradient(ellipse 70% 75% at 50% 50%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
                    <div
                      className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                      style={{ background: `linear-gradient(to top, ${activeServiceMeta.accentColor}25, transparent)` }}
                    />

                    {/* Mock Title Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
                      <p
                        className="font-cinzel text-[8px] sm:text-[9px] tracking-[0.35em] uppercase mb-1"
                        style={{ color: `${activeServiceMeta.accentColor}ee` }}
                      >
                        Frame Your Moments • Live Hero Banner
                      </p>
                      <h4 className="font-serif-luxury text-2xl sm:text-4xl text-white font-light drop-shadow-lg">
                        {activeServiceMeta.title}
                      </h4>
                      <p
                        className="font-serif-luxury italic text-xs sm:text-base font-light mt-0.5"
                        style={{ color: activeServiceMeta.accentColor }}
                      >
                        {activeServiceMeta.subtitle}
                      </p>
                    </div>

                    {/* Top-Right Badges & Actions */}
                    <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                      {currentBannerData?.isCompressed && (
                        <div className="px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/40 backdrop-blur-md text-[10px] font-mono text-emerald-300 flex items-center gap-1.5 shadow-md">
                          <Zap size={11} className="text-emerald-400" />
                          <span>Compressed ({formatBytes(currentBannerData.compressedSize)})</span>
                        </div>
                      )}
                      <button
                        onClick={() => onNavigateToService && onNavigateToService(activeServiceSlug)}
                        className="px-3 py-1 rounded-md bg-black/60 hover:bg-black/90 border border-white/20 backdrop-blur-md text-[10px] font-cinzel tracking-wider uppercase text-white flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <span>Preview Page</span>
                        <ExternalLink size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => bannerFileInputRef.current?.click()}
                  className="w-full aspect-[21/9] sm:aspect-[24/9] min-h-[180px] max-h-[240px] rounded-xl border-2 border-dashed border-white/15 hover:border-[#C5A059]/60 bg-black/40 hover:bg-black/60 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-[#C5A059]/20 border border-white/10 group-hover:border-[#C5A059]/40 flex items-center justify-center mb-3 transition-all">
                    <Camera size={24} className="text-white/40 group-hover:text-[#C5A059] transition-colors" />
                  </div>
                  <p className="font-serif-luxury text-lg text-white font-medium">
                    No Custom Banner Uploaded
                  </p>
                  <p className="font-sans text-xs text-[#A8A29E] mt-1 max-w-md">
                    Click here to select and upload a cover photo for the <strong className="text-white">{activeServiceMeta.title}</strong> Hero Banner.
                  </p>
                </div>
              )}
            </div>

            {/* ── 2. GALLERY PHOTOS SECTION ── */}
            {/* Uploader Card */}
            <div className="bg-[#141210] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-luxury text-2xl text-white font-medium">
                    Upload Gallery Photos to {activeServiceMeta.title}
                  </h3>
                  <p className="font-sans text-xs text-[#A8A29E] mt-1 flex items-center gap-1.5">
                    <Zap size={14} className="text-emerald-400 shrink-0" />
                    <span>
                      Smart Compressor Active: Photos above 500KB are auto-compressed to WebP before uploading to Cloudinary.
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C5A059] hover:bg-[#E2C275] text-[#1C1917] font-cinzel text-xs tracking-wider uppercase font-bold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <UploadCloud size={16} />
                    <span>Select Files</span>
                  </button>

                  <button
                    onClick={() => folderInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-cinzel text-xs tracking-wider uppercase font-semibold transition-all cursor-pointer disabled:opacity-50"
                    title="Upload entire photo folder"
                  >
                    <ImageIcon size={15} />
                    <span className="hidden sm:inline">Upload Folder</span>
                  </button>
                </div>
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-xs font-mono text-emerald-400">
                    <span>{uploadStatusText}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 via-[#C5A059] to-[#E64A6E]"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Media Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-cinzel text-xs tracking-widest uppercase text-white/60">
                  Total Photos: <strong className="text-white">{serviceGallery.length}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {serviceGallery.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="group relative bg-[#141210] border border-white/10 rounded-xl overflow-hidden shadow-md hover:border-[#C5A059]/40 transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
                      <img
                        src={item.src}
                        alt={item.caption || ''}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteServiceImage(item.id, item.src)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg z-10"
                        title="Delete photo"
                      >
                        <Trash2 size={14} />
                      </button>

                      {/* Compression Badge */}
                      <div className="absolute bottom-2 left-2 right-2 z-10">
                        {item.isCompressed ? (
                          <div className="px-2 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/50 backdrop-blur-md text-[9px] font-mono text-emerald-300 flex items-center justify-between shadow-md">
                            <span className="flex items-center gap-1 font-bold">
                              <Zap size={10} className="text-emerald-400" />
                              <span>Compressed</span>
                            </span>
                            <span>
                              {formatBytes(item.compressedSize)}
                            </span>
                          </div>
                        ) : (
                          <div className="px-2 py-1 rounded-md bg-black/75 border border-white/20 backdrop-blur-md text-[9px] font-mono text-white/70 flex items-center justify-between">
                            <span>Standard</span>
                            <span>{formatBytes(item.compressedSize || item.originalSize)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Caption Tag */}
                    <div className="p-2.5 bg-[#141210]">
                      <p className="text-[11px] font-sans text-white/80 truncate">
                        {item.caption || `Photo #${idx + 1}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          );
        })()}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB: BLOGS & EDITORIAL JOURNAL                                           */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'blogs' && (
          <div className="space-y-8">
            {/* Header & Stats Banner */}
            <div className="bg-[#141210] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#E64A6E]/20 border border-[#E64A6E]/40 text-[#E64A6E] rounded-full font-cinzel text-[10px] tracking-widest uppercase font-bold">
                    Editorial Suite
                  </span>
                  <span className="text-xs text-white/50">• {blogs.length} Articles</span>
                </div>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium">
                  Journal & Wedding Guides
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
                  Write, format with colors and inline images, and publish fine-art wedding stories. Articles sync instantly to your live website.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {onNavigateToBlogs && (
                  <button
                    onClick={() => onNavigateToBlogs()}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-cinzel text-xs tracking-wider uppercase font-semibold transition-all cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>View Live Journal</span>
                  </button>
                )}
                {!isWritingBlog && (
                  <button
                    onClick={handleNewBlogClick}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#E64A6E] via-[#E8557B] to-[#D8335B] text-white font-cinzel text-xs tracking-wider uppercase font-bold shadow-[0_4px_20px_rgba(230,74,110,0.4)] hover:scale-105 transition-all cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Write New Article</span>
                  </button>
                )}
              </div>
            </div>

            {/* ── ARTICLE WRITER & EDITOR FORM ── */}
            {isWritingBlog && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#141210] border border-[#E64A6E]/40 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E64A6E]/20 text-[#E64A6E] flex items-center justify-center font-bold">
                      <Edit3 size={18} />
                    </div>
                    <div>
                      <h4 className="font-serif-luxury text-2xl text-white">
                        {editingBlogId ? 'Edit Wedding Article' : 'Write New Wedding Article'}
                      </h4>
                      <p className="text-xs text-white/50 font-sans">
                        Auto-syncs with Supabase table <code className="text-[#F5D77F]">fym_blogs</code>
                      </p>
                    </div>
                  </div>

                  {/* Mode Switcher */}
                  <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setBlogEditorTab('write')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-cinzel tracking-wider uppercase font-bold transition-all cursor-pointer ${
                        blogEditorTab === 'write' ? 'bg-[#E64A6E] text-white' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      ✍️ Write & Format
                    </button>
                    <button
                      type="button"
                      onClick={() => setBlogEditorTab('preview')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-cinzel tracking-wider uppercase font-bold transition-all cursor-pointer ${
                        blogEditorTab === 'preview' ? 'bg-[#C5A059] text-[#1C1917]' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      👁️ Live Preview
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSaveBlogSubmit} className="space-y-6">
                  {/* Row 1: Title & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="md:col-span-8 space-y-1.5">
                      <label className="text-[11px] font-cinzel uppercase tracking-wider text-white/70 block font-bold">
                        Article Headline / Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={blogForm.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBlogForm((prev) => ({
                            ...prev,
                            title: val,
                            slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                          }));
                        }}
                        placeholder="e.g. The Ultimate Guide to Pre-Wedding Shoots in Royal Rajasthan"
                        className="w-full px-4 py-3.5 rounded-xl bg-black/60 border border-white/15 text-white font-serif-luxury text-lg focus:outline-none focus:border-[#E64A6E] transition-colors"
                      />
                    </div>

                    <div className="md:col-span-4 space-y-1.5">
                      <label className="text-[11px] font-cinzel uppercase tracking-wider text-white/70 block font-bold">
                        Category
                      </label>
                      <select
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-cinzel focus:outline-none focus:border-[#E64A6E] transition-colors"
                      >
                        <option value="Wedding Tips">Wedding Tips</option>
                        <option value="Pre-Wedding">Pre-Wedding</option>
                        <option value="Guides">Guides & Timelines</option>
                        <option value="Destinations">Destination Weddings</option>
                        <option value="Cinematography">Cinematography</option>
                        <option value="Trends">Royal Wedding Trends</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Author, Read Time, Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-cinzel uppercase tracking-wider text-white/70 block">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={blogForm.author}
                        onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                        placeholder="Frame Your Moments Editorial"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-[#E64A6E]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-cinzel uppercase tracking-wider text-white/70 block">
                        Read Time
                      </label>
                      <input
                        type="text"
                        value={blogForm.read_time}
                        onChange={(e) => setBlogForm({ ...blogForm, read_time: e.target.value })}
                        placeholder="5 min read"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-[#E64A6E]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-cinzel uppercase tracking-wider text-white/70 block">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={blogForm.tags}
                        onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                        placeholder="Wedding, Rajasthan, Pre-Wedding"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-[#E64A6E]"
                      />
                    </div>
                  </div>

                  {/* Row 3: Cover Image Card */}
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className="text-xs font-cinzel uppercase tracking-wider text-white font-bold block">
                          Featured Cover Photo (Landscape 16:9)
                        </label>
                        <p className="text-[11px] text-white/50 font-sans">
                          High-resolution cover shown on top of the article and on the blog card.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => blogCoverInputRef.current?.click()}
                          disabled={isUploadingBlogCover}
                          className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#1C1917] font-cinzel text-xs uppercase tracking-wider font-bold hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                        >
                          <UploadCloud size={14} />
                          <span>{isUploadingBlogCover ? 'Uploading...' : 'Upload Cover'}</span>
                        </button>
                      </div>
                    </div>

                    {isUploadingBlogCover && (
                      <div className="space-y-1.5 bg-black/80 p-3 rounded-xl border border-white/15">
                        <div className="flex items-center justify-between text-xs text-[#E2C275] font-cinzel">
                          <span>Compressing & Uploading Cover to Cloudinary...</span>
                          <span>{blogCoverProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#C5A059] to-[#E64A6E]" style={{ width: `${blogCoverProgress}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-8">
                        <input
                          type="text"
                          value={blogForm.cover_image}
                          onChange={(e) => setBlogForm({ ...blogForm, cover_image: e.target.value })}
                          placeholder="Paste image URL or click 'Upload Cover' button above"
                          className="w-full px-4 py-3 rounded-xl bg-black/70 border border-white/15 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                      {blogForm.cover_image && (
                        <div className="md:col-span-4 relative aspect-[16/9] rounded-xl overflow-hidden border border-white/20 shadow-md group">
                          <img src={blogForm.cover_image} alt="Cover Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setBlogForm({ ...blogForm, cover_image: '' })}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Excerpt */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-cinzel uppercase tracking-wider text-white/70 block font-bold">
                      Article Short Excerpt / Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      placeholder="A short, catchy 2-line summary displayed on the card and reader preview..."
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-sans focus:outline-none focus:border-[#E64A6E] leading-relaxed"
                    />
                  </div>

                  {/* Row 5: Rich Content Editor OR Live Preview */}
                  {blogEditorTab === 'write' ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-black/80 border border-white/15 p-2.5 rounded-2xl">
                        {/* Formatting Controls */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => applyTextFormatting('h2')}
                            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-serif-luxury font-bold transition-colors cursor-pointer"
                            title="Heading 2 (Section)"
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            onClick={() => applyTextFormatting('h3')}
                            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-serif-luxury transition-colors cursor-pointer"
                            title="Heading 3 (Subheading)"
                          >
                            H3
                          </button>
                          <button
                            type="button"
                            onClick={() => applyTextFormatting('p')}
                            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-sans transition-colors cursor-pointer"
                            title="Paragraph"
                          >
                            P
                          </button>

                          <div className="w-[1px] h-5 bg-white/20 mx-1" />

                          <button
                            type="button"
                            onClick={() => applyTextFormatting('bold')}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            title="Bold"
                          >
                            <Bold size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => applyTextFormatting('italic')}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            title="Italic"
                          >
                            <Italic size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => applyTextFormatting('underline')}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            title="Underline"
                          >
                            <Underline size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => applyTextFormatting('quote')}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            title="Blockquote"
                          >
                            <Quote size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => applyTextFormatting('list')}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            title="Bullet List"
                          >
                            <List size={14} />
                          </button>

                          <div className="w-[1px] h-5 bg-white/20 mx-1" />

                          {/* Color Palette */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => applyTextFormatting('color', '#C5A059')}
                              className="w-6 h-6 rounded-full bg-[#C5A059] border border-white/30 hover:scale-110 transition-transform cursor-pointer shadow-xs"
                              title="Gold Text"
                            />
                            <button
                              type="button"
                              onClick={() => applyTextFormatting('color', '#E64A6E')}
                              className="w-6 h-6 rounded-full bg-[#E64A6E] border border-white/30 hover:scale-110 transition-transform cursor-pointer shadow-xs"
                              title="Rose Text"
                            />
                            <button
                              type="button"
                              onClick={() => applyTextFormatting('color', '#059669')}
                              className="w-6 h-6 rounded-full bg-emerald-500 border border-white/30 hover:scale-110 transition-transform cursor-pointer shadow-xs"
                              title="Emerald Text"
                            />
                            <button
                              type="button"
                              onClick={() => applyTextFormatting('color', '#FAF7F2')}
                              className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-white/30 hover:scale-110 transition-transform cursor-pointer shadow-xs"
                              title="Cream Text"
                            />
                          </div>
                        </div>

                        {/* Insert Image Button */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => blogContentImgInputRef.current?.click()}
                            disabled={isUploadingContentImg}
                            className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-cinzel tracking-wider uppercase font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <ImageIcon size={13} />
                            <span>{isUploadingContentImg ? 'Uploading...' : 'Insert Photo'}</span>
                          </button>
                        </div>
                      </div>

                      {isUploadingContentImg && (
                        <div className="space-y-1 bg-black/80 p-2.5 rounded-xl border border-white/15">
                          <div className="flex items-center justify-between text-xs text-emerald-400 font-cinzel">
                            <span>Compressing & Inserting photo into content...</span>
                            <span>{contentImgProgress}%</span>
                          </div>
                        </div>
                      )}

                      <textarea
                        ref={contentTextAreaRef}
                        rows={14}
                        required
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                        placeholder="Write your article in HTML / text format. Use toolbar above to add headings, colors, and insert images..."
                        className="w-full p-5 rounded-2xl bg-black/60 border border-white/15 text-stone-200 font-mono text-sm leading-relaxed focus:outline-none focus:border-[#E64A6E] transition-colors"
                      />
                    </div>
                  ) : (
                    /* Live Editorial Preview Mode */
                    <div className="bg-[#FAF7F2] text-[#1C1917] p-8 sm:p-12 rounded-3xl shadow-xl space-y-6 max-h-[600px] overflow-y-auto">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#E64A6E]/15 text-[#E64A6E] font-cinzel text-[10px] tracking-widest uppercase font-bold">
                          {blogForm.category}
                        </span>
                        <span className="text-xs text-stone-500 font-cinzel">{blogForm.read_time}</span>
                      </div>

                      <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917]">
                        {blogForm.title || 'Untitled Wedding Story'}
                      </h2>

                      {blogForm.cover_image && (
                        <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-lg">
                          <img src={blogForm.cover_image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div
                        className="prose prose-stone max-w-none text-base leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: blogForm.content || '<p>No content written yet.</p>' }}
                      />
                    </div>
                  )}

                  {/* Form Action Buttons */}
                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setIsWritingBlog(false);
                        setEditingBlogId(null);
                      }}
                      className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-cinzel text-xs tracking-wider uppercase font-semibold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#E64A6E] via-[#E8557B] to-[#D8335B] text-white font-cinzel text-xs tracking-[0.18em] uppercase font-bold shadow-[0_4px_25px_rgba(230,74,110,0.45)] hover:scale-105 transition-all cursor-pointer"
                    >
                      {editingBlogId ? 'Save & Update Article' : 'Publish Article to Website'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── BLOG CARDS GRID (When not writing) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog.id || blog.slug}
                  className="group bg-[#141210] border border-white/10 hover:border-[#C5A059]/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Cover Thumbnail */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-black">
                      <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85';
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-white font-cinzel text-[9px] tracking-widest uppercase font-bold rounded-full border border-white/20">
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-5 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-cinzel text-white/50">
                        <span>{blog.read_time || '5 min read'}</span>
                        <span className="text-emerald-400">● Published</span>
                      </div>

                      <h4 className="font-serif-luxury text-lg text-white font-medium leading-snug group-hover:text-[#E2C275] transition-colors line-clamp-2">
                        {blog.title}
                      </h4>

                      <p className="text-xs text-white/60 font-sans line-clamp-2 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2 mt-4">
                    <a
                      href={`/#blog-${blog.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-cinzel tracking-wider uppercase text-white/60 hover:text-[#C5A059] transition-colors inline-flex items-center gap-1"
                    >
                      <Eye size={12} />
                      <span>Live View</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditBlog(blog)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-cinzel text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 size={11} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBlog(blog.id, blog.slug)}
                        className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-all cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: HERO MARQUEE PHOTOS                                              */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="bg-[#141210] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-luxury text-2xl text-white font-medium">
                    Hero Section Marquee Photos ({heroPhotos.length})
                  </h3>
                  <p className="font-sans text-xs text-[#A8A29E] mt-1">
                    These photos populate the 3 animated vertical scrolling columns in the Hero section.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleResetHero}
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-cinzel text-xs tracking-wider uppercase font-semibold transition-all cursor-pointer"
                    title="Clean duplicates and reset to 18 default photos"
                  >
                    <RefreshCw size={14} />
                    <span>Reset / Clean (18)</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C5A059] text-[#1C1917] font-cinzel text-xs tracking-wider uppercase font-bold hover:scale-105 transition-all cursor-pointer"
                  >
                    <UploadCloud size={16} />
                    <span>Upload Hero Photo</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {heroPhotos.map((item, idx) => (
                <div key={item.id || idx} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black border border-white/10 group">
                  <img
                    src={item.src || item.url || ''}
                    alt={item.caption || ''}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteHeroPhoto(idx, item)}
                      className="p-2 bg-red-600 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-transform"
                      title="Delete photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: GRID SHOWCASE PHOTOS                                             */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'grid' && (
          <div className="space-y-6">
            <div className="bg-[#141210] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-luxury text-2xl text-white font-medium">
                    Grid Showcase Photos ({gridPhotos.length})
                  </h3>
                  <p className="font-sans text-xs text-[#A8A29E] mt-1">
                    Toggle B&W filter or replace square photos displayed in the fixed 3rd section behind the scroll curtain.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleResetGrid}
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-cinzel text-xs tracking-wider uppercase font-semibold transition-all cursor-pointer"
                    title="Reset to 14 standard photos"
                  >
                    <RefreshCw size={14} />
                    <span>Reset (14)</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C5A059] text-[#1C1917] font-cinzel text-xs tracking-wider uppercase font-bold hover:scale-105 transition-all cursor-pointer"
                  >
                    <UploadCloud size={16} />
                    <span>Upload Grid Photo</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {gridPhotos.map((item, idx) => (
                <div key={item.id || idx} className="relative aspect-square rounded-xl overflow-hidden bg-black border border-white/10 group flex flex-col justify-between">
                  <img
                    src={item.src || item.url || ''}
                    alt={item.caption || ''}
                    className={`w-full h-full object-cover ${item.isBW ? 'filter grayscale contrast-105' : ''}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-white/70">#{idx + 1}</span>
                      <button
                        onClick={() => {
                          const updated = [...gridPhotos];
                          updated[idx].isBW = !updated[idx].isBW;
                          setGridPhotos(updated);
                          saveGridPhotos(updated);
                        }}
                        className="px-2 py-1 bg-white/20 hover:bg-white/30 text-[9px] rounded text-white cursor-pointer font-cinzel"
                      >
                        {item.isBW ? 'Make Color' : 'Make B&W'}
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteGridPhoto(idx, item)}
                      className="self-end p-2 bg-red-600 rounded-full text-white cursor-pointer shadow-lg"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB: ABOUT & STORY PHILOSOPHY                                           */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'about' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-[#141210] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-luxury text-2xl text-white font-medium">
                    About & Story Philosophy Imagery
                  </h3>
                  <p className="font-sans text-xs text-[#A8A29E] mt-1">
                    Manage the iconic Arch Frame portrait, the secondary Detail card, Founder avatar, and Featured Video poster. All uploads are automatically compressed to WebP and synced with Supabase.
                  </p>
                </div>
                {isUploadingAbout && (
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl">
                    <RefreshCw size={14} className="animate-spin text-[#C5A059]" />
                    <span className="font-cinzel text-xs text-[#C5A059]">{aboutUploadStatus} ({aboutUploadProgress}%)</span>
                  </div>
                )}
              </div>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Main Arch Photo */}
              <div className="bg-[#181614] border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-cinzel text-[10px] tracking-widest uppercase text-[#C5A059] font-bold">01 • Arch Portrait</span>
                    {aboutPhotos.about_main ? (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Live</span>
                    ) : (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">Fallback</span>
                    )}
                  </div>
                  <h4 className="font-serif-luxury text-lg text-white font-semibold">Grand Arch Story Photo</h4>
                  <p className="font-sans text-xs text-[#A8A29E] mt-1">The iconic arch frame photograph displayed on the right of the About section.</p>
                </div>

                <div className="relative aspect-[3/4] rounded-t-[70px] rounded-b-xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center">
                  {aboutPhotos.about_main ? (
                    <img src={aboutPhotos.about_main} alt="Arch Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon size={28} className="mx-auto text-white/30 mb-2" />
                      <span className="font-cinzel text-[10px] text-white/40 uppercase">No image uploaded</span>
                    </div>
                  )}
                  {isUploadingAbout === 'about_main' && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-2" />
                      <span className="font-cinzel text-[10px] text-[#C5A059]">{aboutUploadProgress}%</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#C5A059] text-[#1C1917] font-cinzel text-[10px] tracking-wider uppercase font-bold hover:scale-[1.02] transition-all cursor-pointer">
                    <UploadCloud size={13} />
                    <span>Upload Arch</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadAboutPhoto('about_main', file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {aboutPhotos.about_main && (
                    <button
                      onClick={() => handleDeleteAboutPhoto('about_main', 'Arch Portrait')}
                      className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors cursor-pointer"
                      title="Remove custom photo"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Card 2: Secondary Detail / Henna Card */}
              <div className="bg-[#181614] border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-cinzel text-[10px] tracking-widest uppercase text-[#E64A6E] font-bold">02 • Detail Card</span>
                    {aboutPhotos.about_detail ? (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Live</span>
                    ) : (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">Fallback</span>
                    )}
                  </div>
                  <h4 className="font-serif-luxury text-lg text-white font-semibold">Bridal Detail / Henna</h4>
                  <p className="font-sans text-xs text-[#A8A29E] mt-1">Floating overlapping card showing fine jewelry, henna, or detail shots.</p>
                </div>

                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center">
                  {aboutPhotos.about_detail ? (
                    <img src={aboutPhotos.about_detail} alt="Detail Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <Sparkles size={28} className="mx-auto text-white/30 mb-2" />
                      <span className="font-cinzel text-[10px] text-white/40 uppercase">No image uploaded</span>
                    </div>
                  )}
                  {isUploadingAbout === 'about_detail' && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-8 h-8 border-2 border-[#E64A6E] border-t-transparent rounded-full animate-spin mb-2" />
                      <span className="font-cinzel text-[10px] text-[#E64A6E]">{aboutUploadProgress}%</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#E64A6E] to-[#D8335B] text-white font-cinzel text-[10px] tracking-wider uppercase font-bold hover:scale-[1.02] transition-all cursor-pointer">
                    <UploadCloud size={13} />
                    <span>Upload Detail</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadAboutPhoto('about_detail', file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {aboutPhotos.about_detail && (
                    <button
                      onClick={() => handleDeleteAboutPhoto('about_detail', 'Detail Card')}
                      className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors cursor-pointer"
                      title="Remove custom photo"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Card 3: Founder / Lead Artist Avatar */}
              <div className="bg-[#181614] border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-cinzel text-[10px] tracking-widest uppercase text-emerald-400 font-bold">03 • Founder Avatar</span>
                    {aboutPhotos.about_founder ? (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Live</span>
                    ) : (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">Fallback</span>
                    )}
                  </div>
                  <h4 className="font-serif-luxury text-lg text-white font-semibold">Founder Profile Picture</h4>
                  <p className="font-sans text-xs text-[#A8A29E] mt-1">Circular artist avatar beside "Rishav & Team, Founders & Lead Artists".</p>
                </div>

                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center p-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#E64A6E] bg-[#F5EFE6] flex items-center justify-center shadow-lg">
                    {aboutPhotos.about_founder ? (
                      <img src={aboutPhotos.about_founder} alt="Founder Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-serif-luxury text-3xl text-[#E64A6E] font-bold">R</span>
                    )}
                  </div>
                  {isUploadingAbout === 'about_founder' && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
                      <span className="font-cinzel text-[10px] text-emerald-400">{aboutUploadProgress}%</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-cinzel text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer">
                    <UploadCloud size={13} />
                    <span>Upload Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadAboutPhoto('about_founder', file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {aboutPhotos.about_founder && (
                    <button
                      onClick={() => handleDeleteAboutPhoto('about_founder', 'Founder Avatar')}
                      className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors cursor-pointer"
                      title="Remove custom photo"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Card 4: Video Banner Poster */}
              <div className="bg-[#181614] border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-cinzel text-[10px] tracking-widest uppercase text-cyan-400 font-bold">04 • Video Poster</span>
                    {aboutPhotos.video_poster ? (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Live</span>
                    ) : (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">Default</span>
                    )}
                  </div>
                  <h4 className="font-serif-luxury text-lg text-white font-semibold">Cinema Banner Poster</h4>
                  <p className="font-sans text-xs text-[#A8A29E] mt-1">Placeholder poster image for the Featured Wedding Film background.</p>
                </div>

                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center">
                  {aboutPhotos.video_poster ? (
                    <img src={aboutPhotos.video_poster} alt="Video Poster" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <Film size={28} className="mx-auto text-white/30 mb-2" />
                      <span className="font-cinzel text-[10px] text-white/40 uppercase">Default Poster</span>
                    </div>
                  )}
                  {isUploadingAbout === 'video_poster' && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2" />
                      <span className="font-cinzel text-[10px] text-cyan-400">{aboutUploadProgress}%</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-cinzel text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer">
                    <UploadCloud size={13} />
                    <span>Upload Poster</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadAboutPhoto('video_poster', file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {aboutPhotos.video_poster && (
                    <button
                      onClick={() => handleDeleteAboutPhoto('video_poster', 'Video Poster')}
                      className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors cursor-pointer"
                      title="Remove custom photo"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB: REVIEWS & CLIENT TESTIMONIALS                                      */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Header & Add Button */}
            <div className="bg-[#141210] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-luxury text-2xl text-white font-medium">
                    Client Reviews & Love Stories ({testimonials.length})
                  </h3>
                  <p className="font-sans text-xs text-[#A8A29E] mt-1">
                    Add, edit, or remove couple testimonials. Photos are compressed to WebP and saved directly to Supabase (`fym_testimonials`).
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleResetReviews}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-cinzel text-xs tracking-wider uppercase font-semibold transition-all cursor-pointer"
                    title="Reset to default initial reviews"
                  >
                    <RefreshCw size={13} />
                    <span>Reset Defaults</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingReviewId(null);
                      setReviewForm({
                        name: '',
                        location: '',
                        event: 'Destination Wedding',
                        rating: 5,
                        image: '',
                        quote: '',
                        fullStory: ''
                      });
                      setReviewModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#AA771C] text-[#1C1917] font-cinzel text-xs tracking-wider uppercase font-bold hover:scale-105 transition-all shadow-lg cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Add New Review</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Testimonials List / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-[#181614] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#C5A059]/40 transition-all shadow-sm"
                >
                  <div className="space-y-3">
                    {/* Top row: Couple Avatar & Names */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                          <span className="font-serif-luxury text-xl text-[#C5A059] font-bold">
                            {item.name ? item.name.charAt(0) : '✦'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-serif-luxury text-lg text-white font-semibold truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-0.5 text-[#C5A059]">
                            {[...Array(item.rating || 5)].map((_, i) => (
                              <Star key={i} size={11} className="fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="font-sans text-xs text-[#A8A29E] truncate">{item.location || 'India'}</p>
                        <span className="inline-block font-cinzel text-[9px] tracking-wider uppercase text-[#E64A6E] font-semibold mt-0.5">
                          ✦ {item.event || 'Wedding'}
                        </span>
                      </div>
                    </div>

                    {/* Quote */}
                    <p className="font-sans text-xs text-white/80 leading-relaxed italic line-clamp-3 pt-2 border-t border-white/5">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="font-mono text-[10px] text-white/40">#{idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditReview(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-cinzel text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                      >
                        <Edit3 size={11} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteReview(item.id, item.name)}
                        className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add / Edit Review Modal */}
            <AnimatePresence>
              {reviewModalOpen && (
                <div
                  className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                  onClick={() => setReviewModalOpen(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#181614] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl my-8"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <h3 className="font-serif-luxury text-2xl text-white font-semibold">
                          {editingReviewId ? 'Edit Review' : 'Add Client Review'}
                        </h3>
                        <p className="font-sans text-xs text-[#A8A29E]">
                          Client testimonial synced across Supabase & LocalStorage
                        </p>
                      </div>
                      <button
                        onClick={() => setReviewModalOpen(false)}
                        className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveReview} className="space-y-4">
                      {/* Couple Photo Upload with Compressor */}
                      <div>
                        <label className="font-cinzel text-[10px] tracking-widest text-[#C5A059] uppercase block mb-1.5 font-bold">
                          Couple Photo (Auto-compressed to WebP)
                        </label>
                        <div className="flex items-center gap-4 p-3 bg-black/30 rounded-2xl border border-white/10">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center">
                            {reviewForm.image ? (
                              <img src={reviewForm.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <User size={24} className="text-white/30" />
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-cinzel text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer">
                              <UploadCloud size={13} />
                              <span>{isUploadingReviewImg ? 'Compressing & Uploading...' : 'Upload Couple Photo'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploadingReviewImg}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleReviewPhotoSelected(file);
                                  e.target.value = '';
                                }}
                              />
                            </label>
                            {isUploadingReviewImg && (
                              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-[#C5A059] h-full transition-all duration-300" style={{ width: `${reviewImgProgress}%` }} />
                              </div>
                            )}
                            {reviewForm.image && !isUploadingReviewImg && (
                              <p className="text-[10px] text-emerald-400 font-mono truncate">✓ Photo attached</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Row 1: Couple Names & Rating */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="font-cinzel text-[10px] tracking-widest text-white/70 uppercase block mb-1">
                            Couple Names *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Supriya & Rohan"
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C5A059] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-cinzel text-[10px] tracking-widest text-white/70 uppercase block mb-1">
                            Rating
                          </label>
                          <select
                            value={reviewForm.rating}
                            onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#C5A059] focus:outline-none cursor-pointer"
                          >
                            <option value="5">★★★★★ (5.0)</option>
                            <option value="4">★★★★☆ (4.0)</option>
                            <option value="3">★★★☆☆ (3.0)</option>
                          </select>
                        </div>
                      </div>

                      {/* Row 2: Location & Event Type */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-cinzel text-[10px] tracking-widest text-white/70 uppercase block mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Toronto, Canada or Jaipur, India"
                            value={reviewForm.location}
                            onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C5A059] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-cinzel text-[10px] tracking-widest text-white/70 uppercase block mb-1">
                            Event Type
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Destination Wedding, Royal Palace Wedding"
                            value={reviewForm.event}
                            onChange={(e) => setReviewForm({ ...reviewForm, event: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C5A059] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Short Quote */}
                      <div>
                        <label className="font-cinzel text-[10px] tracking-widest text-white/70 uppercase block mb-1">
                          Short Quote (Card Display) *
                        </label>
                        <textarea
                          rows={3}
                          required
                          placeholder="A quick 2-3 sentence quote that appears directly on the card..."
                          value={reviewForm.quote}
                          onChange={(e) => setReviewForm({ ...reviewForm, quote: e.target.value })}
                          className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-sm text-white focus:border-[#C5A059] focus:outline-none leading-relaxed"
                        />
                      </div>

                      {/* Full Story */}
                      <div>
                        <label className="font-cinzel text-[10px] tracking-widest text-white/70 uppercase block mb-1">
                          Full Story (Modal Display)
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Detailed story shown when a visitor clicks 'Read Full Story'..."
                          value={reviewForm.fullStory}
                          onChange={(e) => setReviewForm({ ...reviewForm, fullStory: e.target.value })}
                          className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-sm text-white focus:border-[#C5A059] focus:outline-none leading-relaxed"
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setReviewModalOpen(false)}
                          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-cinzel text-xs tracking-wider uppercase transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#AA771C] text-[#1C1917] font-cinzel text-xs tracking-wider uppercase font-bold hover:scale-105 transition-all shadow-lg cursor-pointer"
                        >
                          {editingReviewId ? 'Update Review' : 'Save Review'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: VIDEOS & REELS MANAGEMENT                                        */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'videos' && (
          <div className="space-y-10">
            {/* Header & Add Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141210] border border-white/10 p-6 sm:p-8 rounded-2xl">
              <div>
                <h3 className="font-serif-luxury text-2xl text-white font-medium">
                  Wedding Films & Quick Reels
                </h3>
                <p className="font-sans text-xs text-[#A8A29E] mt-1">
                  Embed YouTube 4K Cinema Films and Instagram Reels that play directly inside the website!
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setEditingVideoId(null);
                    setFilmForm({
                      title: '',
                      couple: '',
                      category: 'wedding_films',
                      categoryLabel: 'Wedding Film',
                      duration: '4:15',
                      location: 'Kolkata, India',
                      thumbnail: '',
                      videoUrl: '/featured_wedding_film.mp4',
                      youtubeId: '',
                      description: '',
                      featured: false
                    });
                    setVideoFormType('film');
                    setVideoModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#AA771C] text-[#1C1917] font-cinzel text-xs tracking-wider uppercase font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add 4K Film</span>
                </button>

                <button
                  onClick={() => {
                    setEditingVideoId(null);
                    setReelForm({
                      title: '',
                      couple: '',
                      duration: '0:45',
                      views: '120K',
                      thumbnail: '',
                      videoUrl: '/featured_wedding_film.mp4',
                      youtubeId: '',
                      instaCode: '',
                      category: 'Wedding Moments'
                    });
                    setVideoFormType('reel');
                    setVideoModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#E64A6E] to-[#D8335B] text-white font-cinzel text-xs tracking-wider uppercase font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add Reel</span>
                </button>
              </div>
            </div>

            {/* ── Section 1: Wedding Films ── */}
            <div className="space-y-4">
              <h4 className="font-cinzel text-xs tracking-widest uppercase text-[#C5A059] font-bold">
                Wedding Films ({films.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {films.map((film) => (
                  <div
                    key={film.id}
                    className="bg-[#141210] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
                  >
                    <div className="relative aspect-video w-full bg-black overflow-hidden group">
                      <img src={film.thumbnail} alt={film.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                          <Play size={20} className="fill-current ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditFilm(film)}
                          className="p-2 bg-[#C5A059] hover:bg-[#AA771C] text-[#1C1917] rounded-full transition-colors cursor-pointer shadow-md"
                          title="Edit Film"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteFilm(film.id)}
                          className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer shadow-md"
                          title="Delete Film"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-cinzel uppercase text-[#C5A059]">
                        <span>{film.categoryLabel}</span>
                        <span>{film.duration}</span>
                      </div>
                      <h5 className="font-serif-luxury text-lg text-white font-medium leading-snug">
                        {film.title}
                      </h5>
                      <p className="font-sans text-xs text-[#A8A29E] line-clamp-2">
                        {film.description}
                      </p>
                      {film.youtubeId && (
                        <div className="pt-2 text-[10px] font-mono text-emerald-400">
                          YouTube ID: {film.youtubeId}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section 2: Quick Reels ── */}
            <div className="space-y-4">
              <h4 className="font-cinzel text-xs tracking-widest uppercase text-[#E64A6E] font-bold">
                Quick Reels ({reels.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {reels.map((reel) => (
                  <div
                    key={reel.id}
                    className="bg-[#141210] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg group"
                  >
                    <div className="relative aspect-[9/16] w-full bg-black overflow-hidden">
                      <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-3 flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                          <span className="px-2 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white">
                            {reel.views}
                          </span>
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditReel(reel)}
                              className="p-1.5 bg-[#E64A6E] hover:bg-[#c93255] text-white rounded-full transition-colors cursor-pointer shadow-md"
                              title="Edit Reel"
                            >
                              <Edit3 size={11} />
                            </button>
                            <button
                              onClick={() => handleDeleteReel(reel.id)}
                              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors cursor-pointer shadow-md"
                              title="Delete Reel"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-cinzel uppercase text-[#E2C275] block font-bold">
                            {reel.couple}
                          </span>
                          <p className="text-xs font-serif-luxury text-white font-medium leading-snug line-clamp-2">
                            {reel.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 5: SUPABASE SQL MIGRATION SCRIPT                                    */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'sql' && (
          <div className="space-y-6">
            <div className="bg-[#141210] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-luxury text-2xl text-white font-medium">
                    Supabase Database SQL Schema
                  </h3>
                  <p className="font-sans text-xs text-[#A8A29E] mt-1">
                    Copy this SQL and run it in your Supabase SQL Editor to create all 4 media & video tables with public RLS policies.
                  </p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C5A059] text-[#1C1917] font-cinzel text-xs tracking-wider uppercase font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {copiedSql ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                </button>
              </div>

              <pre className="p-5 rounded-xl bg-black/80 border border-white/10 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed scrollbar-thin">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* ADD FILM / REEL MODAL                                                   */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-[#141210] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-serif-luxury text-2xl text-white font-medium">
                    {videoFormType === 'film'
                      ? (editingVideoId ? 'Edit 4K Wedding Film' : 'Add 4K Wedding Film')
                      : (editingVideoId ? 'Edit Quick Reel' : 'Add Quick Reel')}
                  </h3>
                  {editingVideoId && (
                    <span className="text-[10px] text-[#C5A059] font-cinzel uppercase tracking-wider block mt-0.5">
                      ✦ Editing Existing Item
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setEditingVideoId(null);
                    setVideoModalOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Hidden File Input for Thumbnail Upload */}
              <input
                type="file"
                ref={videoThumbInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleThumbnailSelected(e.target.files[0], videoFormType);
                  }
                }}
              />

              {videoFormType === 'film' ? (
                <form onSubmit={handleSaveFilm} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-cinzel uppercase text-white/70">Film Title</label>
                    <input
                      type="text"
                      required
                      value={filmForm.title}
                      onChange={(e) => setFilmForm({ ...filmForm, title: e.target.value })}
                      placeholder="e.g. Rohan & Ananya — Royal Heritage Wedding"
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-cinzel uppercase text-white/70">Couple Names</label>
                      <input
                        type="text"
                        required
                        value={filmForm.couple}
                        onChange={(e) => setFilmForm({ ...filmForm, couple: e.target.value })}
                        placeholder="Rohan & Ananya"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-cinzel uppercase text-white/70">Location</label>
                      <input
                        type="text"
                        value={filmForm.location}
                        onChange={(e) => setFilmForm({ ...filmForm, location: e.target.value })}
                        placeholder="Kolkata, India"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-cinzel uppercase text-white/70">YouTube Video URL / 11-digit ID</label>
                    <input
                      type="text"
                      value={filmForm.youtubeId}
                      onChange={(e) => setFilmForm({ ...filmForm, youtubeId: e.target.value })}
                      placeholder="https://youtu.be/M7lc1UVf-VE or M7lc1UVf-VE"
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  {/* ── Thumbnail Image Upload with Smart Compressor ── */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-cinzel uppercase text-white/70">Thumbnail Poster Image</label>
                      <span className="text-[9px] text-[#C5A059]">Auto-compresses if &gt; 500KB</span>
                    </div>

                    {filmForm.thumbnail ? (
                      <div className="rounded-2xl border border-white/15 bg-black/60 p-3 flex items-center gap-3">
                        <img
                          src={filmForm.thumbnail}
                          alt="Thumbnail"
                          className="w-20 h-14 object-cover rounded-xl border border-white/10 shrink-0"
                          onError={(e) => { e.target.style.opacity = '0.3'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate">{filmForm.thumbnail}</p>
                          <span className="text-[10px] text-emerald-400">✓ Thumbnail Attached</span>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              type="button"
                              onClick={() => videoThumbInputRef.current?.click()}
                              disabled={isUploadingVideoThumb}
                              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-cinzel uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Upload New
                            </button>
                            <button
                              type="button"
                              onClick={() => setFilmForm({ ...filmForm, thumbnail: '' })}
                              className="px-2 py-1 text-red-400 hover:text-red-300 text-[10px] transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => !isUploadingVideoThumb && videoThumbInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                          isUploadingVideoThumb
                            ? 'border-[#C5A059] bg-[#C5A059]/10'
                            : 'border-white/20 hover:border-[#C5A059] hover:bg-white/5'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#C5A059]">
                            <UploadCloud size={20} />
                          </div>
                          <div>
                            <p className="text-white text-xs font-medium">Click to Upload Thumbnail Image</p>
                            <p className="text-[10px] text-white/50 mt-0.5">JPG, PNG, WebP • Auto-compressed</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isUploadingVideoThumb && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] text-white/70">
                          <span className="truncate">{videoThumbStatus || 'Processing...'}</span>
                          <span className="font-mono text-[#C5A059]">{videoThumbProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C5A059] to-[#E64A6E] transition-all duration-300 rounded-full"
                            style={{ width: `${videoThumbProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <input
                      type="text"
                      value={filmForm.thumbnail}
                      onChange={(e) => setFilmForm({ ...filmForm, thumbnail: e.target.value })}
                      placeholder="Or paste direct image URL (optional)"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white/70 text-[11px] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-cinzel uppercase text-white/70">Description</label>
                    <textarea
                      rows={3}
                      value={filmForm.description}
                      onChange={(e) => setFilmForm({ ...filmForm, description: e.target.value })}
                      placeholder="Enter details about rituals, emotion and venue..."
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#C5A059] text-[#1C1917] font-cinzel text-xs tracking-wider uppercase font-bold shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    {editingVideoId ? 'Update Wedding Film' : 'Save Wedding Film'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSaveReel} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-cinzel uppercase text-white/70">Reel Title</label>
                    <input
                      type="text"
                      required
                      value={reelForm.title}
                      onChange={(e) => setReelForm({ ...reelForm, title: e.target.value })}
                      placeholder="e.g. Unscripted Sindoor Daan Emotion ✨"
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-[#E64A6E]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-cinzel uppercase text-white/70">Couple</label>
                      <input
                        type="text"
                        required
                        value={reelForm.couple}
                        onChange={(e) => setReelForm({ ...reelForm, couple: e.target.value })}
                        placeholder="Rohan & Ananya"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-[#E64A6E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-cinzel uppercase text-white/70">Views Tag</label>
                      <input
                        type="text"
                        value={reelForm.views}
                        onChange={(e) => setReelForm({ ...reelForm, views: e.target.value })}
                        placeholder="150K"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-[#E64A6E]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-cinzel uppercase text-white/70">Instagram Reel URL / Code</label>
                    <input
                      type="text"
                      value={reelForm.instaCode}
                      onChange={(e) => setReelForm({ ...reelForm, instaCode: e.target.value })}
                      placeholder="https://www.instagram.com/reel/C8qL.../ or Reel Code"
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-[#E64A6E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-cinzel uppercase text-white/70">OR YouTube Shorts URL / ID</label>
                    <input
                      type="text"
                      value={reelForm.youtubeId}
                      onChange={(e) => setReelForm({ ...reelForm, youtubeId: e.target.value })}
                      placeholder="https://youtube.com/shorts/... or ID"
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-[#E64A6E]"
                    />
                  </div>

                  {/* ── Reel Thumbnail Poster Image with Smart Compressor ── */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-cinzel uppercase text-white/70">Thumbnail Poster Image</label>
                      <span className="text-[9px] text-[#E64A6E]">Auto-compresses if &gt; 500KB</span>
                    </div>

                    {reelForm.thumbnail ? (
                      <div className="rounded-2xl border border-white/15 bg-black/60 p-3 flex items-center gap-3">
                        <img
                          src={reelForm.thumbnail}
                          alt="Reel thumbnail"
                          className="w-14 h-20 object-cover rounded-xl border border-white/10 shrink-0"
                          onError={(e) => { e.target.style.opacity = '0.3'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate">{reelForm.thumbnail}</p>
                          <span className="text-[10px] text-emerald-400">✓ Thumbnail Attached</span>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              type="button"
                              onClick={() => videoThumbInputRef.current?.click()}
                              disabled={isUploadingVideoThumb}
                              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-cinzel uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Upload New
                            </button>
                            <button
                              type="button"
                              onClick={() => setReelForm({ ...reelForm, thumbnail: '' })}
                              className="px-2 py-1 text-red-400 hover:text-red-300 text-[10px] transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => !isUploadingVideoThumb && videoThumbInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                          isUploadingVideoThumb
                            ? 'border-[#E64A6E] bg-[#E64A6E]/10'
                            : 'border-white/20 hover:border-[#E64A6E] hover:bg-white/5'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#E64A6E]">
                            <UploadCloud size={20} />
                          </div>
                          <div>
                            <p className="text-white text-xs font-medium">Click to Upload Reel Poster Image</p>
                            <p className="text-[10px] text-white/50 mt-0.5">JPG, PNG, WebP • Auto-compressed</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isUploadingVideoThumb && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] text-white/70">
                          <span className="truncate">{videoThumbStatus || 'Processing...'}</span>
                          <span className="font-mono text-[#E64A6E]">{videoThumbProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#E64A6E] to-[#D8335B] transition-all duration-300 rounded-full"
                            style={{ width: `${videoThumbProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <input
                      type="text"
                      value={reelForm.thumbnail}
                      onChange={(e) => setReelForm({ ...reelForm, thumbnail: e.target.value })}
                      placeholder="Or paste direct image URL (optional)"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white/70 text-[11px] focus:outline-none focus:border-[#E64A6E]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#E64A6E] text-white font-cinzel text-xs tracking-wider uppercase font-bold shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    {editingVideoId ? 'Update Quick Reel' : 'Save Quick Reel'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
