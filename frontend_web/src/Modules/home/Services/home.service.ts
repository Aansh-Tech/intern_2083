import { projectsService } from "../../projects/Services/projects.service";
import { aboutService } from "../../about/services/about.service";
import type { Project } from "../../../types/project.types";
import type { Skill } from "../../../types/skill.types";
import type { BlogPost } from "../../../types/blogPost.types";

/**
 * Home page needs data from three different resources. Featured projects
 * and skills are LIVE. Latest blog posts stay mocked until
 * BlogPostController gets an actual index() method.
 */
export const homeService = {
  async getFeaturedProjects(): Promise<Project[]> {
    return projectsService.getFeatured();
  },

  async getSkills(): Promise<Skill[]> {
    return aboutService.getSkills();
  },

  async getLatestPosts(): Promise<BlogPost[]> {
    // TODO: replace with a real call once BlogPostController@index exists, e.g.
    // const { data } = await apiClient.get<ApiResponse<BlogPost[]>>("/blog-posts?limit=3");
    // return data.data;
    return Promise.resolve(mockLatestPosts);
  },
};