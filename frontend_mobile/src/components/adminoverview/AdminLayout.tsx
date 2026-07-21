// src/components/adminoverview/AdminLayout.tsx
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
        contentContainerClassName="pb-10"
        refreshControl={
          onRefresh ? <RefreshControl refreshing={refreshing || false} onRefresh={onRefresh} /> : undefined
        }
      >
        {children}
      </ScrollView>
    </View>
  );
}