import { memo } from "react";
import { View, TextInput } from "react-native";
import { Search } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import { useResponsiveContainer } from "../../utils/responsive";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

function SearchBar({ value, onChangeText }: SearchBarProps) {
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
          height: 48,
          borderRadius: 16,
          borderWidth: 1,
          paddingHorizontal: 16,
          gap: 10,
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
        placeholder="Search messages..."
        placeholderTextColor={colors.secondaryText}
        autoCapitalize="none"
        autoCorrect={false}
        cursorColor={colors.primary}
        selectionColor={colors.primary}
      />
    </View>
  );
}

export default memo(SearchBar);
