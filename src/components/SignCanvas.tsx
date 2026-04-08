"use client";

import React from 'react';
import { EngravingDesign, WoodMaterial } from '@/types/engraving';

const MATERIAL_TEXTURES: Record<WoodMaterial, string> = {
  walnut: "https://images.unsplash.com/photo-1611486212330-f3719bfecf24?q=80&w=2070&auto=format&fit=crop",
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
      className="relative overflow-hidden rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[12px] border-[#1a0f05] transition-all duration-700 ease-in-out"
      style={{
        aspectRatio: `${aspectRatio}`,
        width: '100%',
        maxWidth: '800px',
        backgroundImage: `url("${MATERIAL_TEXTURES[design.material]}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Realistic Wood Grain Overlay for depth */}
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay" />
      
      {/* Subtle vignette for realism */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.3)_100%)] pointer-events-none" />

      {/* Engraving Effect Container */}
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Main Text with "Deep Carved" effect */}
          <h2 
            style={{ 
              fontFamily: design.fontFamily, 
              fontSize: `${design.fontSize}px`,
              // The "Carved" look:
              // 1. Dark color for the "burnt" or "shadowed" interior
              color: 'rgba(20, 10, 5, 0.9)',
              // 2. Multiple shadows to create depth and a highlight on the edge
              textShadow: `
                -1px -1px 1px rgba(0,0,0,0.8), 
                1px 1px 1px rgba(255,255,255,0.15),
                inset 0 2px 4px rgba(0,0,0,0.5)
              `,
              // 3. Blend mode to let some grain show through
              mixBlendMode: 'multiply',
              filter: 'contrast(1.1) brightness(0.9)'
            }}
            className="text-center leading-tight select-none font-bold"
          >
            {design.text || "Your Text Here"}
          </h2>

          {/* Decorations with similar carved effect */}
          {design.decorations.map((dec) => (
            <div 
              key={dec.id}
              className="absolute"
              style={{
                left: `${dec.position.x}%`,
                top: `${dec.position.y}%`,
                transform: `translate(-50%, -50%) scale(${dec.scale})`,
                color: 'rgba(20, 10, 5, 0.85)',
                textShadow: '-1px -1px 1px rgba(0,0,0,0.7), 1px 1px 1px rgba(255,255,255,0.1)',
                mixBlendMode: 'multiply',
              }}
            >
              <span className="text-5xl">{dec.content}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Measurement Labels */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] text-amber-100 font-mono border border-amber-900/50 shadow-lg">
        {design.width}" x {design.height}" • {design.material.toUpperCase()}
      </div>
    </div>
  );
};

export default SignCanvas;