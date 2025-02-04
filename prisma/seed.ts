const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const tags = await prisma.tag.createMany({
    data: [
      { name: "Rock" },
      { name: "Pop" },
      { name: "Jazz" },
      { name: "Classical" },
      { name: "Hip-Hop" },
    ],
  });

  console.log(`Created ${tags.count} tags`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
