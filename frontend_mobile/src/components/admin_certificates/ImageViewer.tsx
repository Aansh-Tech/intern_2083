import { memo } from "react";
import { View, Image, TouchableOpacity, Modal, Dimensions } from "react-native";
import { X } from "lucide-react-native";

interface ImageViewerProps {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

const { width, height } = Dimensions.get("window");

function ImageViewer({ visible, imageUrl, onClose }: ImageViewerProps) {
  if (!imageUrl) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.92)" }}>
        <TouchableOpacity
          className="absolute top-12 right-5 z-10 w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <X size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Image
          source={{ uri: imageUrl }}
          style={{ width: width - 32, height: height * 0.6 }}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
}

export default memo(ImageViewer);
