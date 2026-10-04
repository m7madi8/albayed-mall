import { palette } from "@/theme/palette";

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-PS", { month: "short", day: "numeric", year: "numeric" });
};

export const formatPrice = (amount: number) => {
  const value = Number.isFinite(amount) ? amount : 0;
  return `${value.toFixed(2)} ₪`;
};

export const getOffer = (product: {
  price: number;
  compareAtPrice?: number | null;
  originalPrice?: number | null;
}) => {
  const compare = product.compareAtPrice ?? product.originalPrice ?? null;
  if (compare == null || compare <= product.price) return null;
  const saved = compare - product.price;
  const percent = Math.round((saved / compare) * 100);
  return { compare, saved, percent };
};

export const statusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "تم التسليم";
    case "shipped":
      return "في الطريق";
    case "pending":
      return "قيد التجهيز";
    default:
      return status;
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return palette.primary;
    case "shipped":
      return palette.primaryDark;
    case "pending":
      return palette.slate;
    default:
      return palette.slate;
  }
};
