import { View, ScrollView } from "react-native";
import Header from "../../components/homepage/Header";
import AboutHero from "../../components/about/AboutHero";
import SkillsSection from "../../components/about/Skills";
import CertificatesSection from "../../components/about/Certificate";
import { useTheme } from "../../context/useTheme";

export default function AboutScreen() {
  const { colors } = useTheme();

  return (
    // Flex-1 for container, background colour from theme
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <Header />

      {/* ScrollView without contentContainerStyle – wrap children in a View with padding */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pb-10">
          <AboutHero />
          <SkillsSection />
          <CertificatesSection />
        </View>
      </ScrollView>
    </View>
  );
}