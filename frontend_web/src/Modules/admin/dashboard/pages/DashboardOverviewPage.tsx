import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Folder, Sparkles } from "lucide-react";
import { projectsService } from "@/Modules/projects/Services/projects.service";
import { useAuth } from "@/common/hooks/useAuth";
import { adminContactMessagesService } from "@/Modules/admin/contact/services/adminContact.services";
import { adminCommentsService } from "@/Modules/admin/comments/service/adminComment.service";
import { adminBlogPostsService } from "@/Modules/admin/blog/services/adminBlogPost.service";
import type { ContactMessage } from "@/types/contactMessage.types";
import type { Comment } from "@/types/comment.types";
import type { BlogPost } from "@/types/blogPost.types";
import type { Project } from "@/types/project.types";

export function DashboardOverviewPage() {
  const { user } = useAuth();
  const [totalProjects, setTotalProjects] = useState<number | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<number | null>(null);

  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [latestProjects, setLatestProjects] = useState<Project[]>([]);
  const [loadingWidgets, setLoadingWidgets] = useState(true);

  useEffect(() => {
    projectsService.getAll()
      .then((projects) => {
        setTotalProjects(projects.length);
        setFeaturedProjects(projects.filter((p) => p.is_featured).length);
      })
      .catch(() => {
        setTotalProjects(0);
        setFeaturedProjects(0);
      });
  }, []);

  useEffect(() => {
    async function loadWidgets() {
      setLoadingWidgets(true);
      try {
        const [messages, comments, posts, projects] = await Promise.all([
          adminContactMessagesService.getAll(),
          adminCommentsService.getAll("pending"),
          adminBlogPostsService.getAll(),
          projectsService.getAll(),
        ]);
        setRecentMessages(messages.slice(0, 3));
        setPendingComments(comments.slice(0, 3));
        setRecentPosts(posts.slice(0, 3));
        setLatestProjects(projects.slice(0, 4));
      } catch (err) {
        console.error("Failed to load dashboard widgets:", err);
      } finally {
        setLoadingWidgets(false);
      }
    }
    loadWidgets();
  }, []);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Overview</p>
      <h1 className="mt-1 text-3xl font-bold">Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Here's what's happening across the site today.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Folder} label="Total Projects" value={totalProjects ?? "…"} />
        <StatCard icon={Sparkles} label="Featured" value={featuredProjects ?? "…"} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent messages */}
        <PreviewCard title="Recent messages" viewHref="/admin/messages">
          {loadingWidgets ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : recentMessages.length === 0 ? (
            <p className="text-sm text-slate-400">No messages yet.</p>
          ) : (
            recentMessages.map((msg) => (
              <PreviewRow
                key={msg.id}
                title={msg.name}
                subtitle={msg.subject}
                badge={!msg.is_read ? "New" : undefined}
              />
            ))
          )}
        </PreviewCard>

        {/* Pending comments */}
        <PreviewCard title="Pending comments" viewHref="/admin/comments">
          {loadingWidgets ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : pendingComments.length === 0 ? (
            <p className="text-sm text-slate-400">No pending comments.</p>
          ) : (
            pendingComments.map((comment) => (
              <PreviewRow
                key={comment.id}
                title={comment.name ?? "Anonymous"}
                subtitle={comment.content}
                badge={comment.status === "pending" ? "Pending" : undefined}
              />
            ))
          )}
        </PreviewCard>

        {/* Recent posts */}
        <PreviewCard title="Recent posts" viewHref="/admin/blog-posts">
          {loadingWidgets ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : recentPosts.length === 0 ? (
            <p className="text-sm text-slate-400">No posts yet.</p>
          ) : (
            recentPosts.map((post) => (
              <PreviewRow
                key={post.id}
                title={post.title}
                subtitle={post.status === "published" ? "Published" : post.status}
              />
            ))
          )}
        </PreviewCard>
      </div>

      {/* Latest projects */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Latest projects</h2>
          <Link to="/admin/projects" className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
            Manage →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {loadingWidgets ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : latestProjects.length === 0 ? (
            <p className="text-sm text-slate-400">No projects yet.</p>
          ) : (
            latestProjects.map((project) => (
              <ProjectPreviewCard key={project.id} project={project} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Folder; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
        <Icon className="h-4 w-4 text-slate-300 dark:text-slate-600" />
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}

function PreviewCard({ title, viewHref, children }: { title: string; viewHref: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <Link to={viewHref} className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
          View →
        </Link>
      </div>
      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {children}
      </div>
    </div>
  );
}

function PreviewRow({ title, subtitle, badge }: { title: string; subtitle?: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
        {subtitle && <p className="truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {badge && (
        <span className="shrink-0 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
      )}
    </div>
  );
}

function ProjectPreviewCard({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{project.title}</p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{project.status}</p>
      </div>
    </div>
  );
}