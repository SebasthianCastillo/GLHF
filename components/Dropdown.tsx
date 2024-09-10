import React from "react";
import { Modal, View, Text, TouchableOpacity, Animated } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface EnhancedModalProps {
  showOptionsModal: boolean;
  setShowOptionsModal: (show: boolean) => void;

  onDelete: () => void;
}

export default function EnhancedModal({
  showOptionsModal,
  setShowOptionsModal,

  onDelete,
}: EnhancedModalProps) {
  const [animation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: showOptionsModal ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showOptionsModal]);

  const AnimatedStyledView = Animated.createAnimatedComponent(StyledView);

  return (
    <Modal
      transparent={true}
      visible={showOptionsModal}
      onRequestClose={() => setShowOptionsModal(false)}
    >
      <StyledView className="flex-1 justify-end items-center bg-black/50">
        <AnimatedStyledView
          className="w-full bg-primary rounded-t-3xl shadow-lg"
          style={{
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                }),
              },
            ],
          }}
        >
          <StyledView className="p-6 space-y-4 ">
            <StyledText className="text-xl self-center font-bold mb-4 text-yellow-500">
              Eliminar Producto
            </StyledText>
            <StyledTouchableOpacity
              className="bg-red-600 py-3 px-4 rounded-lg active:bg-red-700 transition-colors"
              onPress={() => {
                setShowOptionsModal(false);
                onDelete();
              }}
            >
              <StyledText className="text-white text-center font-semibold text-lg">
                Eliminar
              </StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              className="bg-gray-200 py-3 px-4 rounded-lg active:bg-gray-300 transition-colors"
              onPress={() => setShowOptionsModal(false)}
            >
              <StyledText className="text-gray-800 text-center font-semibold text-lg">
                Cancelar
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </AnimatedStyledView>
      </StyledView>
    </Modal>
  );
}
