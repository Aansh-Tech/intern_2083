import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "../../components/homepage/Header";
import HeroSection from "../../components/homepage/HeroSection";
import CTASection from "../../components/homepage/CTASection";
import StatsSection from "../../components/homepage/StatsSection";
import SectionTitle from "../../components/homepage/SectionTitle";
import FeaturedProjects from "../../components/homepage/FeaturedProjects";
import ToolkitSection from "../../components/homepage/ToolkitSection";
import LatestWriting from "../../components/homepage/LatestWriting";
import { useTheme } from "../../context/useTheme";

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 150 }]}>
        <Header />
        <HeroSection />
        <View style={{ height: 36 }} />
        <CTASection />
        <View style={{ height: 36 }} />
        <StatsSection />
        <View style={{ height: 56 }} />
        <SectionTitle subtitle="FEATURED" title="Selected projects" />
        <FeaturedProjects />
        <View style={{ height: 56 }} />
        <ToolkitSection />
        <View style={{ height: 56 }} />
        <LatestWriting />
        <View style={{ height: 56 }} />

        <View className="px-5">
        </View>
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

