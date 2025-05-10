import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  TextInput,
} from "react-native";
import { styled } from "nativewind";

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
      <View className="flex-1 justify-end items-center bg-black/50">
        <View className="w-full bg-primary rounded-t-3xl shadow-lg">
          <View className="p-5 space-y-3">
            <Text className="text-xl self-center font-bold mb-3 text-yellow-500">
              {isModifying ? "Modificar Nombre" : productName}
            </Text>

            {isModifying ? (
              <>
                <TextInput
                  className="bg-white p-3 rounded-lg text-black mb-3"
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Nombre del producto"
                />
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    className="flex-1 bg-yellow-500 py-2.5 px-4 rounded-lg"
                    onPress={handleAccept}
                  >
                    <Text className=" text-white text-center font-semibold">
                      Aceptar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-gray-200 py-2.5 px-4 rounded-lg"
                    onPress={handleCancel}
                  >
                    <Text className="text-gray-800 text-center font-semibold">
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <TouchableOpacity
                  className="bg-red-600 py-4 px-16 rounded-2xl mb-3"
                  onPress={() => {
                    handleCloseModal();
                    onDelete();
                  }}
                >
                  <Text className="text-white text-center font-semibold">
                    Eliminar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-yellow-500 py-4 px-16 rounded-2xl mb-3"
                  onPress={handleModify}
                >
                  <Text className="text-white text-center font-semibold">
                    Modificar
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center items-center">
                  <TouchableOpacity
                    className="bg-gray-200 py-4 px-16 rounded-2xl"
                    onPress={handleCloseModal}
                  >
                    <Text className="text-gray-800 text-center font-semibold">
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
