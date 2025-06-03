export interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

// Filière structure
export interface Filiere {
  id: string;
  name: string;
  formation: 'Management et Finance' | 'Ingénierie';
  degree: 'BAC+3' | 'BAC+5';
  levels: number[];
}

export const FILIERES: Filiere[] = [
  { id: 'mge', name: 'MGE', formation: 'Management et Finance', degree: 'BAC+3', levels: [1, 2, 3] },
  { id: 'mdi', name: 'MDI', formation: 'Management et Finance', degree: 'BAC+3', levels: [1, 2, 3] },
  { id: 'facg', name: 'FACG', formation: 'Management et Finance', degree: 'BAC+5', levels: [4, 5] },
  { id: 'mri', name: 'MRI', formation: 'Management et Finance', degree: 'BAC+5', levels: [4, 5] },
  { id: 'iisi3', name: 'IISI (BAC+3)', formation: 'Ingénierie', degree: 'BAC+3', levels: [1, 2, 3] },
  { id: 'iisi5', name: 'IISI (BAC+5)', formation: 'Ingénierie', degree: 'BAC+5', levels: [4, 5] },
  { id: 'iisrt', name: 'IISRT', formation: 'Ingénierie', degree: 'BAC+5', levels: [4, 5] },
];

export interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  filiere?: string; // Optional: Associate student with a filiere
  level?: number; // Optional: Associate student with a level
  semester?: string; // Add semester property
}
