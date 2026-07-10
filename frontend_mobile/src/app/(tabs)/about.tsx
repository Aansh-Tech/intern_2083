import { View, ScrollView, StyleSheet } from "react-native";
import Header from "../../components/homepage/Header";
import AboutHero from "../../components/about/AboutHero";
import SkillsSection from "../../components/about/Skills";
import CertificatesSection from "../../components/about/Certificate";
import { useTheme } from "../../context/useTheme";

export default function AboutScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AboutHero />
        <SkillsSection />
        <CertificatesSection />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});