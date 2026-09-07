import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Camera, X, Heart, Eye, ArrowRight } from 'lucide-react';

const categories = [
  { id: 'all', label: 'ALL STORIES' },
  { id: 'weddings', label: 'ROYAL WEDDINGS' },
  { id: 'prewedding', label: 'CINEMATIC PRE-WEDDINGS' },
  { id: 'bridal', label: 'FINE ART BRIDAL' },
  { id: 'reception', label: 'RECEPTION & GLAMOUR' }
];

const portfolioItems = [
  {
    id: 1,
    category: 'weddings',
    title: 'The Royal Heritage Saga',
    couple: 'Dev & Ananya',
    location: 'City Palace, Udaipur',
    image: '',
    year: '2026',
    lens: '85mm f/1.2 Fine Art Lens',
    story: 'Captured amidst evening oil lamps and centuries-old marble courtyards as Dev led Ananya down the royal grand steps.'
  },
  {
    id: 2,
    category: 'prewedding',
    title: 'Sunset Whispers by the Arabian Sea',
    couple: 'Rohan & Simran',
    location: 'Goa Beaches',
    image: '',
    year: '2025',
    lens: '35mm Cinematic Prime',
    story: 'The golden sunset reflected off the sea waves while the crimson dupatta caught the soft ocean breeze.'
  },
  {
    id: 3,
    category: 'reception',
    title: 'Midnight Chandeliers & First Dance',
    couple: 'Vikram & Meera',
    location: 'The Leela Palace, New Delhi',
    image: '',
    year: '2026',
    lens: '50mm f/1.4 Portrait Lens',
    story: 'Under glowing crystal chandeliers, Vikram twirled Meera as cold pyros sparked to life during their first dance.'
  },
  {
    id: 4,
    category: 'bridal',
    title: 'The Crimson Heritage Bride',
    couple: 'Aditi Sharma',
    location: 'Amer Fort, Jaipur',
    image: '',
    year: '2026',
    lens: '105mm Macro Fine Art',
    story: 'Intricate gold maang-tikka and royal velvet lehenga rendered in dramatic warm chiaroscuro lighting.'
  },
  {
    id: 5,
    category: 'weddings',
    title: 'Laughter Under Floral Canopies',
    couple: 'Karan & Rhea',
    location: 'Jodhpur Heritage Lawn',
    image: '',
    year: '2025',
    lens: '50mm f/1.2 Lens',
    story: 'Unfiltered joy during the Anand Karaj ceremony surrounded by marigold garlands and family smiles.'
  },
  {
    id: 6,
    category: 'bridal',
    title: 'The Emerald Regal Portrait',
    couple: 'Nisha Kapoor',
    location: 'Taj Falaknuma Palace',
    image: '',
    year: '2026',
    lens: '85mm Portrait Prime',
    story: 'Moody teal backdrop featuring handcrafted emerald polki jewelry and hand-painted velvet dupatta.'
  }
];

