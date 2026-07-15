import { useEffect, useState } from "react";
import { HeroSection } from "../components/HeroSection";
import { FeaturedProject } from "../components/FeaturedProject";
import { ToolKitSection } from "../components/ToolKitSection";
import { LatestBlogPosts } from "../components/LatestBlogPosts";
import { homeService } from "../Services/home.service";
import type { Project } from "@/types/project.types";
import type { Skill } from "@/types/skill.types";
import type { BlogPost } from "@/types/blogPost.types";

export function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [projectsState, setProjectsState] = useState<{ loading: boolean; error: string | null }>({
    loading: true,
    error: null,
  });
  const [skillsState, setSkillsState] = useState<{ loading: boolean; error: string | null }>({
    loading: true,
    error: null,
  });
  const [postsState, setPostsState] = useState<{ loading: boolean; error: string | null }>({
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    homeService
      .getFeaturedProjects()
      .then((data) => isMounted && setProjects(data))
      .catch((err) => isMounted && setProjectsState({ loading: false, error: err.message }))
      .finally(() => isMounted && setProjectsState((s) => ({ ...s, loading: false })));

    homeService
      .getSkills()
      .then((data) => isMounted && setSkills(data))
      .catch((err) => isMounted && setSkillsState({ loading: false, error: err.message }))
      .finally(() => isMounted && setSkillsState((s) => ({ ...s, loading: false })));

    homeService
      .getLatestPosts()
      .then((data) => isMounted && setPosts(data))
      .catch((err) => isMounted && setPostsState({ loading: false, error: err.message }))
      .finally(() => isMounted && setPostsState((s) => ({ ...s, loading: false })));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <HeroSection />
      <FeaturedProject
        projects={projects}
        isLoading={projectsState.loading}
        error={projectsState.error}
      />
      <ToolKitSection skills={skills} isLoading={skillsState.loading} error={skillsState.error} />
      <LatestBlogPosts posts={posts} isLoading={postsState.loading} error={postsState.error} />
    </>
  );
}