
import React from 'react';
import { motion } from 'framer-motion';

interface MapProps {
  selectedLocation: { lat: number, lng: number } | null;
}

const InteractiveMap: React.FC<MapProps> = ({ selectedLocation }) => {
  return (
    <div className="relative w-full aspect-[2/1] bg-black rounded-3xl overflow-hidden border border-zinc-900 gold-glow group shadow-2xl">
      {/* Premium Tech Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      {/* Schematic World View */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.svg 
          viewBox="0 0 1000 500" 
          className="w-full h-full opacity-30"
          animate={selectedLocation ? {
             scale: 1.5,
             x: ((-selectedLocation.lng / 180) * 500),
             y: ((selectedLocation.lat / 90) * 250)
          } : { scale: 1, x: 0, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 40 }}
        >
           {/* Continent Contours with detailed schematic lines */}
           <g fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="0.8">
             {/* North America */}
             <path d="M150,100 L250,80 L320,150 L280,300 L200,320 L150,250 Z" />
             {/* South America */}
             <path d="M280,320 L350,350 L320,450 L280,480 L250,420 Z" />
             {/* Eurasia & Africa */}
             <path d="M450,100 L700,80 L850,150 L880,300 L750,450 L600,480 L500,350 L450,300 Z" />
             {/* Australia */}
             <path d="M780,350 L850,380 L820,450 L750,420 Z" />
           </g>

           {/* Latitude / Longitude Matrix */}
           <g stroke="rgba(212, 175, 55, 0.03)" strokeWidth="0.5">
             {Array.from({length: 20}).map((_, i) => (
               <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
             ))}
             {Array.from({length: 10}).map((_, i) => (
               <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} />
             ))}
           </g>
        </motion.svg>
      </div>

      {/* Target Reticle - Fixed center, map moves behind it */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-16 border border-dashed border-amber-500/20 rounded-full"
          />
          <div className="w-8 h-8 flex items-center justify-center">
            <div className="w-0.5 h-full bg-amber-500/30 absolute"></div>
            <div className="h-0.5 w-full bg-amber-500/30 absolute"></div>
            <div className="w-4 h-4 rounded-full border border-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
          </div>
        </div>
      </div>

      {/* Floating Status UI */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
        <div className="text-[8px] font-bold text-amber-500/50 uppercase tracking-[0.4em]">Satellite Lock</div>
        <div className="h-1 w-24 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            className="h-full w-1/2 bg-amber-500/50"
          />
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 text-[8px] font-mono text-zinc-500">
          SCAN_COORD: {selectedLocation ? `${selectedLocation.lat.toFixed(4)}N ${selectedLocation.lng.toFixed(4)}E` : "WAITING_FOR_INPUT..."}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
