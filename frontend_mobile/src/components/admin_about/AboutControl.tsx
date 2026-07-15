import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, RefreshControl } from "react-native";
import { Save } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import AvatarUploader from "./PhotoUpload";
import IdentityForm from "./IdForm";
import CertificatesManager from "./Certificates";

interface AboutControlProps {
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function AboutControl({ refreshing, onRefresh }: AboutControlProps) {
  const { colors } = useTheme();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [name, setName] = useState("Anish Shrestha");
  const [role, setRole] = useState("Software Engineer & Designer");
  const [bio, setBio] = useState(
    "I design and build calm, high-performance interfaces for ambitious software teams. Currently focused on developer tools and design systems."
  );
  const [certificates, setCertificates] = useState<string[]>([
    "Google UX Design — 2023",
    "Meta Frontend Developer — 2022",
    "AWS Cloud Practitioner — 2024",
  ]);

  const addCertificate = (text: string) => {
    setCertificates((prev) => [...prev, text]);
  };

  const removeCertificate = (index: number) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // TODO: replace with your real persistence layer (API call / AsyncStorage)
    const payload = { name, role, bio, avatarUri, certificates };
    console.log("Saving about page:", payload);
    Alert.alert("Saved", "Your About page has been updated.");
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="gap-5 px-5 pb-10"
      refreshControl={
        onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} /> : undefined
      }
    >
      <View className="flex-row items-start justify-between pt-2">
        <View className="gap-1">
          <Text className="text-[26px] font-bold" style={{ color: colors.text }}>
            About page
          </Text>
          <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
            Update your public profile.
          </Text>
        </View>

        <TouchableOpacity
          className="h-11 flex-row items-center gap-2 rounded-full px-4"
          style={{ backgroundColor: colors.primary }}
          activeOpacity={0.85}
          onPress={handleSave}
        >
          <Save size={16} color={colors.text} />
          <Text className="text-[14px] font-semibold" style={{ color: colors.text }}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <AvatarUploader
        avatarUri={avatarUri}
        initial={name.charAt(0) || "A"}
        onAvatarChange={setAvatarUri}
      />

      <IdentityForm
        name={name}
        role={role}
        bio={bio}
        onChangeName={setName}
        onChangeRole={setRole}
        onChangeBio={setBio}
      />

      <CertificatesManager
        certificates={certificates}
        onAdd={addCertificate}
        onRemove={removeCertificate}
      />
    </ScrollView>
  );
}