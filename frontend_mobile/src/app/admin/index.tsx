import { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AdminHeader from "../../components/admin/AdminHeader";
import LoginCard from "../../components/admin/LoginCard";
import InputField from "../../components/admin/InputField";
import PasswordField from "../../components/admin/PasswordField";
import { login } from "../../utils/adminAuth";
import { useTheme } from "../../context/useTheme";

console.log = () => {};
console.info = () => {};
console.debug = () => {};

export default function AdminLoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; auth?: string }>({});
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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

  const handleLogin = useCallback(async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    let success = false;
    try {
      success = await login(email, password);
    } catch (error: any) {
    }
    if (!mountedRef.current) return;

    if (success) {
      Keyboard.dismiss();
      try {
        router.replace("/admin/adminoverview" as any);
      } catch (navError: any) {
      }
      setLoading(false);
    } else {
      setErrors((prev) => ({ ...prev, auth: "Invalid email or password" }));
      setLoading(false);
    }
  }, [validate, email, password, router]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 30 }}
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

              {errors.auth && (
                <Text className="text-center text-[14px] font-medium" style={{ color: "#EF4444" }}>
                  {errors.auth}
                </Text>
              )}

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

          <View style={{ width: "100%", maxWidth: 420, alignSelf: "center", paddingHorizontal: 12, marginTop: -60 }} pointerEvents="none">
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
