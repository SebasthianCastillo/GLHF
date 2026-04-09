import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useExpenseCategories } from "../hooks/useExpenseCategories";
import { ExpenseCategory } from "./api/expense-categories";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import RouterBackArrow from "@/components/RouterBackArrow";

interface CategoryItemProps {
  category: ExpenseCategory;
  onEdit: (cat: ExpenseCategory) => void;
  onDelete: (cat: ExpenseCategory) => void;
  onAddSubcategory: (cat: ExpenseCategory) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onEdit,
  onDelete,
  onAddSubcategory,
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <View className="border-b border-[#3f3f3f]">
      <TouchableOpacity
        className="flex-row items-center p-4"
        onPress={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            className="mr-2"
          >
            <Ionicons
              name={expanded ? "chevron-down" : "chevron-forward"}
              size={20}
              color="#aaaaaa"
            />
          </TouchableOpacity>
        )}
        {!hasChildren && <View className="w-6" />}
        
        <Text className="text-white flex-1">{category.name}</Text>
        
        <TouchableOpacity
          onPress={() => onAddSubcategory(category)}
          className="p-2"
        >
          <Ionicons name="add-circle-outline" size={22} color="#F59E0B" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => onEdit(category)}
          className="p-2"
        >
          <Ionicons name="pencil-outline" size={20} color="#aaaaaa" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => onDelete(category)}
          className="p-2"
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </TouchableOpacity>

      {expanded && hasChildren && (
        <View className="bg-[#1a1a1a]">
          {category.children!.map((child: ExpenseCategory) => (
            <View key={child.id} className="flex-row items-center pl-8 pr-4 py-3 border-t border-[#3f3f3f]">
              <Text className="text-gray-400 flex-1">  └ {child.name}</Text>
              <TouchableOpacity onPress={() => onEdit(child)} className="p-2">
                <Ionicons name="pencil-outline" size={18} color="#aaaaaa" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(child)} className="p-2">
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default function ExpenseCategoriesScreen() {
  const router = useRouter();
  const {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    removeCategory,
  } = useExpenseCategories();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "subcategory">("create");
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = () => {
    setModalType("create");
    setEditingCategory(null);
    setCategoryName("");
    setShowModal(true);
  };

  const handleEdit = (category: ExpenseCategory) => {
    setModalType("edit");
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowModal(true);
  };

  const handleAddSubcategory = (category: ExpenseCategory) => {
    setModalType("subcategory");
    setEditingCategory(category);
    setCategoryName("");
    setShowModal(true);
  };

  const handleDelete = async (category: ExpenseCategory) => {
    Alert.alert(
      "Eliminar Categoría",
      `¿Estás seguro de eliminar "${category.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await removeCategory.mutateAsync(category.id);
              Alert.alert("Éxito", "Categoría eliminada");
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.response?.data?.error || "No se pudo eliminar la categoría"
              );
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Ingresa un nombre para la categoría");
      return;
    }

    setSaving(true);
    try {
      if (modalType === "create") {
        await addCategory.mutateAsync({ name: categoryName.trim(), parentId: null });
        Alert.alert("Éxito", "Categoría creada");
      } else if (modalType === "edit" && editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          name: categoryName.trim(),
        });
        Alert.alert("Éxito", "Categoría actualizada");
      } else if (modalType === "subcategory" && editingCategory) {
        await addCategory.mutateAsync({
          name: categoryName.trim(),
          parentId: editingCategory.id,
        });
        Alert.alert("Éxito", "Subcategoría creada");
      }
      setShowModal(false);
      setCategoryName("");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.error || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0f0f0f]">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0f0f0f]">
      {/* Header */}
      <View className="border-b border-[#3f3f3f]">
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-3 -ml-2">
              <RouterBackArrow />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">Categorías de Gastos</Text>
          </View>
          <TouchableOpacity
            onPress={handleCreate}
            className="bg-[#F59E0B] px-4 py-2 rounded-lg"
          >
            <Text className="text-black font-semibold">+ Nueva</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category List */}
      {categories.length > 0 ? (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CategoryItem
              category={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddSubcategory={handleAddSubcategory}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-20 h-20 rounded-full bg-[#272727] items-center justify-center mb-4">
            <Ionicons name="folder-outline" size={40} color="#aaaaaa" />
          </View>
          <Text className="text-[#aaaaaa] text-base text-center mb-4">
            No hay categorías de gastos
          </Text>
          <TouchableOpacity
            className="bg-[#F59E0B] px-6 py-3 rounded-lg"
            onPress={handleCreate}
          >
            <Text className="text-black font-semibold">Crear primera categoría</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-[#272727] rounded-xl w-full p-6">
            <Text className="text-white text-lg font-bold mb-4">
              {modalType === "create" && "Nueva Categoría"}
              {modalType === "edit" && "Editar Categoría"}
              {modalType === "subcategory" && "Nueva Subcategoría"}
            </Text>
            
            {modalType === "subcategory" && editingCategory && (
              <Text className="text-[#aaaaaa] text-sm mb-4">
                Subcategoría de: {editingCategory.name}
              </Text>
            )}

            <TextInput
              className="bg-[#1a1a1a] text-white border border-[#3f3f3f] rounded-lg px-4 py-3 mb-6"
              placeholder="Nombre de la categoría"
              placeholderTextColor="#666666"
              value={categoryName}
              onChangeText={setCategoryName}
              autoFocus
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 py-3 bg-[#3f3f3f] rounded-lg items-center"
                onPress={() => setShowModal(false)}
              >
                <Text className="text-white font-medium">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 bg-[#F59E0B] rounded-lg items-center ${saving ? "opacity-70" : ""}`}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text className="text-black font-semibold">Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}