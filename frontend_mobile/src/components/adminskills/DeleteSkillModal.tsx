import { memo, useCallback } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useTheme } from "../../context/useTheme";

interface DeleteSkillModalProps {
  visible: boolean;
  skillName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteSkillModal({ visible, skillName, onCancel, onConfirm }: DeleteSkillModalProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center px-8" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
        <View
          className="w-full rounded-3xl border p-6 items-center"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <Text className="text-[20px] font-bold" style={{ color: colors.text }}>
            Delete Skill?
          </Text>
          <Text className="text-[14px] text-center mt-2" style={{ color: colors.secondaryText }}>
            Are you sure you want to delete "{skillName}"?
          </Text>
          <View className="flex-row gap-3 mt-6 w-full">
            <TouchableOpacity
              className="flex-1 h-[50px] rounded-full border items-center justify-center"
              style={{ borderColor: colors.border }}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text className="text-[15px] font-semibold" style={{ color: colors.secondaryText }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 h-[50px] rounded-full items-center justify-center"
              style={{ backgroundColor: "#EF4444" }}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text className="text-[15px] font-bold" style={{ color: "#FFFFFF" }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default memo(DeleteSkillModal);
