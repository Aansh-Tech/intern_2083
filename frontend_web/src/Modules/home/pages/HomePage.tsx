import { HeroSection } from "../components/HeroSection";
import { FeaturedProjects } from "../components/FeaturedProjects";
import { ToolkitSection } from "../components/ToolkitSection";
import { LatestBlogPosts } from "../components/LatestBlogPosts";
import {
  mockFeaturedProjects,
  mockSkills,
  mockLatestPosts,
} from "../mock/home.mock";

// TODO: once the API is ready, replace the mock imports above with:
// const { data: projects } = useQuery(["projects", "featured"], projectsService.getFeatured);
// const { data: skills } = useQuery(["skills"], skillsService.getAll);
// const { data: posts } = useQuery(["blogPosts", "latest"], blogService.getLatest);

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProjects projects={mockFeaturedProjects} />
      <ToolkitSection skills={mockSkills} />
      <LatestBlogPosts posts={mockLatestPosts} />
    </>
  );
}