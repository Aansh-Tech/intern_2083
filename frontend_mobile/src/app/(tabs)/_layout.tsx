import { useRef, useEffect, memo, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Tabs, useRouter, usePathname } from "expo-router";
import { Home, Briefcase, BookOpen, User, Mail } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import "../../../global.css";

console.log = () => {};
console.info = () => {};
console.debug = () => {};

const iconMap = {
  home: Home,
  briefcase: Briefcase,
  "book-open": BookOpen,
  user: User,
  mail: Mail,
} as const;

const tabConfig = [
  { name: "index" as const, icon: "home" as keyof typeof iconMap, title: "Home" },
  { name: "project" as const, icon: "briefcase" as keyof typeof iconMap, title: "Projects" },
  { name: "blog" as const, icon: "book-open" as keyof typeof iconMap, title: "Blog" },
  { name: "about" as const, icon: "user" as keyof typeof iconMap, title: "About" },
  { name: "contact" as const, icon: "mail" as keyof typeof iconMap, title: "Contact" },
];

const TabBarItem = memo(function TabBarItem({
  tab,
  active,
  onPress,
  colors,
}: {
  tab: (typeof tabConfig)[number];
  active: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  const scaleAnim = useRef(new Animated.Value(active ? 1 : 0.85)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: active ? 1 : 0.85,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [active, scaleAnim]);

  const IconComponent = iconMap[tab.icon];
  const iconColor = active ? colors.primary : colors.secondaryText;
  const labelColor = active ? colors.primary : colors.secondaryText;

  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
      <Animated.View
        style={[
          styles.iconContainer,
          active && { backgroundColor: colors.primary + "18" },
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <IconComponent size={22} color={iconColor} />
      </Animated.View>
      <Text style={[styles.tabLabel, { color: labelColor }]}>
        {tab.title}
      </Text>
    </TouchableOpacity>
  );
});

const CustomTabBar = memo(function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();

  const currentTab = pathname.split("/").filter(Boolean).pop() || "index";

  const navigate = useCallback(
    (name: string) => {
      if (name === currentTab) return;
      const tab = name === "index" ? "/" : `/${name}`;
      router.navigate(tab as any);
    },
    [router, currentTab]
  );

  return (
    <View style={[styles.tabBar, { backgroundColor: colors.header, borderTopColor: colors.border }]}>
      {tabConfig.map((tab) => {
        const active = currentTab === tab.name;
        return (
          <TabBarItem
            key={tab.name}
            tab={tab}
            active={active}
            colors={colors}
            onPress={() => navigate(tab.name)}
          />
        );
      })}
    </View>
  );
});

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      tabBar={() => <CustomTabBar />}
      screenOptions={{
        headerShown: false,
        lazy: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="project" />
      <Tabs.Screen name="blog" />
      <Tabs.Screen name="about" />
      <Tabs.Screen name="contact" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
  },
  tabItem: {
    alignItems: "center",
    gap: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
});
