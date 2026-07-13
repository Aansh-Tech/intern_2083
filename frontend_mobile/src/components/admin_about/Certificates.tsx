import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Trash2, Plus } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface CertificatesManagerProps {
  certificates: string[];
  onAdd: (text: string) => void;
  onRemove: (index: number) => void;
}

export default function CertificatesManager({
  certificates,
  onAdd,
  onRemove,
}: CertificatesManagerProps) {
  const { colors } = useTheme();
  const [newCert, setNewCert] = useState("");
  const fieldStyle = {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: colors.border,
  };

  const handleAdd = () => {
    const trimmed = newCert.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewCert("");
  };

  return (
    <View
      className="gap-4 rounded-[20px] border p-5"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      <Text
        className="text-[12px] font-bold tracking-[1.5px]"
        style={{ color: colors.primary }}
      >
        CERTIFICATES
      </Text>

      <View className="gap-3">
        {certificates.map((cert, index) => (
          <View
            key={`${cert}-${index}`}
            className="h-14 flex-row items-center justify-between rounded-2xl border px-4"
            style={fieldStyle}
          >
            <Text
              className="flex-1 pr-3 text-[15px]"
              style={{ color: colors.text }}
              numberOfLines={1}
            >
              {cert}
            </Text>
            <TouchableOpacity
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: "#EF444426" }}
              activeOpacity={0.7}
              onPress={() => onRemove(index)}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}

        {certificates.length === 0 && (
          <Text className="text-[13px]" style={{ color: colors.secondaryText }}>
            No certificates added yet.
          </Text>
        )}
      </View>

      <View className="flex-row items-center gap-3">
        <TextInput
          value={newCert}
          onChangeText={setNewCert}
          placeholder="Add certificate..."
          placeholderTextColor={colors.secondaryText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          className="h-14 flex-1 rounded-2xl border px-4 text-[15px]"
          style={[fieldStyle, { color: colors.text }]}
          cursorColor={colors.primary}
          selectionColor={colors.primary}
        />
        <TouchableOpacity
          className="h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.primary }}
          activeOpacity={0.8}
          onPress={handleAdd}
        >
          <Plus size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}