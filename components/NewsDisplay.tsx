
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsItem } from '../types';
// Added missing Cpu icon import
import { Sparkles, MapPin, Calendar, ScrollText, Stars, Info, Cpu } from 'lucide-react';

interface NewsDisplayProps {
  news: NewsItem[];
  isLoading: boolean;
  error: string | null;
  selectedYear: number;
}

const NewsCard = ({ item }: { item: NewsItem }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative group bg-zinc-950/40 glass border border-zinc-900 p-6 rounded-[1.5rem] overflow-hidden transition-all duration-500"
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none rounded-bl-[100%]"></div>
    
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
      <span className="inline-block self-start text-[8px] font-bold text-amber-500 uppercase tracking-[0.3em] px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
        {item.category}
      </span>
      <div className="flex gap-3 text-zinc-500 text-[8px] font-bold uppercase tracking-widest">
        <span className="flex items-center gap-1"><MapPin size={9}/> {item.location}</span>
        <span className="flex items-center gap-1"><Calendar size={9}/> {item.year}</span>
      </div>
    </div>
    
    <h3 className="text-lg sm:text-xl font-serif font-bold mb-3 text-zinc-100 leading-tight">
      {item.title}
    </h3>
    
    <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed font-light italic">
      "{item.summary}"
    </p>
    
    <div className="pt-5 border-t border-zinc-900/40">
      <div className="flex items-center gap-2 mb-3 text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
        <Info size={10} className="text-amber-500/50" />
        AI Information Source
      </div>
      <div className="flex flex-wrap gap-2">
        {item.sources.map((source, idx) => (
          <div 
            key={idx}
            className="px-3 py-1.5 bg-zinc-900/60 rounded-full text-[8px] font-bold text-zinc-500 border border-zinc-800"
          >
            Ref: {source.publisher}
          </div>
        ))}
      </div>
      <p className="mt-3 text-[7px] text-zinc-700 italic">
        * Information synthesized from verified historical contexts. Direct links disabled for integrity.
      </p>
    </div>
  </motion.div>
);

const SkeletonCard = () => (
  <div className="bg-zinc-950/30 border border-zinc-900 p-6 rounded-[1.5rem] animate-pulse">
    <div className="h-2 w-16 bg-zinc-900 rounded-full mb-6"></div>
    <div className="h-5 w-3/4 bg-zinc-900 rounded mb-3"></div>
    <div className="h-2 w-full bg-zinc-900 rounded mb-1"></div>
    <div className="h-2 w-2/3 bg-zinc-900 rounded mb-8"></div>
    <div className="flex gap-2">
      <div className="h-6 w-16 bg-zinc-900 rounded-full"></div>
    </div>
  </div>
);

const NewsDisplay: React.FC<NewsDisplayProps> = ({ news, isLoading, error, selectedYear }) => {
  const currentYear = new Date().getFullYear();
  const isFuture = selectedYear > currentYear;

  return (
    <div className="w-full space-y-5 px-1">
      <AnimatePresence mode="wait">
        {isFuture ? (
          <motion.div key="future" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center border border-dashed border-amber-900/10 rounded-[2rem] bg-zinc-950/20">
            <Stars className="text-amber-500/40 mx-auto mb-4" size={20} />
            <p className="text-zinc-500 font-serif italic text-base leading-relaxed">
              "The year {selectedYear} remains uncharted in our neural archives."
            </p>
          </motion.div>
        ) : isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
             <div className="flex flex-col items-center py-10 gap-4">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                 <Sparkles size={20} className="text-amber-500/60" />
               </motion.div>
               <span className="text-amber-500/30 text-[8px] font-bold uppercase tracking-[0.5em]">Scanning Historical Threads...</span>
             </div>
            <SkeletonCard />
            <SkeletonCard />
          </motion.div>
        ) : error ? (
          <motion.div key="error" className="p-8 text-center border border-amber-900/10 bg-amber-950/5 rounded-[1.5rem]">
            <p className="text-zinc-500 text-xs italic">{error}</p>
          </motion.div>
        ) : news.length > 0 ? (
          <motion.div key="results" className="space-y-6">
            {news.map((item) => <NewsCard key={item.id} item={item} />)}
            <div className="pt-6 text-center border-t border-zinc-900/30">
               <p className="text-[7px] text-zinc-800 uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-2">
                 <Cpu size={10} /> Neural Synthesis Engine
               </p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" className="p-12 text-center">
            <ScrollText className="text-zinc-900 mx-auto mb-4" size={24} />
            <p className="text-zinc-700 font-serif italic text-base">
              "No positive dispatches found for this era."
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsDisplay;
