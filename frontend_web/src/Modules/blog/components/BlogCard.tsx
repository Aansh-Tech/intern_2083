import { Link } from "react-router-dom";
import { Card } from "@/common/components/Card";
import { Badge } from "@/common/components/Badge";
import { formatDate } from "@/common/utils/formatDate";
import { resolveMediaUrl } from "@/common/utils/resolveMediaUrl";
import { ROUTES } from "@/common/constants/routes";
import type { BlogPost } from "@/types/blogPost.types";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const thumbnail = post.images?.find((img) => img.is_primary) ?? post.images?.[0];
  const thumbnailSrc = resolveMediaUrl(thumbnail?.image?.url);

  return (
    <Card>
      <Link to={`${ROUTES.blog}/${post.slug}`} className="block">
        {thumbnailSrc && (
          <img
            src={thumbnailSrc}
            alt={post.title}
            className="mb-3 w-full aspect-video rounded-lg object-cover"
          />
        )}

        {post.category && <Badge>{post.category}</Badge>}

        <h3 className="mt-2 text-lg font-semibold text-foreground mb-2">{post.title}</h3>
        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">{formatDate(post.published_at)}</p>
      </Link>
    </Card>
  );
}``