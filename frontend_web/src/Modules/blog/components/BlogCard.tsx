import { Link } from "react-router-dom";
import { Card } from "@/common/components/Card";
import { formatDate } from "@/common/utils/formatDate";
import { ROUTES } from "@/common/constants/routes";
import type { BlogPost } from "@/types/blogPost.types";
import { resolveMediaUrl } from "@/common/utils/resolveMediaUrl";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card>
      <Link to={`${ROUTES.blog}/${post.slug}`} className="block">
        {post.featured_image && (
          <img
            src={resolveMediaUrl(post.featured_image)}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-md mb-3"
          />
        )}
        <p className="text-xs text-muted-foreground mb-1">{formatDate(post.published_at)}</p>
        <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
      </Link>
    </Card>
  );
}