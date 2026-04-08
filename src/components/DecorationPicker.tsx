"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Palette, Upload, Image as ImageIcon } from 'lucide-react';

// Appending \uFE0E forces the browser to render the character as text rather than a colorful emoji
const DECORATIONS = [
  // Flourishes & Floral
  { id: 'flourish-1', content: '⚜\uFE0E', name: 'Fleur-de-lis' },
  { id: 'flourish-2', content: '❦\uFE0E', name: 'Floral Heart' },
  { id: 'flourish-3', content: '❧\uFE0E', name: 'Vine' },
  { id: 'flourish-4', content: '☘\uFE0E', name: 'Shamrock' },
  { id: 'flourish-5', content: '❀\uFE0E', name: 'Flower' },
  { id: 'flourish-6', content: '❁\uFE0E', name: 'Ornate Flower' },
  { id: 'flourish-7', content: '❃\uFE0E', name: 'Petal' },
  { id: 'flourish-8', content: '✾\uFE0E', name: 'Blossom' },
  { id: 'flourish-9', content: '✽\uFE0E', name: 'Floral Star' },
  { id: 'flourish-10', content: '⚘\uFE0E', name: 'Stemmed Flower' },
  
  // Celestial & Symbols
  { id: 'symbol-1', content: '✦\uFE0E', name: 'Star' },
  { id: 'symbol-2', content: '✧\uFE0E', name: 'Sparkle' },
  { id: 'symbol-3', content: '☼\uFE0E', name: 'Sun' },
  { id: 'symbol-4', content: '☽\uFE0E', name: 'Moon' },
  { id: 'symbol-5', content: '☄\uFE0E', name: 'Comet' },
  { id: 'symbol-6', content: '⚓\uFE0E', name: 'Anchor' },
  { id: 'symbol-7', content: '⚖\uFE0E', name: 'Scales' },
  { id: 'symbol-8', content: '⚔\uFE0E', name: 'Swords' },
  { id: 'symbol-9', content: '🛡\uFE0E', name: 'Shield' },
  { id: 'symbol-10', content: '🗝\uFE0E', name: 'Key' },
  
  // Scrolls & Ornaments
  { id: 'scroll-1', content: '🙘\uFE0E', name: 'Scroll Left' },
  { id: 'scroll-2', content: '🙙\uFE0E', name: 'Scroll Right' },
  { id: 'scroll-3', content: '🙚\uFE0E', name: 'Ornate Scroll' },
  { id: 'scroll-4', content: '🙛\uFE0E', name: 'Fancy Scroll' },
  { id: 'scroll-5', content: '🙜\uFE0E', name: 'Leafy Scroll' },
  { id: 'scroll-6', content: '🙝\uFE0E', name: 'Vine Scroll' },
  { id: 'scroll-7', content: '🙞\uFE0E', name: 'Heavy Scroll' },
  { id: 'scroll-8', content: '🙟\uFE0E', name: 'Double Scroll' },
  
  // Borders & Lines
  { id: 'border-1', content: '◈\uFE0E', name: 'Diamond' },
  { id: 'border-2', content: '❖\uFE0E', name: 'Fancy Diamond' },
  { id: 'border-3', content: '═\uFE0E', name: 'Double Line' },
  { id: 'border-4', content: '🙤\uFE0E', name: 'Ornate Line' },
  { id: 'border-5', content: '🙥\uFE0E', name: 'Fancy Line' },
  { id: 'border-6', content: '🙦\uFE0E', name: 'Scroll Line' },
  { id: 'border-7', content: '🙧\uFE0E', name: 'Vine Line' },
  { id: 'border-8', content: '🙨\uFE0E', name: 'Leafy Line' },
  { id: 'border-9', content: '🙩\uFE0E', name: 'Heavy Line' },
  { id: 'border-10', content: '🙪\uFE0E', name: 'Pattern Line' },
  
  // Corners
  { id: 'corner-1', content: '╔\uFE0E', name: 'Top Left' },
  { id: 'corner-2', content: '╗\uFE0E', name: 'Top Right' },
  { id: 'corner-3', content: '╚\uFE0E', name: 'Bottom Left' },
  { id: 'corner-4', content: '╝\uFE0E', name: 'Bottom Right' },
  { id: 'corner-5', content: '🙐\uFE0E', name: 'Fancy Corner' },
  { id: 'corner-6', content: '🙑\uFE0E', name: 'Ornate Corner' },
  { id: 'corner-7', content: '🙒\uFE0E', name: 'Leafy Corner' },
  { id: 'corner-8', content: '🙓\uFE0E', name: 'Vine Corner' },
];

interface DecorationPickerProps {
  onAdd: (content: string) => void;
  onAddImage: (src: string) => void;
  selectedColor?: string;
}

const DecorationPicker = ({ onAdd, onAddImage, selectedColor }: DecorationPickerProps) => {
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
              <span 
                className="select-none"
                style={{ color: selectedColor || 'inherit' }}
              >
                {dec.content}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DecorationPicker;