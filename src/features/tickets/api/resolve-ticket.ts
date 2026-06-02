import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TICKET_STATUS } from "../constants/ticket";
import { type Ticket } from "../types/ticket";
import { ticketsQueryKey } from "./fetch-tickets";

async function resolveTicket(ticketId: string): Promise<Ticket> {
  const res = await fetch(`/api/tickets/${ticketId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: TICKET_STATUS.RESOLVED }),
  });

  if (!res.ok) {
    throw new Error("Error resolving ticket");
  }

  return res.json();
}

export function useResolveTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resolveTicket,
    onMutate: async (ticketId) => {
      await queryClient.cancelQueries({ queryKey: ticketsQueryKey });

      const previousTickets =
        queryClient.getQueryData<Ticket[]>(ticketsQueryKey);

      queryClient.setQueryData<Ticket[]>(
        ticketsQueryKey,
        (currentTickets = []) =>
          currentTickets.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  status: TICKET_STATUS.RESOLVED,
                  updatedAt: new Date().toISOString(),
                }
              : ticket,
          ),
      );

      return { previousTickets };
    },
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData<Ticket[]>(
        ticketsQueryKey,
        (currentTickets = []) =>
          currentTickets.map((ticket) =>
            ticket.id === updatedTicket.id ? updatedTicket : ticket,
          ),
      );
    },
    onError: (error, _ticketId, context) => {
      if (context?.previousTickets) {
        queryClient.setQueryData(ticketsQueryKey, context.previousTickets);
      }

      console.error("Error resolving ticket:", error);
    },
  });
}
