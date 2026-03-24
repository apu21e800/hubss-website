'use client';

import { motion } from 'framer-motion';

const cities = [
  'Vancouver', 'Calgary', 'Edmonton', 'Saskatoon', 'Winnipeg',
  'Toronto', 'Ottawa', 'Montreal', 'Halifax', 'Victoria',
  'Kelowna', 'Lethbridge', 'Red Deer', 'London ON', 'Hamilton',
];

export default function HeroCityTicker() {
  return (
    <div className="w-full overflow-hidden bg-zinc-900 border-t border-zinc-800 py-3">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {[...cities, ...cities].map((city, i) => (
          <span key={i} className="text-sm text-zinc-500 font-medium tracking-wider uppercase">
            {city}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
