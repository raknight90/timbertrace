"use client";

import React, { useState, useRef, useEffect } from 'react';
import { EngravingDesign, WoodMaterial, Decoration } from '@/types/engraving';
import { Trash2, Move, Maximize, Type } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const WOOD_COLORS: Record<WoodMaterial, string> = {
  walnut: "#3d2b1f",
  oak: "#d2b48c",
  cherry: "#8b4513",
  pine: "#f5deb3"
};

interface SignCanvasProps {
  design: EngravingDesign;
  id?: string;
  onUpdateDesign?: (updates: Partial<EngravingDesign>) => void;
  onUpdateDecoration?: (id: string, updates: Partial<Decoration>) => void;
  onRemoveDecoration?: (id: string) => void;
}

const SignCanvas = ({ design, id, onUpdateDesign, onUpdateDecoration, onRemoveDecoration }: SignCanvasProps) => {
  const [selectedId, setSelectedId] = useState<string | 'text' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Use a base "Pixels Per Inch" to make the sign grow/shrink physically
  const ppi = 25; 
  let displayWidth = design.width * ppi;
  let displayHeight = design.height * ppi;

  // Cap the preview size so it doesn't break the layout
  const maxWidth = 800;
  const maxHeight = 500;

  if (displayWidth > maxWidth || displayHeight > maxHeight) {
    const scale = Math.min(maxWidth / displayWidth, maxHeight / displayHeight);
    displayWidth *= scale;
    displayHeight *= scale;
  }

  const handleMouseDown = (e: React.MouseEvent, targetId: string | 'text') => {
    e.stopPropagation();
    setSelectedId(targetId);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Constrain to canvas
    const constrainedX = Math.max(0, Math.min(100, x));
    const constrainedY = Math.max(0, Math.min(100, y));

    if (selectedId === 'text') {
      onUpdateDesign?.({ textPosition: { x: constrainedX, y: constrainedY } });
    } else {
      onUpdateDecoration?.(selectedId, { position: { x: constrainedX, y: constrainedY } });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  return (
    <div 
      className="flex items-center justify-center w-full min-h-[550px] p-8 bg-black/20 rounded-2xl border border-amber-900/10"
      onClick={() => setSelectedId(null)}
    >
      <div 
        ref={canvasRef}
        id={id}
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden rounded-sm transition-all duration-300 ease-out group cursor-default"
        style={{
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
          backgroundColor: WOOD_COLORS[design.material],
          boxShadow: `
            0 20px 50px rgba(0,0,0,0.6),
            inset 0 0 2px rgba(255,255,255,0.2),
            inset 0 0 20px rgba(0,0,0,0.3)
          `,
          border: '1px solid rgba(0,0,0,0.3)'
        }}
      >
        {/* Realistic Wood Grain Overlay */}
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay" />
        
        {/* Lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15)_0%,transparent_70%)] pointer-events-none" />

        {/* Main Text Layer */}
        <div 
          className={`absolute cursor-move transition-shadow ${selectedId === 'text' ? 'z-50' : 'z-10'}`}
          style={{
            left: `${design.textPosition.x}%`,
            top: `${design.textPosition.y}%`,
            transform: `translate(-50%, -50%)`,
          }}
          onMouseDown={(e) => handleMouseDown(e, 'text')}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className={`relative group/text p-4 rounded-lg border-2 transition-all ${selectedId === 'text' ? 'border-amber-500 bg-amber-500/10' : 'border-transparent hover:border-amber-500/30'}`}
          >
            <h2 
              style={{ 
                fontFamily: design.fontFamily, 
                fontSize: `${design.fontSize}px`,
                color: design.fontColor,
                textShadow: `
                  0px -2px 1px rgba(0,0,0,0.9),
                  0px 1px 1px rgba(255,255,255,0.2),
                  0px 4px 8px rgba(0,0,0,0.4)
                `,
                mixBlendMode: design.fontColor.startsWith('rgba') ? 'multiply' : 'normal',
                filter: 'contrast(1.1) brightness(0.85) drop-shadow(0px 2px 2px rgba(0,0,0,0.3))'
              }}
              className="text-center leading-tight select-none font-bold tracking-tight whitespace-nowrap"
            >
              {design.text || "Your Text Here"}
            </h2>

            {/* Text Controls UI */}
            {selectedId === 'text' && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/90 backdrop-blur-md p-2 rounded-full border border-amber-900/50 shadow-xl pointer-events-auto">
                <div className="flex items-center gap-2 px-2">
                  <Maximize size={12} className="text-amber-200/60" />
                  <div className="w-32">
                    <Slider 
                      value={[design.fontSize]} 
                      min={10} 
                      max={200} 
                      step={1}
                      onValueChange={([val]) => onUpdateDesign?.({ fontSize: val })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decorations Layer */}
        {design.decorations.map((dec) => {
          const isSelected = selectedId === dec.id;
          return (
            <div 
              key={dec.id}
              className={`absolute cursor-move transition-shadow ${isSelected ? 'z-50' : 'z-10'}`}
              style={{
                left: `${dec.position.x}%`,
                top: `${dec.position.y}%`,
                transform: `translate(-50%, -50%)`,
              }}
              onMouseDown={(e) => handleMouseDown(e, dec.id)}
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className={`relative group/dec p-4 rounded-lg border-2 transition-all ${isSelected ? 'border-amber-500 bg-amber-500/10' : 'border-transparent hover:border-amber-500/30'}`}
              >
                <span 
                  className="text-5xl select-none block"
                  style={{
                    color: design.fontColor,
                    transform: `scale(${dec.scale})`,
                    textShadow: '0px -1px 1px rgba(0,0,0,0.8), 0px 1px 1px rgba(255,255,255,0.1)',
                    mixBlendMode: design.fontColor.startsWith('rgba') ? 'multiply' : 'normal',
                    filter: 'brightness(0.8)'
                  }}
                >
                  {dec.content}
                </span>

                {/* Decoration Controls UI */}
                {isSelected && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/90 backdrop-blur-md p-2 rounded-full border border-amber-900/50 shadow-xl pointer-events-auto">
                    <div className="flex items-center gap-2 px-2 border-r border-amber-900/30">
                      <Maximize size={12} className="text-amber-200/60" />
                      <div className="w-24">
                        <Slider 
                          value={[dec.scale]} 
                          min={0.5} 
                          max={3} 
                          step={0.1}
                          onValueChange={([val]) => onUpdateDecoration?.(dec.id, { scale: val })}
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => onRemoveDecoration?.(dec.id)}
                      className="p-1.5 hover:bg-red-900/40 rounded-full text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Measurement Labels */}
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] text-amber-100 font-mono border border-amber-900/50 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {design.width}" x {design.height}" • {design.material.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default SignCanvas;