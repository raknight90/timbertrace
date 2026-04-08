"use client";

import React from 'react';
import { EngravingDesign } from '@/types/engraving';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Library, Trash2, ExternalLink } from 'lucide-react';

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
                className="group flex items-center justify-between p-3 bg-black/20 border border-amber-900/30 rounded-lg hover:border-amber-500/50 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate text-amber-100">
                    {design.text || "Untitled Design"}
                  </h4>
                  <p className="text-[10px] text-amber-200/40">
                    {design.width}" x {design.height}" • {new Date(design.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-amber-200 hover:text-amber-100 hover:bg-amber-900/40"
                    onClick={() => onLoad(design)}
                  >
                    <ExternalLink size={14} />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    onClick={() => onDelete(design.id)}
                  >
                    <Trash2 size={14} />
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