"use client";

import React, { useState, useRef, useEffect } from 'react';
import { EngravingDesign, WoodMaterial, Decoration } from '@/types/engraving';
import { Trash2, Maximize, Copy, AlignCenter, AlignVerticalJustifyCenter, RotateCw, FlipHorizontal, FlipVertical, Layers } from 'lucide-react';
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
  onDuplicateDecoration?: (id: string) => void;
  onBringToFront?: (id: string) => void;
}

const SignCanvas = ({ 
  design, 
  id, 
  onUpdateDesign, 
  onUpdateDecoration, 
  onRemoveDecoration,
  onDuplicateDecoration,
  onBringToFront
}: SignCanvasProps) => {
  const [selectedId, setSelectedId] = useState<string | 'text' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const ppi = 25; 
  let displayWidth = design.width * ppi;
  let displayHeight = design.height * ppi;

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId) return;
      const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '');
      if (isInputFocused) return;

      const step = e.shiftKey ? 2 : 0.5;
      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case 'ArrowLeft': dx = -step; break;
        case 'ArrowRight': dx = step; break;
        case 'ArrowUp': dy = -step; break;
        case 'ArrowDown': dy = step; break;
        case 'Delete':
        case 'Backspace':
          if (selectedId !== 'text') {
            onRemoveDecoration?.(selectedId);
            setSelectedId(null);
          }
          return;
        default: return;
      }

      e.preventDefault();

      if (selectedId === 'text') {
        const newX = Math.max(0, Math.min(100, design.textPosition.x + dx));
        const newY = Math.max(0, Math.min(100, design.textPosition.y + dy));
        onUpdateDesign?.({ textPosition: { x: newX, y: newY } });
      } else {
        const dec = design.decorations.find(d => d.id === selectedId);
        if (dec) {
          const newX = Math.max(0, Math.min(100, dec.position.x + dx));
          const newY = Math.max(0, Math.min(100, dec.position.y + dy));
          onUpdateDecoration?.(selectedId, { position: { x: newX, y: newY } });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, design, onUpdateDesign, onUpdateDecoration, onRemoveDecoration]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  const engravingStyle = {
    color: design.fontColor,
    textShadow: `
      0px -1px 1px rgba(0,0,0,0.8),
      0px 1px 1px rgba(255,255,255,0.15),
      inset 0px 2px 4px rgba(0,0,0,0.5)
    `,
    mixBlendMode: design.fontColor.startsWith('rgba') ? 'multiply' : 'normal' as any,
    filter: 'contrast(1.1) brightness(0.9) drop-shadow(0px 1px 1px rgba(0,0,0,0.2))'
  };

  return (
    <div 
      className="flex items-center justify-center w-full min-h-[550px] p-12 bg-black/20 rounded-2xl border border-amber-900/10"
      onClick={() => setSelectedId(null)}
    >
      <div 
        ref={canvasRef}
        id={id}
        onMouseMove={handleMouseMove}
        className="relative transition-all duration-300 ease-out group cursor-default"
        style={{
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
        }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-sm shadow-2xl border border-black/30">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: WOOD_COLORS[design.material] }}
          />
          <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15)_0%,transparent_70%)] pointer-events-none" />
        </div>

        {/* Main Text Layer */}
        <div 
          className={`absolute cursor-move transition-shadow ${selectedId === 'text' ? 'z-50' : 'z-10'}`}
          style={{
            left: `${design.textPosition.x}%`,
            top: `${design.textPosition.y}%`,
            transform: `translate(-50%, -50%) rotate(${design.textRotation}deg)`,
          }}
          onMouseDown={(e) => handleMouseDown(e, 'text')}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className={`relative group/text p-4 rounded-lg border-2 transition-all ${selectedId === 'text' ? 'border-amber-500 bg-amber-500/10' : 'border-transparent hover:border-amber-500/30'}`}
          >
            <h2 
              style={{ 
                ...engravingStyle,
                fontFamily: design.fontFamily, 
                fontSize: `${design.fontSize}px`,
              }}
              className="text-center leading-tight select-none font-bold tracking-tight whitespace-nowrap"
            >
              {design.text || "Your Text Here"}
            </h2>

            {selectedId === 'text' && (
              <div className={`absolute ${design.textPosition.y < 20 ? 'top-full mt-4' : '-top-12'} left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/90 backdrop-blur-md p-2 rounded-full border border-amber-900/50 shadow-xl pointer-events-auto`}>
                <div className="flex items-center gap-2 px-2 border-r border-amber-900/30">
                  <Maximize size={12} className="text-amber-200/60" />
                  <div className="w-24">
                    <Slider 
                      value={[design.fontSize]} 
                      min={10} 
                      max={200} 
                      step={1}
                      onValueChange={([val]) => onUpdateDesign?.({ fontSize: val })}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 px-2 border-r border-amber-900/30">
                  <RotateCw size={12} className="text-amber-200/60" />
                  <div className="w-24">
                    <Slider 
                      value={[design.textRotation]} 
                      min={0} 
                      max={360} 
                      step={1}
                      onValueChange={([val]) => onUpdateDesign?.({ textRotation: val })}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 px-1">
                  <button 
                    onClick={() => onUpdateDesign?.({ textPosition: { ...design.textPosition, x: 50 } })}
                    className="p-1.5 hover:bg-amber-900/40 rounded-full text-amber-400 transition-colors"
                    title="Center Horizontally"
                  >
                    <AlignCenter size={14} />
                  </button>
                  <button 
                    onClick={() => onUpdateDesign?.({ textPosition: { ...design.textPosition, y: 50 } })}
                    className="p-1.5 hover:bg-amber-900/40 rounded-full text-amber-400 transition-colors"
                    title="Center Vertically"
                  >
                    <AlignVerticalJustifyCenter size={14} />
                  </button>
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
                transform: `translate(-50%, -50%) rotate(${dec.rotation}deg) scaleX(${dec.flipX ? -1 : 1}) scaleY(${dec.flipY ? -1 : 1})`,
              }}
              onMouseDown={(e) => handleMouseDown(e, dec.id)}
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className={`relative group/dec p-4 rounded-lg border-2 transition-all ${isSelected ? 'border-amber-500 bg-amber-500/10' : 'border-transparent hover:border-amber-500/30'}`}
              >
                {dec.type === 'image' ? (
                  <img 
                    src={dec.src} 
                    alt={dec.name}
                    className="select-none block pointer-events-none"
                    style={{
                      width: `${100 * dec.scale}px`,
                      height: 'auto',
                      filter: 'brightness(0.8) contrast(1.2) drop-shadow(0px 2px 2px rgba(0,0,0,0.3))',
                      mixBlendMode: 'multiply'
                    }}
                  />
                ) : (
                  <span 
                    className="text-5xl select-none block"
                    style={{
                      ...engravingStyle,
                      transform: `scale(${dec.scale})`,
                    }}
                  >
                    {dec.content}
                  </span>
                )}

                {isSelected && (
                  <div className={`absolute ${dec.position.y < 20 ? 'top-full mt-4' : '-top-12'} left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/90 backdrop-blur-md p-2 rounded-full border border-amber-900/50 shadow-xl pointer-events-auto`}>
                    <div className="flex items-center gap-2 px-2 border-r border-amber-900/30">
                      <Maximize size={12} className="text-amber-200/60" />
                      <div className="w-20">
                        <Slider 
                          value={[dec.scale]} 
                          min={0.1} 
                          max={5} 
                          step={0.1}
                          onValueChange={([val]) => onUpdateDecoration?.(dec.id, { scale: val })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-2 border-r border-amber-900/30">
                      <RotateCw size={12} className="text-amber-200/60" />
                      <div className="w-20">
                        <Slider 
                          value={[dec.rotation]} 
                          min={0} 
                          max={360} 
                          step={1}
                          onValueChange={([val]) => onUpdateDecoration?.(dec.id, { rotation: val })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-1 border-r border-amber-900/30">
                      <button 
                        onClick={() => onUpdateDecoration?.(dec.id, { flipX: !dec.flipX })}
                        className={`p-1.5 rounded-full transition-colors ${dec.flipX ? 'bg-amber-500 text-black' : 'hover:bg-amber-900/40 text-amber-400'}`}
                        title="Flip Horizontal"
                      >
                        <FlipHorizontal size={14} />
                      </button>
                      <button 
                        onClick={() => onUpdateDecoration?.(dec.id, { flipY: !dec.flipY })}
                        className={`p-1.5 rounded-full transition-colors ${dec.flipY ? 'bg-amber-500 text-black' : 'hover:bg-amber-900/40 text-amber-400'}`}
                        title="Flip Vertical"
                      >
                        <FlipVertical size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 px-1 border-r border-amber-900/30">
                      <button 
                        onClick={() => onBringToFront?.(dec.id)}
                        className="p-1.5 hover:bg-amber-900/40 rounded-full text-amber-400 transition-colors"
                        title="Bring to Front"
                      >
                        <Layers size={14} />
                      </button>
                      <button 
                        onClick={() => onDuplicateDecoration?.(dec.id)}
                        className="p-1.5 hover:bg-amber-900/40 rounded-full text-amber-400 transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemoveDecoration?.(dec.id)}
                      className="p-1.5 hover:bg-red-900/40 rounded-full text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] text-amber-100 font-mono border border-amber-900/50 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {design.width}" x {design.height}" • {design.material.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default SignCanvas;