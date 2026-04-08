"use client";

import React from 'react';
import { EngravingDesign } from '@/types/engraving';
import { cn } from '@/lib/utils';

interface SignCanvasProps {
  design: EngravingDesign;
  id?: string;
}

const SignCanvas = ({ design, id }: SignCanvasProps) => {
  // Calculate aspect ratio for the preview
  const aspectRatio = design.width / design.height;
  
  return (
    <div 
      id={id}
      className="relative overflow-hidden rounded-sm shadow-2xl border-4 border-[#2a1a0a] transition-all duration-500"
      style={{
        aspectRatio: `${aspectRatio}`,
        width: '100%',
        maxWidth: '800px',
        background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=2070&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Wood Grain Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
      
      {/* Engraving Effect Container */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Main Text */}
          <h2 
            style={{ 
              fontFamily: design.fontFamily, 
              fontSize: `${design.fontSize}px`,
              color: 'rgba(0, 0, 0, 0.7)',
              textShadow: '1px 1px 1px rgba(255,255,255,0.1), -1px -1px 1px rgba(0,0,0,0.5)',
              filter: 'blur(0.5px)'
            }}
            className="text-center leading-tight select-none"
          >
            {design.text || "Your Text Here"}
          </h2>

          {/* Decorations */}
          {design.decorations.map((dec) => (
            <div 
              key={dec.id}
              className="absolute text-black/60"
              style={{
                left: `${dec.position.x}%`,
                top: `${dec.position.y}%`,
                transform: `translate(-50%, -50%) scale(${dec.scale})`,
                filter: 'blur(0.3px)'
              }}
            >
              <span className="text-4xl">{dec.content}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Measurement Labels */}
      <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-[10px] text-amber-200/70 font-mono">
        {design.width}" x {design.height}"
      </div>
    </div>
  );
};

export default SignCanvas;