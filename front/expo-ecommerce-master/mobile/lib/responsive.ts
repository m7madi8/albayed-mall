import { Platform, useWindowDimensions } from "react-native";

/** عرض المحتوى على سطح المكتب — موقع ويب وليس شاشة هاتف فقط */
export const WEB_MAX_CONTENT_WIDTH = 1120;

export const GRID_HORIZONTAL_PADDING = 40;
export const GRID_GAP = 12;

export function useContentWidth() {
  const { width: screenWidth } = useWindowDimensions();
  if (Platform.OS !== "web") return screenWidth;
  return Math.min(screenWidth, WEB_MAX_CONTENT_WIDTH);
}

export function gridColumnsForWidth(contentWidth: number) {
  if (contentWidth >= 1024) return 4;
  if (contentWidth >= 720) return 3;
  return 2;
}

export function cardWidthForGrid(contentWidth: number, columns: number) {
  return Math.floor(
    (contentWidth - GRID_HORIZONTAL_PADDING - GRID_GAP * (columns - 1)) / columns
  );
}

export function useProductGridMetrics() {
  const contentWidth = useContentWidth();
  const columns = gridColumnsForWidth(contentWidth);
  const cardWidth = cardWidthForGrid(contentWidth, columns);

  return {
    contentWidth,
    columns,
    cardWidth,
    gap: GRID_GAP,
    horizontalPadding: GRID_HORIZONTAL_PADDING,
  };
}

export function useIsWideWeb() {
  const contentWidth = useContentWidth();
  return Platform.OS === "web" && contentWidth >= 720;
}
