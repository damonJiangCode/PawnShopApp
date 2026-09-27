import type { Ticket } from "../../../shared/models/ticket.model.ts";
import type { ProcessTicketPaymentsInput } from "../../../shared/payload-contracts/ticket.contract.ts";
import { calculation } from "../../../shared/utils/calculation.ts";
import { getTicketPickupAmount } from "../../../shared/utils/ticketFinance.ts";
import { getDatabaseNow } from "../../database/connection.ts";
import { createFieldError } from "../../shared/createFieldError.ts";
import { runInTransaction } from "../../shared/runInTransaction.ts";
import { interestPaymentRepo } from "./interest-payment.repo.ts";
import { ticketInput } from "./ticket.input.ts";
import { ticketRepo } from "./ticket.repo.ts";

type ProcessPaymentsResult = {
  picked_up_tickets: Ticket[];
  extended_tickets: Ticket[];
};

const validateLockedTickets = (ticketNumbers: number[], tickets: Ticket[]) => {
  const ticketByNumber = new Map(
    tickets.map((ticket) => [Number(ticket.ticket_number), ticket]),
  );

  for (const ticketNumber of ticketNumbers) {
    const ticket = ticketByNumber.get(ticketNumber);

    if (!ticket) {
      throw createFieldError(
        "ticket_number",
        `Ticket #${ticketNumber} was not found. Refresh and try again.`,
      );
    }

    if (ticket.status !== "pawned") {
      throw createFieldError(
        "ticket_number",
        `Ticket #${ticketNumber} is no longer pawned. Refresh and try again.`,
      );
    }
  }

  return ticketByNumber;
};

export const ticketPaymentService = {
  processPayments: async (
    input: ProcessTicketPaymentsInput,
  ): Promise<ProcessPaymentsResult> => {
    const normalizedInput = ticketInput.normalizeProcessPayments(input);
    const pickupTicketNumbers = normalizedInput.pickup_ticket_numbers;
    const extensionTicketNumbers = normalizedInput.extensions.map(
      (extension) => extension.ticket_number,
    );

    if (!pickupTicketNumbers.length && !extensionTicketNumbers.length) {
      throw createFieldError("ticket_number", "Select at least one ticket.");
    }

    const pickupSet = new Set(pickupTicketNumbers);
    const conflictingTicketNumber = extensionTicketNumbers.find(
      (ticketNumber) => pickupSet.has(ticketNumber),
    );

    if (conflictingTicketNumber) {
      throw createFieldError(
        "ticket_number",
        `Ticket #${conflictingTicketNumber} cannot be bought back and extended in the same payment.`,
      );
    }

    return runInTransaction("processTicketPayments", async (client) => {
      const allTicketNumbers = [
        ...new Set([...pickupTicketNumbers, ...extensionTicketNumbers]),
      ].sort((left, right) => left - right);
      const lockedTickets = await ticketRepo.loadManyByTicketNumberForUpdate(
        allTicketNumbers,
        client,
      );
      const ticketByNumber = validateLockedTickets(
        allTicketNumbers,
        lockedTickets,
      );
      const stolenPickup = pickupTicketNumbers.find(
        (ticketNumber) => ticketByNumber.get(ticketNumber)?.is_stolen,
      );

      if (stolenPickup) {
        throw createFieldError(
          "ticket_number",
          `Ticket #${stolenPickup} is marked stolen and cannot be bought back.`,
        );
      }

      const paymentDatetime = await getDatabaseNow(client);
      const authoritativePayments = pickupTicketNumbers.map((ticketNumber) => ({
        ticket_number: ticketNumber,
        pickup_amount_paid: getTicketPickupAmount(
          ticketByNumber.get(ticketNumber)!,
          paymentDatetime,
        ),
      }));
      const pickedUpTickets = authoritativePayments.length
        ? await ticketRepo.pickup(
            {
              tickets: authoritativePayments,
              pickup_datetime: paymentDatetime,
            },
            client,
          )
        : [];

      if (pickedUpTickets.length !== authoritativePayments.length) {
        throw createFieldError(
          "ticket_number",
          "One or more tickets changed while the payment was processing. Refresh and try again.",
        );
      }

      const extendedTickets: Ticket[] = [];

      for (const extension of normalizedInput.extensions) {
        const originalTicket = ticketByNumber.get(extension.ticket_number)!;
        const extendedTicket = await ticketRepo.extend(
          {
            ticket_number: extension.ticket_number,
            months: extension.months,
            interested_datetime: paymentDatetime,
          },
          client,
        );
        const amountPaid =
          calculation.getBaseIntAmt(Number(originalTicket.amount ?? 0)) *
          extension.months;

        await interestPaymentRepo.addInterestPayment(
          {
            ticket_number: extension.ticket_number,
            months_paid: extension.months,
            amount_paid: Number(amountPaid.toFixed(2)),
            payment_datetime: paymentDatetime,
          },
          client,
        );
        extendedTickets.push(extendedTicket);
      }

      return {
        picked_up_tickets: pickedUpTickets,
        extended_tickets: extendedTickets,
      };
    });
  },
};
