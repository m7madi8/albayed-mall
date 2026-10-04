import { palette } from "@/theme/palette";
import { useTabBarMetrics } from "@/lib/tab-bar";
import BrandMark from "@/components/BrandMark";
import ProductsGrid from "@/components/ProductsGrid";
import SafeScreen from "@/components/SafeScreen";
import { MALL_DEPARTMENTS } from "@/data/mall-departments";
import { getCatalogProductCountsByDepartment } from "@/data/store-catalog";
import { useIsWideWeb } from "@/lib/responsive";
import useProducts from "@/hooks/useProducts";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState, type ComponentProps } from "react";
import { Platform, View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import useCart from "@/hooks/useCart";

const ALL_CATEGORY = "الكل";

const ShopScreen = () => {
  const { scrollPadding } = useTabBarMetrics();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const { cartItemCount } = useCart();
  const { data: products, isLoading, isError, refetch } = useProducts();

  const departmentCounts = useMemo(() => getCatalogProductCountsByDepartment(), [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    if (selectedCategory !== ALL_CATEGORY) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const totalInCatalog = products?.length ?? 0;
  const isWeb = Platform.OS === "web";
  const isWideWeb = useIsWideWeb();

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: scrollPadding }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        directionalLockEnabled
      >
        <View className={`px-5 pb-2 ${isWeb ? "pt-6" : "pt-4"}`}>
          {!isWeb && (
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <BrandMark size={72} />
                <View className="ms-3">
                  <Text className="text-text-primary text-2xl font-bold">مول البايض</Text>
                  <Text className="text-text-secondary text-sm mt-0.5">كتالوج المول كامل</Text>
                </View>
              </View>
              <TouchableOpacity
                className="w-11 h-11 rounded-full bg-surface border border-line items-center justify-center"
                onPress={() => router.push("/(tabs)/cart")}
                accessibilityRole="button"
                accessibilityLabel="السلة"
              >
                <Ionicons name="cart-outline" size={22} color={palette.ink} />
                {cartItemCount > 0 && (
                  <View className="absolute -top-1 -left-1 bg-primary min-w-5 h-5 px-1 rounded-full items-center justify-center">
                    <Text className="text-ivory text-[10px] font-bold">{cartItemCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}

          {isWeb && (
            <Text className="text-text-primary text-2xl font-bold mb-4">جميع أصناف المول</Text>
          )}

          <View className={`bg-surface border border-line flex-row items-center px-4 rounded-2xl h-14 ${isWeb ? "" : "mt-5"}`}>
            <Ionicons color={palette.slate} size={20} name="search" />
            <TextInput
              placeholder="ابحث في كل أصناف المول"
              placeholderTextColor={palette.slate}
              className="flex-1 ms-3 text-base text-text-primary"
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="بحث"
            />
          </View>
        </View>

        <View className="px-5 mt-5">
          <View className="bg-primary-dark rounded-3xl px-6 py-7">
            <View className="self-start bg-lime rounded-full px-3 py-1">
              <Text className="text-ink text-xs font-bold">متجر شامل</Text>
            </View>
            <Text className={`text-ivory font-bold mt-4 ${isWideWeb ? "text-4xl" : "text-3xl"}`}>
              جميع أصناف المول
            </Text>
            <Text className="text-ivory text-base leading-7 mt-3" style={{ opacity: 0.82 }}>
              تصفّح كل الأقسام — غذائية، لحوم، خضار، مشروبات، منظفات والمزيد. أضف ما تريد إلى السلة
              وأتمم الطلب.
            </Text>
            {!isLoading && totalInCatalog > 0 && (
              <Text className="text-lime text-sm font-bold mt-4">
                {totalInCatalog} صنف متوفر الآن في الكتالوج
              </Text>
            )}
          </View>
        </View>

        <View className="mt-7">
          <Text className="text-text-primary text-lg font-bold px-5 mb-1">أقسام المول</Text>
          <Text className="text-text-secondary text-sm px-5 mb-3">اختر قسماً لعرض أصنافه</Text>
          {isWideWeb ? (
            <View className="flex-row flex-wrap px-5 gap-3">
              <DepartmentChip
                name={ALL_CATEGORY}
                icon="view-grid-outline"
                count={totalInCatalog}
                isSelected={selectedCategory === ALL_CATEGORY}
                onPress={() => setSelectedCategory(ALL_CATEGORY)}
                layout="grid"
              />
              {MALL_DEPARTMENTS.map((department) => (
                <DepartmentChip
                  key={department.name}
                  name={department.name}
                  icon={department.icon}
                  count={departmentCounts[department.name] ?? 0}
                  isSelected={selectedCategory === department.name}
                  onPress={() => setSelectedCategory(department.name)}
                  layout="grid"
                />
              ))}
            </View>
          ) : (
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              <DepartmentChip
                name={ALL_CATEGORY}
                icon="view-grid-outline"
                count={totalInCatalog}
                isSelected={selectedCategory === ALL_CATEGORY}
                onPress={() => setSelectedCategory(ALL_CATEGORY)}
              />
              {MALL_DEPARTMENTS.map((department) => (
                <DepartmentChip
                  key={department.name}
                  name={department.name}
                  icon={department.icon}
                  count={departmentCounts[department.name] ?? 0}
                  isSelected={selectedCategory === department.name}
                  onPress={() => setSelectedCategory(department.name)}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View className="px-5 mt-8">
          <View className="flex-row items-end justify-between mb-4">
            <View className="flex-1 pe-3">
              <Text className="text-text-primary text-lg font-bold">
                {selectedCategory === ALL_CATEGORY ? "كل الأصناف" : selectedCategory}
              </Text>
              <Text className="text-text-secondary text-sm mt-1 leading-5">
                {isLoading
                  ? "..."
                  : selectedCategory === ALL_CATEGORY
                    ? `عرض كامل الكتالوج — ${filteredProducts.length} صنف`
                    : `${filteredProducts.length} صنف في هذا القسم`}
              </Text>
            </View>
          </View>
          <ProductsGrid
            products={filteredProducts}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            animationKey={selectedCategory}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

function DepartmentChip({
  name,
  icon,
  count,
  isSelected,
  onPress,
  layout = "rail",
}: {
  name: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  count: number;
  isSelected: boolean;
  onPress: () => void;
  layout?: "rail" | "grid";
}) {
  const isGrid = layout === "grid";

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-2xl px-2 overflow-hidden items-center justify-center border h-28 ${
        isGrid ? "" : "me-3 w-28"
      } ${isSelected ? "bg-primary border-primary" : "bg-surface border-line"}`}
      style={isGrid ? { width: "23%", minWidth: 120, maxWidth: 168 } : undefined}
      accessibilityRole="button"
      accessibilityLabel={`${name}، ${count} صنف`}
    >
      <MaterialCommunityIcons
        name={icon}
        size={28}
        color={isSelected ? palette.onPrimary : palette.ink}
      />
      <Text
        className={`text-xs font-bold mt-2 text-center ${isSelected ? "text-ivory" : "text-text-primary"}`}
        numberOfLines={2}
      >
        {name}
      </Text>
      <Text
        className={`text-[10px] font-semibold mt-1 ${isSelected ? "text-ivory/80" : "text-text-secondary"}`}
      >
        {count} صنف
      </Text>
      {isSelected && <View className="w-1.5 h-1.5 rounded-full bg-lime mt-1.5" />}
    </TouchableOpacity>
  );
}

export default ShopScreen;
