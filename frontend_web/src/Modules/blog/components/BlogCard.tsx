import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Card } from "../../../common/components/Card";
import { formatDate } from "../../../common/utils/formatDate";
import { ROUTES } from "../../../common/constants/routes";
import type { BlogPost } from "../../../types/blogPost.types";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="flex h-full flex-col justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {formatDate(post.publishedAt)}
        </p>
        <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {post.excerpt}
        </p>
      </div>

      <Link
        to={ROUTES.blogDetails(post.slug)}
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        Read more
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </Card>
  );
}
