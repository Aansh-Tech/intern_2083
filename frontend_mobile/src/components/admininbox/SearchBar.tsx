import { memo } from "react";
import { View, TextInput } from "react-native";
import { Search } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

function SearchBar({ value, onChangeText }: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <View
      className="mx-5 mt-4 flex-row items-center h-[48px] rounded-2xl border px-4 gap-2.5"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
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
      />
    </View>
  );
}

export default memo(SearchBar);
