import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { router } from "expo-router";
import ColorPicker, { Swatches } from "reanimated-color-picker";
import { Ionicons } from "@expo/vector-icons";

const FilteredCategoriesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [colors, setColors] = useState<{ [key: string]: string }>({});
  const [IsPickerVisible, setIsPickerVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const {
    getCategory: { data: categoriesData, isLoading, isError },
  } = useCategories();

  const filteredCategories = (categoriesData ?? []).filter((product: any) =>
    product.name.toString().toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const OnPressColorChange = (categoryId: any) => {
    setSelectedCategoryId(categoryId);
    setIsPickerVisible(true);
  };

  const navigateToProductosFromCategory = (category: object) => {
    router.push({
      pathname: "/Products",
      params: { category: JSON.stringify(category) },
    });
  };

  const handleColorChange = async (newColor: any) => {
    if (selectedCategoryId !== null) {
      const updatedColors = { ...colors, [selectedCategoryId]: newColor };
      setColors(updatedColors);

      try {
        await AsyncStorage.setItem(
          "categoryColors",
          JSON.stringify(updatedColors),
        );
      } catch (error) {
        console.log("Error saving colors:", error);
      }
    }
  };

  useEffect(() => {
    const loadColors = async () => {
      try {
        const savedColors = await AsyncStorage.getItem("categoryColors");
        if (savedColors) {
          setColors(JSON.parse(savedColors));
        }
      } catch (error) {
        console.log("Error loading colors:", error);
      }
    };
    loadColors();
  }, []);

  if (isLoading) {
    return (
      <View className="px-4 py-8">
        <Text className="text-neutral-400 text-center">Cargando...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="px-4 py-8">
        <Text className="text-red-400 text-center">
          Error al cargar categorías
        </Text>
      </View>
    );
  }

  if (filteredCategories.length === 0) {
    return (
      <View className="px-4 py-8">
        <View className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 items-center">
          <Ionicons name="folder-open-outline" size={48} color="#525252" />
          <Text className="text-neutral-400 text-center mt-3">
            No hay categorías aún
          </Text>
          <Text className="text-neutral-500 text-sm text-center mt-1">
            Toca el botón + para agregar una
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="px-4">
      <View className="mb-3">
        <View className="bg-neutral-800 rounded-xl px-3 border border-neutral-700 h-9 flex-row items-center">
          <Ionicons name="search" size={14} color="#6B7280" />
          <View className="flex-1">
            <TextInput
              className="text-neutral-400 text-sm ml-2 h-full"
              placeholder="Buscar..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>
      {Array.from({ length: Math.ceil(filteredCategories.length / 2) }).map(
        (_, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-between w-full mb-3">
            {filteredCategories
              .slice(rowIndex * 2, rowIndex * 2 + 2)
              .map((category: any) => (
                <TouchableOpacity
                  key={category._id}
                  className="w-[48%] rounded-xl overflow-hidden"
                  activeOpacity={0.7}
                  onPress={() => navigateToProductosFromCategory(category)}
                  onLongPress={() => OnPressColorChange(category._id)}
                >
                  <View
                    className="h-24 justify-center items-center relative"
                    style={{
                      backgroundColor: colors[category._id] || "#F59E0B",
                    }}
                  >
                    <Ionicons
                      name="folder"
                      size={32}
                      color="rgba(255,255,255,0.9)"
                    />
                    <View className="absolute bottom-2 left-0 right-0 px-2">
                      <Text
                        className="text-white text-sm font-semibold text-center"
                        numberOfLines={1}
                      >
                        {category.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            {filteredCategories.length % 2 === 1 &&
              rowIndex === Math.ceil(filteredCategories.length / 2) - 1 && (
                <View key={`placeholder-${rowIndex}`} className="w-[48%]" />
              )}
          </View>
        ),
      )}

      <Modal visible={IsPickerVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/70">
          <View className="w-4/5 bg-neutral-900 p-5 rounded-2xl border border-neutral-800 items-center">
            <Text className="text-white text-lg font-semibold mb-4">
              Elegir Color
            </Text>
            <ColorPicker
              style={{ width: "70%" }}
              value={colors[selectedCategoryId] || "#F59E0B"}
              onComplete={({ hex }: { hex: string }) => {
                handleColorChange(hex);
                setIsPickerVisible(false);
              }}
            >
              <Swatches />
            </ColorPicker>
            <View className="items-center p-4">
              <TouchableOpacity
                className="bg-neutral-700 px-8 py-2.5 rounded-xl"
                onPress={() => setIsPickerVisible(false)}
              >
                <Text className="text-white font-medium">Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FilteredCategoriesList;
