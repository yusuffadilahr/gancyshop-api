import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function main() {
  // ----- Motor Matic Populer Indonesia -----
  const motors = [
    {
      motorCycleName: "Honda Beat Karbu",
      releaseYear: 2010,
    },
    {
      motorCycleName: "Honda Beat Fi",
      releaseYear: 2012,
    },
    {
      motorCycleName: "Yamaha Mio M3",
      releaseYear: 2010,
    },
    {
      motorCycleName: "Honda Vario 125",
      releaseYear: 2015,
    },
    {
      motorCycleName: "Honda Vario 150",
      releaseYear: 2015,
    },
    {
      motorCycleName: "Honda Scoopy Old",
      releaseYear: 2015,
    },
  ];

  await prisma.categorymotorcyle.createMany({ data: motors });
  const motos = await prisma.categorymotorcyle.findMany();

  // ----- Body Sparepart Category Umum -----
  const categoryNames = [
    "Body / Fairing",
    "Cover / Panel",
    "Front Fender / Spakbor Depan",
    "Rear Fender / Spakbor Belakang",
    "Body Kanan Kiri",
    "Dek Kolong",
    "Tameng Depan",
  ];

  const categories = [];
  for (let i = 0; i < categoryNames.length; i++) {
    const cat = await prisma.category.create({
      data: {
        categoryName: categoryNames[i],
        categoryMotorcycleId: motos[i % motos.length].id,
      },
    });
    categories.push(cat);
  }

  // ----- Dummy Products -----
  const productImage = [
    "https://ik.imagekit.io/gancyshop/products/body-sparepart/53206KVY960-COVER-HNDL-RR.jpg?updatedAt=1757756421006",
    "https://ik.imagekit.io/gancyshop/products/body-sparepart/images-1749227170376-726901762_l329rPtIE.jpg?updatedAt=1749227171095",
    "https://ik.imagekit.io/gancyshop/products/body-sparepart/images-1752295826856-644991957_T3GrGx2bE.jpg?updatedAt=1752295827016",
    "https://ik.imagekit.io/gancyshop/products/body-sparepart/tameng.jpg?updatedAt=1757756355018",
    "https://ik.imagekit.io/gancyshop/products/body-sparepart/dek-kunci-beat.jpg?updatedAt=1757756266319",
  ];

  const count = 20;
  let idx = 0;
  for (let i = 0; i <= count; i++) {
    await prisma.product.create({
      data: {
        name: `Body Motor ${i + 1}`,
        description: `Deskripsi Produk ke ${i + 1}`,
        price: 20000 * (i + 1),
        imageUrl: productImage[idx] || productImage[0],
        isActive: true,
        stock: 10 * (i + 1),
        weightGram: 450,
        ownerId: 1,
        categoryId: categories[idx].id,
      },
    });
    
    idx++;

    if (idx > 4) {
      idx = 0;
    }
  }

  const hashed = await hashPassword("12312312");

  await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "Gancy",
      email: "admin@gancy.my.id",
      password: hashed,
      phoneNumber: "6289214124124",
      role: "ADMIN",
      id: 1,
    },
  });

  console.log("✅ Seeding motor matic dan body sparepart selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
