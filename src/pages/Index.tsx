"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { EngravingDesign, Decoration, TextElement } from '@/types/engraving';
import SignCanvas from '@/components/SignCanvas';
import DesignToolbar from '@/components/DesignToolbar';
import DecorationPicker from '@/components/DecorationPicker';
import DesignLibrary from '@/components/DesignLibrary';
import { showSuccess, showError } from '@/utils/toast';
import html2canvas from 'html2canvas';
import { Hammer, Plus, Undo2, Redo2, Grid3X3 } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DEFAULT_DESIGN: EngravingDesign = {
  id: '1',
  name: 'New Design',
  width: 24,
  height: 12,
  material: 'walnut',
  textElements: [
    {
      id: 'initial-text',
      text: 'THE SMITHS',
      fontFamily: "'Playfair Display', serif",
      fontSize: 80,
      fontColor: 'rgba(20, 10, 5, 0.9)',
      letterSpacing: 0,
      position: { x: 50, y: 50 },
    }
  ],
  decorations: [],
  createdAt: Date.now(),
};

const Index = () => {
  const [currentDesign, setCurrentDesign] = useState<EngravingDesign>(DEFAULT_DESIGN);
  const [history, setHistory] = useState<EngravingDesign[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [library, setLibrary] = useState<EngravingDesign[]>([]);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
      return [...newHistory, JSON.parse(JSON.stringify(design))].slice(-50);
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
    setHistory([JSON.parse(JSON.stringify(newDesign))]);
    setHistoryIndex(0);
    setSelectedId(null);
    showSuccess("Started a new design");
  };

  const handleUpdateDesign = (updates: Partial<EngravingDesign>) => {
    const updated = { ...currentDesign, ...updates };
    setCurrentDesign(updated);
    addToHistory(updated);
  };

  const handleAddText = () => {
    const newText: TextElement = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'New Text',
      fontFamily: "'Playfair Display', serif",
      fontSize: 40,
      fontColor: 'rgba(20, 10, 5, 0.9)',
      letterSpacing: 0,
      position: { x: 50, y: 50 },
    };
    const updated = {
      ...currentDesign,
      textElements: [...currentDesign.textElements, newText]
    };
    setCurrentDesign(updated);
    addToHistory(updated);
    setSelectedId(newText.id);
    showSuccess("Text block added!");
  };

  const handleUpdateText = (id: string, updates: Partial<TextElement>) => {
    const updated = {
      ...currentDesign,
      textElements: currentDesign.textElements.map(t => t.id === id ? { ...t, ...updates } : t)
    };
    setCurrentDesign(updated);
    if (!updates.position) {
      addToHistory(updated);
    }
  };

  const handleRemoveText = (id: string) => {
    const updated = {
      ...currentDesign,
      textElements: currentDesign.textElements.filter(t => t.id !== id)
    };
    setCurrentDesign(updated);
    addToHistory(updated);
    setSelectedId(null);
    showSuccess("Text block removed");
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
    setSelectedId(newDec.id);
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
    setSelectedId(newDec.id);
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
    setSelectedId(newDec.id);
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
    if (dec) {
      const others = currentDesign.decorations.filter(d => d.id !== id);
      const updated = {
        ...currentDesign,
        decorations: [...others, dec]
      };
      setCurrentDesign(updated);
      addToHistory(updated);
      showSuccess("Moved to front");
      return;
    }
    
    const textEl = currentDesign.textElements.find(t => t.id === id);
    if (textEl) {
      const others = currentDesign.textElements.filter(t => t.id !== id);
      const updated = {
        ...currentDesign,
        textElements: [...others, textEl]
      };
      setCurrentDesign(updated);
      addToHistory(updated);
      showSuccess("Moved to front");
    }
  };

  const handleRemoveDecoration = (id: string) => {
    const updated = {
      ...currentDesign,
      decorations: currentDesign.decorations.filter(d => d.id !== id)
    };
    setCurrentDesign(updated);
    addToHistory(updated);
    setSelectedId(null);
    showSuccess("Decoration removed");
  };

  const handleSaveToLibrary = async () => {
    const element = document.getElementById('sign-preview');
    if (!element) return;

    setSelectedId(null);

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(element, {
          scale: 0.5,
          useCORS: true,
          backgroundColor: null,
        });
        const thumbnail = canvas.toDataURL('image/jpeg', 0.5);

        const isExisting = library.some(d => d.id === currentDesign.id);

        if (isExisting) {
          setLibrary(prev => prev.map(d => 
            d.id === currentDesign.id 
              ? { ...currentDesign, thumbnail, createdAt: Date.now() } 
              : d
          ));
          showSuccess("Design updated in library!");
        } else {
          const newDesign = {
            ...currentDesign,
            createdAt: Date.now(),
            thumbnail
          };
          setLibrary(prev => [newDesign, ...prev]);
          showSuccess("Design saved to library!");
        }
      } catch (err) {
        console.error("Thumbnail generation failed", err);
        const isExisting = library.some(d => d.id === currentDesign.id);
        
        if (isExisting) {
          setLibrary(prev => prev.map(d => d.id === currentDesign.id ? currentDesign : d));
          showSuccess("Design updated (without preview)");
        } else {
          setLibrary(prev => [currentDesign, ...prev]);
          showSuccess("Design saved (without preview)");
        }
      }
    }, 50);
  };

  const handleLoadDesign = (design: EngravingDesign) => {
    setCurrentDesign(JSON.parse(JSON.stringify(design)));
    setHistory([JSON.parse(JSON.stringify(design))]);
    setHistoryIndex(0);
    setSelectedId(null);
    showSuccess("Design loaded!");
  };

  const handleDeleteDesign = (id: string) => {
    setLibrary(prev => prev.filter(d => d.id !== id));
    showSuccess("Design removed from library");
  };

  const handleExportPNG = async () => {
    const element = document.getElementById('sign-preview');
    if (!element) return;

    setSelectedId(null);

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
          backgroundColor: null,
        });
        
        const link = document.createElement('a');
        link.download = `${currentDesign.name || 'wood-sign'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showSuccess("PNG exported successfully!");
      } catch (err) {
        showError("Failed to export PNG");
        console.error(err);
      }
    }, 50);
  };

  const handlePrint = () => {
    setSelectedId(null);
    // Trigger native browser print dialog
    window.print();
  };

  const isExistingInLibrary = library.some(d => d.id === currentDesign.id);

  return (
    <div 
      className="min-h-screen text-amber-50 font-sans selection:bg-amber-500/30 relative"
      style={{
        backgroundColor: '#0f0a05',
        backgroundImage: 'radial-gradient(circle at center, rgba(42, 26, 10, 0.4) 0%, rgba(15, 10, 5, 1) 100%)',
      }}
    >
      <header className="border-b border-amber-900/30 bg-black/60 backdrop-blur-xl sticky top-0 z-50 no-print">
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

            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-amber-900/20">
              <Button 
                variant={showGrid ? "secondary" : "ghost"} 
                size="icon" 
                onClick={() => setShowGrid(!showGrid)}
                className={`h-8 w-8 ${showGrid ? 'bg-amber-500/20 text-amber-400' : 'text-amber-200'}`}
                title="Toggle Grid"
              >
                <Grid3X3 size={16} />
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
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar no-print">
            <DesignToolbar 
              design={currentDesign} 
              isExisting={isExistingInLibrary}
              selectedId={selectedId}
              onUpdate={handleUpdateDesign}
              onUpdateText={handleUpdateText}
              onAddText={handleAddText}
              onSave={handleSaveToLibrary}
              onExportPNG={handleExportPNG}
              onPrint={handlePrint}
            />
            <DecorationPicker 
              onAdd={handleAddDecoration} 
              onAddImage={handleAddImageDecoration}
              selectedColor={currentDesign.textElements[0]?.fontColor}
            />
            <DesignLibrary 
              designs={library} 
              onLoad={handleLoadDesign} 
              onDelete={handleDeleteDesign} 
            />
          </div>

          <div className="lg:col-span-8 flex flex-col items-center justify-start pt-4 lg:sticky lg:top-24">
            <div className="w-full">
              <div className="mb-6 flex items-center justify-between w-full max-w-[800px] mx-auto no-print">
                <h2 className="text-lg font-medium text-amber-200/80">Live Editor</h2>
                <div className="text-[10px] text-amber-500/40 uppercase tracking-widest font-bold">
                  {showGrid ? "Grid Snapping Active" : "Drag elements to position"}
                </div>
              </div>
              
              <div id="sign-preview-wrapper" className="flex justify-center w-full">
                <SignCanvas 
                  design={currentDesign} 
                  id="sign-preview" 
                  showGrid={showGrid}
                  snapToGrid={snapToGrid}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onUpdateDesign={handleUpdateDesign}
                  onUpdateText={handleUpdateText}
                  onUpdateDecoration={handleUpdateDecoration}
                  onRemoveText={handleRemoveText}
                  onRemoveDecoration={handleRemoveDecoration}
                  onDuplicateDecoration={handleDuplicateDecoration}
                  onBringToFront={handleBringToFront}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="no-print">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;