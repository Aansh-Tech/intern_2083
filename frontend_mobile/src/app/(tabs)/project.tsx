import { useState, useMemo } from "react";
import { View, ScrollView } from "react-native";
import Header from "../../components/homepage/Header";
import PageHeader from "../../components/work/PageHeader";
import FilterTabs, { FilterValue } from "../../components/work/FilterTabs";
import ProjectList from "../../components/work/Projectlist";
import { projects } from "../../components/work/ProjectsData";
import { useTheme } from "../../context/useTheme";

export default function ProjectScreen() {
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    if (activeFilter === "featured") return projects.filter((p) => p.featured);
    return projects.filter((p) => p.status === activeFilter);
  }, [activeFilter]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pb-10">
          <PageHeader />
          <FilterTabs active={activeFilter} onChange={setActiveFilter} />
          <ProjectList projects={filteredProjects} />
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
