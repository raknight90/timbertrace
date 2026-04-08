"use client";

import React, { useState, useEffect } from 'react';
import { EngravingDesign, Decoration } from '@/types/engraving';
import SignCanvas from '@/components/SignCanvas';
import DesignToolbar from '@/components/DesignToolbar';
import DecorationPicker from '@/components/DecorationPicker';
import DesignLibrary from '@/components/DesignLibrary';
import { showSuccess, showError } from '@/utils/toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Hammer } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';

const DEFAULT_DESIGN: EngravingDesign = {
  id: '1',
  name: 'New Design',
  width: 24,
  height: 12,
  text: 'THE SMITHS',
  fontFamily: "'Playfair Display', serif",
  fontSize: 80,
  decorations: [],
  createdAt: Date.now(),
};

const Index = () => {
  const [currentDesign, setCurrentDesign] = useState<EngravingDesign>(DEFAULT_DESIGN);
  const [library, setLibrary] = useState<EngravingDesign[]>([]);

  // Load library from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wood-sign-library');
    if (saved) {
      try {
        setLibrary(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load library", e);
      }
    }
  }, []);

  // Save library to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wood-sign-library', JSON.stringify(library));
  }, [library]);

  const handleUpdateDesign = (updates: Partial<EngravingDesign>) => {
    setCurrentDesign(prev => ({ ...prev, ...updates }));
  };

  const handleAddDecoration = (content: string) => {
    const newDec: Decoration = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'icon',
      name: 'Decoration',
      content,
      position: { x: 50, y: 50 },
      scale: 1,
    };
    setCurrentDesign(prev => ({
      ...prev,
      decorations: [...prev.decorations, newDec]
    }));
    showSuccess("Decoration added!");
  };

  const handleSaveToLibrary = () => {
    const newDesign = {
      ...currentDesign,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    setLibrary(prev => [newDesign, ...prev]);
    showSuccess("Design saved to library!");
  };

  const handleLoadDesign = (design: EngravingDesign) => {
    setCurrentDesign(design);
    showSuccess("Design loaded!");
  };

  const handleDeleteDesign = (id: string) => {
    setLibrary(prev => prev.filter(d => d.id !== id));
    showSuccess("Design removed from library");
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('sign-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: currentDesign.width > currentDesign.height ? 'landscape' : 'portrait',
        unit: 'in',
        format: [currentDesign.width, currentDesign.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, currentDesign.width, currentDesign.height);
      pdf.save(`${currentDesign.text || 'wood-sign'}-template.pdf`);
      showSuccess("PDF exported successfully!");
    } catch (err) {
      showError("Failed to export PDF");
      console.error(err);
    }
  };

  return (
    <div 
      className="min-h-screen text-amber-50 font-sans selection:bg-amber-500/30 relative"
      style={{
        backgroundColor: '#1a0f05',
        backgroundImage: 'linear-gradient(rgba(26, 15, 5, 0.85), rgba(26, 15, 5, 0.95)), url("https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center'
      }}
    >
      {/* Header */}
      <header className="border-b border-amber-900/30 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-700 p-2 rounded-lg shadow-lg shadow-amber-900/20">
              <Hammer className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-amber-100">TimberTrace</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500/60 font-semibold">Engraving Template Studio</p>
            </div>
          </div>
          <div className="hidden md:block text-sm text-amber-200/40 italic">
            Crafting digital templates for physical masterpieces
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <DesignToolbar 
              design={currentDesign} 
              onUpdate={handleUpdateDesign}
              onSave={handleSaveToLibrary}
              onExport={handleExportPDF}
            />
            <DecorationPicker onAdd={handleAddDecoration} />
            <DesignLibrary 
              designs={library} 
              onLoad={handleLoadDesign} 
              onDelete={handleDeleteDesign} 
            />
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-8 flex flex-col items-center justify-start pt-4">
            <div className="w-full sticky top-28">
              <div className="mb-6 flex items-center justify-between w-full max-w-[800px]">
                <h2 className="text-lg font-medium text-amber-200/80">Live Preview</h2>
                <div className="flex gap-4 text-xs text-amber-200/40">
                  <span>Scale: 1:1 (Digital)</span>
                  <span>Material: Dark Walnut</span>
                </div>
              </div>
              
              <div className="flex justify-center w-full">
                <SignCanvas design={currentDesign} id="sign-preview" />
              </div>

              <div className="mt-12 p-6 rounded-xl bg-black/40 backdrop-blur-sm border border-amber-900/20 max-w-[800px] w-full">
                <h3 className="text-sm font-semibold text-amber-200 mb-2 uppercase tracking-wider">Pro Tip</h3>
                <p className="text-sm text-amber-200/60 leading-relaxed">
                  When exporting for CNC or laser engraving, ensure your font size is large enough for the bit or beam width. 
                  The PDF export maintains the aspect ratio of your physical sign dimensions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-amber-900/20 py-10 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto px-6 flex flex-col items-center gap-4">
          <div className="flex gap-8 text-amber-200/30 text-sm">
            <a href="#" className="hover:text-amber-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-amber-200 transition-colors">Terms</a>
            <a href="#" className="hover:text-amber-200 transition-colors">Support</a>
          </div>
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Index;