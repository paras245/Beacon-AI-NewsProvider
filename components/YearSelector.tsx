
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ selectedYear, onYearChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();
  // Extending to 2030 to showcase "future" logic
  const years = Array.from({ length: 2031 - 1950 + 1 }, (_, i) => 1950 + i).reverse();

  useEffect(() => {
    const element = document.getElementById(`year-${selectedYear}`);
    if (element && scrollRef.current) {
        element.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }, [selectedYear]);

  return (
    <div className="w-full py-8 relative">
      <div className="flex items-end justify-between mb-4 border-b border-zinc-900 pb-2">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Temporal Window</span>
        <span className="text-3xl font-serif font-bold gold-gradient italic">{selectedYear}</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-2 py-6 no-scrollbar mask-fade-edges snap-x scroll-smooth items-center"
      >
        {years.map((year) => (
          <motion.button
            key={year}
            id={`year-${year}`}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onYearChange(year)}
            className={`flex-none min-w-[80px] py-4 rounded-xl text-sm font-bold transition-all snap-center border ${
              selectedYear === year 
                ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.2)] scale-110' 
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700'
            } ${year > currentYear ? 'opacity-60' : ''}`}
          >
            {year}
          </motion.button>
        ))}
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-fade-edges {
          mask-image: linear-gradient(to right, transparent, black 25%, black 75%, transparent);
        }
      `}</style>
    </div>
  );
};

export default YearSelector;
