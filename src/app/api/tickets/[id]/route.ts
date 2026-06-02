import { NextResponse } from "next/server";
import { updateTicketStatus } from "@/features/tickets";
import { getCurrentSession } from "@/lib/auth";

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

    const updatedTicket = await updateTicketStatus({
      id,
      companyId: session.companyId,
      status,
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_STATUS") {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    if (error instanceof Error && error.message === "TICKET_NOT_FOUND") {
      return NextResponse.json(
        { error: "Ticket no encontrado" },
        { status: 404 },
      );
    }

    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Error updating ticket" },
      { status: 500 },
    );
  }
}
