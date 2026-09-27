import type { ReportDateRangeInput } from "../../../shared/payload-contracts/ticket.contract.ts";
import type { XmlReportSubmitInput } from "../../../shared/payload-contracts/xmlReport.contract.ts";
import { createHash } from "node:crypto";
import { validateReportDateRange } from "../../shared/reportDateRange.ts";
import { loadXmlReportConfig } from "./xml-report.config.ts";
import { mapXmlReportTicket } from "./xml-report.mapper.ts";
import {
  getXmlSubmissionKey,
  xmlReportRepo,
  type XmlReportSubmissionIdentity,
} from "./xml-report.repo.ts";
import { xmlReportSoap } from "./xml-report.soap.ts";
import type { LeadsOnlineTicket } from "./xml-report.types.ts";
import { createFieldError } from "../../shared/createFieldError.ts";
import {
  attachXmlReportImages,
  getXmlReportImageReferences,
  getXmlReportImageWarnings,
} from "./xml-report.images.ts";
import type { XmlReportImageReferences } from "./xml-report.types.ts";

const validateTicket = (ticket: LeadsOnlineTicket) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!ticket.items.Item.length) {
    errors.push("Ticket has no items.");
  }

  ticket.items.Item.forEach((item, index) => {
    if (!item.make && !item.model && !item.serialNumber && !item.description) {
      errors.push(`Item ${index + 1} has no identifying details.`);
    }
  });

  if (!ticket.customer.fname || !ticket.customer.lname) {
    warnings.push("Customer name is incomplete.");
  }
  if (!ticket.customer.dob) warnings.push("Customer birth date is missing.");
  if (!ticket.customer.sex) warnings.push("Customer sex is missing.");
  if (!ticket.customer.height) warnings.push("Customer height is missing.");
  if (!ticket.customer.weight) warnings.push("Customer weight is missing.");
  if (!ticket.customer.eyeColor)
    warnings.push("Customer eye color is missing.");
  if (!ticket.customer.hairColor)
    warnings.push("Customer hair color is missing.");
  if (!ticket.customer.idNumber) warnings.push("Customer ID is missing.");
  if (!ticket.customer.address1) warnings.push("Customer address is missing.");
  if (!ticket.customer.city) warnings.push("Customer city is missing.");
  if (!ticket.customer.state) warnings.push("Customer province is missing.");
  if (!ticket.customer.postalCode) {
    warnings.push("Customer postal code is missing.");
  }
  if (!ticket.customer.phone) warnings.push("Customer phone is missing.");

  return { errors, warnings };
};

const getPayloadHash = (
  payload: LeadsOnlineTicket,
  imageReferences: XmlReportImageReferences,
) =>
  createHash("sha256")
    .update(JSON.stringify({ payload, imageReferences }))
    .digest("hex");

const getSubmissionIdentity = (
  payload: LeadsOnlineTicket,
): XmlReportSubmissionIdentity => ({
  ticket_number: Number(payload.key.ticketnumber),
  ticket_type: payload.key.ticketType,
  ticket_datetime: payload.key.ticketDateTime,
});

