import { cssInterop } from "nativewind";
import React from "react";
import {
  KeyboardAwareScrollView as KeyboardAwareScrollViewNative,
  KeyboardAwareScrollViewProps
} from "react-native-keyboard-aware-scroll-view";

cssInterop(KeyboardAwareScrollViewNative, {
  className: "style",
  contentContainerClassName: "contentContainerStyle"
});
const KeyboardAwareScrollView = React.forwardRef<
  KeyboardAwareScrollViewNative,
  KeyboardAwareScrollViewProps
>(
  (
    {
      contentContainerStyle,

      ...props
    },
    ref
  ) => (
    <KeyboardAwareScrollViewNative
      ref={ref}
      enableOnAndroid
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[contentContainerStyle, { flexGrow: 1 }]}
      {...props}
    />
  )
);

KeyboardAwareScrollView.displayName = "KeyboardAwareScrollView";

export { KeyboardAwareScrollView };
