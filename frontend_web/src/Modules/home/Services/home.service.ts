import { projectsService } from "@/Modules/projects/Services/projects.service";
import { aboutService } from "@/Modules/about/services/about.service";
import { blogService } from "@/Modules/blog/services/blog.service";
import type { Project } from "@/types/project.types";
import type { Skill } from "@/types/skill.types";
import type { BlogPost } from "@/types/blogPost.types";

export const homeService = {
  // LIVE — GET /projects/featured
  async getFeaturedProjects(): Promise<Project[]> {
    return projectsService.getFeatured();
  },

  // LIVE — GET /skills
  async getSkills(): Promise<Skill[]> {
    return aboutService.getSkills();
  },

  // NOT LIVE YET — BlogPostController is empty on the backend.
  // Deliberately NOT falling back to mock data here. This will fail/throw
  // until the backend implements it, and LatestBlogPosts below handles
  // that failure with an honest empty state instead of faking posts.
  async getLatestPosts(): Promise<BlogPost[]> {
    return blogService.getLatestPosts();
  },
};