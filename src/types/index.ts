export interface College {
  id: string;
  slug: string;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  description: string;
  establishedYear?: number;
  courses?: Course[];
  reviews?: Review[];
  placement?: Placement;
}

export interface Course {
  id: string;
  collegeId: string;
  name: string;
  duration: string;
  fees: number;
}

export interface Review {
  id: string;
  collegeId: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Placement {
  id: string;
  collegeId: string;
  averagePackage: number;
  highestPackage: number;
  placementRate: number;
}

export interface SearchFilters {
  q?: string;
  location?: string;
  maxFees?: number;
  minRating?: number;
  sort?: 'rating_desc' | 'fees_asc' | 'fees_desc' | 'name_asc';
  page?: number;
  limit?: number;
}

export interface PredictorRequest {
  exam: string;
  rank: number;
}

export interface PredictorResult {
  college: College;
  matchType: 'Likely' | 'Moderate' | 'Reach';
  reason: string;
}