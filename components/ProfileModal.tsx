import { Modal, Pressable, View, Image, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "@/store/useUserStore";

interface ProfileModalProps {
  showProfileModal: boolean;
  setShowProfileModal: (value: boolean) => void;
}
const ProfileModal = ({
  showProfileModal,
  setShowProfileModal,
}: ProfileModalProps) => {
  const user = useUserStore((state) => state.user);
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    useUserStore.getState().clearUser();
  };
  return (
    <View>
      <Modal
        visible={showProfileModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/60"
          onPress={() => setShowProfileModal(false)}
        >
          <View className="bg-neutral-900 rounded-t-3xl p-6 pb-10 border-t border-l border-r border-neutral-800">
            <View className="items-center mb-6">
              <View className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500">
                <Image
                  source={{
                    uri:
                      (user?.avatar as string) ||
                      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <Text className="text-lg font-semibold mt-3 text-white">
                {user?.name?.split(" ")[0]}
              </Text>
              <Text className="text-neutral-400 text-sm">{user?.email}</Text>
            </View>
            <Pressable
              onPress={() => {
                setShowProfileModal(false);
                logout();
              }}
              className="bg-red-600 py-3.5 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">Cerrar sesión</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default ProfileModal;
