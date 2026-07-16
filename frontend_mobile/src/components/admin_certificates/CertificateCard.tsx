import { memo, useCallback } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Trash2, Award } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import type { Certificate } from "../../types/certificate";

interface CertificateCardProps {
  certificate: Certificate;
  onDelete: (id: string) => void;
  onEdit: (certificate: Certificate) => void;
  onViewImage: (certificate: Certificate) => void;
}

function CertificateCard({ certificate, onDelete, onEdit, onViewImage }: CertificateCardProps) {
  const { colors } = useTheme();

  const handleDelete = useCallback(() => onDelete(certificate.id), [onDelete, certificate.id]);
  const handleEdit = useCallback(() => onEdit(certificate), [onEdit, certificate]);
  const handleViewImage = useCallback(() => onViewImage(certificate), [onViewImage, certificate]);

  console.log("[CertificateCard] image URL:", certificate.image?.substring(0, 80), "title:", certificate.title);

  return (
    <TouchableOpacity
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
      onPress={handleEdit}
      activeOpacity={0.7}
    >
      {certificate.image ? (
        <TouchableOpacity onPress={handleViewImage} activeOpacity={0.85}>
          <Image
            source={{ uri: certificate.image }}
            className="w-full h-[120px]"
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <View className="w-full h-[80px] items-center justify-center">
          <Award size={32} color={colors.secondaryText} />
        </View>
      )}

      <View className="p-3 gap-1">
        <Text className="text-[14px] font-bold" style={{ color: colors.text }} numberOfLines={2}>
          {certificate.title}
        </Text>
        {certificate.issuer ? (
          <Text className="text-[12px]" style={{ color: colors.secondaryText }} numberOfLines={1}>
            {certificate.issuer}
          </Text>
        ) : null}
        {certificate.category ? (
          <Text className="text-[10px] font-semibold tracking-[1px] mt-1" style={{ color: colors.primary }}>
            {certificate.category.toUpperCase()}
          </Text>
        ) : null}
      </View>

      <View className="px-3 pb-3">
        <TouchableOpacity
          className="h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: "#EF444420" }}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Trash2 size={15} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default memo(CertificateCard);
