export interface Project {
  _id?: string;
  title: string;
  description: string;
  content?: string;
  slug: string;
  imageUrl?: string;
  tags?: string[];
  repoUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  published?: boolean;
  addToHome?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} 