"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { EngravingDesign, Decoration } from '@/types/engraving';
import SignCanvas from '@/components/SignCanvas';
import DesignToolbar from '@/components/DesignToolbar';
import DecorationPicker from '@/components/DecorationPicker';
import DesignLibrary from '@/components/DesignLibrary';
import { showSuccess, showError } from '@/utils/toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Hammer, Plus, Undo2, Redo2 } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DEFAULT_DESIGN: EngravingDesign = {
  id: '1',
  name: 'New Design',
  width: 24,
  height: 12,
  text: 'THE SMITHS',
  fontFamily: "'Playfair Display', serif",
  fontSize: 80,
  fontColor: 'rgba(20, 10, 5, 0.9)',
  letterSpacing: 0,
  material: 'walnut',
  decorations: [],
  textPosition: { x: 50, y: 50 },
  textRotation: 0,
  createdAt: Date.now(),
};

const Index = () => {
  const [currentDesign, setCurrentDesign] = useState<EngravingDesign>(DEFAULT_DESIGN);
  const [history, setHistory] = useState<EngravingDesign[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [library, setLibrary] = useState<EngravingDesign[]>([]);

  // Load library from local storage
  useEffect(() => {
    const saved = localStorage.getItem('wood-sign-library');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLibrary(parsed);
      } catch (e) {
        console.error("Failed to load library", e);
      }
    }
  }, []);

  // Save library to local storage
  useEffect(() => {
    localStorage.setItem('wood-sign-library', JSON.stringify(library));
  }, [library]);

  // History Management
  const addToHistory = useCallback((design: EngravingDesign) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, JSON.parse(JSON.stringify(design))].slice(-50); // Keep last 50 steps
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setCurrentDesign(JSON.parse(JSON.stringify(history[prevIndex])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setCurrentDesign(JSON.parse(JSON.stringify(history[nextIndex])));
    }
  };

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      setHistory([JSON.parse(JSON.stringify(DEFAULT_DESIGN))]);
      setHistoryIndex(0);
    }
  }, []);

  const handleNewDesign = () => {
    const newDesign = {
      ...DEFAULT_DESIGN,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    setCurrentDesign(newDesign);
    addToHistory(newDesign);
    showSuccess("Started a new design");
  };

  const handleUpdateDesign = (updates: Partial<EngravingDesign>) => {
    const updated = { ...currentDesign, ...updates };
    setCurrentDesign(updated);
    // Only add to history for significant changes (not every drag frame)
    // For simplicity here, we'll add it, but in a real app we might debounce
    if (!updates.textPosition) {
      addToHistory(updated);
    }
  };

  const handleAddDecoration = (content: string) => {
    const newDec: Decoration = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'icon',
      name: 'Decoration',
      content,
      position: { x: 50, y: 50 },
      scale: 1,
      rotation: 0,
    };
    const updated = {
      ...currentDesign,
      decorations: [...currentDesign.decorations, newDec]
    };
    setCurrentDesign(updated);
    addToHistory(updated);
    showSuccess("Decoration added!");
  };

  const handleAddImageDecoration = (src: string) => {
    const newDec: Decoration = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'image',
      name: 'Custom Image',
      content: '',
      src,
      position: { x: 50, y: 50 },
      scale: 1,
      rotation: 0,
    };
    const updated = {
      ...currentDesign,
      decorations: [...currentDesign.decorations, newDec]
    };
    setCurrentDesign(updated);
    addToHistory(updated);
    showSuccess("Image added!");
  };

  const handleDuplicateDecoration = (id: string) => {
    const decToDup = currentDesign.decorations.find(d => d.id === id);
    if (!decToDup) return;

    const newDec: Decoration = {
      ...decToDup,
      id: Math.random().toString(36).substr(2, 9),
      position: { x: decToDup.position.x + 5, y: decToDup.position.y + 5 }
    };

    const updated = {
      ...currentDesign,
      decorations: [...currentDesign.decorations, newDec]
    };
    setCurrentDesign(updated);
    addToHistory(updated);
    showSuccess("Decoration duplicated!");
  };

  const handleUpdateDecoration = (id: string, updates: Partial<Decoration>) => {
    const updated = {
      ...currentDesign,
      decorations: currentDesign.decorations.map(d => d.id === id ? { ...d, ...updates } : d)
    };
    setCurrentDesign(updated);
    if (!updates.position) {
      addToHistory(updated);
    }
  };

  const handleBringToFront = (id: string) => {
    const dec = currentDesign.decorations.find(d => d.id === id);
    if (!dec) return;
    const others = currentDesign.decorations.filter(d => d.id !== id);
    const updated = {
      ...currentDesign,
      decorations: [...others, dec]
    };
    setCurrentDesign(updated);
    addToHistory(updated);
    showSuccess("Moved to front");
  };

  const handleRemoveDecoration = (id: string) => {
    const updated = {
      ...currentDesign,
      decorations: currentDesign.decorations.filter(d => d.id !== id)
    };
    setCurrentDesign(updated);
    addToHistory(updated);
    showSuccess("Decoration removed");
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
    setHistory([JSON.parse(JSON.stringify(design))]);
    setHistoryIndex(0);
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
      pdf.save(`${currentDesign.name || currentDesign.text || 'wood-sign'}-template.pdf`);
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
        backgroundColor: '#0f0a05',
        backgroundImage: 'radial-gradient(circle at center, rgba(42, 26, 10, 0.4) 0%, rgba(15, 10, 5, 1) 100%)',
      }}
    >
      <header className="border-b border-amber-900/30 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-700 p-2 rounded-lg shadow-lg shadow-amber-900/20">
                <Hammer className="text-white" size={24} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight text-amber-100">TimberTrace</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500/60 font-semibold">Engraving Studio</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-amber-900/20">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={undo} 
                disabled={historyIndex <= 0}
                className="h-8 w-8 text-amber-200 disabled:opacity-30"
              >
                <Undo2 size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={redo} 
                disabled={historyIndex >= history.length - 1}
                className="h-8 w-8 text-amber-200 disabled:opacity-30"
              >
                <Redo2 size={16} />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Input 
                value={currentDesign.name}
                onChange={(e) => handleUpdateDesign({ name: e.target.value })}
                className="bg-black/40 border-amber-900/30 text-amber-100 h-9 w-48 focus:ring-amber-500"
                placeholder="Project Name"
              />
            </div>
            <Button 
              onClick={handleNewDesign}
              variant="ghost"
              className="text-amber-200 hover:bg-amber-900/40 hover:text-amber-100"
            >
              <Plus size={18} className="mr-2" />
              New
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <DesignToolbar 
              design={currentDesign} 
              onUpdate={handleUpdateDesign}
              onSave={handleSaveToLibrary}
              onExport={handleExportPDF}
            />
            <DecorationPicker 
              onAdd={handleAddDecoration} 
              onAddImage={handleAddImageDecoration}
              selectedColor={currentDesign.fontColor}
            />
            <DesignLibrary 
              designs={library} 
              onLoad={handleLoadDesign} 
              onDelete={handleDeleteDesign} 
            />
          </div>

          <div className="lg:col-span-8 flex flex-col items-center justify-start pt-4 lg:sticky lg:top-24">
            <div className="w-full">
              <div className="mb-6 flex items-center justify-between w-full max-w-[800px] mx-auto">
                <h2 className="text-lg font-medium text-amber-200/80">Live Editor</h2>
                <div className="text-[10px] text-amber-500/40 uppercase tracking-widest font-bold">Drag elements to position</div>
              </div>
              
              <div className="flex justify-center w-full">
                <SignCanvas 
                  design={currentDesign} 
                  id="sign-preview" 
                  onUpdateDesign={handleUpdateDesign}
                  onUpdateDecoration={handleUpdateDecoration}
                  onRemoveDecoration={handleRemoveDecoration}
                  onDuplicateDecoration={handleDuplicateDecoration}
                  onBringToFront={handleBringToFront}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;