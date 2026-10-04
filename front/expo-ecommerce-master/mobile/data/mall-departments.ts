import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type MciName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export type MallDepartment = {
  name: string;
  icon: MciName;
};

/** أقسام المول — تُعرض كلها في الواجهة؛ الأصناف تُربط باسم القسم في الكتالوج. */
export const MALL_DEPARTMENTS: MallDepartment[] = [
  { name: "المواد الغذائية", icon: "basket-outline" },
  { name: "خضار وفواكه", icon: "fruit-cherries" },
  { name: "اللحوم", icon: "food-steak" },
  { name: "ألبان ومشتقاتها", icon: "cheese" },
  { name: "مخبوزات", icon: "baguette" },
  { name: "مجمدات", icon: "snowflake" },
  { name: "معلبات وحبوب", icon: "food-variant" },
  { name: "المشروبات", icon: "cup-outline" },
  { name: "حلويات ووجبات خفيفة", icon: "candy-outline" },
  { name: "المنظفات", icon: "spray-bottle" },
  { name: "عناية شخصية", icon: "face-woman-shimmer" },
];

const iconByName = new Map(MALL_DEPARTMENTS.map((d) => [d.name, d.icon]));

export function departmentIcon(categoryName: string): MciName {
  return iconByName.get(categoryName) ?? "package-variant";
}

export function isMallDepartment(name: string) {
  return iconByName.has(name);
}
