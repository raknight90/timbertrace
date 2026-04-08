"use client";

import React from 'react';
import { EngravingDesign, WoodMaterial } from '@/types/engraving';

const WOOD_COLORS: Record<WoodMaterial, string> = {
  walnut: "#3d2b1f",
  oak: "#d2b48c",
  cherry: "#8b4513",
  pine: "#f5deb3"
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
      className="relative overflow-hidden rounded-sm transition-all duration-700 ease-in-out group"
      style={{
        aspectRatio: `${aspectRatio}`,
        width: '100%',
        maxWidth: '800px',
        backgroundColor: WOOD_COLORS[design.material],
        // Physical board effect: Beveled edges and heavy shadow
        boxShadow: `
          0 20px 50px rgba(0,0,0,0.6),
          inset 0 0 2px rgba(255,255,255,0.2),
          inset 0 0 20px rgba(0,0,0,0.3)
        `,
        border: '1px solid rgba(0,0,0,0.3)'
      }}
    >
      {/* Realistic Wood Grain Overlay - adds tactile texture */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay" />
      
      {/* Lighting: Top-down light source for the board */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Engraving Effect Container */}
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Main Text with "Deep Carved" effect */}
          <h2 
            style={{ 
              fontFamily: design.fontFamily, 
              fontSize: `${design.fontSize}px`,
              color: design.fontColor,
              // The "Carved" look:
              textShadow: `
                0px -2px 1px rgba(0,0,0,0.9),
                0px 1px 1px rgba(255,255,255,0.2),
                0px 4px 8px rgba(0,0,0,0.4)
              `,
              mixBlendMode: design.fontColor.startsWith('rgba') ? 'multiply' : 'normal',
              filter: 'contrast(1.1) brightness(0.85) drop-shadow(0px 2px 2px rgba(0,0,0,0.3))'
            }}
            className="text-center leading-tight select-none font-bold tracking-tight"
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
                color: design.fontColor,
                textShadow: '0px -1px 1px rgba(0,0,0,0.8), 0px 1px 1px rgba(255,255,255,0.1)',
                mixBlendMode: design.fontColor.startsWith('rgba') ? 'multiply' : 'normal',
                filter: 'brightness(0.8)'
              }}
            >
              <span className="text-5xl">{dec.content}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Measurement Labels */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] text-amber-100 font-mono border border-amber-900/50 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
        {design.width}" x {design.height}" • {design.material.toUpperCase()}
      </div>
    </div>
  );
};

export default SignCanvas;