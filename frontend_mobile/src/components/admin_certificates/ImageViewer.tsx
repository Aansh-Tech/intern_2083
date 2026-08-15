import { memo } from "react";
import { View, Image, TouchableOpacity, Modal, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";

interface ImageViewerProps {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

function ImageViewer({ visible, imageUrl, onClose }: ImageViewerProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  if (!imageUrl) return null;

  const maxImageWidth = Math.min(width - 32, 640);
  const maxImageHeight = height * 0.6;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.92)" }}>
        <TouchableOpacity
          className="absolute right-5 z-10 w-10 h-10 rounded-full items-center justify-center"
          style={{ top: insets.top + 8, backgroundColor: "rgba(255,255,255,0.15)" }}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <X size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Image
          source={{ uri: imageUrl }}
          style={{ width: maxImageWidth, height: maxImageHeight }}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
}

export default memo(ImageViewer);
