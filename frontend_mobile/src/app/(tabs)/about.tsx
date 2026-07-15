import { useState, useCallback } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import Header from "../../components/homepage/Header";
import AboutHero from "../../components/about/AboutHero";
import SkillsSection from "../../components/about/Skills";
import CertificatesSection from "../../components/about/Certificate";
import { useTheme } from "../../context/useTheme";

export default function AboutScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.resolve();
    setRefreshing(false);
  }, []);

  return (
    // Flex-1 for container, background colour from theme
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <Header />

      {/* ScrollView without contentContainerStyle – wrap children in a View with padding */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="pb-10">
          <AboutHero />
          <SkillsSection />
          <CertificatesSection />
        </View>
      </ScrollView>
    </View>
  );
}