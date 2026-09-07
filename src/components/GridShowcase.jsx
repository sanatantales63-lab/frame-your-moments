import React, { useState, useEffect } from 'react';
import { getGridPhotos } from '../data/siteMediaData';

// ── Placeholder dark cell shown when no image is uploaded yet ──
function EmptyCell({ className = '' }) {
  return (
    <div className={`w-full h-full bg-[#111] flex items-center justify-center ${className}`}>
      <span className="text-white/10 text-xs font-mono">no image</span>
    </div>
  );
}

export default function GridShowcase() {
  const [gridConfig, setGridConfig] = useState([]);

  useEffect(() => {
    getGridPhotos().then((photos) => {
      setGridConfig(Array.isArray(photos) ? photos : []);
    });
  }, []);

  const getItem = (index) => gridConfig[index] || null;
  const getSrc = (index) => {
    const item = getItem(index);
    return item ? (item.src || item.url || '') : '';
  };
  const getIsBW = (index) => getItem(index)?.isBW || false;

  return (
    <>
      {/* 
        FIXED GRID LAYER — position:fixed z-1 pinned behind everything.
        As the user scrolls, the upper and lower cream sections slide over this grid.
      */}
      <div className="fixed inset-0 z-[1] w-full h-screen bg-[#0A0A0A]">
        
        {/* Full Viewport 5-column x 3-row Grid (Exact Drishtikon Layout) */}
        <div className="w-full h-full grid grid-cols-3 sm:grid-cols-5 grid-rows-3 gap-[2px] bg-[#0A0A0A]">

          {/* ── Row 1: 5 Items (Color, B&W, Color, B&W, Color) ── */}
          {[0, 1, 2, 3, 4].map((idx, i) => (
            <div key={`r1-${i}`} className="relative overflow-hidden w-full h-full bg-[#111]">
              {getSrc(idx) ? (
                <img
                  src={getSrc(idx)}
                  alt=""
                  className={`w-full h-full object-cover ${getIsBW(idx) ? 'filter grayscale contrast-105' : ''}`}
                  draggable={false}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : <EmptyCell />}
            </div>
          ))}

          {/* ── Row 2: B&W, Color, [CENTER LOGO ONLY], Color, B&W ── */}
          <div className="relative overflow-hidden w-full h-full bg-[#111]">
            {getSrc(5) ? (
              <img
                src={getSrc(5)}
                alt=""
                className={`w-full h-full object-cover ${getIsBW(5) ? 'filter grayscale contrast-105' : ''}`}
                draggable={false}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : <EmptyCell />}
          </div>

          <div className="relative overflow-hidden w-full h-full bg-[#111]">
            {getSrc(6) ? (
              <img
                src={getSrc(6)}
                alt=""
                className={`w-full h-full object-cover ${getIsBW(6) ? 'filter grayscale contrast-105' : ''}`}
                draggable={false}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : <EmptyCell />}
          </div>

          {/* 🌟 CENTER LOGO CELL — ONLY LOGO (NO TEXT) & LARGER SIZE 🌟 */}
          <div className="relative w-full h-full bg-[#0A0A0A] flex items-center justify-center p-3 sm:p-6">
            <img
              src="/logo.png"
              alt="Frame Your Moments"
              className="w-28 sm:w-44 lg:w-52 h-auto max-h-[75%] object-contain filter drop-shadow-[0_4px_20px_rgba(197,160,89,0.35)]"
              draggable={false}
            />
          </div>

          <div className="relative overflow-hidden w-full h-full bg-[#111]">
            {getSrc(7) ? (
              <img
                src={getSrc(7)}
                alt=""
                className={`w-full h-full object-cover ${getIsBW(7) ? 'filter grayscale contrast-105' : ''}`}
                draggable={false}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : <EmptyCell />}
          </div>

          <div className="relative overflow-hidden w-full h-full bg-[#111]">
            {getSrc(8) ? (
              <img
                src={getSrc(8)}
                alt=""
                className={`w-full h-full object-cover ${getIsBW(8) ? 'filter grayscale contrast-105' : ''}`}
                draggable={false}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : <EmptyCell />}
          </div>

          {/* ── Row 3: 5 Items (Color, B&W, Color, B&W, Color) ── */}
          {[9, 10, 11, 12, 13].map((idx, i) => (
            <div key={`r3-${i}`} className="relative overflow-hidden w-full h-full bg-[#111]">
              {getSrc(idx) ? (
                <img
                  src={getSrc(idx)}
                  alt=""
                  className={`w-full h-full object-cover ${getIsBW(idx) ? 'filter grayscale contrast-105' : ''}`}
                  draggable={false}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : <EmptyCell />}
            </div>
          ))}

        </div>
      </div>

      {/* 
        SPACER DIV — Creates 100vh scroll window where fixed grid is revealed
      */}
      <div id="grid-showcase-spacer" className="relative z-0 h-screen w-full" aria-hidden="true" />
      <div id="portfolio" className="absolute" style={{ transform: 'translateY(-100vh)' }} aria-hidden="true" />
    </>
  );
}
