import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  console.error("Missing required environment variable: DATABASE_URL");
  process.exit(1);
}

const prisma = new PrismaClient();

export default prisma;
