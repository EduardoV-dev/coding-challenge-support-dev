import type { Ticket } from "../types/ticket";
import { useQuery } from "@tanstack/react-query";

export const ticketsQueryKey = ["tickets"];

async function fetchTickets(): Promise<Ticket[]> {
  const res = await fetch("/api/tickets");

  if (!res.ok) {
    throw new Error("Error fetching tickets");
  }

  return res.json();
}

export function useGetTickets() {
  return useQuery({
    queryKey: ticketsQueryKey,
    queryFn: fetchTickets,
  });
}
