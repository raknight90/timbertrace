export interface Decoration {
  id: string;
  type: 'border' | 'corner' | 'icon' | 'image';
  name: string;
  content: string;
  src?: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  flipX?: boolean;
  flipY?: boolean;
}

export interface TextElement {
  id: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  letterSpacing: number;
  position: { x: number; y: number };
}

export type WoodMaterial = 'walnut' | 'oak' | 'cherry' | 'pine' | 'maple' | 'mahogany' | 'cedar' | 'ebony' | 'birch';

export interface EngravingDesign {
  id: string;
  name: string;
  width: number;
  height: number;
  material: WoodMaterial;
  textElements: TextElement[];
  decorations: Decoration[];
  createdAt: number;
  thumbnail?: string;
}