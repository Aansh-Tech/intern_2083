import { memo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { MoreHorizontal, Edit3, Star, StarOff, Trash2, CheckCircle, XCircle } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface ProjectMenuProps {
  featured: boolean;
  completed: boolean;
  onEdit: () => void;
  onToggleFeatured: () => void;
  onToggleCompleted: () => void;
  onDelete: () => void;
}

function ProjectMenu({
  featured,
  completed,
  onEdit,
  onToggleFeatured,
  onToggleCompleted,
  onDelete,
}: ProjectMenuProps) {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  const close = () => setVisible(false);

  const items = [
    { label: "Edit", icon: Edit3, onPress: () => { close(); onEdit(); } },
    { label: featured ? "Remove Featured" : "Mark as Featured", icon: featured ? StarOff : Star, onPress: () => { close(); onToggleFeatured(); } },
    { label: completed ? "Mark Incomplete" : "Mark Completed", icon: completed ? XCircle : CheckCircle, onPress: () => { close(); onToggleCompleted(); } },
    { label: "Delete", icon: Trash2, destructive: true, onPress: () => { close(); onDelete(); } },
  ];

  return (
    <>
      <TouchableOpacity
        className="w-8 h-8 rounded-full items-center justify-center"
        style={{ backgroundColor: colors.background }}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <MoreHorizontal size={16} color={colors.secondaryText} />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={close}>
        <Pressable className="flex-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onPress={close}>
          <Pressable
            className="absolute right-6 rounded-2xl border overflow-hidden"
            style={{
              top: 220,
              backgroundColor: colors.card,
              borderColor: colors.border,
              minWidth: 200,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 10,
            }}
          >
            {items.map((item, idx) => (
              <View key={item.label}>
                <TouchableOpacity
                  className="flex-row items-center gap-3 px-4 py-3.5"
                  activeOpacity={0.7}
                  onPress={item.onPress}
                >
                  <item.icon
                    size={16}
                    color={(item as any).destructive ? "#EF4444" : colors.secondaryText}
                  />
                  <Text
                    className="text-[14px] font-medium"
                    style={{ color: (item as any).destructive ? "#EF4444" : colors.text }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
                {idx < items.length - 1 && (
                  <View style={{ height: 1, backgroundColor: colors.border }} />
                )}
              </View>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export default memo(ProjectMenu);
