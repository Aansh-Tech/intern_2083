import { View, Text, TouchableOpacity, Linking } from "react-native";
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

      {/* Grid container */}
      <View className="flex-row flex-wrap gap-3.5 px-5 pt-5">
        {certificates.map((cert) => (
          <View
            key={cert.id}
            style={[
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            className="flex-1 basis-[47%] rounded-2xl border p-[18px] gap-3"
          >
            {/* Card header */}
            <View className="flex-row items-center gap-2.5">
              <View
                style={{ backgroundColor: colors.primary + "26" }}
                className="w-[34px] h-[34px] rounded-full items-center justify-center"
              >
                <Award size={18} color={colors.primary} />
              </View>
              <Text
                style={{ color: colors.secondaryText }}
                className="text-[11px] font-bold tracking-[1px]"
              >
                {cert.category}
              </Text>
            </View>

            {/* Title */}
            <Text
              style={{ color: colors.text }}
              className="text-[17px] font-bold"
            >
              {cert.title}
            </Text>

            {/* View button */}
            <TouchableOpacity
              style={[
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              className="self-start px-4 h-9 rounded-full items-center justify-center border"
              activeOpacity={0.7}
              onPress={() => openLink(cert.url)}
            >
              <Text
                style={{ color: colors.text }}
                className="text-[13px] font-semibold"
              >
                View
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}