'use client';

import { motion } from 'framer-motion';

const cities = [
  'Vancouver', 'Calgary', 'Edmonton', 'Saskatoon', 'Winnipeg',
  'Toronto', 'Ottawa', 'Montreal', 'Halifax', 'Victoria',
  'Kelowna', 'Lethbridge', 'Red Deer', 'London ON', 'Hamilton',
];

export default function HeroCityTicker() {
  const doubled = [...cities, ...cities];

  return (
    <div className="w-full overflow-hidden bg-[var(--bg-card-neutral)] border-t border-[var(--border-strong)] py-3">
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((city, i) => (
          <span key={i} className="flex items-center">
            <span className="text-sm text-[var(--text-secondary)] font-medium tracking-wider uppercase px-4">
              {city}
            </span>
            <span aria-hidden="true" style={{ color: 'var(--accent-text-lg)', fontSize: '0.5rem', lineHeight: 1 }}>·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
