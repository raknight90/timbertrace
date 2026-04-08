"use client";

import React from 'react';
import { EngravingDesign, Decoration } from '@/types/engraving';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown, Type, Image as ImageIcon, Star } from 'lucide-react';

interface LayersPanelProps {
  design: EngravingDesign;
  selectedIds: string[];
  onSelect: (id: string | 'text' | null, isMulti: boolean) => void;
  onToggleVisibility: (id: string | 'text') => void;
  onToggleLock: (id: string | 'text') => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
}

const LayersPanel = ({ design, selectedIds, onSelect, onToggleVisibility, onToggleLock, onReorder }: LayersPanelProps) => {
  const allLayers = [
    { id: 'text', name: 'Main Text', type: 'text', locked: design.textLocked, hidden: design.textHidden },
    ...design.decorations.map(d => ({ 
      id: d.id, 
      name: d.name || 'Decoration', 
      type: d.type, 
      locked: d.locked, 
      hidden: d.hidden 
    })).reverse() // Show top layers first
  ];

  return (
    <div className="bg-[#2a1a0a]/90 backdrop-blur-md border border-amber-900/30 p-6 rounded-xl shadow-xl text-amber-50">
      <div className="flex items-center gap-2 text-amber-200 mb-4">
        <Layers size={18} />
        <h3 className="font-semibold uppercase tracking-wider text-sm">Layers</h3>
      </div>

      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-1">
          {allLayers.map((layer, index) => (
            <div 
              key={layer.id}
              onClick={(e) => onSelect(layer.id, e.shiftKey)}
              className={`group flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer ${
                selectedIds.includes(layer.id) 
                  ? 'bg-amber-500/20 border-amber-500/50' 
                  : 'bg-black/20 border-transparent hover:border-amber-900/30'
              }`}
            >
              <div className="text-amber-500/60">
                {layer.type === 'text' ? <Type size={14} /> : layer.type === 'image' ? <ImageIcon size={14} /> : <Star size={14} />}
              </div>
              
              <span className={`flex-1 text-xs truncate ${layer.hidden ? 'opacity-40' : 'opacity-100'}`}>
                {layer.name}
              </span>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {layer.id !== 'text' && (
                  <>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6 text-amber-200/60 hover:text-amber-200"
                      onClick={(e) => { e.stopPropagation(); onReorder(layer.id, 'up'); }}
                    >
                      <ChevronUp size={12} />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6 text-amber-200/60 hover:text-amber-200"
                      onClick={(e) => { e.stopPropagation(); onReorder(layer.id, 'down'); }}
                    >
                      <ChevronDown size={12} />
                    </Button>
                  </>
                )}
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={`h-6 w-6 ${layer.locked ? 'text-amber-500' : 'text-amber-200/60'}`}
                  onClick={(e) => { e.stopPropagation(); onToggleLock(layer.id); }}
                >
                  {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={`h-6 w-6 ${layer.hidden ? 'text-red-400' : 'text-amber-200/60'}`}
                  onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }}
                >
                  {layer.hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LayersPanel;