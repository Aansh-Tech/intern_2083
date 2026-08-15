import { memo, useCallback, useRef } from "react";
import { View, TextInput } from "react-native";
import { Search } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import { useResponsiveContainer } from "../../utils/responsive";

interface ProjectSearchProps {
  value: string;
  onChangeText: (text: string) => void;
}

function ProjectSearch({ value, onChangeText }: ProjectSearchProps) {
  const { colors } = useTheme();
  const container = useResponsiveContainer();

  return (
    <View
      style={[
        container,
        {
          marginTop: 16,
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 14,
          borderWidth: 1,
          paddingHorizontal: 16,
          gap: 12,
          height: 48,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Search size={18} color={colors.secondaryText} />
      <TextInput
        className="flex-1 text-[15px]"
        style={{ color: colors.text }}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search projects..."
        placeholderTextColor={colors.secondaryText}
        autoCapitalize="none"
        autoCorrect={false}
        cursorColor={colors.primary}
        selectionColor={colors.primary}
      />
    </View>
  );
}

export default memo(ProjectSearch);
