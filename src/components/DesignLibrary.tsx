"use client";

import React from 'react';
import { EngravingDesign } from '@/types/engraving';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Library, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface DesignLibraryProps {
  designs: EngravingDesign[];
  onLoad: (design: EngravingDesign) => void;
  onDelete: (id: string) => void;
}

const DesignLibrary = ({ designs, onLoad, onDelete }: DesignLibraryProps) => {
  return (
    <div className="bg-[#2a1a0a]/90 backdrop-blur-md border border-amber-900/30 p-6 rounded-xl shadow-xl text-amber-50">
      <div className="flex items-center gap-2 text-amber-200 mb-4">
        <Library size={18} />
        <h3 className="font-semibold uppercase tracking-wider text-sm">Your Library</h3>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        {designs.length === 0 ? (
          <div className="text-center py-8 text-amber-200/30 italic text-sm">
            No saved designs yet
          </div>
        ) : (
          <div className="space-y-3">
            {designs.map((design) => (
              <div 
                key={design.id}
                className="group flex items-center gap-3 p-2 bg-black/20 border border-amber-900/30 rounded-lg hover:border-amber-500/50 transition-all"
              >
                <div className="w-16 h-10 bg-black/40 rounded border border-amber-900/30 overflow-hidden shrink-0 flex items-center justify-center">
                  {design.thumbnail ? (
                    <img src={design.thumbnail} alt={design.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <ImageIcon size={14} className="text-amber-900/50" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium truncate text-amber-100">
                    {design.name || design.text || "Untitled Design"}
                  </h4>
                  <p className="text-[9px] text-amber-200/40">
                    {design.width}"x{design.height}" • {new Date(design.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 text-amber-200 hover:text-amber-100 hover:bg-amber-900/40"
                    onClick={() => onLoad(design)}
                  >
                    <ExternalLink size={12} />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    onClick={() => onDelete(design.id)}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default DesignLibrary;