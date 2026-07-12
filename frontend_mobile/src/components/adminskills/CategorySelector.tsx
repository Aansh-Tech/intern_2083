import { memo, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import type { SkillCategory } from "../../types/skill";
import { skillCategories } from "../../data/defaultSkills";

interface CategorySelectorProps {
  value: SkillCategory;
  onChange: (category: SkillCategory) => void;
}

function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback(
    (cat: SkillCategory) => {
      onChange(cat);
      setOpen(false);
    },
    [onChange]
  );

  return (
    <>
      <TouchableOpacity
        className="flex-row items-center justify-between h-[56px] rounded-[18px] border px-4"
        style={{ backgroundColor: colors.background, borderColor: colors.border }}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text className="text-[15px]" style={{ color: colors.text }}>
          {value}
        </Text>
        <ChevronDown size={18} color={colors.secondaryText} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View
            className="w-[280px] rounded-3xl border overflow-hidden"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <FlatList
              data={skillCategories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="px-5 py-4"
                  style={{
                    backgroundColor: item === value ? colors.primary + "20" : "transparent",
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    className="text-[15px] font-medium"
                    style={{ color: item === value ? colors.primary : colors.text }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              scrollEnabled={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default memo(CategorySelector);
