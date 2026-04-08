export interface Decoration {
  id: string;
  type: 'border' | 'corner' | 'icon';
  name: string;
  content: string;
  position: { x: number; y: number };
  scale: number;
}

export type WoodMaterial = 'walnut' | 'oak' | 'cherry' | 'pine';

export interface EngravingDesign {
  id: string;
  name: string;
  width: number; // in inches
  height: number; // in inches
  text: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  material: WoodMaterial;
  decorations: Decoration[];
  createdAt: number;
}