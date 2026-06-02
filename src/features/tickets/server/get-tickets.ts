import { prisma } from "@/lib/prisma";

export async function getTickets(companyId: string) {
  return prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    where: { companyId },
  });
}
