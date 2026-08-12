import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MailCheck } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

console.log = () => {};
console.info = () => {};
console.debug = () => {};

export default function ResetLinkSentScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const emailValue = typeof email === "string" ? email : "";

  const handleContinue = () => {
    router.replace({
      pathname: "/reset/change",
      params: emailValue ? { email: emailValue } : {},
    });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
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
        <View style={{ width: "100%", maxWidth: 420, alignSelf: "center", marginTop: 10 }}>
          <View
            className="w-full max-w-[420px] rounded-[24px] border border-solid px-6 py-6"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <View className="flex-row items-center gap-4 w-full mb-6">
              <View
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary + "20" }}
              >
                <MailCheck size={24} color={colors.primary} strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Text className="text-[12px] font-semibold uppercase tracking-[2px] mb-1" style={{ color: colors.primary }}>
                  Almost there
                </Text>
                <Text className="text-[26px] font-bold" style={{ color: colors.text }}>
                  Reset link sent
                </Text>
              </View>
            </View>

            <Text className="text-[15px] leading-6 mb-5" style={{ color: colors.secondaryText }}>
              {emailValue
                ? `If ${emailValue} matches the admin account, a password reset link has been sent to the inbox.`
                : "If the email matches the admin account, a password reset link has been sent to the inbox."}
            </Text>

            <Text className="text-[15px] leading-6 mb-7" style={{ color: colors.secondaryText }}>
              Open the email, copy the complete password reset link, then paste it here to set your new password.
            </Text>

            <View className="w-full gap-4">
              <TouchableOpacity
                className="w-full h-14 rounded-[28] items-center justify-center"
                style={{ backgroundColor: colors.primary }}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <Text className="text-base font-bold" style={{ color: colors.text }}>
                  Continue
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-full h-14 rounded-[28] items-center justify-center border"
                style={{ borderColor: colors.border }}
                onPress={() => router.replace("/admin")}
                activeOpacity={0.7}
              >
                <Text className="text-base font-medium" style={{ color: colors.secondaryText }}>
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}