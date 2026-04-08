export interface Decoration {
  id: string;
  type: 'border' | 'corner' | 'icon';
  name: string;
  content: string; // SVG path or icon name
  position: { x: number; y: number };
  scale: number;
}

export interface EngravingDesign {
  id: string;
  name: string;
  width: number; // in inches
  height: number; // in inches
  text: string;
  fontFamily: string;
  fontSize: number;
  decorations: Decoration[];
  createdAt: number;
}