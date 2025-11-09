import { Modal, View, Text, Pressable } from "react-native";
import { useSelectedValuesFormatPicker } from "../store/useSelectedIdProduct";

interface PickerModalProps {
  showFormatPicker: boolean;
  setShowFormatPicker: (value: boolean) => void;
}

const FormatPicker = ({
  showFormatPicker,
  setShowFormatPicker,
}: PickerModalProps) => {
  const { selectedProductId, setSelectedValuesFormatPicker } =
    useSelectedValuesFormatPicker();
  //maneja el comportamiento de los dropdown para elegir formato P, KG, GR
  const handleDropdownChange = (id: string, newValue: string) => {
    setSelectedValuesFormatPicker({ [id]: newValue });
  };

  const items = [
    { label: "P", value: "P" },
    { label: "KG", value: "KG" },
    { label: "GR", value: "GR" },
  ];

  return (
    <>
      <Modal
        visible={showFormatPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFormatPicker(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-slate-800 rounded-t-3xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-bold">
                Seleccionar Formato
              </Text>
              <Pressable onPress={() => setShowFormatPicker(false)}>
                <Text className="text-white text-lg">✕</Text>
              </Pressable>
            </View>
            <View className="space-y-2">
              {items.map((item: any) => (
                <Pressable
                  key={item.value}
                  onPress={() => {
                    if (selectedProductId) {
                      handleDropdownChange(selectedProductId, item.value);
                      setShowFormatPicker(false);
                    }
                  }}
                  className="bg-slate-700 p-4 rounded-lg"
                >
                  <Text className="text-white text-center text-lg">
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default FormatPicker;
