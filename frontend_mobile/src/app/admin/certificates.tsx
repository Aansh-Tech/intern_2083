import { useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import CertificateCard from "../../components/admin_certificates/CertificateCard";
import CertificateFormModal from "../../components/admin_certificates/CertificateFormModal";
import ImageViewer from "../../components/admin_certificates/ImageViewer";
import { usePopup } from "../../components/Popup";
import { useCertificates } from "../../context/CertificateContext";
import { useTheme } from "../../context/useTheme";
import { uploadImage } from "../../services/image";
import type { Certificate } from "../../types/certificate";

console.log = () => {};
console.info = () => {};
console.debug = () => {};

export default function AdminCertificatesScreen() {
  const { colors } = useTheme();
  const { showModal, showConfirm, showToast } = usePopup();
  const { certificates, loading, refreshing, refreshCertificates, addCertificate, editCertificate, deleteCertificate } = useCertificates();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Certificate | null>(null);
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
      showToast({ type: "success", message: editTarget ? "Certificate updated" : "Certificate added" });
    } catch (error: any) {
      console.log("[AdminCertificates] handleSave error:", error.message);
      showModal({
        type: "error",
        title: "Something went wrong",
        message: "Failed to save certificate or upload image.",
        primaryText: "OK",
      });
    }
  }, [editTarget, addCertificate, editCertificate, refreshCertificates, showModal, showToast]);

  const handleDeleteRequest = useCallback((id: string) => {
    const cert = certificates.find((c) => c.id === id);
    if (!cert) return;
    showConfirm({
      title: "Delete certificate?",
      message: `Are you sure you want to delete "${cert.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      destructive: true,
      onConfirm: async () => {
        try {
          await deleteCertificate(cert.id);
          showToast({ type: "success", message: "Certificate deleted" });
        } catch (error) {
          showModal({
            type: "error",
            title: "Something went wrong",
            message: "Failed to delete the certificate.",
            primaryText: "OK",
          });
        }
      },
    });
  }, [certificates, deleteCertificate, showConfirm, showModal, showToast]);

  const handleViewImage = useCallback((cert: Certificate) => {
    if (cert.image) setViewImage(cert.image);
  }, []);

  return (
    <AdminLayout refreshing={refreshing} onRefresh={refreshCertificates}>
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

      <ImageViewer
        visible={!!viewImage}
        imageUrl={viewImage}
        onClose={() => setViewImage(null)}
      />
    </AdminLayout>
  );
}
