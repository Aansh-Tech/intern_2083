import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AdminHeader from "../components/admin/AdminHeader";
import LoginCard from "../components/admin/LoginCard";
import InputField from "../components/admin/InputField";
import PasswordField from "../components/admin/PasswordField";
import Checkbox from "../components/admin/Checkbox";
import { useTheme } from "../context/useTheme";

export default function AdminScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = useCallback(() => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleLogin = useCallback(() => {
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Email:", email, "Password:", password, "Remember:", remember);
    }, 1000);
  }, [validate, email, password, remember]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 20, paddingTop: 30, paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: "100%", maxWidth: 420, alignSelf: "center", marginBottom: 22 }}>
            <AdminHeader />
          </View>

          <View style={{ width: "100%", maxWidth: 420, alignSelf: "center", marginTop: 10 }}>
            <LoginCard>
              <InputField
                label="Email"
                value={email}
                onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <PasswordField
                value={password}
                onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: undefined })); }}
                error={errors.password}
              />

              <Checkbox
                label="Remember me"
                checked={remember}
                onToggle={() => setRemember(!remember)}
              />

              <TouchableOpacity
                className="w-full h-14 rounded-[28] items-center justify-center"
                style={{ backgroundColor: colors.primary }}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={colors.text} />
                ) : (
                  <Text className="text-base font-bold" style={{ color: colors.text }}>Sign in</Text>
                )}
              </TouchableOpacity>
            </LoginCard>
          </View>

          <View style={{ width: "100%", maxWidth: 420, alignSelf: "center", paddingHorizontal: 12, marginTop: 20 }}>
            <Text
              className="text-center text-[13px] leading-[18]"
              style={{ color: colors.secondaryText }}
            >
              Access is restricted to the site administrator.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}