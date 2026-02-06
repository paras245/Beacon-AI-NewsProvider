
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, LocationState, NewsItem } from './types';
import { fetchGoodNews, resolveLocation } from './services/geminiService';
import InteractiveMap from './components/InteractiveMap';
import YearSelector from './components/YearSelector';
import NewsDisplay from './components/NewsDisplay';
import LocationSearch from './components/LocationSearch';
import { Map, Clock, ArrowRight, ChevronLeft, Globe, Sparkles, MapPin, Search, Mail, Phone, Linkedin, Github, Compass, Waves, Cpu } from 'lucide-react';

const BeaconIcon = () => (
  <motion.div 
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="relative w-16 h-16 flex items-center justify-center"
  >
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 border border-amber-500/20 rounded-full"
    />
    <div className="relative bg-black rounded-full p-3 border border-amber-500/60 gold-glow">
      <Compass size={24} className="text-amber-500" />
    </div>
  </motion.div>
);

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [selectedLocation, setSelectedLocation] = useState<LocationState | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResolvingLocation, setIsResolvingLocation] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsResolvingLocation(true);
    setError(null);
    try {
        const resolved = await resolveLocation(query);
        setSelectedLocation(resolved);
    } catch (e: any) {
        setError(e.message || "Archive could not locate this place.");
    } finally {
        setIsResolvingLocation(false);
    }
  };

  const performQuery = useCallback(async () => {
    if (!selectedLocation) return;
    
    const currentYear = new Date().getFullYear();
    if (selectedYear > currentYear) {
      setNews([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setNews([]);
    try {
      const results = await fetchGoodNews(selectedLocation.name, selectedYear);
      setNews(results);
    } catch (err: any) {
      setError(err.message || "Archive retrieval failed.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocation, selectedYear]);

  useEffect(() => {
    if (selectedLocation && appState === AppState.EXPLORING) {
      performQuery();
    }
  }, [selectedLocation, selectedYear, appState, performQuery]);

  return (
    <div className={`min-h-screen relative flex flex-col bg-black text-zinc-200 transition-all duration-1000 ${appState === AppState.LANDING ? 'bg-burj' : ''}`}>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-amber-950/10 rounded-full blur-[160px] opacity-30"></div>
        <div className="absolute bottom-[-5%] left-[-10%] w-[60%] h-[60%] bg-zinc-900/30 rounded-full blur-[140px] opacity-20"></div>
      </div>

      <AnimatePresence mode="wait">
        {appState === AppState.LANDING ? (
          <motion.main 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
            className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 max-w-4xl mx-auto"
          >
            <BeaconIcon />
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-10 space-y-6"
            >
              <div>
                <h1 className="text-7xl md:text-9xl font-serif font-bold tracking-tighter leading-none">
                  <span className="gold-gradient italic block">Beacon</span>
                </h1>
                <span className="text-zinc-500 text-[11px] md:text-xs uppercase tracking-[0.6em] font-bold block mt-8 mb-2">
                  Synthetic Intelligence Archive
                </span>
              </div>
              
              <div className="max-w-lg mx-auto py-10">
                <p className="text-zinc-400 text-base md:text-xl font-light italic leading-relaxed border-l border-amber-500/30 pl-8 text-left">
                  "Powered by Gemini AI, Beacon recreates the global landscape of hope. Every dispatch is a synthetic recovery of verified positive history."
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center gap-10 w-full"
            >
              <button
                onClick={() => setAppState(AppState.EXPLORING)}
                className="group relative px-12 py-5 bg-transparent text-amber-500 border border-amber-500/40 rounded-full overflow-hidden transition-all duration-700 hover:border-amber-300 hover:text-white"
              >
                <span className="relative z-10 flex items-center gap-4 font-bold uppercase tracking-[0.3em] text-[11px]">
                  Begin Exploration <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              </button>

              <div className="flex gap-10 items-center justify-center opacity-40">
                  <div className="flex flex-col items-center gap-2">
                    <Cpu size={16} className="text-amber-500" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Neural Logic</span>
                  </div>
                  <div className="w-px h-6 bg-zinc-800"></div>
                  <div className="flex flex-col items-center gap-2">
                    <Globe size={16} className="text-amber-500" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Global Data</span>
                  </div>
                  <div className="w-px h-6 bg-zinc-800"></div>
                  <div className="flex flex-col items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Hope Curated</span>
                  </div>
              </div>
            </motion.div>
          </motion.main>
        ) : (
          <motion.div 
            key="exploring"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6"
          >
            <header className="flex items-center justify-between py-2 border-b border-zinc-900 sticky top-0 z-50 bg-black/80 backdrop-blur-lg -mx-4 px-4">
              <button 
                onClick={() => setAppState(AppState.LANDING)}
                className="p-2 hover:bg-zinc-900 rounded-xl text-zinc-500 hover:text-amber-500 transition-all flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest"
              >
                <ChevronLeft size={14} /> Exit
              </button>
              <h2 className="text-lg font-serif font-bold gold-gradient italic">Beacon</h2>
              <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-amber-500 bg-zinc-950">
                <Compass size={14} />
              </div>
            </header>

            <div className="space-y-6">
              <section className="space-y-4">
                <LocationSearch onSearch={handleSearch} isLoading={isResolvingLocation} />
              </section>

              <section className="space-y-4">
                <InteractiveMap selectedLocation={selectedLocation} />
                {selectedLocation && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-zinc-950/80 glass rounded-2xl flex items-center justify-between border border-amber-500/10">
                    <div className="flex items-center gap-3">
                      <MapPin size={14} className="text-amber-500" />
                      <div>
                        <p className="text-[7px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Target Region</p>
                        <p className="text-sm font-bold text-zinc-100 font-serif italic">{selectedLocation.name}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </section>

              <section className="sticky top-12 z-40 bg-black/90 backdrop-blur-xl -mx-4 px-4 py-4 border-y border-zinc-900/50">
                <YearSelector selectedYear={selectedYear} onYearChange={setSelectedYear} />
              </section>

              <section className="pb-10">
                <NewsDisplay news={news} isLoading={isLoading} error={error} selectedYear={selectedYear} />
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Attribution Footer */}
      <footer className="mt-auto py-8 text-center border-t border-zinc-900/40 px-6 max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-zinc-600">Architect:</span>
            <span className="text-xs font-serif italic font-bold text-amber-500">Paras Panchal</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:+971502877414" className="p-2 bg-zinc-950 rounded-lg border border-zinc-900 hover:border-amber-500/30 transition-all">
               <Phone size={12} className="text-amber-500/60" />
            </a>
            <a href="mailto:paraspanchal5555@gmail.com" className="p-2 bg-zinc-950 rounded-lg border border-zinc-900 hover:border-amber-500/30 transition-all">
               <Mail size={12} className="text-amber-500/60" />
            </a>
            <a href="https://www.linkedin.com/in/paras-panchal-718679223/" target="_blank" className="p-2 bg-zinc-950 rounded-lg border border-zinc-900 hover:border-amber-500/30 transition-all">
               <Linkedin size={12} className="text-amber-500/60" />
            </a>
            <a href="https://github.com/paras245" target="_blank" className="p-2 bg-zinc-950 rounded-lg border border-zinc-900 hover:border-amber-500/30 transition-all">
               <Github size={12} className="text-amber-500/60" />
            </a>
            <a href="https://paras-panchal.netlify.app/" target="_blank" className="p-2 bg-zinc-950 rounded-lg border border-amber-500/20 hover:border-amber-500/40 transition-all">
               <Globe size={12} className="text-amber-500/60" />
            </a>
          </div>

          <p className="text-[7px] font-bold tracking-[0.5em] uppercase text-zinc-800">
            MMXXV • DUBAI • AI GENERATED HISTORY
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
