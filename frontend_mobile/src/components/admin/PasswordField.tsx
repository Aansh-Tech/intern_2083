import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Lock, Eye, EyeOff } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface PasswordFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export default function PasswordField({ value, onChangeText, error }: PasswordFieldProps) {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View className="gap-1.5">
      <Text
        className="text-[13px] font-semibold uppercase tracking-[0.8px]"
        style={{ color: colors.secondaryText }}
      >
        Password
      </Text>
      <View
        className="flex-row items-center rounded-[14px] border px-4 gap-3"
        style={{
          height: 56,
          backgroundColor: colors.background,
          borderColor: error ? "#EF4444" : focused ? colors.primary : colors.border,
        }}
      >
        <Lock size={18} color={focused ? colors.primary : colors.secondaryText} />
        <TextInput
          className="flex-1 text-base"
          style={{ color: colors.text, height: "100%", textAlignVertical: "center" }}
          value={value}
          onChangeText={onChangeText}
          placeholder="Enter your password"
          placeholderTextColor={colors.secondaryText}
          secureTextEntry={!visible}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <TouchableOpacity
          className="w-11 h-11 items-center justify-center"
          onPress={() => setVisible(!visible)}
          activeOpacity={0.7}
        >
          {visible ? (
            <EyeOff size={20} color={colors.secondaryText} />
          ) : (
            <Eye size={20} color={colors.secondaryText} />
          )}
        </TouchableOpacity>
      </View>
      {error && <Text className="text-[#EF4444] text-xs">{error}</Text>}
    </View>
  );
}