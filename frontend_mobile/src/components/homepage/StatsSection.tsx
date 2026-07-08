import { View, StyleSheet } from "react-native";
import StatsCard from "./StatsCard";

const stats = [
  { value: "100+", title: "Years shipping" },
  { value: "40+", title: "Projects" },
  { value: "12", title: "Design systems" },
];

export default function StatsSection() {
  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <StatsCard key={stat.title} value={stat.value} title={stat.title} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 10,
  },
});
