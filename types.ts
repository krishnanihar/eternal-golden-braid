import { ReactNode } from 'react';

export interface Chapter {
  id: number;
  part: string;
  title: string;
  description: string;
  visualType: 'logic' | 'geometry' | 'recursive' | 'network' | 'code' | 'gold';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  chapterId?: number;
}

// --- Neural Network Types (Chapter 12) ---
export interface Neuron {
  id: number;
  x: number;
  y: number;
  activation: number;
  threshold: number;
  connections: number[]; // IDs of connected neurons
  lastFired: number;
}

// --- TNT Types (Chapter 8) ---
export type TNTSymbolType = 'number' | 'variable' | 'operator' | 'quantifier' | 'punctuation';

export interface TNTSymbol {
  char: string;
  type: TNTSymbolType;
  val: number; // Gödel value mapping (simplified)
}

// --- MIU Graph Types (Chapter 1) ---
export interface MIUNode {
  id: string;
  value: string;
  parent: string | null;
  depth: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}
