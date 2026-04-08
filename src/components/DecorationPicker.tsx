"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Palette, Upload, Image as ImageIcon } from 'lucide-react';

const DECORATIONS = [
  { id: 'leaf-1', content: '🌿', name: 'Leaf' },
  { id: 'flower-1', content: '🌸', name: 'Flower' },
  { id: 'star-1', content: '✨', name: 'Sparkle' },
  { id: 'border-1', content: '◈', name: 'Diamond' },
  { id: 'border-2', content: '❧', name: 'Vine' },
  { id: 'border-3', content: '⚓', name: 'Anchor' },
  { id: 'border-4', content: '🌲', name: 'Pine' },
  { id: 'border-5', content: '🦌', name: 'Deer' },
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
      
      <ScrollArea className="h-[150px] pr-4">
        <div className="grid grid-cols-4 gap-3">
          {DECORATIONS.map((dec) => (
            <button
              key={dec.id}
              onClick={() => onAdd(dec.content)}
              className="h-12 w-12 flex items-center justify-center bg-black/20 border border-amber-900/30 rounded-lg hover:bg-amber-900/40 hover:border-amber-500 transition-all text-2xl"
              title={dec.name}
            >
              {dec.content}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DecorationPicker;