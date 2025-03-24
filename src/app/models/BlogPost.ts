export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl?: string;
  imageColor?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  addToHome?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} 