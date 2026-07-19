import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Award } from "lucide-react-native";
import SectionHeading from "./Heading";
import ImageViewer from "../admin_certificates/ImageViewer";
import { useTheme } from "../../context/useTheme";
import { useCertificates } from "../../context/CertificateContext";

console.log = () => {};
console.info = () => {};
console.debug = () => {};
export default function CertificatesSection() {
  const { colors } = useTheme();
  const { certificates } = useCertificates();
  const [viewImage, setViewImage] = useState<string | null>(null);

  if (certificates.length > 0) {
    const first = certificates[0];
    console.log("[CertificatesSection] First cert image:", first.image?.substring(0, 80), "title:", first.title);
  } else {
    console.log("[CertificatesSection] No certificates loaded");
  }

  const openImage = useCallback((url: string) => {
    setViewImage(url);
  }, []);

  return (
    <View>
      <SectionHeading eyebrow="CREDENTIALS" title="Certificates" />

      <View className="flex-row flex-wrap gap-3.5 px-5 pt-5">
        {certificates.map((cert) => (
          <TouchableOpacity
            key={cert.id}
            style={[
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            className="flex-1 basis-[47%] rounded-2xl border p-[18px] gap-3"
            activeOpacity={0.7}
            onPress={() => cert.image ? openImage(cert.image) : undefined}
          >
            <View className="flex-row items-center gap-2.5">
              {cert.image ? (
                <Image source={{ uri: cert.image }} className="w-[34px] h-[34px] rounded-full" resizeMode="cover" />
              ) : (
                <View
                  style={{ backgroundColor: colors.primary + "26" }}
                  className="w-[34px] h-[34px] rounded-full items-center justify-center"
                >
                  <Award size={18} color={colors.primary} />
                </View>
              )}
              <Text
                style={{ color: colors.secondaryText }}
                className="text-[11px] font-bold tracking-[1px]"
              >
                {cert.category?.toUpperCase() ?? "CERTIFICATE"}
              </Text>
            </View>

            <Text
              style={{ color: colors.text }}
              className="text-[17px] font-bold"
            >
              {cert.title}
            </Text>

            {cert.issuer ? (
              <Text
                style={{ color: colors.secondaryText }}
                className="text-[12px]"
                numberOfLines={1}
              >
                {cert.issuer}
              </Text>
            ) : null}

            {cert.image ? (
              <TouchableOpacity
                style={[
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                className="self-start px-4 h-9 rounded-full items-center justify-center border"
                activeOpacity={0.7}
                onPress={() => openImage(cert.image!)}
              >
                <Text
                  style={{ color: colors.text }}
                  className="text-[13px] font-semibold"
                >
                  View
                </Text>
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>

      <ImageViewer
        visible={!!viewImage}
        imageUrl={viewImage}
        onClose={() => setViewImage(null)}
      />
    </View>
  );
}
