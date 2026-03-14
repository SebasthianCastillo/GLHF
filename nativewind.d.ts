import "nativewind";
import "react-native";

declare module "react-native" {
  interface ViewProps {
    className?: string;
    tw?: string;
  }
  interface TextProps {
    className?: string;
    tw?: string;
  }
  interface ImagePropsBase {
    className?: string;
    tw?: string;
  }
  interface FlatListProps<ItemT> {
    className?: string;
    tw?: string;
  }
  interface SwitchProps {
    className?: string;
    tw?: string;
  }
  interface TouchableWithoutFeedbackProps {
    className?: string;
    tw?: string;
  }
}
