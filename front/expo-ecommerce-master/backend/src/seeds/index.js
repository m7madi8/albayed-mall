import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ENV } from "../config/env.js";

const products = [
  {
    name: "صلصة بندورة أول قطفة 400 غم",
    description: "عرض: كل 3 بـ 9.99 ₪ بدل 18 ₪.",
    price: 9.99,
    compareAtPrice: 18,
    promoLabel: "كل 3 بـ 9.99 ₪",
    stock: 40,
    category: "المواد الغذائية",
    images: ["https://placehold.co/600x600/F8F8F5/123C32?text=%D8%B5%D9%84%D8%B5%D8%A9"],
    averageRating: 4.8,
    totalReviews: 24,
  },
  {
    name: "أرز سيدرا بسمتي",
    description: "أرز بسمتي فاخر من سيدرا.",
    price: 5,
    compareAtPrice: 9,
    stock: 55,
    category: "المواد الغذائية",
    images: ["https://placehold.co/600x600/F8F8F5/123C32?text=%D8%A3%D8%B1%D8%B2"],
    averageRating: 4.7,
    totalReviews: 31,
  },
  {
    name: "كبدة دجاج 1 كيلو",
    description: "كبدة دجاج طازجة من قسم اللحوم.",
    price: 9.99,
    compareAtPrice: 15,
    stock: 20,
    category: "اللحوم",
    images: ["https://placehold.co/600x600/F8F8F5/123C32?text=%D9%83%D8%A8%D8%AF%D8%A9"],
    averageRating: 4.6,
    totalReviews: 18,
  },
  {
    name: "نبوت دجاج 3 كيلو",
    description: "نبوت دجاج للعائلة، 3 كيلو.",
    price: 44.99,
    compareAtPrice: 50,
    stock: 15,
    category: "اللحوم",
    images: ["https://placehold.co/600x600/F8F8F5/123C32?text=%D9%86%D8%A8%D9%88%D8%AA"],
    averageRating: 4.9,
    totalReviews: 12,
  },
  {
    name: "عصير كابي ليمون ونعنع 1.5 لتر",
    description: "عرض: كل 3 بـ 9.99 ₪.",
    price: 9.99,
    promoLabel: "كل 3 بـ 9.99 ₪",
    stock: 36,
    category: "المشروبات",
    images: ["https://placehold.co/600x600/F8F8F5/123C32?text=%D8%B9%D8%B5%D9%8A%D8%B1"],
    averageRating: 4.5,
    totalReviews: 27,
  },
  {
    name: "قهوة مثلجة الربيع",
    description: "لاتيه بندق، كابتشينو، كراميل فرابيه. عرض: كل 5 بـ 9.99 ₪.",
    price: 9.99,
    promoLabel: "كل 5 بـ 9.99 ₪",
    stock: 30,
    category: "المشروبات",
    images: ["https://placehold.co/600x600/F8F8F5/123C32?text=%D9%82%D9%87%D9%88%D8%A9"],
    averageRating: 4.8,
    totalReviews: 41,
  },
  {
    name: "صابون يد سائل Oil 500 مل",
    description: "عرض: كل 2 بـ 12.99 ₪ بدل 18 ₪.",
    price: 12.99,
    compareAtPrice: 18,
    promoLabel: "كل 2 بـ 12.99 ₪",
    stock: 48,
    category: "المنظفات",
    images: ["https://placehold.co/600x600/F8F8F5/123C32?text=%D8%B5%D8%A7%D8%A8%D9%88%D9%86"],
    averageRating: 4.4,
    totalReviews: 16,
  },
  {
    name: "كبسولات غسيل سانو 40 قرص",
    description: "كبسولات غسيل سانو، 40 قرص.",
    price: 19.99,
    stock: 22,
    category: "المنظفات",
    images: ["https://placehold.co/600x600/F8F8F5/123C32?text=%D8%B3%D8%A7%D9%86%D9%88"],
    averageRating: 4.6,
    totalReviews: 9,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${products.length} products`);

    const categories = [...new Set(products.map((p) => p.category))];
    console.log("\n📊 Seeded Products Summary:");
    console.log(`Total Products: ${products.length}`);
    console.log(`Categories: ${categories.join(", ")}`);

    await mongoose.connection.close();
    console.log("\n✅ Database seeding completed and connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
