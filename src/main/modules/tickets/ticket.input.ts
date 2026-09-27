import type {
  ConvertTicketInput,
  ExpireTicketInput,
  MarkTicketStolenInput,
  ProcessTicketPaymentsInput,
  CreatePawnTicketInput,
  CreateSellTicketInput,
  ReverseTicketInput,
  TransferTicketInput,
  UpdateTicketInput,
} from "../../../shared/payload-contracts/ticket.contract.ts";
import { createFieldError } from "../../shared/createFieldError.ts";

const trimText = (value?: string) => value?.trim() ?? "";

const toNumber = (value: unknown) => Number(value);

const toOptionalNumber = (value: unknown, fallback = 0) =>
  value === "" || value === null || value === undefined
    ? fallback
    : Number(value);

const normalizeCreatePawnTicket = (input: CreatePawnTicketInput) => ({
  description: trimText(input.description),
  location: trimText(input.location),
  amount: toNumber(input.amount),
  onetime_fee: toOptionalNumber(input.onetime_fee),
  employee_password: trimText(input.employee_password),
  client_number: input.client_number,
});

const normalizeCreateSellTicket = (input: CreateSellTicketInput) => ({
  description: trimText(input.description),
  location: trimText(input.location),
  amount: toNumber(input.amount),
  employee_password: trimText(input.employee_password),
  client_number: input.client_number,
});

const normalizeUpdateTicket = (input: UpdateTicketInput) => ({
  ticket_number: input.ticket_number,
  is_lost: Boolean(input.is_lost),
  description: trimText(input.description),
  location: trimText(input.location),
  amount: toNumber(input.amount),
  onetime_fee: toOptionalNumber(input.onetime_fee),
  partial_payment: toOptionalNumber(input.partial_payment),
  employee_password: trimText(input.employee_password),
});

const normalizeTransferTicket = (input: TransferTicketInput) => ({
  ticket_number: toNumber(input.ticket_number),
  client_number: toNumber(input.client_number),
});

const normalizeConvertTicket = (input: ConvertTicketInput) => ({
  ticket_number: toNumber(input.ticket_number),
  target_status: input.target_status,
  description: trimText(input.description),
  location: trimText(input.location),
  amount: toNumber(input.amount),
  onetime_fee: toOptionalNumber(input.onetime_fee),
  employee_password: trimText(input.employee_password),
});

const normalizeExpireTicket = (input: ExpireTicketInput) => ({
  ticket_number: toNumber(input.ticket_number),
  employee_password:
    input.employee_password === undefined
      ? undefined
      : trimText(input.employee_password),
});

const normalizeMarkTicketStolen = (input: MarkTicketStolenInput) => ({
  ticket_number: toNumber(input.ticket_number),
  employee_password: trimText(input.employee_password),
});

const normalizeProcessPayments = (input: ProcessTicketPaymentsInput) => ({
  pickup_ticket_numbers: [
    ...new Set(
      input.pickup_ticket_numbers
        .map(toNumber)
        .filter(
          (ticketNumber) => Number.isInteger(ticketNumber) && ticketNumber > 0,
        ),
    ),
  ],
  extensions: [
    ...input.extensions
      .map((extension) => ({
        ticket_number: toNumber(extension.ticket_number),
        months: Math.floor(toNumber(extension.months)),
      }))
      .filter(
        (extension) =>
          Number.isInteger(extension.ticket_number) &&
          extension.ticket_number > 0 &&
          Number.isInteger(extension.months) &&
          extension.months > 0,
      )
      .reduce<Map<number, { ticket_number: number; months: number }>>(
        (extensions, extension) => {
          const existing = extensions.get(extension.ticket_number);
          extensions.set(extension.ticket_number, {
            ticket_number: extension.ticket_number,
            months: (existing?.months ?? 0) + extension.months,
          });
          return extensions;
        },
        new Map(),
      )
      .values(),
  ],
});

const normalizeReverseTicket = (input: ReverseTicketInput) => ({
  ticket_number: toNumber(input.ticket_number),
});

const validateTicketDetails = (input: {
  description: string;
  location: string;
  amount: number;
  employee_password: string;
}) => {
  if (!input.description) {
    throw createFieldError("description", "Description is required.");
  }

  if (!input.location) {
    throw createFieldError("location", "Location is required.");
  }

  if (!Number.isFinite(input.amount) || input.amount < 0) {
    throw createFieldError("amount", "Amount cannot be negative.");
  }

  if (!input.employee_password) {
    throw createFieldError("employee_password", "Enter employee password.");
  }
};

const validateClientNumber = (clientNumber: number) => {
  if (!Number.isInteger(clientNumber) || clientNumber <= 0) {
    throw createFieldError("client", "Select a valid client.");
  }
};

const validateOnetimeFee = (onetimeFee: number) => {
  if (!Number.isFinite(onetimeFee) || onetimeFee < 0) {
    throw createFieldError("onetime_fee", "One Time Fee cannot be negative.");
  }
};

const validateCreatePawnTicket = (
  input: ReturnType<typeof normalizeCreatePawnTicket>,
) => {
  validateTicketDetails(input);
  validateClientNumber(input.client_number);
  validateOnetimeFee(input.onetime_fee);
};

const validateCreateSellTicket = (
  input: ReturnType<typeof normalizeCreateSellTicket>,
) => {
  validateTicketDetails(input);
  validateClientNumber(input.client_number);
};

const validateUpdateTicket = (
  input: ReturnType<typeof normalizeUpdateTicket>,
) => {
  validateTicketDetails(input);

  if (!Number.isInteger(input.ticket_number) || input.ticket_number <= 0) {
    throw createFieldError("ticket_number", "Enter a valid ticket number.");
  }

  validateOnetimeFee(input.onetime_fee);

  if (!Number.isFinite(input.partial_payment) || input.partial_payment < 0) {
    throw createFieldError("amount", "Partial payment cannot be negative.");
  }
};

const validateConvertTicket = (
  input: ReturnType<typeof normalizeConvertTicket>,
) => {
  validateTicketDetails(input);

  if (!Number.isInteger(input.ticket_number) || input.ticket_number <= 0) {
    throw createFieldError("ticket_number", "Enter a valid ticket number.");
  }

  validateOnetimeFee(input.onetime_fee);
};

const isValidDateKey = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export const ticketInput = {
  normalizeCreatePawnTicket,
  normalizeCreateSellTicket,
  normalizeUpdateTicket,
  normalizeTransferTicket,
  normalizeConvertTicket,
  normalizeExpireTicket,
  normalizeMarkTicketStolen,
  normalizeProcessPayments,
  normalizeReverseTicket,
  validateCreatePawnTicket,
  validateCreateSellTicket,
  validateUpdateTicket,
  validateConvertTicket,
  isValidDateKey,
};
