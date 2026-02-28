import { useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";
interface OptionModalProps {
  showOptionsModal: boolean;
  setShowOptionsModal: (show: boolean) => void;
  onDelete: () => void;
  onModify: () => void;
  productName?: string;
  onNameChange?: (newName: string) => void;
}

export default function OptionModal({
  showOptionsModal,
  setShowOptionsModal,
  onModify,
  onDelete,
  productName = "",
  onNameChange, //retorna el nuevo nombre del producto modificado
}: OptionModalProps) {
  const [isModifying, setIsModifying] = useState(false);
  const [newName, setNewName] = useState(productName);

  const handleModify = () => {
    setIsModifying(true);
  };
  //funcion para aceptar la modificacion
  const handleAccept = () => {
    if (onNameChange) {
      onNameChange(newName);
    }
    setIsModifying(false);
    setShowOptionsModal(false);
    onModify(); // llama a la funcion para modificar el nombre del producto
  };
  //funcion para cancelar la modificacion
  const handleCancel = () => {
    setIsModifying(false);
    setNewName(productName);
  };
  // funcion para cerrar el modal
  const handleCloseModal = () => {
    setShowOptionsModal(false);
    setIsModifying(false);
    setNewName(productName);
  };

  return (
    <Modal
      visible={showOptionsModal}
      transparent={true}
      onRequestClose={handleCloseModal}
      animationType="slide"
    >
      <View className="flex-1 justify-end items-center bg-black/90">
        <View className="w-full bg-gray-900 rounded-t-3xl shadow-2xl">
          <View className="p-6 space-y-4">
            <Text className="text-xl self-center font-bold text-white mb-2 pb-2 w-full text-center">
              {isModifying ? "Modificar Nombre" : productName}
            </Text>

            {isModifying ? (
              <>
                <TextInput
                  className="bg-gray-800 p-4 rounded-xl text-white border border-gray-700 focus:border-red-600 mb-3 text-lg"
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Escribe el nuevo nombre..."
                  placeholderTextColor="#a0a0a0"
                />
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    className="flex-1 bg-red-600 py-3 rounded-xl shadow-lg"
                    onPress={handleAccept}
                  >
                    <Text className="text-white text-center font-bold text-base">
                      Aceptar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-gray-700 py-3 rounded-xl"
                    onPress={handleCancel}
                  >
                    <Text className="text-white text-center font-bold text-base">
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View className="space-y-3">
                <TouchableOpacity
                  className="w-full bg-red-600 py-3 rounded-xl shadow-md"
                  onPress={() => {
                    handleCloseModal();
                    onDelete();
                  }}
                >
                  <Text className="text-white text-center font-bold text-lg">
                    Eliminar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-full bg-gray-700 py-3 rounded-xl shadow-md"
                  onPress={handleModify}
                >
                  <Text className="text-white text-center font-bold text-lg">
                    Modificar
                  </Text>
                </TouchableOpacity>

                <View className="pt-2">
                  <TouchableOpacity className="py-2" onPress={handleCloseModal}>
                    <Text className="text-gray-400 text-center font-semibold text-base">
                      Cerrar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
