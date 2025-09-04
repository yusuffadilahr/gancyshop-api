import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // ----- Motor Matic Populer Indonesia -----
    const motors = [
        "Honda Beat",
        "Yamaha Mio M3",
        "Yamaha NMAX",
        "Honda Vario 125",
        "Honda Vario 150",
        "Suzuki Nex",
        "Yamaha Fino",
        "Honda Scoopy",
        "Suzuki Burgman Street",
        "Yamaha Lexi",
    ];

    const motorData = motors.map((name, i) => ({
        motorCycleName: name,
        releaseYear: 2021 + (i % 3),
    }));

    await prisma.categorymotorcyle.createMany({ data: motorData });
    const motos = await prisma.categorymotorcyle.findMany();

    // ----- Body Sparepart Category Umum -----
    const categoryNames = [
        "Body / Fairing",
        "Cover / Panel",
        "Front Fender / Spakbor Depan",
        "Rear Fender / Spakbor Belakang",
        "Headlamp / Lampu Depan",
        "Tail Lamp / Lampu Belakang",
        "Handle / Stang & Grip",
        "Footstep / Step Kaki",
        "Seat / Jok",
        "Mirror / Spion",
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
    const productImage =
        "https://ik.imagekit.io/gancyshop/products/body-sparepart/images-1749227170376-726901762_l329rPtIE.jpg?updatedAt=1749227171095";

    let productCount = 1;
    for (let cat of categories) {
        const itemsPerCategory = 3; // tiap kategori punya 3 produk dummy
        for (let i = 0; i < itemsPerCategory; i++) {
            await prisma.product.create({
                data: {
                    name: `Sparepart ${productCount}`,
                    description: `Description for Sparepart ${productCount}`,
                    price: 50000 + productCount * 10000,
                    stock: 5 + productCount,
                    weightGram: 300 + productCount * 50,
                    imageUrl: productImage,
                    ownerId: 1, // asumsikan ada user admin default
                    categoryId: cat.id,
                },
            });
            productCount++;
        }
    }

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
