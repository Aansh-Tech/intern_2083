export interface ProfileImage {
  id: number;
  type: string; // e.g. "avatar"
  is_primary: boolean;
  image: {
    id: number;
    url: string;
  };
}

export interface Profile {
  id: number;
  title?: string;
  bio?: string;
  phone?: string;
  address?: string;
  resume_path?: string | null;
  resume_url?: string | null;
  images?: ProfileImage[];
}