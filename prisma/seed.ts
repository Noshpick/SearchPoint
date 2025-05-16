import { Pool } from "../actor/middleware/Pool";

async function seed() {
  const commonTypeData = {
    title: "Смартфон",
    filters: {
      create: {
        title: "Категория",
        items: {
          create: [
            { title: "Флагман" },
            { title: "Бюджетный" }
          ]
        }
      }
    }
  };

  const products = [
    {
      title: "iPhone 13",
      price: 1200,
      description: "Apple смартфон",
      images: [{ src: "iphone.jpg" }],
      features: [{ icon: "jpg", title: "Цвет", value: "Синий" }],
    },
    {
      title: "Samsung Galaxy S22",
      price: 1100,
      description: "Samsung флагман",
      images: [{ src: "samsung.jpg" }],
      features: [{ icon: "jpg", title: "Память", value: "256GB" }],
    },
    {
      title: "Poco",
      price: 1100,
      description: "POCO X100000 SUPER DUPER MEGA FLAGMEN FRAGMEN PLAGMEN PUPER DUPER EXTRA HARD",
      images: [{ src: "pocoX3.jpg" }],
      features: [{ icon: "jpg", title: "Память", value: "256GB" }],
    }
  ];

  for (const productData of products) {
    const product = await Pool.conn.product.create({
      data: {
        title: productData.title,
        price: productData.price,
        description: productData.description,
        images: {
          create: productData.images
        },
        features: {
          create: productData.features
        },
        type: {
          create: commonTypeData
        }
      }
    });

    console.log("Создан товар:", product.title);
  }
}
seed()