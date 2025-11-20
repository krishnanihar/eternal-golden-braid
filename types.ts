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
}