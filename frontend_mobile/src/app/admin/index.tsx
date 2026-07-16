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
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import AdminHeader from "../../components/admin/AdminHeader";
import LoginCard from "../../components/admin/LoginCard";
import InputField from "../../components/admin/InputField";
import PasswordField from "../../components/admin/PasswordField";
import { login } from "../../utils/adminAuth";
import { useTheme } from "../../context/useTheme";

export default function AdminLoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; auth?: string }>({});

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
    //console.log("[LoginScreen] === SIGN IN BUTTON PRESSED ===");
    //console.log("[LoginScreen] Email:", email);

    //console.log("[LoginScreen] Validation started.");
    if (!validate()) {
      //console.log("[LoginScreen] Validation failed.");
      return;
    }
    //console.log("[LoginScreen] Validation passed.");

    setLoading(true);
    //console.log("[LoginScreen] Login request started.");
    let success = false;
    try {
      success = await login(email, password);
    } catch (error: any) {
      //console.log("[LoginScreen] UNEXPECTED ERROR in login() call");
      //console.log("[LoginScreen] error.message:", error.message);
      //console.log("[LoginScreen] error.response?.status:", error.response?.status);
      //console.log("[LoginScreen] error.response?.data:", JSON.stringify(error.response?.data));
      //console.log("[LoginScreen] error.stack:", error.stack);
    }
    //console.log("[LoginScreen] Login request completed. success =", success);

    if (success) {
      //console.log("[LoginScreen] Router navigation STARTED to /admin/adminoverview");
      Keyboard.dismiss();
      try {
        router.replace("/admin/adminoverview" as any);
        //console.log("[LoginScreen] Router navigation completed (called).");
      } catch (navError: any) {
        //console.log("[LoginScreen] Router navigation THREW");
        //console.log("[LoginScreen] navError.message:", navError.message);
       // console.log("[LoginScreen] navError.stack:", navError.stack);
      }
    } else {
      //console.log("[LoginScreen] Login failed. Setting auth error message.");
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

          <View style={{ width: "100%", maxWidth: 420, alignSelf: "center", paddingHorizontal: 12, marginTop: -60 }}>
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
