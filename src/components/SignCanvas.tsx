"use client";

import React, { useState, useRef, useEffect } from 'react';
import { EngravingDesign, WoodMaterial, Decoration, TextElement } from '@/types/engraving';
import { Trash2, Maximize, Copy, AlignCenter, AlignVerticalJustifyCenter, RotateCw, FlipHorizontal, FlipVertical, Layers } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const WOOD_COLORS: Record<WoodMaterial, string> = {
  walnut: "#3d2b1f",
  oak: "#d2b48c",
  cherry: "#8b4513",
  pine: "#f5deb3",
  maple: "#f4e4bc",
  mahogany: "#4a2511",
  cedar: "#c17f59",
  ebony: "#1a1a1a",
  birch: "#fdf5e6"
};

interface SignCanvasProps {
  design: EngravingDesign;
  id?: string;
  showGrid?: boolean;
  snapToGrid?: boolean;
  isPrintMode?: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateDesign?: (updates: Partial<EngravingDesign>) => void;
  onUpdateText?: (id: string, updates: Partial<TextElement>) => void;
  onUpdateDecoration?: (id: string, updates: Partial<Decoration>) => void;
  onRemoveText?: (id: string) => void;
  onRemoveDecoration?: (id: string) => void;
  onDuplicateDecoration?: (id: string) => void;
  onBringToFront?: (id: string) => void;
}

