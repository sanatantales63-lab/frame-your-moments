import React from 'react';
import { motion } from 'framer-motion';

/**
 * Luxury Scroll Reveal Wrapper
 * - Uses fine-art Apple/Editorial cubic bezier easing
 * - Ultra-smooth opacity, subtle blur lift, and vertical rise
 * - Fully customizable and modular
 */
export default function ScrollReveal({
  children,
  delay = 0,
  y = 40,
  blur = true,
  scale = 0.98,
  duration = 0.85,
  className = '',
  viewportMargin = '-70px'
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: y,
        scale: scale,
        filter: blur ? 'blur(8px)' : 'none'
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)'
      }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container for child elements
 */
export function ScrollRevealStagger({
  children,
  stagger = 0.12,
  delay = 0,
  className = ''
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual item inside a ScrollRevealStagger container
 */
export function ScrollRevealItem({
  children,
  y = 30,
  blur = true,
  className = ''
}) {
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: y,
      filter: blur ? 'blur(6px)' : 'none'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
