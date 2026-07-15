import { projectsService } from "@/Modules/projects/Services/projects.service";
import { aboutService } from "@/Modules/about/services/about.service";
import { blogService } from "@/Modules/blog/services/blog.service";
import type { Project } from "@/types/project.types";
import type { Skill } from "@/types/skill.types";
import type { BlogPost } from "@/types/blogPost.types";

export const homeService = {
  async getFeaturedProjects(): Promise<Project[]> {
    return projectsService.getFeatured();
  },

  async getSkills(): Promise<Skill[]> {
    return aboutService.getSkills();
  },

  async getLatestPosts(): Promise<BlogPost[]> {
    return blogService.getLatestPosts();
  },
};