
import React, { useState } from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full relative px-1">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 rounded-[1.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
        
        <div className="relative flex items-center bg-zinc-950/80 border border-zinc-800/80 rounded-[1.2rem] overflow-hidden shadow-2xl transition-all duration-500 group-focus-within:border-amber-500/40 group-focus-within:bg-black group-focus-within:gold-glow">
          <div className="pl-5 text-zinc-500">
            <Search size={16} className="group-focus-within:text-amber-500 transition-colors" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, country, landmark..."
            className="w-full bg-transparent border-none py-4 px-4 text-sm font-medium focus:ring-0 placeholder:text-zinc-600 text-zinc-200 outline-none"
            disabled={isLoading}
          />
          
          <div className="pr-3">
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className={`px-6 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
                query.trim() && !isLoading
                  ? 'bg-amber-500 text-black hover:bg-amber-400 gold-glow shadow-lg active:scale-95'
                  : 'bg-zinc-900 text-zinc-600'
              }`}
            >
              {isLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Sparkles size={12} />
                </motion.div>
              ) : (
                "LOCATE"
              )}
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-5 flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-1 px-1">
        {['Dubai, UAE', 'Paris, France', 'Tokyo, Japan', 'New York', 'Sydney'].map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => { setQuery(loc); onSearch(loc); }}
            className="flex-none flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-900 bg-zinc-950/40 text-[8px] font-bold text-zinc-500 uppercase tracking-widest hover:border-amber-500/30 hover:text-zinc-200 transition-all active:scale-95"
          >
            <MapPin size={9} className="text-amber-500/40" />
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationSearch;
