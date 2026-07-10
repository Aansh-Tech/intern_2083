import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";

interface ContactInfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export default function ContactInfoCard({
  icon,
  label,
  value,
}: ContactInfoCardProps) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-row items-center rounded-3xl border px-5 py-3"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{
          backgroundColor: colors.primary + "20",
        }}
      >
        {icon}
      </View>

      <View className="flex-1 ml-4">
        <Text
          className="text-xs font-semibold uppercase"
          style={{
            color: colors.secondaryText,
            letterSpacing: 1.5,
          }}
        >
          {label}
        </Text>

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-base font-bold mt-1"
          style={{ color: colors.text }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}


// import { View, Text } from "react-native";
// import { useTheme } from "../../context/useTheme";

// interface ContactInfoCardProps {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
// }

// export default function ContactInfoCard({ icon, label, value }: ContactInfoCardProps) {
//   const { colors } = useTheme();

//   return (
//     <View
//       className="flex-1 rounded-3xl border p-5 items-center gap-2"
//       style={{ backgroundColor: colors.card, borderColor: colors.border }}
//     >
//       <View
//         className="w-12 h-12 rounded-full items-center justify-center"
//         style={{ backgroundColor: colors.primary + "18" }}
//       >
//         {icon}
//       </View>
//       <Text className="text-[11px] font-bold tracking-[2px] mt-1" style={{ color: colors.primary }}>
//         {label}
//       </Text>
//       <Text className="text-[13px] font-medium text-center leading-[18]" style={{ color: colors.text }}>
//         {value}
//       </Text>
//     </View>
//   );
// }