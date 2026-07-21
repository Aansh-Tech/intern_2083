import { useState, useCallback, useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import Header from "../../components/homepage/Header";
import HeroSection from "../../components/homepage/HeroSection";
import CTASection from "../../components/homepage/CTASection";
//import StatsSection from "../../components/homepage/StatsSection";
import SectionTitle from "../../components/homepage/SectionTitle";
import FeaturedProjects from "../../components/homepage/FeaturedProjects";
import ToolkitSection from "../../components/homepage/ToolkitSection";
import LatestWriting from "../../components/homepage/LatestWriting";
import { useTheme } from "../../context/useTheme";
import { useProject } from "../../context/ProjectContext";
import { useSkills } from "../../context/SkillsContext";
import { useProfile } from "../../context/ProfileContext";


console.log = () => {};
console.info = () => {};
console.debug = () => {};
export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { refreshProjects } = useProject();
  const { refreshSkills } = useSkills();
  const { refreshProfile } = useProfile();
  const [refreshing, setRefreshing] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshProjects(), refreshSkills(), refreshProfile()]);
    } finally {
      if (mountedRef.current) setRefreshing(false);
    }
  }, [refreshProjects, refreshSkills, refreshProfile]);

  useEffect(() => {
    refreshSkills();
    refreshProfile();
    refreshProjects();
  }, [refreshSkills, refreshProfile, refreshProjects]);

  useFocusEffect(
    useCallback(() => {
      refreshSkills();
      refreshProfile();
      refreshProjects();
    }, [refreshSkills, refreshProfile, refreshProjects])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 150 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Header />
        <HeroSection />
        <View style={{ height: 36 }} />
        <CTASection />
        <View style={{ height: 36 }} />
        {/* <StatsSection /> */}
        {/* <View style={{ height: 56 }} /> */}
        <SectionTitle subtitle="FEATURED" title="Selected projects" />
        <FeaturedProjects />
        {/* <View style={{ height: 56 }} /> */}
        <ToolkitSection />
        {/* <View style={{ height: 56 }} /> */}
        <LatestWriting />
        {/* <View style={{ height: 56 }} /> */}

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

