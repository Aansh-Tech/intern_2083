import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import Header from "../../components/homepage/Header";
import HeroSection from "../../components/homepage/HeroSection";
import CTASection from "../../components/homepage/CTASection";
import StatsSection from "../../components/homepage/StatsSection";
import SectionTitle from "../../components/homepage/SectionTitle";
import { useTheme } from "../../context/useTheme";

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Header />
        <HeroSection />
        <CTASection />
        <StatsSection />
        <SectionTitle />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
});