const buildReport = async (input: ReportDateRangeInput) => {
  const { fromDate, toDate } = validateReportDateRange(input, {
    maximumDays: 93,
  });
  const sourceRows = await xmlReportRepo.loadSourceRows(fromDate, toDate);

  if (sourceRows.length > 20_000) {
    throw createFieldError(
      "to_date",
      "This report is too large. Select a smaller date range.",
    );
  }
  const groupedRows = new Map<number, typeof sourceRows>();

  for (const row of sourceRows) {
    const rows = groupedRows.get(row.ticket_number) ?? [];
    rows.push(row);
    groupedRows.set(row.ticket_number, rows);
  }

  const environment = loadXmlReportConfig().environment;
  const candidates = [...groupedRows.values()].map((rows) => {
    const payload = mapXmlReportTicket(rows);
    const imageReferences = getXmlReportImageReferences(rows);
    const validation = validateTicket(payload);
    validation.warnings.push(...getXmlReportImageWarnings(imageReferences));
    return {
      payload,
      imageReferences,
      identity: getSubmissionIdentity(payload),
      payloadHash: getPayloadHash(payload, imageReferences),
      validation,
    };
  });
  const submissionMap = await xmlReportRepo.loadSubmissionMap(
    candidates.map((candidate) => candidate.identity),
    environment,
  );
  const tickets = candidates.map((candidate) => {
    const submission = submissionMap.get(
      getXmlSubmissionKey(candidate.identity),
    );
    const payloadChanged = Boolean(
      submission?.status === "submitted" &&
      submission.payload_hash !== candidate.payloadHash,
    );

    return {
      payload: candidate.payload,
      image_references: candidate.imageReferences,
      photo_count:
        Number(Boolean(candidate.imageReferences.client_image_path)) +
        candidate.imageReferences.item_image_paths.filter(Boolean).length,
      expected_photo_count: 1 + candidate.payload.items.Item.length,
      ...candidate.validation,
      submission_status: payloadChanged
        ? ("pending" as const)
        : (submission?.status ?? ("pending" as const)),
      submission_message: payloadChanged
        ? "Ticket changed since its last submission. Submit to update it."
        : (submission?.message ?? ""),
    };
  });
  const previewToken = createHash("sha256")
    .update(
      JSON.stringify(
        candidates.map((candidate) => ({
          identity: candidate.identity,
          payload_hash: candidate.payloadHash,
        })),
      ),
    )
    .digest("hex");

  return {
    from_date: fromDate,
    to_date: toDate,
    preview_token: previewToken,
    tickets,
    total_tickets: tickets.length,
    valid_tickets: tickets.filter((ticket) => !ticket.errors.length).length,
    invalid_tickets: tickets.filter((ticket) => ticket.errors.length).length,
  };
};

const buildPreview = async (input: ReportDateRangeInput) => {
  const report = await buildReport(input);
  return {
    ...report,
    tickets: report.tickets.map(({ image_references: _, ...ticket }) => ticket),
  };
};

export const xmlReportService = {
  checkConnection: () => xmlReportSoap.checkLogin(),

  loadPreview: buildPreview,

  submitReport: async (input: XmlReportSubmitInput) => {
    const preview = await buildReport(input);
    if (!input.preview_token || input.preview_token !== preview.preview_token) {
      throw createFieldError(
        "form",
        "Ticket data changed after the preview. Generate the preview again before submitting.",
      );
    }
    if (!preview.total_tickets) {
      throw createFieldError(
        "form",
        "There are no tickets to submit for this date range.",
      );
    }
    if (preview.invalid_tickets) {
      throw createFieldError(
        "form",
        "Fix all invalid tickets before submitting the report.",
      );
    }

    const environment = loadXmlReportConfig().environment;
    const results = [];

    for (const ticket of preview.tickets) {
      const identity = getSubmissionIdentity(ticket.payload);
      const ticketNumber = identity.ticket_number;
      const payloadHash = getPayloadHash(
        ticket.payload,
        ticket.image_references,
      );
      const claim = await xmlReportRepo.claimSubmission({
        ...identity,
        environment,
        payload_hash: payloadHash,
      });

      if (!claim.claimed) {
        results.push({
          ticket_number: ticketNumber,
          status: "skipped" as const,
          error_code: 0,
          message: claim.message,
        });
        continue;
      }

      let result: {
        success: boolean;
        error_code: number;
        message: string;
      };

      try {
        const payloadWithImages = await attachXmlReportImages(
          ticket.payload,
          ticket.image_references,
        );
        result = claim.use_update
          ? await xmlReportSoap.updateTransaction(payloadWithImages)
          : await xmlReportSoap.submitTransaction(payloadWithImages);

        if (!claim.use_update && result.error_code === 13) {
          result = await xmlReportSoap.updateTransaction(payloadWithImages);
        }
      } catch (error) {
        result = {
          success: false,
          error_code: -1,
          message:
            error instanceof Error
              ? error.message
              : "Unable to reach LeadsOnline.",
        };
      }

      const status = result.success ? "submitted" : "failed";
      await xmlReportRepo.completeSubmission({
        ...identity,
        environment,
        payload_hash: payloadHash,
        status,
        error_code: result.error_code,
        message: result.message,
      });
      results.push({
        ticket_number: ticketNumber,
        status,
        error_code: result.error_code,
        message: result.message,
      });
    }

    return {
      from_date: preview.from_date,
      to_date: preview.to_date,
      results,
      submitted_tickets: results.filter(
        (result) => result.status === "submitted",
      ).length,
      failed_tickets: results.filter((result) => result.status === "failed")
        .length,
      skipped_tickets: results.filter((result) => result.status === "skipped")
        .length,
    };
  },
};
