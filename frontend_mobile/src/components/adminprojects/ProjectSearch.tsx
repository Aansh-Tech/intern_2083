import { memo, useCallback, useRef } from "react";
import { View, TextInput } from "react-native";
import { Search } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface ProjectSearchProps {
  value: string;
  onChangeText: (text: string) => void;
}

function ProjectSearch({ value, onChangeText }: ProjectSearchProps) {
  const { colors } = useTheme();

  return (
    <View
      className="mx-5 mt-4 flex-row items-center rounded-[14px] border px-4 gap-3"
      style={{
        height: 48,
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
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
