"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Palette, Upload, Image as ImageIcon } from 'lucide-react';

const DECORATIONS = [
  // Flourishes & Symbols (Monochrome)
  { id: 'flourish-1', content: '⚜', name: 'Fleur-de-lis' },
  { id: 'flourish-2', content: '❦', name: 'Floral Heart' },
  { id: 'flourish-3', content: '❧', name: 'Vine' },
  { id: 'symbol-1', content: '❀', name: 'Flower' },
  { id: 'symbol-2', content: '❁', name: 'Ornate Flower' },
  { id: 'symbol-3', content: '✦', name: 'Star' },
  { id: 'symbol-4', content: '✧', name: 'Sparkle' },
  { id: 'symbol-5', content: '☼', name: 'Sun' },
  
  // Scrolls
  { id: 'scroll-1', content: '🙘', name: 'Scroll Left' },
  { id: 'scroll-2', content: '🙙', name: 'Scroll Right' },
  { id: 'scroll-3', content: '🙚', name: 'Ornate Scroll' },
  { id: 'scroll-4', content: '🙛', name: 'Fancy Scroll' },
  { id: 'scroll-5', content: '🙜', name: 'Leafy Scroll' },
  { id: 'scroll-6', content: '🙝', name: 'Vine Scroll' },
  
  // Borders & Lines
  { id: 'border-1', content: '◈', name: 'Diamond' },
  { id: 'border-2', content: '❖', name: 'Fancy Diamond' },
  { id: 'border-4', content: '═', name: 'Double Line' },
  { id: 'border-5', content: '🙤', name: 'Ornate Line' },
  { id: 'border-6', content: '🙥', name: 'Fancy Line' },
  { id: 'border-7', content: '🙦', name: 'Scroll Line' },
  { id: 'border-8', content: '🙧', name: 'Vine Line' },
  
  // Corners
  { id: 'corner-1', content: '╔', name: 'Top Left' },
  { id: 'corner-2', content: '╗', name: 'Top Right' },
  { id: 'corner-3', content: '╚', name: 'Bottom Left' },
  { id: 'corner-4', content: '╝', name: 'Bottom Right' },
  { id: 'corner-5', content: '🙐', name: 'Fancy Corner' },
  { id: 'corner-6', content: '🙑', name: 'Ornate Corner' },
];

interface DecorationPickerProps {
  onAdd: (content: string) => void;
  onAddImage: (src: string) => void;
}

const DecorationPicker = ({ onAdd, onAddImage }: DecorationPickerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onAddImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#2a1a0a]/90 backdrop-blur-md border border-amber-900/30 p-6 rounded-xl shadow-xl text-amber-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-amber-200">
          <Palette size={18} />
          <h3 className="font-semibold uppercase tracking-wider text-sm">Decorations</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-amber-200 hover:bg-amber-900/40"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={14} className="mr-2" />
          Upload PNG
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/png" 
          onChange={handleFileChange}
        />
      </div>
      
      <ScrollArea className="h-[250px] pr-4">
        <div className="grid grid-cols-4 gap-3">
          {DECORATIONS.map((dec) => (
            <button
              key={dec.id}
              onClick={() => onAdd(dec.content)}
              className="h-12 w-12 flex items-center justify-center bg-black/20 border border-amber-900/30 rounded-lg hover:bg-amber-900/40 hover:border-amber-500 transition-all text-2xl"
              title={dec.name}
            >
              <span className="select-none">{dec.content}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DecorationPicker;