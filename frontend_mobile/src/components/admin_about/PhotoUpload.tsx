import { View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Upload } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface AvatarUploaderProps {
  avatarUri: string | null;
  initial: string;
  onAvatarChange: (uri: string) => void;
}

export default function AvatarUploader({
  avatarUri,
  initial,
  onAvatarChange,
}: AvatarUploaderProps) {
  const { colors } = useTheme();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      onAvatarChange(result.assets[0].uri);
    }
  };

  return (
    <View
      className="flex-row items-center gap-4 rounded-[20px] border p-5"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} className="w-16 h-16 rounded-2xl" />
      ) : (
        <LinearGradient
          colors={["#8B5CF6", "#D946EF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-16 h-16 rounded-2xl items-center justify-center"
        >
          <Text className="text-[20px] font-bold text-white">{initial}</Text>
        </LinearGradient>
      )}

      <TouchableOpacity
        className="h-11 flex-row items-center gap-2 rounded-full border px-4"
        style={{ backgroundColor: colors.background, borderColor: colors.border }}
        activeOpacity={0.7}
        onPress={pickImage}
      >
        <Upload size={16} color={colors.text} />
        <Text className="text-[14px] font-semibold" style={{ color: colors.text }}>
          Upload avatar
        </Text>
      </TouchableOpacity>
    </View>
  );
}