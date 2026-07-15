import { useState, useMemo, useCallback } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import Header from "../../components/homepage/Header";
import PageHeader from "../../components/work/PageHeader";
import FilterTabs, { FilterValue } from "../../components/work/FilterTabs";
import ProjectList from "../../components/work/Projectlist";
import { useProject } from "../../context/ProjectContext";
import { useTheme } from "../../context/useTheme";

export default function ProjectScreen() {
  const { colors } = useTheme();
  const { projects, loading, refreshing, refreshProjects } = useProject();
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const filteredProjects = useMemo(() => {
    if (loading) return [];
    if (activeFilter === "all") return projects;
    if (activeFilter === "featured") return projects.filter((p) => p.featured);
    return projects.filter((p) => p.status === activeFilter);
  }, [activeFilter, projects, loading]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshProjects} />}
      >
        <View className="pb-10">
          <PageHeader />
          <FilterTabs active={activeFilter} onChange={setActiveFilter} />
          <ProjectList projects={filteredProjects as any} />
        </View>
      </ScrollView>
    </View>
  );
}
// import { View, Text, StyleSheet, SafeAreaView } from "react-native";
// import { useTheme } from "../../context/useTheme";

// export default function ProjectScreen() {
//   const { colors } = useTheme();

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       <View style={styles.content}>
//         <Text style={[styles.title, { color: colors.text }]}>Projects</Text>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//   },
// });
