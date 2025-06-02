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
  photo?: string;
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