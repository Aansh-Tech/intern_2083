export interface Comments {
  id: string;
  postId: string;
  author: string;          // user name or ID
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
}

export interface Post {
  id: string;
  category?: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  body: string[];
  gradient: [string, string, ...string[]];
  comments?: Comment[];    // only approved comments are shown to users
}