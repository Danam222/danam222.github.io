export interface Student {
  id: string;
  name: string;
  gender?: 'male' | 'female' | 'other'; // Optional expansion
  difficulties: string[]; // IDs of difficulty factors
  helpers: string[]; // IDs of help factors
}

export interface Factor {
  id: string;
  label: string;
  type: 'difficulty' | 'helper';
}

export interface ClassGroup {
  id: number;
  name: string;
  students: Student[];
  stats: {
    total: number;
    difficultyScore: number;
    helperScore: number;
  };
}

export interface AppState {
  step: number;
  classCount: number;
  factors: Factor[];
  students: Student[];
  groups: ClassGroup[];
}