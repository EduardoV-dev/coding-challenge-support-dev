import { prisma } from "@/lib/prisma";
import { TICKET_PRIORITY, TICKET_STATUS } from "../constants/ticket";
import type { TicketStatus } from "../types/ticket";
import { sendEmailNotification } from "./send-email-notification";

export async function updateTicketStatus({
  id,
  companyId,
  status,
}: {
  id: string;
  companyId: string;
  status: TicketStatus;
}) {
  if (status !== TICKET_STATUS.OPEN && status !== TICKET_STATUS.RESOLVED) {
    throw new Error("INVALID_STATUS");
  }

  const ticket = await prisma.ticket.findFirst({
    where: {
      id,
      companyId,
    },
  });

  if (!ticket) {
    throw new Error("TICKET_NOT_FOUND");
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id },
    data: { status },
  });

  if (
    ticket.priority === TICKET_PRIORITY.URGENT &&
    status === TICKET_STATUS.RESOLVED
  ) {
    void sendEmailNotification(ticket.id, ticket.companyId).catch((error) => {
      console.error("Error sending urgent notification:", error);
    });
  }

  return updatedTicket;
}
