import { View, Text, TextInput } from "react-native";
import { useTheme } from "../../context/useTheme";

interface IdentityFormProps {
  name: string;
  role: string;
  bio: string;
  onChangeName: (value: string) => void;
  onChangeRole: (value: string) => void;
  onChangeBio: (value: string) => void;
}

export default function IdentityForm({
  name,
  role,
  bio,
  onChangeName,
  onChangeRole,
  onChangeBio,
}: IdentityFormProps) {
  const { colors } = useTheme();
  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <View
      className="gap-5 rounded-[20px] border p-5"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      <Text
        className="text-[12px] font-bold tracking-[1.5px]"
        style={{ color: colors.primary }}
      >
        IDENTITY
      </Text>

      <View className="gap-2">
        <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
          Name
        </Text>
        <TextInput
          value={name}
          onChangeText={onChangeName}
          placeholder="Your name"
          placeholderTextColor={colors.secondaryText}
          className="h-12 rounded-2xl border px-4 text-[15px]"
          style={inputStyle}
        />
      </View>

      <View className="gap-2">
        <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
          Role
        </Text>
        <TextInput
          value={role}
          onChangeText={onChangeRole}
          placeholder="Your role"
          placeholderTextColor={colors.secondaryText}
          className="h-12 rounded-2xl border px-4 text-[15px]"
          style={inputStyle}
        />
      </View>

      <View className="gap-2">
        <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
          Bio
        </Text>
        <TextInput
          value={bio}
          onChangeText={onChangeBio}
          placeholder="A short bio"
          placeholderTextColor={colors.secondaryText}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="min-h-[110px] rounded-2xl border px-4 py-3 text-[15px]"
          style={inputStyle}
        />
      </View>
    </View>
  );
}