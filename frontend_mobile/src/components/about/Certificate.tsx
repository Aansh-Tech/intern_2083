import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Award } from "lucide-react-native";
import SectionHeading from "./Heading";
import { useTheme } from "../../context/useTheme";

const certificates = [
  {
    id: "react-nextjs",
    title: "React & Next.js",
    category: "FRONTEND",
    url: "https://example.com/certificates/react-nextjs",
  },
  {
    id: "typescript",
    title: "TypeScript",
    category: "FRONTEND",
    url: "https://example.com/certificates/typescript",
  },
  {
    id: "nodejs",
    title: "Node.js",
    category: "BACKEND",
    url: "https://example.com/certificates/nodejs",
  },
  {
    id: "postgresql",
    title: "PostgreSQL",
    category: "BACKEND",
    url: "https://example.com/certificates/postgresql",
  },
  {
    id: "rust",
    title: "Rust",
    category: "BACKEND",
    url: "https://example.com/certificates/rust",
  },
  {
    id: "figma",
    title: "Figma",
    category: "DESIGN",
    url: "https://example.com/certificates/figma",
  },
];

export default function CertificatesSection() {
  const { colors } = useTheme();

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View>
      <SectionHeading eyebrow="CREDENTIALS" title="Certificates" />

      <View style={styles.grid}>
        {certificates.map((cert) => (
          <View
            key={cert.id}
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconBadge, { backgroundColor: colors.primary + "26" }]}>
                <Award size={18} color={colors.primary} />
              </View>
              <Text style={[styles.category, { color: colors.secondaryText }]}>
                {cert.category}
              </Text>
            </View>

            <Text style={[styles.title, { color: colors.text }]}>{cert.title}</Text>

            <TouchableOpacity
              style={[
                styles.viewButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              activeOpacity={0.7}
              onPress={() => openLink(cert.url)}
            >
              <Text style={[styles.viewText, { color: colors.text }]}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  card: {
    flexBasis: "47%",
    flexGrow: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  category: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
  },
  viewButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  viewText: {
    fontSize: 13,
    fontWeight: "600",
  },
});