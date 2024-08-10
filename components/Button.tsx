import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

interface CustomButtonProps {
  title: string;
  color: string;
  onPress: () => void; // Function to handle button press
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, color, onPress }) => {
  return (
    <View style={styles.container}>
      <Button 
        title={title}
        color={color}
        onPress={onPress}
      />
    </View>


  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },

});

export default CustomButton;