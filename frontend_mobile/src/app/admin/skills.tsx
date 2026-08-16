import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import SkillForm from "../../components/adminskills/SkillForm";
import SkillSection from "../../components/adminskills/SkillSection";
import SkillFormModal from "../../components/adminskills/SkillFormModal";
import { usePopup } from "../../components/Popup";
import { useSkills } from "../../context/SkillsContext";
import { useTheme } from "../../context/useTheme";
import type { Skill, SkillCategory } from "../../types/skill";
import { useResponsiveContainer } from "../../utils/responsive";

export default function AdminSkillsScreen() {
  const { colors } = useTheme();
  const { showModal, showConfirm, showToast } = usePopup();
  const { skills, getSkillsByCategory, addSkill, updateSkill, deleteSkill, loading, refreshing, refreshSkills } = useSkills();
  const categories = getSkillsByCategory();

  const [editTarget, setEditTarget] = useState<Skill | null>(null);
  const [editCategory, setEditCategory] = useState<SkillCategory>("Frontend");
  const [editName, setEditName] = useState("");
  const [editPercentage, setEditPercentage] = useState(50);
  const [editError, setEditError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const headerContainer = useResponsiveContainer();
  const listContainer = useResponsiveContainer();

  const handleAdd = useCallback(
    async (data: { category: SkillCategory; name: string; percentage: number }) => {
      const err = await addSkill(data);
      if (!err) {
        showToast({ type: "success", message: "Skill added" });
      }
      return err;
    },
    [addSkill, showToast]
  );

  const handleDeleteRequest = useCallback((id: string) => {
    const skill = categories.flatMap((c) => c.skills).find((s) => s.id === id);
    if (!skill) return;
    showConfirm({
      title: "Delete skill?",
      message: `Are you sure you want to delete "${skill.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      destructive: true,
      onConfirm: async () => {
        try {
          await deleteSkill(skill.id);
          showToast({ type: "success", message: "Skill deleted" });
        } catch (error) {
          showModal({
            type: "error",
            title: "Something went wrong",
            message: "Failed to delete the skill.",
            primaryText: "OK",
          });
        }
      },
    });
  }, [categories, deleteSkill, showConfirm, showModal, showToast]);

  const handleEdit = useCallback((skill: Skill) => {
    setEditTarget(skill);
    setEditCategory(skill.category);
    setEditName(skill.name);
    setEditPercentage(skill.percentage);
    setEditError(null);
  }, []);

  const handleEditSave = useCallback(async () => {
    if (!editTarget) return;
    const err = await updateSkill(editTarget.id, {
      category: editCategory,
      name: editName,
      percentage: editPercentage,
    });
    if (err) {
      setEditError(err);
    } else {
      setEditTarget(null);
      showToast({ type: "success", message: "Skill updated" });
    }
  }, [editTarget, editCategory, editName, editPercentage, updateSkill, showToast]);

  return (
    <AdminLayout refreshing={refreshing} onRefresh={refreshSkills}>
      <View style={[headerContainer, { paddingHorizontal: 20, paddingTop: 16 }]}>
        <Text className="text-[11px] font-semibold tracking-[1.5px]" style={{ color: colors.primary }}>
          SKILLS
        </Text>
        <Text className="text-[22px] font-bold mt-1" style={{ color: colors.text }}>
          Skills & Proficiencies
        </Text>
        <Text className="text-[13px] mt-0.5" style={{ color: colors.secondaryText }}>
          Manage your skill set and proficiency levels.
        </Text>
      </View>

      <View className="pt-6">
        {!showAddForm ? (
          <View className="mx-5">
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 h-14 rounded-3xl border-2 border-dashed"
              style={{ borderColor: colors.border }}
              activeOpacity={0.7}
              onPress={() => setShowAddForm(true)}
            >
              <Plus size={20} color={colors.primary} />
              <Text className="text-[15px] font-bold" style={{ color: colors.primary }}>
                Add Skill
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <SkillForm onAdd={handleAdd} onSuccess={() => setShowAddForm(false)} />
        )}
      </View>

      {loading ? null : categories.length === 0 ? (
        <View className="items-center justify-center px-10 pt-16 pb-20">
          <Text className="text-[20px] font-bold" style={{ color: colors.text }}>
            No skills yet
          </Text>
          <Text className="text-[14px] text-center mt-2" style={{ color: colors.secondaryText }}>
            Add your first skill using the form above.
          </Text>
        </View>
      ) : (
        <View style={[listContainer, { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32, gap: 16 }]}>
          {categories.map(({ category, skills }) => (
            <SkillSection
              key={category}
              category={category}
              skills={skills}
              onDelete={handleDeleteRequest}
              onEdit={handleEdit}
            />
          ))}
        </View>
      )}

      <SkillFormModal
        visible={!!editTarget}
        category={editCategory}
        name={editName}
        percentage={editPercentage}
        error={editError}
        onCategoryChange={setEditCategory}
        onNameChange={(t) => { setEditName(t); setEditError(null); }}
        onPercentageChange={setEditPercentage}
        onSave={handleEditSave}
        onClose={() => setEditTarget(null)}
      />
    </AdminLayout>
  );
}
