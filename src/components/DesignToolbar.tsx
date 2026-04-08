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

const WOOD_TYPES: { name: string; value: WoodMaterial; color: string }[] = [
  { name: 'American Walnut', value: 'walnut', color: '#3d2b1f' },
  { name: 'White Oak', value: 'oak', color: '#d2b48c' },
  { name: 'Black Cherry', value: 'cherry', color: '#8b4513' },
  { name: 'Eastern Pine', value: 'pine', color: '#f5deb3' },
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
      {/* Wood Type Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-200">
          <Trees size={18} />
          <h3 className="font-semibold uppercase tracking-wider text-sm">Wood Type</h3>
        </div>
        <Select 
          value={design.material} 
          onValueChange={(val) => onUpdate({ material: val as WoodMaterial })}
        >
          <SelectTrigger className="bg-black/20 border-amber-900/50 h-12">
            <SelectValue placeholder="Select Wood Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#2a1a0a] border-amber-900/50 text-amber-50">
            {WOOD_TYPES.map(wood => (
              <SelectItem key={wood.value} value={wood.value}>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-sm border border-white/10" style={{ backgroundColor: wood.color }} />
                  {wood.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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