const SignCanvas = ({ 
  design, 
  id, 
  showGrid,
  snapToGrid = true,
  isPrintMode = false,
  selectedId,
  onSelect,
  onUpdateDesign, 
  onUpdateText,
  onUpdateDecoration, 
  onRemoveText,
  onRemoveDecoration,
  onDuplicateDecoration,
  onBringToFront
}: SignCanvasProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const ppi = isPrintMode ? 96 : 35; 
  let displayWidth = design.width * ppi;
  let displayHeight = design.height * ppi;

  if (!isPrintMode) {
    const maxWidth = 1400;
    const maxHeight = 900;

    if (displayWidth > maxWidth || displayHeight > maxHeight) {
      const scale = Math.min(maxWidth / displayWidth, maxHeight / displayHeight);
      displayWidth *= scale;
      displayHeight *= scale;
    }
  }

  const handleMouseDown = (e: React.MouseEvent, targetId: string) => {
    e.stopPropagation();
    onSelect(targetId);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId || !canvasRef.current || isPrintMode) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    if (snapToGrid) {
      if (Math.abs(x - 50) < 2) x = 50;
      if (Math.abs(y - 50) < 2) y = 50;

      const gridStepX = (1 / design.width) * 100;
      const gridStepY = (1 / design.height) * 100;
      
      const snappedX = Math.round(x / gridStepX) * gridStepX;
      const snappedY = Math.round(y / gridStepY) * gridStepY;

      if (Math.abs(x - snappedX) < 1.5) x = snappedX;
      if (Math.abs(y - snappedY) < 1.5) y = snappedY;
    }

    const constrainedX = Math.max(0, Math.min(100, x));
    const constrainedY = Math.max(0, Math.min(100, y));

    const isText = design.textElements.some(t => t.id === selectedId);
    if (isText) {
      onUpdateText?.(selectedId, { position: { x: constrainedX, y: constrainedY } });
    } else {
      onUpdateDecoration?.(selectedId, { position: { x: constrainedX, y: constrainedY } });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId || isPrintMode) return;
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
          const isText = design.textElements.some(t => t.id === selectedId);
          if (isText) {
            onRemoveText?.(selectedId);
          } else {
            onRemoveDecoration?.(selectedId);
          }
          onSelect(null);
          return;
        default: return;
      }

      e.preventDefault();

      const textEl = design.textElements.find(t => t.id === selectedId);
      if (textEl) {
        const newX = Math.max(0, Math.min(100, textEl.position.x + dx));
        const newY = Math.max(0, Math.min(100, textEl.position.y + dy));
        onUpdateText?.(selectedId, { position: { x: newX, y: newY } });
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
  }, [selectedId, design, onUpdateDesign, onUpdateText, onUpdateDecoration, onRemoveText, onRemoveDecoration, onSelect, isPrintMode]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  const getEngravingStyle = (color: string) => isPrintMode ? {
    color: '#000000',
    textShadow: 'none',
    filter: 'none',
    mixBlendMode: 'normal' as any
  } : {
    color: color,
    textShadow: `
      -1px -1px 1px rgba(0,0,0,0.6), 
      1px 1px 1px rgba(255,255,255,0.1),
      0px 1px 2px rgba(0,0,0,0.8)
    `,
    mixBlendMode: color.startsWith('rgba') ? 'multiply' : 'normal' as any,
    filter: 'contrast(1.2) brightness(0.85) drop-shadow(0px 1px 0px rgba(255,255,255,0.05))'
  };

  return (
    <div 
      className={`flex items-center justify-center w-full p-12 sm:p-20 ${isPrintMode ? 'bg-white' : 'bg-black/20 rounded-2xl border border-amber-900/10 min-h-[600px]'}`}
      onClick={() => onSelect(null)}
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
        {/* Dimension Lines (Rulers) */}
        {!isPrintMode && (
          <>
            <div className="absolute -top-10 left-0 right-0 flex flex-col items-center pointer-events-none">
              <div className="flex items-center justify-between w-full px-1">
                <div className="w-px h-3 bg-amber-500/50" />
                <div className="flex-1 h-px bg-amber-500/30 mx-1" />
                <div className="px-2 py-0.5 bg-amber-900/80 rounded text-[10px] font-mono text-amber-200 border border-amber-500/30 whitespace-nowrap">
                  {design.width}"
                </div>
                <div className="flex-1 h-px bg-amber-500/30 mx-1" />
                <div className="w-px h-3 bg-amber-500/50" />
              </div>
            </div>

            <div className="absolute -left-12 top-0 bottom-0 flex items-center pointer-events-none">
              <div className="flex flex-col items-center justify-between h-full py-1">
                <div className="h-px w-3 bg-amber-500/50" />
                <div className="flex-1 w-px bg-amber-500/30 my-1" />
                <div className="px-1 py-2 bg-amber-900/80 rounded text-[10px] font-mono text-amber-200 border border-amber-500/30 [writing-mode:vertical-lr] rotate-180">
                  {design.height}"
                </div>
                <div className="flex-1 w-px bg-amber-500/30 my-1" />
                <div className="h-px w-3 bg-amber-500/50" />
              </div>
            </div>
          </>
        )}

        {/* Wood Sign Container */}
        <div className={`absolute inset-0 overflow-hidden rounded-sm ${isPrintMode ? 'border border-gray-200' : 'shadow-2xl border border-black/40'}`}>
          <div 
            className="absolute inset-0 transition-colors duration-300"
            style={{ backgroundColor: isPrintMode ? '#FFFFFF' : WOOD_COLORS[design.material] }}
          />
          
          {!isPrintMode && (
            <>
              {/* Base Wood Texture Overlay */}
              <div className="absolute inset-0 opacity-50 pointer-events-none bg-[url('https://www.transparenttextures.com/wood-pattern.png')] mix-blend-overlay" />
              
              {/* Defined Horizontal Grain Fibers */}
              <div 
                className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    to bottom,
                    transparent,
                    transparent 1px,
                    rgba(0,0,0,0.3) 1px,
                    rgba(0,0,0,0.3) 2px,
                    transparent 2px,
                    transparent 4px
                  )`,
                  backgroundSize: '100% 4px'
                }}
              />

              {/* Strong Organic Horizontal Growth Rings */}
              <div 
                className="absolute inset-0 opacity-60 pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: `linear-gradient(
                    to bottom,
                    transparent 0%,
                    rgba(0,0,0,0.2) 5%,
                    transparent 15%,
                    rgba(0,0,0,0.1) 30%,
                    transparent 45%,
                    rgba(0,0,0,0.3) 60%,
                    transparent 75%,
                    rgba(0,0,0,0.1) 85%,
                    transparent 100%
                  )`,
                  backgroundSize: '100% 150px'
                }}
              />

              {/* Pronounced Horizontal Streaks */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    to bottom,
                    rgba(255,255,255,0.15) 0px,
                    rgba(255,255,255,0.15) 2px,
                    transparent 2px,
                    transparent 30px
                  )`
                }}
              />

              {/* Deep Grain Shadows */}
              <div 
                className="absolute inset-0 opacity-30 pointer-events-none mix-blend-multiply"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    to bottom,
                    rgba(0,0,0,0.1) 0px,
                    rgba(0,0,0,0.1) 1px,
                    transparent 1px,
                    transparent 10px
                  )`
                }}
              />

              <div className="absolute inset-0 pointer-events-none rounded-sm shadow-[inset_0_0_15px_rgba(0,0,0,0.7),inset_0_0_2px_rgba(0,0,0,0.9)]" />
              <div className="absolute inset-0 pointer-events-none rounded-sm border border-white/10 mix-blend-screen opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/20 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />
            </>
          )}
          
          {showGrid && (
            <div 
              className={`absolute inset-0 pointer-events-none ${isPrintMode ? 'opacity-10' : 'opacity-20'}`}
              style={{
                backgroundImage: `
                  linear-gradient(to right, ${isPrintMode ? 'black' : 'white'} 1px, transparent 1px),
                  linear-gradient(to bottom, ${isPrintMode ? 'black' : 'white'} 1px, transparent 1px)
                `,
                backgroundSize: `${(1 / design.width) * 100}% ${(1 / design.height) * 100}%`
              }}
            />
          )}
          
          {showGrid && (
            <>
              <div className={`absolute left-1/2 top-0 bottom-0 w-[1px] ${isPrintMode ? 'bg-black/20' : 'bg-amber-500/30'} pointer-events-none`} />
              <div className={`absolute top-1/2 left-0 right-0 h-[1px] ${isPrintMode ? 'bg-black/20' : 'bg-amber-500/30'} pointer-events-none`} />
            </>
          )}
        </div>

        {/* Text Elements Layer */}
        {design.textElements.map((textEl) => {
          const isSelected = selectedId === textEl.id;
          return (
            <div 
              key={textEl.id}
              className={`absolute cursor-move transition-shadow ${isSelected ? 'z-50' : 'z-10'}`}
              style={{
                left: `${textEl.position.x}%`,
                top: `${textEl.position.y}%`,
                transform: `translate(-50%, -50%)`,
              }}
              onMouseDown={(e) => handleMouseDown(e, textEl.id)}
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className={`relative group/text p-4 rounded-lg border-2 transition-all ${isSelected ? 'border-amber-500 bg-amber-500/10' : 'border-transparent hover:border-amber-500/30'}`}
              >
                <h2 
                  style={{ 
                    ...getEngravingStyle(textEl.fontColor),
                    fontFamily: textEl.fontFamily, 
                    fontSize: `${textEl.fontSize * (isPrintMode ? 2.74 : 1)}px`, 
                    letterSpacing: `${textEl.letterSpacing * (isPrintMode ? 2.74 : 1)}px`,
                  }}
                  className="text-center leading-tight select-none font-bold tracking-tight whitespace-nowrap"
                >
                  {textEl.text || "Your Text Here"}
                </h2>

                {isSelected && !isPrintMode && (
                  <div className={`absolute ${textEl.position.y < 20 ? 'top-full mt-4' : '-top-12'} left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/90 backdrop-blur-md p-2 rounded-full border border-amber-900/50 shadow-xl pointer-events-auto`}>
                    <div className="flex items-center gap-1 px-1 border-r border-amber-900/30">
                      <button 
                        onClick={() => onUpdateText?.(textEl.id, { position: { ...textEl.position, x: 50 } })}
                        className="p-1.5 hover:bg-amber-900/40 rounded-full text-amber-400 transition-colors"
                        title="Center Horizontally"
                      >
                        <AlignCenter size={14} />
                      </button>
                      <button 
                        onClick={() => onUpdateText?.(textEl.id, { position: { ...textEl.position, y: 50 } })}
                        className="p-1.5 hover:bg-amber-900/40 rounded-full text-amber-400 transition-colors"
                        title="Center Vertically"
                      >
                        <AlignVerticalJustifyCenter size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemoveText?.(textEl.id)}
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
                      width: `${100 * dec.scale * (isPrintMode ? 2.74 : 1)}px`,
                      height: 'auto',
                      filter: isPrintMode ? 'grayscale(1) contrast(200%) brightness(0)' : 'brightness(0.8) contrast(1.2) drop-shadow(0px 2px 2px rgba(0,0,0,0.3))',
                      mixBlendMode: isPrintMode ? 'normal' : 'multiply'
                    }}
                  />
                ) : (
                  <span 
                    className="select-none block"
                    style={{
                      ...getEngravingStyle(design.textElements[0]?.fontColor || '#1a1a1a'),
                      fontSize: `${48 * dec.scale * (isPrintMode ? 2.74 : 1)}px`,
                    }}
                  >
                    {dec.content}
                  </span>
                )}

                {isSelected && !isPrintMode && (
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

        {!isPrintMode && (
          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] text-amber-100 font-mono border border-amber-900/50 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {design.width}" x {design.height}" • {design.material.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignCanvas;