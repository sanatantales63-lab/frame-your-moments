/**
 * High-performance, zero-lag smooth scroll engine.
 * - Instant velocity on frame 0 (Zero holding / delay)
 * - Adaptive duration with luxury easeOutCubic deceleration
 * - Automatically bypasses browser CSS scroll-behavior queue stalls
 */

let currentAnimationId = null;

export function smoothScrollTo(targetPosition, duration = 480, offset = -60) {
  // Cancel previous animation immediately if user clicks again
  if (currentAnimationId) {
    cancelAnimationFrame(currentAnimationId);
    currentAnimationId = null;
  }

  let targetY = 0;
  if (typeof targetPosition === 'number') {
    targetY = targetPosition;
  } else if (typeof targetPosition === 'string') {
    try {
      const el = document.querySelector(targetPosition);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      targetY = window.pageYOffset + rect.top + offset;
    } catch {
      return;
    }
  } else if (targetPosition instanceof HTMLElement) {
    const rect = targetPosition.getBoundingClientRect();
    targetY = window.pageYOffset + rect.top + offset;
  }

  targetY = Math.max(0, targetY);
  const startY = window.pageYOffset;
  const distance = targetY - startY;

  if (Math.abs(distance) < 2) return;

  // Snappy adaptive duration (max 520ms) so even full-page jumps feel instant
  const calculatedDuration = Math.min(520, Math.max(340, Math.abs(distance) * 0.07));
  const startTime = performance.now();

  // Instant response easeOutCubic: starts at full speed on frame 0 with ZERO pause/hold
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // Disable native CSS smooth-scroll queue delay
  document.documentElement.style.scrollBehavior = 'auto';

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / calculatedDuration, 1);
    const easedProgress = easeOutCubic(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      currentAnimationId = requestAnimationFrame(step);
    } else {
      currentAnimationId = null;
      window.scrollTo(0, targetY);
    }
  }

  currentAnimationId = requestAnimationFrame(step);
}

/**
 * Initializes smooth anchor link interception for all internal `#` links
 */
export function initSmoothAnchors() {
  const handleClick = (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;

    try {
      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        smoothScrollTo(targetEl);
      }
    } catch {
      // ignore
    }
  };

  document.addEventListener('click', handleClick, { passive: false });
  return () => document.removeEventListener('click', handleClick);
}
