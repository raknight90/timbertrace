"use client";

import React from 'react';
import { EngravingDesign, WoodMaterial } from '@/types/engraving';

const MATERIAL_TEXTURES: Record<WoodMaterial, string> = {
  walnut: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=2070&auto=format&fit=crop",
  oak: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop",
  cherry: "https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?q=80&w=1935&auto=format&fit=crop",
  pine: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=2070&auto=format&fit=crop"
};

interface SignCanvasProps {
  design: EngravingDesign;
  id?: string;
}

const SignCanvas = ({ design, id }: SignCanvasProps) => {
  const aspectRatio = design.width / design.height;
  
  return (
    <div 
      id={id}
      className="relative overflow-hidden rounded-sm shadow-2xl border-8 border-[#1a0f05] transition-all duration-700 ease-in-out"
      style={{
        aspectRatio: `${aspectRatio}`,
        width: '100%',
        maxWidth: '800px',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url("${MATERIAL_TEXTURES[design.material]}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Realistic Wood Grain Overlay */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
      
      {/* Engraving Effect Container */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Main Text with "Carved" effect */}
          <h2 
            style={{ 
              fontFamily: design.fontFamily, 
              fontSize: `${design.fontSize}px`,
              color: 'rgba(0, 0, 0, 0.85)',
              textShadow: '1px 1px 0px rgba(255,255,255,0.15), -1px -1px 2px rgba(0,0,0,0.6)',
              filter: 'contrast(1.2) brightness(0.8)'
            }}
            className="text-center leading-tight select-none"
          >
            {design.text || "Your Text Here"}
          </h2>

          {/* Decorations */}
          {design.decorations.map((dec) => (
            <div 
              key={dec.id}
              className="absolute"
              style={{
                left: `${dec.position.x}%`,
                top: `${dec.position.y}%`,
                transform: `translate(-50%, -50%) scale(${dec.scale})`,
                color: 'rgba(0, 0, 0, 0.8)',
                textShadow: '1px 1px 0px rgba(255,255,255,0.1), -1px -1px 1px rgba(0,0,0,0.5)',
              }}
            >
              <span className="text-4xl">{dec.content}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Measurement Labels */}
      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] text-amber-100 font-mono border border-amber-900/30">
        {design.width}" x {design.height}" • {design.material.toUpperCase()}
      </div>
    </div>
  );
};

export default SignCanvas;