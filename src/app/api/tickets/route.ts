import { NextResponse } from "next/server";
import { getTickets } from "@/features/tickets";
import { getCurrentSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const tickets = await getTickets(session.companyId);

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Error fetching tickets" },
      { status: 500 },
    );
  }
}
