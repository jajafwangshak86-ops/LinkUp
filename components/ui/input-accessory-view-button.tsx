import React from "react";
import { View, Button, InputAccessoryView, Keyboard, Platform } from "react-native";

const nativeID = "action-button";

const InputAccessoryViewButton = ({
  onPress = () => {
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
    }
  },
  inputAccessoryViewID = nativeID,
  title = "Done"
}) => {
  if (Platform.OS !== "ios") return null;

  return (
    <InputAccessoryView nativeID={inputAccessoryViewID}>
      <View className="bg-gray-100 p-2 items-end">
        <Button onPress={onPress} title={title} />
      </View>
    </InputAccessoryView>
  );
};

InputAccessoryViewButton.nativeID = nativeID;
export default InputAccessoryViewButton;
