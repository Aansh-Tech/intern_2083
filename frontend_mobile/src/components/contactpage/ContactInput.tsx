import { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme } from "../../context/useTheme";

interface ContactInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export default function ContactInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline,
  numberOfLines,
  keyboardType,
  autoCapitalize,
}: ContactInputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View className="gap-1.5">
      <Text
        className="text-[13px] font-semibold uppercase tracking-[0.8px]"
        style={{ color: colors.secondaryText }}
      >
        {label}
      </Text>
      <View
        className="rounded-[18px] border px-4"
        style={{
          backgroundColor: colors.background,
          borderColor: error ? "#EF4444" : focused ? colors.primary : colors.border,
        }}
      >
        <TextInput
          className="text-base"
          style={{
            color: colors.text,
            height: multiline ? 140 : 56,
            textAlignVertical: multiline ? "top" : "center",
            paddingTop: multiline ? 16 : 0,
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.secondaryText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType="default"
          //keyboardType={keyboardType}
          // inputMode={keyboardType === "email-address" ? "email" : undefined}
          autoCapitalize={autoCapitalize}
          cursorColor={colors.primary}
          selectionColor={colors.primary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {error && <Text className="text-[#EF4444] text-xs mt-0.5">{error}</Text>}
    </View>
  );
}