import { useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import SkillForm from "../../components/adminskills/SkillForm";
import SkillSection from "../../components/adminskills/SkillSection";
import DeleteSkillModal from "../../components/adminskills/DeleteSkillModal";
import SkillFormModal from "../../components/adminskills/SkillFormModal";
import { useSkills } from "../../context/SkillsContext";
import { useTheme } from "../../context/useTheme";
import type { Skill, SkillCategory } from "../../types/skill";

export default function AdminSkillsScreen() {
  const { colors } = useTheme();
  const { getSkillsByCategory, addSkill, updateSkill, deleteSkill, loading, refreshing, refreshSkills } = useSkills();
  const categories = getSkillsByCategory();

  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [editTarget, setEditTarget] = useState<Skill | null>(null);
  const [editCategory, setEditCategory] = useState<SkillCategory>("Frontend");
  const [editName, setEditName] = useState("");
  const [editPercentage, setEditPercentage] = useState(50);
  const [editError, setEditError] = useState<string | null>(null);

  const handleAdd = useCallback(
    async (data: { category: SkillCategory; name: string; percentage: number }) => {
      return await addSkill(data);
    },
    [addSkill]
  );

  const handleDeleteRequest = useCallback((id: string) => {
    const skill = categories.flatMap((c) => c.skills).find((s) => s.id === id);
    if (skill) setDeleteTarget(skill);
  }, [categories]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteSkill(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteTarget, deleteSkill]);

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
    }
  }, [editTarget, editCategory, editName, editPercentage, updateSkill]);

  return (
    <AdminLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshSkills} />}
      >
        <View className="px-5 pt-4">
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
          <SkillForm onAdd={handleAdd} />
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
          <View className="px-5 pt-6 pb-8 gap-4">
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
      </ScrollView>

      <DeleteSkillModal
        visible={!!deleteTarget}
        skillName={deleteTarget?.name ?? ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

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
