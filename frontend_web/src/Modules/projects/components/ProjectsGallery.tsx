import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveMediaUrl } from "@/common/utils/resolveMediaUrl";
import type { ProjectImage } from "@/types/project.types";

interface ProjectsGalleryProps {
  images: ProjectImage[];
}

export function ProjectsGallery({ images }: ProjectsGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const resolvedUrls = images
    .map((img) => resolveMediaUrl(img.image?.url))
    .filter((url): url is string => Boolean(url));

  if (resolvedUrls.length === 0) return null;

  function goPrev() {
    setActiveIndex((i) => (i === 0 ? resolvedUrls.length - 1 : i - 1));
  }

  function goNext() {
    setActiveIndex((i) => (i === resolvedUrls.length - 1 ? 0 : i + 1));
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-border">
      <img
        src={resolvedUrls[activeIndex]}
        alt={`Project screenshot ${activeIndex + 1}`}
        className="w-full aspect-video object-cover"
      />

      {resolvedUrls.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {resolvedUrls.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === activeIndex ? "bg-foreground" : "bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}