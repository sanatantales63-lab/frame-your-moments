import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  User,
  Camera,
  Film,
  Award,
  Clock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  PenTool
} from 'lucide-react';
import confetti from 'canvas-confetti';

const REAL_PACKAGES = [
  {
    group: '👑 Both Side Wedding Packages',
    options: [
      'Both Side Standard — ₹75,000 (Most Popular)',
      'Both Side Basic — ₹65,000',
      'Both Side Elite (Royal Grandeur) — ₹1,20,000'
    ]
  },
  {
    group: '💍 Single Side Wedding (Bride / Groom)',
    options: [
      'Single Side Basic (3-Day) — ₹55,000',
      'Single Side Standard (2-Day) — ₹45,000',
      'Single Side Basic (2-Day) — ₹40,000'
    ]
  },
  {
    group: '🎬 Pre-Wedding & Engagement',
    options: [
      'Cinematic Pre-Wedding Shoot — ₹30,000',
      'Engagement Day Package — ₹25,000'
    ]
  },
  {
    group: '✨ Custom & Destinations',
    options: [
      'Custom Destination Wedding (India / Abroad)',
      'General Muhurat Date Check & Consultation'
    ]
  }
];

const LOCATIONS = [
  'Kolkata & West Bengal',
  'Rajasthan (Jaipur / Udaipur / Jodhpur)',
  'Goa / Beach Destinations',
  'Delhi NCR / North India',
  'Dubai / UAE / International Destination',
  'Other City / State'
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventDate: '',
    packageChoice: 'Both Side Standard — ₹75,000 (Most Popular)',
    location: 'Kolkata & West Bengal',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill in your name and WhatsApp contact number.');
      return;
    }

    setLoading(true);

    // Royal Confetti celebration effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#C5A059', '#E64A6E', '#FCF6BA', '#AA771C', '#25D366']
      });
    } catch {
      // ignore
    }

    const waText = 
