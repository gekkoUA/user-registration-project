export interface UserDetails {
  id?: string;
  fullName: string;
  constituency: string;
  party: string;
  position: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  vision: string;
  education: Education[];
  photo?: string | StrapiMedia; // Can be URL string or Strapi media object
  // Contact Details
  phone?: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  // Strapi timestamps (optional)
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Education {
  id?: string;
  degree: string;
  college: string;
  graduationYear: string;
}

export interface UserState {
  users: UserDetails[];
  loading: boolean;
  error: string | null;
}

// Strapi specific types
export interface StrapiMedia {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: any;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  createdAt: string;
  updatedAt: string;
}

// Helper type for form data
export type UserFormData = Omit<UserDetails, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>;