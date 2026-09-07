import React, { useState, useRef, useEffect } from 'react';

/* ─── SVG Icons (original brand colours) ─── */
const InstagramIcon = ({ size = 26 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-grad1" cx="19%" cy="99%" r="128%">
        <stop offset="0%"  stopColor="#fdf497"/>
        <stop offset="5%"  stopColor="#fdf497"/>
        <stop offset="45%" stopColor="#fd5949"/>
        <stop offset="60%" stopColor="#d6249f"/>
        <stop offset="90%" stopColor="#285AEB"/>
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#ig-grad1)"/>
    <circle cx="24" cy="24" r="10" stroke="white" strokeWidth="3.2" fill="none"/>
    <circle cx="35.2" cy="12.8" r="2.6" fill="white"/>
  </svg>
);

const WhatsAppIcon = ({ size = 26 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="44" height="44" rx="12" fill="#25D366"/>
    <path
      d="M24 10c-7.73 0-14 6.27-14 14 0 2.53.67 4.9 1.84 6.95L10 38l7.3-1.81A13.93 13.93 0 0024 38c7.73 0 14-6.27 14-14S31.73 10 24 10zm6.88 19.23c-.28.78-1.64 1.5-2.26 1.56-.56.06-1.29.08-2.08-.13-.48-.13-1.1-.3-1.89-.64-3.33-1.44-5.5-4.83-5.67-5.06-.17-.23-1.37-1.82-1.37-3.47s.87-2.46 1.18-2.8c.31-.33.67-.42.9-.42.22 0 .45.01.64.02.21 0 .49-.08.77.59l1.07 2.63c.09.21.05.46-.1.66l-.5.66-.54.61c.26.42 1.04 1.56 2.04 2.37 1.29 1.05 2.38 1.38 2.72 1.53.34.15.54.13.74-.08l.93-1.05c.19-.22.48-.28.76-.17l2.46.97c.29.11.48.17.55.27.07.1.07.57-.2 1.35z"
      fill="white"
    />
  </svg>
);

const PhoneIcon = ({ size = 26 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="44" height="44" rx="12" fill="#E64A6E"/>
    <path
      d="M32.5 29.9l-3.2-.37a2.02 2.02 0 00-1.65.57l-2.32 2.32a15.25 15.25 0 01-6.73-6.73l2.34-2.34c.44-.44.64-1.06.56-1.65l-.37-3.18A2.008 2.008 0 0019.14 17h-2.96C14.99 17 14 17.99 14.13 19.17 15.16 27.57 20.43 32.82 28.82 33.87 30 34 31 33.01 31 31.82v-2.96c.01-1.03-.77-1.9-1.5-1.96z"
      fill="white"
    />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ─── Rotating trigger icons list ─── */
const triggerIcons = [
  <InstagramIcon key="ig" size={26} />,
  <WhatsAppIcon  key="wa" size={26} />,
  <PhoneIcon     key="ph" size={26} />,
];

const options = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/frameyourmoments_official/',
    icon: <InstagramIcon size={22} />,
    color: '#d6249f',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/919876543210',
    icon: <WhatsAppIcon size={22} />,
    color: '#25D366',
  },
  {
    label: 'Call Us',
    href: 'tel:+919876543210',
    icon: <PhoneIcon size={22} />,
    color: '#E64A6E',
  },
];

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [activeIcon, setActiveIcon] = useState(0);
  const [iconVisible, setIconVisible] = useState(true);
  const isTouchDevice = useRef(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  /* detect touch once */
  useEffect(() => {
    isTouchDevice.current =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  /* ── rotate trigger icons every 3s when menu is closed ── */
  useEffect(() => {
    if (open) return; // pause while menu is open
    intervalRef.current = setInterval(() => {
      // fade out
      setIconVisible(false);
      setTimeout(() => {
        setActiveIcon((prev) => (prev + 1) % triggerIcons.length);
        setIconVisible(true); // fade in
      }, 300);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [open]);

  /* close when clicking outside on touch devices */
  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handle);
    return () => document.removeEventListener('pointerdown', handle);
  }, [open]);

  /* ── desktop: hover handlers ── */
  const handleMouseEnter = () => {
    if (!isTouchDevice.current) setOpen(true);
  };
  const handleMouseLeave = () => {
    if (!isTouchDevice.current) setOpen(false);
  };

  /* ── toggle on click (both desktop & touch) ── */
  const handleButtonClick = () => {
    setOpen((v) => !v);
  };

  return (
    <>
      {/* ── Backdrop blur overlay ── */}
      <div
        className={`fab-backdrop ${open ? 'fab-backdrop--open' : ''}`}
        onClick={() => setOpen(false)}
        style={
          open
            ? {
                backdropFilter: 'blur(18px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
              }
            : undefined
        }
        aria-hidden="true"
      />

      {/* ── FAB container ── */}
      <div
        ref={containerRef}
        className="fab-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Option pills */}
        <div className={`fab-menu ${open ? 'fab-menu--open' : ''}`}>
          {options.map((opt, i) => (
            <a
              key={opt.label}
              href={opt.href}
              target={opt.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="fab-option"
              style={{ '--delay': `${i * 0.06}s`, '--accent': opt.color }}
              onClick={() => setOpen(false)}
            >
              <span className="fab-option__icon">{opt.icon}</span>
              <span className="fab-option__label">{opt.label}</span>
            </a>
          ))}
        </div>

        {/* Main trigger button */}
        <button
          className={`fab-trigger ${open ? 'fab-trigger--open' : ''}`}
          onClick={handleButtonClick}
          aria-label={open ? 'Close contact menu' : 'Open contact menu'}
          aria-expanded={open}
        >
          {open ? (
            /* X close icon when menu is open */
            <span className="fab-trigger__icon fab-trigger__icon--rotated">
              <CloseIcon />
            </span>
          ) : (
            /* Rotating social icons when menu is closed */
            <span
              className="fab-trigger__icon"
              style={{ opacity: iconVisible ? 1 : 0, transition: 'opacity 0.3s ease' }}
            >
              {triggerIcons[activeIcon]}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
