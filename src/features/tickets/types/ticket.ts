import { TICKET_PRIORITY, TICKET_STATUS } from "../constants/ticket";

export type TicketStatus =
  (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];

export type TicketPriority =
  (typeof TICKET_PRIORITY)[keyof typeof TICKET_PRIORITY];

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  companyId: string;
  createdAt: string;
  updatedAt: string;
};
