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

export type WoodMaterial = 'walnut' | 'oak' | 'cherry' | 'pine' | 'maple' | 'mahogany' | 'cedar' | 'ebony' | 'birch';

export interface EngravingDesign {
  id: string;
  name: string;
  width: number;
  height: number;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  letterSpacing: number;
  material: WoodMaterial;
  decorations: Decoration[];
  textPosition: { x: number; y: number };
  createdAt: number;
  thumbnail?: string; // Base64 preview image
}