"use client";

import React from 'react';
import { EngravingDesign, WoodMaterial } from '@/types/engraving';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Type, Maximize2, Palette, Save, Download, Trees, Paintbrush, Check } from 'lucide-react';

const FONTS = [
  { name: 'Classic Serif', value: "'Playfair Display', serif" },
  { name: 'Rustic Script', value: "'Dancing Script', cursive" },
  { name: 'Modern Sans', value: "'Inter', sans-serif" },
  { name: 'Vintage Slab', value: "'Arvo', serif" },
  { name: 'Elegant Cursive', value: "'Great Vibes', cursive" },
];

const MATERIALS: { name: string; value: WoodMaterial; image: string }[] = [
  { 
    name: 'Dark Walnut', 
    value: 'walnut',
    image: "https://images.unsplash.com/photo-1611486212330-f3719bfecf24?q=80&w=200&auto=format&fit=crop"
  },
  { 
    name: 'Light Oak', 
    value: 'oak',
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=200&auto=format&fit=crop"
  },
  { 
    name: 'Cherry Wood', 
    value: 'cherry',
    image: "https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?q=80&w=200&auto=format&fit=crop"
  },
  { 
    name: 'Reclaimed Pine', 
    value: 'pine',
    image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=200&auto=format&fit=crop"
  },
];

const COLORS = [
  { name: 'Natural Carved', value: 'rgba(20, 10, 5, 0.9)' },
  { name: 'Charcoal Black', value: '#1a1a1a' },
  { name: 'Antique White', value: '#f5f5f0' },
  { name: 'Metallic Gold', value: '#d4af37' },
  { name: 'Metallic Silver', value: '#c0c0c0' },
  { name: 'Barn Red', value: '#7c0a02' },
];

interface DesignToolbarProps {
  design: EngravingDesign;
  onUpdate: (updates: Partial<EngravingDesign>) => void;
  onSave: () => void;
  onExport: () => void;
}

const DesignToolbar = ({ design, onUpdate, onSave, onExport }: DesignToolbarProps) => {
  return (
    <div className="bg-[#2a1a0a]/90 backdrop-blur-md border border-amber-900/30 p-6 rounded-xl shadow-xl space-y-8 text-amber-50">
      {/* Material Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-200">
          <Trees size={18} />
          <h3 className="font-semibold uppercase tracking-wider text-sm">Wood Material</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {MATERIALS.map((mat) => (
            <button
              key={mat.value}
              onClick={() => onUpdate({ material: mat.value })}
              className={`group relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                design.material === mat.value 
                  ? 'border-amber-500 ring-2 ring-amber-500/20' 
                  : 'border-transparent hover:border-amber-700'
              }`}
            >
              <img 
                src={mat.image} 
                alt={mat.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white drop-shadow-md">
                  {mat.name}
                </span>
                {design.material === mat.value && (
                  <Check size={16} className="text-amber-400 mt-1" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-200">
          <Maximize2 size={18} />
          <h3 className="font-semibold uppercase tracking-wider text-sm">Sign Dimensions</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width" className="text-xs text-amber-200/60">Width (inches)</Label>
            <Input 
              id="width"
              type="number" 
              value={design.width} 
              onChange={(e) => onUpdate({ width: Number(e.target.value) })}
              className="bg-black/20 border-amber-900/50 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height" className="text-xs text-amber-200/60">Height (inches)</Label>
            <Input 
              id="height"
              type="number" 
              value={design.height} 
              onChange={(e) => onUpdate({ height: Number(e.target.value) })}
              className="bg-black/20 border-amber-900/50 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Text Content & Color */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-200">
          <Type size={18} />
          <h3 className="font-semibold uppercase tracking-wider text-sm">Engraving Text</h3>
        </div>
        <div className="space-y-4">
          <Input 
            placeholder="Enter text to engrave..."
            value={design.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className="bg-black/20 border-amber-900/50 focus:ring-amber-500 text-lg py-6"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-amber-200/60">Font Style</Label>
              <Select 
                value={design.fontFamily} 
                onValueChange={(val) => onUpdate({ fontFamily: val })}
              >
                <SelectTrigger className="bg-black/20 border-amber-900/50">
                  <SelectValue placeholder="Select Font" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a1a0a] border-amber-900/50 text-amber-50">
                  {FONTS.map(font => (
                    <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-amber-200/60">Fill Color</Label>
              <Select 
                value={design.fontColor} 
                onValueChange={(val) => onUpdate({ fontColor: val })}
              >
                <SelectTrigger className="bg-black/20 border-amber-900/50">
                  <SelectValue placeholder="Select Color" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a1a0a] border-amber-900/50 text-amber-50">
                  {COLORS.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: color.value }} />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs text-amber-200/60">Font Size</Label>
              <span className="text-xs text-amber-200/60">{design.fontSize}px</span>
            </div>
            <Slider 
              value={[design.fontSize]} 
              min={10} 
              max={200} 
              step={1}
              onValueChange={([val]) => onUpdate({ fontSize: val })}
              className="py-4"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 grid grid-cols-2 gap-3">
        <Button 
          onClick={onSave}
          className="bg-amber-700 hover:bg-amber-600 text-white border-none"
        >
          <Save className="mr-2 h-4 w-4" /> Save to Library
        </Button>
        <Button 
          onClick={onExport}
          variant="outline"
          className="border-amber-700 text-amber-200 hover:bg-amber-900/30"
        >
          <Download className="mr-2 h-4 w-4" /> Export PDF
        </Button>
      </div>
    </div>
  );
};

export default DesignToolbar;