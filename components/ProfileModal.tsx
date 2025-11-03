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
    // setAuth(null);
    useUserStore.getState().clearUser();
  };
  return (
    <View>
      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <Pressable
          className="flex-1 justify-end"
          onPress={() => setShowProfileModal(false)}
        >
          <View className="bg-slate-950 rounded-t-3xl p-6 pb-10">
            <View className="items-center mb-6">
              <View className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-2 border-primary">
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
              <Text className="text-lg font-bold mt-3 text-white">
                {user?.name.split(" ")[0]}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                setShowProfileModal(false);
                logout();
              }}
              className="bg-red-500 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-medium">Cerrar sesión</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default ProfileModal;
