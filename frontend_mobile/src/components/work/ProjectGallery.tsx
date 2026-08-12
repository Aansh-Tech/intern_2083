import { useState } from "react";
import {
  View,
  Image,
  ScrollView,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useTheme } from "../../context/useTheme";
import type { ProjectImage } from "../../types/project";
import { MAX_PROJECT_PHOTOS } from "../../types/project";
import { dedupeImages } from "../../services/image";

interface ProjectGalleryProps {
  images: ProjectImage[];
  height?: number;
  horizontalPadding?: number;
}

export default function ProjectGallery({
  images,
  height = 220,
  horizontalPadding = 40,
}: ProjectGalleryProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const pageWidth = Math.max(width - horizontalPadding, 1);
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleImages = dedupeImages(images).slice(0, MAX_PROJECT_PHOTOS);

  if (!visibleImages || visibleImages.length === 0) return null;

  if (visibleImages.length === 1) {
    return (
      <Image
        source={{ uri: visibleImages[0].url }}
        style={{ width: "100%", height, borderRadius: 16 }}
        resizeMode="cover"
      />
    );
  }

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
    setActiveIndex(Math.min(Math.max(index, 0), visibleImages.length - 1));
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {visibleImages.map((img) => (
          <Image
            key={img.id}
            source={{ uri: img.url }}
            style={{ width: pageWidth, height, borderRadius: 16 }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 10 }}>
        {visibleImages.map((img, index) => (
          <View
            key={img.id}
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: index === activeIndex ? colors.primary : colors.border,
            }}
          />
        ))}
      </View>
    </View>
  );
}
