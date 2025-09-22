import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in dev/hot-reload
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["warn", "error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
