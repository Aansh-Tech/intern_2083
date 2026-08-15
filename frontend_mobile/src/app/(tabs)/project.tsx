import { useState, useMemo, useCallback } from "react";
import { View, ScrollView, RefreshControl, ActivityIndicator, Text, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FolderKanban } from "lucide-react-native";
import Header from "../../components/homepage/Header";
import PageHeader from "../../components/work/PageHeader";
import FilterTabs, { FilterValue } from "../../components/work/FilterTabs";
import ProjectList from "../../components/work/Projectlist";
import { useProject } from "../../context/ProjectContext";
import { useTheme } from "../../context/useTheme";

export default function ProjectScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { projects, loading, refreshing, refreshProjects } = useProject();
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    if (activeFilter === "featured") return projects.filter((p) => p.featured);
    return projects.filter((p) => p.status === activeFilter);
  }, [activeFilter, projects]);

  if (loading && projects.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.center} showsVerticalScrollIndicator={false}>
          <Header />
          <PageHeader />
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="mt-4" style={{ color: colors.secondaryText }}>
              Loading projects...
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshProjects} />}
      >
        <Header />
        <View className="pb-10" style={{ paddingBottom: insets.bottom + 96 }}>
          <PageHeader />
          {projects.length === 0 ? (
            <View className="items-center px-10 pt-14 pb-16">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center"
                style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
              >
                <FolderKanban size={28} color={colors.primary} />
              </View>
              <Text className="text-[18px] font-bold mt-5" style={{ color: colors.text }}>
                No projects yet
              </Text>
              <Text className="text-[14px] text-center mt-2 leading-5" style={{ color: colors.secondaryText }}>
                There are currently no projects to display. Check back soon.
              </Text>
            </View>
          ) : (
            <>
              <FilterTabs active={activeFilter} onChange={setActiveFilter} />
              <ProjectList projects={filteredProjects as any} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flexGrow: 1,
  },
});