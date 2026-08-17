import { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft, KeyRound, Link2 } from "lucide-react-native";
import PasswordField from "../../components/admin/PasswordField";
import { submitPasswordReset } from "../../services/auth";
import { parsePasswordResetUrl } from "../../utils/passwordResetLink";
import { useTheme } from "../../context/useTheme";
import { useResponsiveMaxWidth } from "../../utils/responsive";


const LINK_ERROR_MESSAGES: Record<string, string> = {
  invalid: "Invalid reset link. Please copy the complete reset link from your email.",
  "missing-token": "The reset link is incomplete.",
  "missing-email": "The reset link does not contain the required email information.",
};

export default function ResetPasswordChangeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const paramEmail = typeof emailParam === "string" ? emailParam : "";
  const cardMaxWidth = useResponsiveMaxWidth(480);

  const [link, setLink] = useState("");
  const [linkFocused, setLinkFocused] = useState(false);
  const [linkError, setLinkError] = useState<string | undefined>(undefined);

  const [token, setToken] = useState("");
  const [email, setEmail] = useState(paramEmail);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{ password?: string; confirmation?: string }>({});
  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleParseLink = useCallback(() => {
    const result = parsePasswordResetUrl(link);

    if (!result.ok) {
      setLinkError(LINK_ERROR_MESSAGES[result.reason]);
      return;
    }

    setToken(result.token);
    setEmail(result.email);
    setLinkError(undefined);
    setAuthError(undefined);
  }, [link]);

  const clearLink = useCallback(() => {
    setToken("");
    setLinkFocused(false);
    setAuthError(undefined);
    setPassword("");
    setConfirmation("");
    setPasswordErrors({});
  }, []);

  const validate = useCallback(() => {
    const next: { password?: string; confirmation?: string } = {};

    if (!password) {
      next.password = "Password is required";
    } else if (password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }

    if (!confirmation) {
      next.confirmation = "Please confirm your new password";
    } else if (confirmation !== password) {
      next.confirmation = "Passwords do not match";
    }

    setPasswordErrors(next);
    return Object.keys(next).length === 0;
  }, [password, confirmation]);

  const handleReset = useCallback(async () => {
    if (!token) {
      return;
    }
    if (!email) {
      setAuthError("The reset link does not contain the required email information.");
      return;
    }
    if (!validate()) return;

    setLoading(true);
    try {
      await submitPasswordReset({
        email,
        token,
        password,
        passwordConfirmation: confirmation,
      });
    } catch (error: any) {
      if (mountedRef.current) {
        setAuthError(error?.message || "Something went wrong. Please try again.");
      }
      return;
    } finally {
      if (mountedRef.current) setLoading(false);
    }

    if (!mountedRef.current) return;
    router.replace("/reset/success");
  }, [token, email, validate, password, confirmation, router]);

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
              onPress={() => (token ? clearLink() : router.back())}
              activeOpacity={0.7}
            >
              <ChevronLeft size={18} color={colors.secondaryText} />
              <Text className="text-[15px] font-medium" style={{ color: colors.secondaryText }}>
                {token ? "Edit link" : "Back"}
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
                Reset Password
              </Text>

              {!token ? (
                <>
                  <Text className="text-[15px] leading-6 mt-3 mb-7" style={{ color: colors.secondaryText }}>
                    Paste the password reset link from your email.
                  </Text>

                  <View className="w-full gap-5">
                    <View className="gap-1.5">
                      <Text
                        className="text-[13px] font-semibold uppercase tracking-[0.8px]"
                        style={{ color: colors.secondaryText }}
                      >
                        Reset Link
                      </Text>
                      <View
                        className="flex-row items-center rounded-[14px] border px-4 gap-3"
                        style={{
                          height: 56,
                          backgroundColor: colors.background,
                          borderColor: linkError ? "#EF4444" : linkFocused ? colors.primary : colors.border,
                        }}
                      >
                        <Link2 size={18} color={linkFocused ? colors.primary : colors.secondaryText} />
                        <TextInput
                          className="flex-1 text-base"
                          style={{ color: colors.text, height: "100%", textAlignVertical: "center" }}
                          value={link}
                          onChangeText={(t) => { setLink(t); setLinkError(undefined); }}
                          placeholder="Paste reset link here"
                          placeholderTextColor={colors.secondaryText}
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="url"
                          cursorColor={colors.primary}
                          selectionColor={colors.primary}
                          onFocus={() => setLinkFocused(true)}
                          onBlur={() => setLinkFocused(false)}
                        />
                      </View>
                      {linkError && <Text className="text-[#EF4444] text-xs mt-0.5">{linkError}</Text>}
                    </View>

                    <Text className="text-[13px] leading-5" style={{ color: colors.secondaryText }}>
                      Open the email, copy the password reset link, then paste it here. The link contains a unique token
                      that is verified automatically.
                    </Text>

                    <TouchableOpacity
                      className="w-full h-14 rounded-[28] items-center justify-center"
                      style={{ backgroundColor: colors.primary }}
                      onPress={handleParseLink}
                      activeOpacity={0.8}
                    >
                      <Text className="text-base font-bold" style={{ color: colors.text }}>
                        Continue
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View className="flex-row items-center gap-3 rounded-[14px] border px-4 py-3 mt-3 mb-7"
                    style={{ borderColor: colors.border, backgroundColor: colors.background }}
                  >
                    <KeyRound size={18} color={colors.primary} />
                    <Text className="flex-1 text-[14px] leading-5" style={{ color: colors.secondaryText }}>
                      Reset link verified{email ? ` for ${email}` : ""}. Choose a new password.
                    </Text>
                  </View>

                  <View className="w-full gap-5">
                    <PasswordField
                      label="New Password"
                      value={password}
                      onChangeText={(t) => { setPassword(t); setPasswordErrors((e) => ({ ...e, password: undefined })); setAuthError(undefined); }}
                      error={passwordErrors.password}
                    />

                    <PasswordField
                      label="Confirm Password"
                      value={confirmation}
                      onChangeText={(t) => { setConfirmation(t); setPasswordErrors((e) => ({ ...e, confirmation: undefined })); setAuthError(undefined); }}
                      error={passwordErrors.confirmation}
                    />

                    {authError && (
                      <Text className="text-center text-[14px] font-medium" style={{ color: "#EF4444" }}>
                        {authError}
                      </Text>
                    )}

                    <TouchableOpacity
                      className="w-full h-14 rounded-[28] items-center justify-center"
                      style={{ backgroundColor: colors.primary }}
                      onPress={handleReset}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      {loading ? (
                        <ActivityIndicator color={colors.text} />
                      ) : (
                        <Text className="text-base font-bold" style={{ color: colors.text }}>
                          Reset Password
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}