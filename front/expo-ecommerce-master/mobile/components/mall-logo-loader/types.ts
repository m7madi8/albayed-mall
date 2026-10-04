import type { StyleProp, ViewStyle } from "react-native";

export interface MallLogoLoaderProps {
  /** Total seconds incl. final hold. Default 2.8 */
  duration?: number;
  /** Seconds before start. Default 0 */
  delay?: number;
  /** Rendered width in px; height follows the logo aspect ratio. Default 360 */
  size?: number;
  onComplete?: () => void;
  /** Defaults sampled from the logo: yellow #FFBE29, charcoal #3A3A3A */
  colors?: { accent?: string; dark?: string };
  label?: string;
  style?: StyleProp<ViewStyle>;
}
