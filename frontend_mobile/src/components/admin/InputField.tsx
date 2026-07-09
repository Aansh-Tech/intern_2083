import { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Mail } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: InputFieldProps) {
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
        className="flex-row items-center rounded-[14px] border px-4 gap-3"
        style={{
          height: 56,
          backgroundColor: colors.background,
          borderColor: error ? "#EF4444" : focused ? colors.primary : colors.border,
        }}
      >
        <Mail size={18} color={focused ? colors.primary : colors.secondaryText} />
        <TextInput
          className="flex-1 text-base"
          style={{ color: colors.text, height: "100%", textAlignVertical: "center" }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.secondaryText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {error && <Text className="text-[#EF4444] text-xs mt-0.5">{error}</Text>}
    </View>
  );
}