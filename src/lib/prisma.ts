interface Global {
  prisma?: PrismaClient;
}

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as Global;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}

export const prisma = globalForPrisma.prisma;
