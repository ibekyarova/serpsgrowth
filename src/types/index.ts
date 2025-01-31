export interface ApiConfig {
  provider: string;
  apiKey: string;
}

export interface WebsiteInfo {
  url: string;
  internalLinks: string[];
}

export interface Article {
  title: string;
  content: string;
  outline: string[];
  images?: ArticleImage[];
}

export interface ArticleImage {
  url: string;
  alt: string;
  caption: string;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  isPopular?: boolean;
}

export type ArticleLength = '700-1200' | '1200-2000' | '2000-3500';

export interface Language {
  code: string;
  name: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface GenerationOptions {
  articleLength: ArticleLength;
  generateImages: boolean;
  language: Language;
  country: Country;
}
