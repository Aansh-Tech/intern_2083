import { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import InputField from "../../components/admin/InputField";
import { requestPasswordReset } from "../../services/auth";
import { useTheme } from "../../context/useTheme";
import { useResponsiveMaxWidth } from "../../utils/responsive";


export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const cardMaxWidth = useResponsiveMaxWidth(480);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; auth?: string }>({});
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const validate = useCallback(() => {
    const next: { email?: string } = {};

    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Invalid email format";
    }

    setErrors((prev) => ({ ...prev, email: next.email, auth: undefined }));
    return Object.keys(next).length === 0;
  }, [email]);

  const handleSend = useCallback(async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
    } catch (error: any) {
      if (mountedRef.current) {
        setErrors((prev) => ({
          ...prev,
          auth: error?.message || "Something went wrong. Please try again.",
        }));
      }
      return;
    } finally {
      if (mountedRef.current) setLoading(false);
    }

    if (!mountedRef.current) return;
    router.replace({
      pathname: "/reset/sent",
      params: { email: email.trim() },
    });
  }, [validate, email, router]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 30,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: "100%", maxWidth: cardMaxWidth, alignSelf: "center", marginBottom: 22 }}>
            <TouchableOpacity
              className="flex-row items-center gap-[5px] h-12 px-4 rounded-full border self-start"
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
              onPress={() => router.replace("/admin")}
              activeOpacity={0.7}
            >
              <ChevronLeft size={18} color={colors.secondaryText} />
              <Text className="text-[15px] font-medium" style={{ color: colors.secondaryText }}>
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: "100%", maxWidth: cardMaxWidth, alignSelf: "center", marginTop: 10 }}>
            <View
              className="w-full rounded-[24px] border border-solid px-6 py-6"
              style={{ width: "100%", maxWidth: cardMaxWidth, backgroundColor: colors.card, borderColor: colors.border }}
            >
              <Text className="text-[12px] font-semibold uppercase tracking-[2px] mb-1" style={{ color: colors.primary }}>
                Account Recovery
              </Text>
              <Text className="text-[26px] font-bold" style={{ color: colors.text }}>
                Forgot Password
              </Text>

              <Text className="text-[15px] leading-6 mt-3 mb-7" style={{ color: colors.secondaryText }}>
                Enter the admin account email and we will send a link to reset the password.
              </Text>

              <View className="w-full gap-5">
                <InputField
                  label="Email"
                  value={email}
                  onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined, auth: undefined })); }}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />

                {errors.auth && (
                  <Text className="text-center text-[14px] font-medium" style={{ color: "#EF4444" }}>
                    {errors.auth}
                  </Text>
                )}

                <TouchableOpacity
                  className="w-full h-14 rounded-[28] items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                  onPress={handleSend}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.text} />
                  ) : (
                    <Text className="text-base font-bold" style={{ color: colors.text }}>
                      Send Reset Link
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}