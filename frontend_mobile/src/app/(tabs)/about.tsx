import { useCallback } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import Header from "../../components/homepage/Header";
import AboutHero from "../../components/about/AboutHero";
import SkillsSection from "../../components/about/Skills";
import CertificatesSection from "../../components/about/Certificate";
import { useTheme } from "../../context/useTheme";
import { useProfile } from "../../context/ProfileContext";
import { useSkills } from "../../context/SkillsContext";
import { useCertificates } from "../../context/CertificateContext";

export default function AboutScreen() {
  const { colors } = useTheme();
  const { refreshing: profileRefreshing, refreshProfile } = useProfile();
  const { refreshing: skillsRefreshing, refreshSkills } = useSkills();
  const { refreshing: certRefreshing, refreshCertificates } = useCertificates();

  const refreshing = profileRefreshing || skillsRefreshing || certRefreshing;

  const onRefresh = useCallback(async () => {
    await Promise.all([refreshProfile(), refreshSkills(), refreshCertificates()]);
  }, [refreshProfile, refreshSkills, refreshCertificates]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <Header />

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