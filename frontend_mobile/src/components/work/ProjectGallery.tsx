import { useState } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
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
  onImagePress?: (index: number) => void;
}

const imageKey = (img: ProjectImage & { key?: string }): string =>
  img.key || (img.id !== undefined && img.id !== null ? String(img.id) : "") || img.url;

export default function ProjectGallery({
  images,
  height = 220,
  horizontalPadding = 40,
  onImagePress,
}: ProjectGalleryProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const pageWidth = Math.max(width - horizontalPadding, 1);
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleImages = dedupeImages(images).slice(0, MAX_PROJECT_PHOTOS);

  if (!visibleImages || visibleImages.length === 0) return null;

  if (visibleImages.length === 1) {
    return (
      <TouchableOpacity
        activeOpacity={onImagePress ? 0.9 : 1}
        onPress={onImagePress ? () => onImagePress(0) : undefined}
      >
        <Image
          source={{ uri: visibleImages[0].url }}
          style={{ width: "100%", height, borderRadius: 20 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
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
        {visibleImages.map((img, index) => (
          <TouchableOpacity
            key={imageKey(img)}
            activeOpacity={onImagePress ? 0.9 : 1}
            onPress={onImagePress ? () => onImagePress(index) : undefined}
          >
            <Image
              source={{ uri: img.url }}
              style={{ width: pageWidth, height, borderRadius: 20 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 10 }}>
        {visibleImages.map((img, index) => (
          <View
            key={imageKey(img)}
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