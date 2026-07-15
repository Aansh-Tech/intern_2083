import { View, ScrollView, RefreshControl } from "react-native";
import { useTheme } from "../../context/useTheme";

interface AdminLayoutProps {
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function AdminLayout({ children, refreshing, onRefresh }: AdminLayoutProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          refreshing !== undefined && onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    </View>
  );
}