`👑 *NEW WEDDING INQUIRY - FRAME YOUR MOMENTS* 👑

👤 *Client / Couple:* ${formData.name}
📞 *WhatsApp:* ${formData.phone}
📅 *Wedding / Event Date:* ${formData.eventDate || 'To be decided'}
📦 *Selected Package:* ${formData.packageChoice}
📍 *Event City / Venue:* ${formData.location}
💬 *Note / Vision:* ${formData.message || 'Standard Inquiry'}

_Submitted via official studio website (frameyourmoments.in)_`;

    const waUrl = `https://wa.me/918013346138?text=${encodeURIComponent(waText)}`;

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      window.open(waUrl, '_blank');
    }, 500);
  };

  return (
    <section id="contact" className="relative w-full pt-10 sm:pt-14 pb-20 sm:pb-24 bg-[#FAF7F2] overflow-hidden border-t border-[#E8DFD1]/60 scroll-mt-10">
      
      {/* ── Ambient Background Lighting ── */}
      <div className="absolute top-0 right-10 w-[600px] h-[600px] bg-[#C5A059]/[0.06] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[550px] h-[550px] bg-[#E64A6E]/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* ── Subtle Background Watermark Text ── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-serif-luxury text-[6.5rem] sm:text-[11rem] lg:text-[15rem] font-bold tracking-widest uppercase watermark-text-stroke whitespace-nowrap opacity-40">
          RESERVATION
        </span>
      </div>

      <div className="max-w-[1300px] mx-auto px-5 sm:px-10 lg:px-12 relative z-10">

        {/* ═══ SECTION HEADER ═══ */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          
          {/* Royal Gold Line & Diamond Accent */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-4 flex items-center justify-center gap-3"
          >
            <div className="w-16 sm:w-28 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-[#C5A059]" />
            <div className="flex items-center gap-2 text-[#C5A059]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/60" />
              <div className="w-3.5 h-3.5 rotate-45 border border-[#C5A059] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#C5A059]" />
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/60" />
            </div>
            <div className="w-16 sm:w-28 h-[1px] bg-gradient-to-l from-transparent via-[#C5A059]/40 to-[#C5A059]" />
          </motion.div>

          {/* Availability Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E8DFD1] shadow-xs mb-3"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-bold text-[#8A7968]">
              2026 – 2027 Wedding Season Dates Open
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl italic text-[#1C1917] font-light mb-3"
          >
            Let’s Frame Your Forever
          </motion.h2>

          <p className="font-sans text-[#57534E] max-w-xl text-xs sm:text-sm leading-relaxed">
            Reserve your muhurat dates with Lead Artist Rishav. Fill in your details below for instant WhatsApp package discussion.
          </p>
        </div>

        {/* ═══ TWO-COLUMN INQUIRY SUITE ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ──── LEFT: Clean & Quick WhatsApp Form (7 Cols) ──── */}
          <motion.div
            initial={{ opacity: 0, y: 35, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-9 border border-[#E8DFD1] shadow-[0_16px_50px_rgba(28,25,23,0.06)] relative overflow-hidden"
          >
            {/* Top Gold Accent Ribbon */}
            <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-[#E64A6E] via-[#C5A059] to-[#E64A6E]" />

            {/* Form Header with Artisanal Seal */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8DFD1]/70">
              <div>
                <span className="font-cinzel text-[10px] tracking-[0.22em] uppercase font-bold text-[#C5A059] block mb-0.5">
                  Direct Studio Inquiry
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#1C1917] font-medium leading-tight">
                  Check Muhurat & Date Availability
                </h3>
              </div>

              {/* Bespoke Photography Insignia Seal (NO cheap AI icon) */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/40 shadow-xs shrink-0">
                <Camera size={15} className="text-[#C5A059]" />
                <span className="font-cinzel text-[9px] tracking-wider uppercase font-bold text-[#1C1917]">
                  Studio FYM
                </span>
              </div>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="space-y-4 sm:space-y-5">
              
              {/* Row 1: Couple / Client Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 font-cinzel text-[10px] tracking-wider uppercase font-bold text-[#57534E] mb-1.5">
                    <User size={12} className="text-[#C5A059]" />
                    <span>Your Name / Couple *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rohan & Priya"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-2 focus:ring-[#C5A059]/15 transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 font-cinzel text-[10px] tracking-wider uppercase font-bold text-[#57534E] mb-1.5">
                    <Phone size={12} className="text-[#25D366]" />
                    <span>WhatsApp Number *</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-2 focus:ring-[#C5A059]/15 transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Wedding Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 font-cinzel text-[10px] tracking-wider uppercase font-bold text-[#57534E] mb-1.5">
                    <Calendar size={12} className="text-[#C5A059]" />
                    <span>Wedding / Event Date</span>
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-2 focus:ring-[#C5A059]/15 transition-all cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 font-cinzel text-[10px] tracking-wider uppercase font-bold text-[#57534E] mb-1.5">
                    <MapPin size={12} className="text-[#E64A6E]" />
                    <span>Event Location / City</span>
                  </label>
                  <div className="relative">
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-2 focus:ring-[#C5A059]/15 transition-all appearance-none cursor-pointer"
                    >
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7968] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 3: Real Package Dropdown from Pricing Section */}
              <div>
                <label className="flex items-center justify-between font-cinzel text-[10px] tracking-wider uppercase font-bold text-[#57534E] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Award size={12} className="text-[#C5A059]" />
                    <span>Interested Package</span>
                  </span>
                  <a href="#pricing" className="text-[9px] text-[#C5A059] hover:underline font-sans normal-case">
                    View Package Details ↗
                  </a>
                </label>
                <div className="relative">
                  <select
                    name="packageChoice"
                    value={formData.packageChoice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-2 focus:ring-[#C5A059]/15 transition-all appearance-none cursor-pointer font-medium"
                  >
                    {REAL_PACKAGES.map((grp) => (
                      <optgroup key={grp.group} label={grp.group} className="font-bold text-[#1C1917] bg-white">
                        {grp.options.map((opt) => (
                          <option key={opt} value={opt} className="font-normal text-[#57534E]">
                            {opt}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7968] pointer-events-none" />
                </div>
              </div>

              {/* Row 4: Short Optional Message */}
              <div>
                <label className="flex items-center gap-1.5 font-cinzel text-[10px] tracking-wider uppercase font-bold text-[#57534E] mb-1.5">
                  <PenTool size={12} className="text-[#C5A059]" />
                  <span>Tell Us About Your Celebration (Optional)</span>
                </label>
                <input
                  type="text"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="e.g. 2 days wedding at Vedic Village with 400 guests..."
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-2 focus:ring-[#C5A059]/15 transition-all"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden py-4 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] via-[#1EB85A] to-[#128C7E] text-white font-cinzel text-xs sm:text-sm tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(37,211,102,0.35)] hover:shadow-[0_14px_40px_rgba(37,211,102,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-75 pt-3.5"
              >
                <div className="absolute inset-0 shine-sweep pointer-events-none opacity-40" />

                <MessageCircle size={19} className="relative z-10 shrink-0" />
                <span className="relative z-10">
                  {loading ? 'Opening WhatsApp Concierge...' : 'Send Inquiry via WhatsApp (+91 80133 46138)'}
                </span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-6 pt-1 text-center text-[11px] font-sans text-[#8A7968]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-[#C5A059]" />
                  <span>100% Confidential</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-[#C5A059]" />
                  <span>Quick Reply within 1 Hour</span>
                </div>
              </div>
            </form>

            {/* Success Notification Alert */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-xs font-sans shadow-xs"
                >
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block text-emerald-950">Inquiry Launched!</span>
                    Connecting you directly with Lead Artist Rishav on WhatsApp.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

          {/* ──── RIGHT: Studio Concierge & 3-Step Process (5 Cols) ──── */}
          <motion.div
            initial={{ opacity: 0, y: 35, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-5"
          >
            
            {/* ── Studio Concierge Card ── */}
            <div className="bg-gradient-to-br from-[#1C1917] via-[#2A2421] to-[#141210] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#C5A059]/15 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                <span className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-[#C5A059] font-bold">
                  Studio Concierge
                </span>
              </div>
              
              <h4 className="font-serif-luxury text-xl sm:text-2xl font-light mb-5 text-[#FAF7F2]">
                Prefer a Direct Call or Studio Visit?
              </h4>

              <div className="space-y-3">
                {/* Phone / WhatsApp */}
                <a
                  href="https://wa.me/918013346138?text=Hello%20Frame%20Your%20Moments%20Team!%20I%20would%20like%20to%20discuss%20our%20wedding%20coverage."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#C5A059]/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#FCF6BA] group-hover:scale-110 transition-transform shrink-0">
                    <Phone size={17} />
                  </div>
                  <div>
                    <span className="font-cinzel text-[9px] tracking-wider uppercase text-[#B0A898] block">Call / WhatsApp</span>
                    <span className="font-sans text-sm font-semibold text-white group-hover:text-[#C5A059] transition-colors">+91 80133 46138</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:hello@frameyourmoments.in"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#C5A059]/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E64A6E]/20 border border-[#E64A6E]/40 flex items-center justify-center text-[#FFA0B8] group-hover:scale-110 transition-transform shrink-0">
                    <Mail size={17} />
                  </div>
                  <div>
                    <span className="font-cinzel text-[9px] tracking-wider uppercase text-[#B0A898] block">Studio Email</span>
                    <span className="font-sans text-xs sm:text-sm font-semibold text-white group-hover:text-[#E64A6E] transition-colors">hello@frameyourmoments.in</span>
                  </div>
                </a>

                {/* Studio Location */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#C5A059] shrink-0 mt-0.5">
                    <MapPin size={17} />
                  </div>
                  <div>
                    <span className="font-cinzel text-[9px] tracking-wider uppercase text-[#B0A898] block">Head Studio</span>
                    <span className="font-sans text-xs sm:text-sm text-[#E8DFD1] leading-relaxed block">
                      Kolkata, West Bengal, India<br />
                      <span className="text-[#C5A059]/90 text-[11px]">Available across India & Worldwide</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 3-Step Simple Booking Journey ── */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DFD1] shadow-sm space-y-3">
              <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase font-bold text-[#8A7968] block">
                The FYM Process
              </span>
              <h4 className="font-serif-luxury text-lg sm:text-xl text-[#1C1917] font-medium">
                3 Steps to Lock Your Dates
              </h4>

              <div className="space-y-2.5 pt-1">
                {[
                  {
                    step: '01',
                    title: 'Date Check & WhatsApp Chat',
                    desc: 'We verify muhurat availability and discuss your vision.'
                  },
                  {
                    step: '02',
                    title: 'Package Customization',
                    desc: 'Choose your desired photo, video, album & drone deliverables.'
                  },
                  {
                    step: '03',
                    title: 'Agreement & Date Lock',
                    desc: 'Official booking confirmation for your wedding celebrations.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1]/70">
                    <span className="font-cinzel text-[11px] font-bold text-[#C5A059] bg-white px-2 py-0.5 rounded-md border border-[#E8DFD1] shadow-2xs shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h5 className="font-sans text-xs font-bold text-[#1C1917]">{item.title}</h5>
                      <p className="font-sans text-[11px] text-[#57534E] leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
