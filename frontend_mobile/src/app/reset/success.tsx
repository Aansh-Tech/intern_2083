import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";


export default function ResetPasswordSuccessScreen() {
  const { colors } = useTheme();
  const router = useRouter();

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
                <Check size={26} color={colors.primary} strokeWidth={3} />
              </View>
              <View className="flex-1">
                <Text className="text-[12px] font-semibold uppercase tracking-[2px] mb-1" style={{ color: colors.primary }}>
                  All done
                </Text>
                <Text className="text-[26px] font-bold" style={{ color: colors.text }}>
                  Password Reset Successful
                </Text>
              </View>
            </View>

            <Text className="text-[15px] leading-6 mb-7" style={{ color: colors.secondaryText }}>
              Your password has been updated. You can now sign in with your new password.
            </Text>

            <TouchableOpacity
              className="w-full h-14 rounded-[28] items-center justify-center"
              style={{ backgroundColor: colors.primary }}
              onPress={() => router.replace("/admin")}
              activeOpacity={0.8}
            >
              <Text className="text-base font-bold" style={{ color: colors.text }}>
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}