const stats = [
  { value: '500+', label: 'Royal Weddings' },
  { value: '14+', label: 'Global Destinations' },
  { value: '12+', label: 'National Awards' },
  { value: '100%', label: 'Soulful Emotions' }
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = activeCategory === 'all'
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <section id="portfolio" className="relative w-full bg-[#FAF7F2] py-20 px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto space-y-16">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#E8DFD1] pb-12">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EFE6] border border-[#C5A059]/40 text-[#C5A059] font-cinzel text-[10px] tracking-[0.25em] uppercase font-semibold">
              <Sparkles size={12} /> CURATED GALLERY
            </span>
            <h2 className="font-serif-luxury text-4xl sm:text-6xl font-light text-[#1C1917] leading-tight">
              Featured Stories & Fine Art Gallery
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#57534E] leading-relaxed">
              Every photograph is a hand-crafted heirloom. Explore our royal wedding sagas, cinematic pre-wedding films, and fine art portraits.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 pt-4 lg:pt-0">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-1">
                <span className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] font-normal block">
                  {stat.value}
                </span>
                <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#8A7968] block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Category Filter Tabs ── */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-cinzel text-[11px] tracking-[0.2em] uppercase font-bold transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#1C1917] text-[#FAF7F2] shadow-md scale-105'
                  : 'bg-[#F5EFE6] text-[#57534E] hover:bg-[#E8DFD1] hover:text-[#1C1917]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Masonry Grid Layout ── */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                onClick={() => setSelectedItem(item)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-[#E8DFD1] shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                {/* Image Container with Zoom Effect */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F5EFE6]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#E8DFD1] to-[#D4C4A8] flex items-center justify-center">
                      <Camera size={32} className="text-[#8A7968]/40" />
                    </div>
                  )}
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                  {/* Location Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[10px] font-cinzel tracking-widest text-[#1C1917] font-semibold">
                      <MapPin size={11} className="text-[#E64A6E]" />
                      {item.location}
                    </span>
                  </div>

                  {/* Quick Inspect Icon */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1C1917] shadow-md">
                      <Eye size={16} />
                    </div>
                  </div>

                  {/* Card Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="font-cinzel text-[9px] tracking-[0.25em] uppercase text-amber-200 block">
                      {item.couple} • {item.year}
                    </span>
                    <h3 className="font-serif-luxury text-2xl font-light leading-snug group-hover:text-amber-100 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between pt-2 text-[10px] font-cinzel tracking-widest text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>VIEW FULL STORY</span>
                      <ArrowRight size={14} className="text-[#E64A6E]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── Story Lightbox Modal ── */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#FAF7F2] text-[#1C1917] max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] relative"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-[#E8DFD1] flex items-center justify-center text-[#1C1917] hover:bg-[#E64A6E] hover:text-white transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>

                {/* Left Photo View */}
                <div className="md:w-1/2 relative bg-black aspect-[3/4] md:aspect-auto flex items-center justify-center">
                  {selectedItem.image ? (
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1612] to-[#0A0A0A] flex items-center justify-center">
                      <Camera size={48} className="text-white/10" />
                    </div>
                  )}
                </div>

                {/* Right Story Breakdown */}
                <div className="md:w-1/2 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto space-y-6">
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFE6] border border-[#C5A059]/40 text-[#C5A059] font-cinzel text-[10px] tracking-[0.25em] uppercase font-semibold">
                      <Camera size={12} /> {selectedItem.couple} SAGA
                    </span>

                    <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] leading-tight font-light">
                      {selectedItem.title}
                    </h3>

                    <div className="space-y-2 text-xs font-cinzel text-[#8A7968] border-y border-[#E8DFD1] py-4">
                      <div className="flex justify-between">
                        <span className="uppercase tracking-widest">Venue & Location:</span>
                        <span className="font-bold text-[#1C1917]">{selectedItem.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="uppercase tracking-widest">Equipment / Lens:</span>
                        <span className="font-bold text-[#1C1917]">{selectedItem.lens}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="uppercase tracking-widest">Year Captured:</span>
                        <span className="font-bold text-[#1C1917]">{selectedItem.year}</span>
                      </div>
                    </div>

                    <p className="font-sans text-sm text-[#57534E] leading-relaxed italic">
                      "{selectedItem.story}"
                    </p>
                  </div>

                  {/* Modal CTA */}
                  <div className="pt-4 border-t border-[#E8DFD1]">
                    <a
                      href="#contact"
                      onClick={() => setSelectedItem(null)}
                      className="w-full py-3.5 bg-gradient-to-r from-[#E64A6E] via-[#E8557B] to-[#D8335B] text-white font-cinzel text-xs tracking-[0.2em] uppercase font-bold rounded-full text-center block shadow-md hover:shadow-xl transition-all"
                    >
                      Book A Similar Wedding Story
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
