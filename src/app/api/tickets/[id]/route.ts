import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Función auxiliar simulada para envío de correos
async function sendEmailNotification(ticketId: string, companyId: string) {
  return new Promise((resolve) => {
    console.log(
      `Enviando notificación urgente a ${companyId} para el ticket ${ticketId}...`,
    );
    resolve(true);
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (status !== "Abierto" && status !== "Resuelto") {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    // Buscamos el ticket para ver su prioridad
    const ticket = await prisma.ticket.findFirst({
      where: {
        id,
        companyId: session.companyId,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket no encontrado" },
        { status: 404 },
      );
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { status },
    });

    if (ticket.priority === "Urgente" && status === "Resuelto") {
      void sendEmailNotification(ticket.id, ticket.companyId).catch((error) => {
        console.error("Error sending urgent notification:", error);
      });
    }

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Error updating ticket" },
      { status: 500 },
    );
  }
}
