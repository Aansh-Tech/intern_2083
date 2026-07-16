import { useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { Plus } from "lucide-react-native";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import CertificateCard from "../../components/admin_certificates/CertificateCard";
import CertificateFormModal from "../../components/admin_certificates/CertificateFormModal";
import DeleteModal from "../../components/admin_certificates/DeleteModal";
import ImageViewer from "../../components/admin_certificates/ImageViewer";
import { useCertificates } from "../../context/CertificateContext";
import { useTheme } from "../../context/useTheme";
import { uploadImage } from "../../services/image";
import type { Certificate } from "../../types/certificate";

export default function AdminCertificatesScreen() {
  const { colors } = useTheme();
  const { certificates, loading, refreshing, refreshCertificates, addCertificate, editCertificate, deleteCertificate } = useCertificates();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Certificate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);

  const handleAdd = useCallback(() => {
    setEditTarget(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((cert: Certificate) => {
    setEditTarget(cert);
    setShowForm(true);
  }, []);

  const handleSave = useCallback(async (data: {
    title: string;
    issuer: string;
    category: string;
    description: string;
    issueDate: string;
    image?: string;
  }) => {
    try {
      if (editTarget) {
        // Editing: upload image with existing cert ID, then update
        let image = data.image;
        if (image && !image.startsWith("http")) {
          console.log("[AdminCertificates] uploading image for existing cert:", editTarget.id);
          const resultUrl = await uploadImage(image, "certificate", editTarget.id, { isPrimary: true });
          if (resultUrl) image = resultUrl;
          console.log("[AdminCertificates] image upload result:", image);
        }
        await editCertificate(editTarget.id, { ...data, image });
      } else {
        // Creating: create certificate FIRST, then upload image with new ID
        const imageUri = data.image && !data.image.startsWith("http") ? data.image : undefined;
        console.log("[AdminCertificates] creating certificate...");
        const certId = await addCertificate({ ...data, image: imageUri ? undefined : data.image });
        console.log("[AdminCertificates] certificate created, id:", certId);

        if (imageUri && certId) {
          console.log("[AdminCertificates] uploading image for new cert:", certId);
          await uploadImage(imageUri, "certificate", certId, { isPrimary: true });
          console.log("[AdminCertificates] image uploaded, refreshing...");
          await refreshCertificates();
        }
      }
      setShowForm(false);
      setEditTarget(null);
    } catch (error: any) {
      console.log("[AdminCertificates] handleSave error:", error.message);
      Alert.alert("Error", "Failed to save certificate or upload image.");
    }
  }, [editTarget, addCertificate, editCertificate, refreshCertificates]);

  const handleDeleteRequest = useCallback((id: string) => {
    const cert = certificates.find((c) => c.id === id);
    if (cert) setDeleteTarget(cert);
  }, [certificates]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteCertificate(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteTarget, deleteCertificate]);

  const handleViewImage = useCallback((cert: Certificate) => {
    if (cert.image) setViewImage(cert.image);
  }, []);

  return (
    <AdminLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshCertificates} />}
      >
        <View className="px-5 pt-4">
          <View className="flex-row items-center justify-between">
            <View className="gap-1">
              <Text className="text-[11px] font-semibold tracking-[1.5px]" style={{ color: colors.primary }}>
                CERTIFICATES
              </Text>
              <Text className="text-[22px] font-bold mt-1" style={{ color: colors.text }}>
                Certificates
              </Text>
              <Text className="text-[13px] mt-0.5" style={{ color: colors.secondaryText }}>
                Manage your certificates and credentials.
              </Text>
            </View>
            <TouchableOpacity
              className="h-11 w-11 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
              onPress={handleAdd}
              activeOpacity={0.8}
            >
              <Plus size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? null : certificates.length === 0 ? (
          <View className="items-center justify-center px-10 pt-16 pb-20">
            <Text className="text-[20px] font-bold" style={{ color: colors.text }}>
              No certificates yet
            </Text>
            <Text className="text-[14px] text-center mt-2" style={{ color: colors.secondaryText }}>
              Add your first certificate using the + button above.
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap px-5 pt-6 pb-8 gap-3.5">
            {certificates.map((cert) => (
              <View key={cert.id} className="flex-1 basis-[47%]">
                <CertificateCard
                  certificate={cert}
                  onDelete={handleDeleteRequest}
                  onEdit={handleEdit}
                  onViewImage={handleViewImage}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <CertificateFormModal
        visible={showForm}
        editTarget={editTarget}
        onSave={handleSave}
        onClose={() => { setShowForm(false); setEditTarget(null); }}
      />

      <DeleteModal 
        visible={!!deleteTarget}
        title={deleteTarget?.title ?? ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <ImageViewer
        visible={!!viewImage}
        imageUrl={viewImage}
        onClose={() => setViewImage(null)}
      />
    </AdminLayout>
  );
}
