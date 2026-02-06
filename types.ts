
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'Community' | 'Technology' | 'Health' | 'Environment' | 'Culture';
  location: string;
  year: number;
  sources: Source[];
}

export interface Source {
  publisher: string;
  url: string;
}

export interface LocationState {
  lat: number;
  lng: number;
  name: string;
}

export enum AppState {
  LANDING = 'landing',
  EXPLORING = 'exploring'
}
