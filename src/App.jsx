import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import GridShowcase from './components/GridShowcase';
import Services from './components/Services';
import FeaturedVideoBanner from './components/FeaturedVideoBanner';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import VideosPage from './components/VideosPage';
import ServicePage from './components/ServicePage';
import BlogsPage from './components/BlogsPage';
import AdminPanel from './components/AdminPanel';
import FloatingContact from './components/FloatingContact';
import { initSmoothAnchors } from './utils/smoothScroll';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'videos' | 'service' | 'admin' | 'blogs'
  const [activeServiceSlug, setActiveServiceSlug] = useState(null);
  const [activeBlogSlug, setActiveBlogSlug] = useState(null);

  useEffect(() => {
    // Check initial hash route
    const hash = window.location.hash;
    if (hash === '#admin' || window.location.pathname === '/admin') {
      setCurrentView('admin');
    } else if (hash === '#videos' || window.location.pathname === '/videos') {
      setCurrentView('videos');
    } else if (hash === '#blogs') {
      setCurrentView('blogs');
      setActiveBlogSlug(null);
    } else if (hash.startsWith('#blog-')) {
      const slug = hash.replace('#blog-', '');
      setActiveBlogSlug(slug);
      setCurrentView('blogs');
    } else if (hash.startsWith('#service-')) {
      const slug = hash.replace('#service-', '');
      setActiveServiceSlug(slug);
      setCurrentView('service');
    }

    const handleHashChange = () => {
      const h = window.location.hash;
      if (h === '#admin') {
        setCurrentView('admin');
        window.scrollTo(0, 0);
      } else if (h === '#videos') {
        setCurrentView('videos');
        window.scrollTo(0, 0);
      } else if (h === '#blogs') {
        setCurrentView('blogs');
        setActiveBlogSlug(null);
        window.scrollTo(0, 0);
      } else if (h.startsWith('#blog-')) {
        const slug = h.replace('#blog-', '');
        setActiveBlogSlug(slug);
        setCurrentView('blogs');
        window.scrollTo(0, 0);
      } else if (h.startsWith('#service-')) {
        // Browser back/forward on service pages
        const slug = h.replace('#service-', '');
        setActiveServiceSlug(slug);
        setCurrentView('service');
        window.scrollTo(0, 0);
      } else if (h === '' || h === '#home') {
        setCurrentView('home');
        setActiveServiceSlug(null);
        setActiveBlogSlug(null);
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    const cleanup = initSmoothAnchors();
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      cleanup();
    };
  }, []);

  const navigateToAdmin = () => {
    setCurrentView('admin');
    window.location.hash = 'admin';
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateToVideos = () => {
    setCurrentView('videos');
    window.location.hash = 'videos';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToBlogs = (slug = null) => {
    setActiveBlogSlug(slug);
    setCurrentView('blogs');
    window.location.hash = slug ? `blog-${slug}` : 'blogs';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentView('home');
    setActiveServiceSlug(null);
    setActiveBlogSlug(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToService = (slug) => {
    setActiveServiceSlug(slug);
    setCurrentView('service');
    // Push a proper hash so browser back button works correctly
    window.location.hash = `service-${slug}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] font-sans relative selection:bg-[#E64A6E] selection:text-white">
      {/* Loader */}
      <AnimatePresence mode="wait">
        {loading && (
          <Loader key="loader" onFinishLoading={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main Content with View Switching */}
      {!loading && (
        <AnimatePresence mode="wait">
          {currentView === 'admin' ? (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel
                onBackToHome={navigateToHome}
                onNavigateToVideos={navigateToVideos}
                onNavigateToService={navigateToService}
                onNavigateToBlogs={navigateToBlogs}
              />
            </motion.div>
          ) : currentView === 'videos' ? (
            <motion.div
              key="videos-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <VideosPage onBackToHome={navigateToHome} />
            </motion.div>
          ) : currentView === 'blogs' ? (
            <motion.div
              key="blogs-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <BlogsPage
                onBackToHome={navigateToHome}
                onNavigateToVideos={navigateToVideos}
                initialBlogSlug={activeBlogSlug}
              />
            </motion.div>
          ) : currentView === 'service' ? (
            <motion.div
              key={`service-${activeServiceSlug}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <ServicePage
                slug={activeServiceSlug}
                onBackToHome={navigateToHome}
                onNavigateToVideos={navigateToVideos}
              />
            </motion.div>
          ) : (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Navbar — always on top */}
              <Navbar
                onNavigateToVideos={navigateToVideos}
                onNavigateToAdmin={navigateToAdmin}
                onNavigateToBlogs={navigateToBlogs}
              />

              {/* ═══ SECTIONS ABOVE THE GRID ═══
                  These have z-10 + cream bg so they scroll OVER the fixed grid */}
              <div className="relative z-10 bg-[#FAF7F2]">
                <Hero />
                <About />
              </div>

              {/* ═══ FIXED GRID SHOWCASE (Drishtikon 3rd Section) ═══
                  The component renders:
                  1. A position:fixed z-1 grid layer (always behind)
                  2. A transparent spacer div (creates the "reveal window")
                  The grid becomes visible when the above cream sections 
                  scroll past, and gets covered when below sections arrive. */}
              <GridShowcase />

              {/* ═══ SECTIONS BELOW THE GRID ═══
                  These have z-10 + cream bg so they scroll OVER the fixed grid */}
              <div className="relative z-10 bg-[#FAF7F2]">
                <Services onNavigateToService={navigateToService} />

                {/* ═══ FEATURED CINEMA VIDEO BANNER (Drishtikon Inspired) ═══ */}
                <FeaturedVideoBanner onNavigateToVideos={navigateToVideos} />

                <Pricing />
                <Testimonials />
                <Contact />

                {/* ═══ LUXURY FOOTER COMPONENT ═══ */}
                <Footer
                  onNavigateToVideos={navigateToVideos}
                  onNavigateToAdmin={navigateToAdmin}
                  onNavigateToBlogs={navigateToBlogs}
                />
              </div>

              {/* ═══ FLOATING CONTACT BUTTON (piixonova-style) ═══ */}
              <FloatingContact />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

