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
  TicketFormField,
} from "../../../../shared/payload-contracts/ticket.contract";
import { extractBackendFieldError } from "../../../shared/utils/formError";

export type { TicketFormField } from "../../../../shared/payload-contracts/ticket.contract";

export type TicketFormError = Error & {
  field?: TicketFormField;
};

const createFieldError = (
  field: TicketFormField,
  message: string,
): TicketFormError => {
  const error = new Error(message) as TicketFormError;
  error.field = field;
  return error;
};

const trimText = (value?: string) => value?.trim() ?? "";

const toNumber = (value: unknown) => Number(value);

const toOptionalNumber = (value: unknown, fallback = 0) =>
  value === "" || value === null || value === undefined
    ? fallback
    : Number(value);

export const normalizeCreatePawnTicketInput = (
  input: CreatePawnTicketInput,
): CreatePawnTicketInput => ({
  ...input,
  description: trimText(input.description),
  location: trimText(input.location),
  amount: toNumber(input.amount),
  onetime_fee: toOptionalNumber(input.onetime_fee),
  employee_password: trimText(input.employee_password),
});

export const normalizeCreateSellTicketInput = (
  input: CreateSellTicketInput,
): CreateSellTicketInput => ({
  ...input,
  description: trimText(input.description),
  location: trimText(input.location),
  amount: toNumber(input.amount),
  employee_password: trimText(input.employee_password),
});

export const normalizeUpdateTicketInput = (
  input: UpdateTicketInput,
): UpdateTicketInput => ({
  ticket_number: input.ticket_number,
  is_lost: Boolean(input.is_lost),
  description: trimText(input.description),
  location: trimText(input.location),
  amount: toNumber(input.amount),
  onetime_fee: toOptionalNumber(input.onetime_fee),
  partial_payment: toOptionalNumber(input.partial_payment),
  employee_password: trimText(input.employee_password),
});

export const normalizeTransferTicketInput = (
  input: TransferTicketInput,
): TransferTicketInput => ({
  ticket_number: toNumber(input.ticket_number),
  client_number: toNumber(input.client_number),
});

export const normalizeConvertTicketInput = (
  input: ConvertTicketInput,
): ConvertTicketInput => ({
  ticket_number: toNumber(input.ticket_number),
  target_status: input.target_status,
  description: trimText(input.description),
  location: trimText(input.location),
  amount: toNumber(input.amount),
  onetime_fee: toOptionalNumber(input.onetime_fee),
  employee_password: trimText(input.employee_password),
});

export const normalizeExpireTicketInput = (
  input: ExpireTicketInput,
): ExpireTicketInput => ({
  ticket_number: toNumber(input.ticket_number),
  employee_password:
    input.employee_password === undefined
      ? undefined
      : trimText(input.employee_password),
});

export const normalizeMarkTicketStolenInput = (
  input: MarkTicketStolenInput,
): MarkTicketStolenInput => ({
  ticket_number: toNumber(input.ticket_number),
  employee_password: trimText(input.employee_password),
});

export const normalizeProcessTicketPaymentsInput = (
  input: ProcessTicketPaymentsInput,
): ProcessTicketPaymentsInput => ({
  ...(input.pickup_price_exceptions !== undefined
    ? { pickup_price_exceptions: input.pickup_price_exceptions }
    : {}),
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

export const normalizeReverseTicketInput = (
  input: ReverseTicketInput,
): ReverseTicketInput => ({
  ticket_number: toNumber(input.ticket_number),
});

export const mapBackendError = (error: unknown): Error => {
  if (!(error instanceof Error)) {
    return new Error("Unknown ticket error");
  }

  const backendFieldError = extractBackendFieldError(error.message);

  if (!backendFieldError) {
    return error;
  }

  return createFieldError(
    backendFieldError.field as TicketFormField,
    backendFieldError.message,
  );
};
