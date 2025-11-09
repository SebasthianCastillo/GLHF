import { Modal, View } from "react-native";
import { useState } from "react";
import CustomButton from "../Button";
import { useCategories } from "../../hooks/useCategories";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { router } from "expo-router";
import SearchBar from "../SearchBar";
import ColorPicker, { Swatches } from "reanimated-color-picker";

const FilteredCategoriesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [colors, setColors] = useState<{ [key: string]: string }>({}); // Object to hold colors for each category
  const [IsPickerVisible, setIsPickerVisible] = useState(false); // To toggle color picker modal
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // Category ID for which color is being changed

  const { data: categoriesData, isLoading, isError } = useCategories();
  //Simple nice and beatiful search bar filter
  const filteredCategories = (categoriesData ?? []).filter((product: any) =>
    product.Name.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );
  const OnPressColorChange = (categoryId: any) => {
    setSelectedCategoryId(categoryId); // Set the current category ID
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
          JSON.stringify(updatedColors)
        ); // Save the new colors to AsyncStorage
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
          setColors(JSON.parse(savedColors)); // Set the saved colors
        }
      } catch (error) {
        console.log("Error loading colors:", error);
      }
    };
    loadColors();
  }, []);
  return (
    <View>
      <View className="pt-2">
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>
      {filteredCategories.map((category: any) => (
        <CustomButton
          key={category._id}
          containerStyles="w-full m-2"
          text={category.Name}
          HandlePress={() => navigateToProductosFromCategory(category)}
          HandleOnLongPress={() => OnPressColorChange(category._id)} // Show color picker on long press
          style={{
            backgroundColor: colors[category._id] || "#F59E0B",
          }}
          size={"text-lg"}
          showIcon={true}
          containerStylesText="pl-8"
        />
      ))}
      {/* Modal for color picker */}
      <Modal visible={IsPickerVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-center items-center bg-primary bg-opacity-50">
          <View className="w-4/5 bg-primary p-5 rounded-lg items-center">
            <ColorPicker
              style={{ width: "70%" }}
              value={colors[selectedCategoryId] || "red"}
              onComplete={({ hex }: { hex: string }) => {
                handleColorChange(hex);
                setIsPickerVisible(false);
              }}
            >
              <Swatches />
            </ColorPicker>
            <View className="items-center p-4">
              <CustomButton
                containerStyles="w-32 m-2 items-center"
                text={"Volver"}
                HandlePress={() => setIsPickerVisible(false)}
                size={"text-lg"}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FilteredCategoriesList;
