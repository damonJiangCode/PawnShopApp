import type { Client } from "../../../../shared/models/client.model";
import type { Ticket } from "../../../../shared/models/ticket.model";
import { calculation } from "../../../../shared/utils/calculation";

export type PrintClient = Pick<
  Client,
  | "client_number"
  | "first_name"
  | "last_name"
  | "middle_name"
  | "address"
  | "city"
  | "province"
>;

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatMoney = (value: number) => {
  return `$${Number(value).toFixed(2)}`;
};

const formatTicketDate = (value: Date) => {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const addDays = (value: Date, days: number) => {
  const nextDate = new Date(value);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const formatClientName = (client?: PrintClient) =>
  [client?.last_name, client?.first_name, client?.middle_name]
    .filter((value): value is string => Boolean(value?.trim()))
    .map((value) => value.trim().toUpperCase())
    .join(" ");

const formatCityProvince = (client?: PrintClient) =>
  [client?.city, client?.province]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(",");

const createPseudoBarcode = (value: string) => {
  const seed = value || "0";
  const bars = Array.from(seed.repeat(7)).map((char, index) => {
    const digit = Number(char);
    const width = Number.isFinite(digit) ? (digit % 3) + 1 : 1;
    const margin = index % 4 === 0 ? 2 : 1;
    return `<span style="display:inline-block;width:${width}px;height:58px;margin-right:${margin}px;background:#000"></span>`;
  });

  return bars.join("");
};

export const createEnvelopePrintHtml = (
  ticket: Ticket,
  client?: PrintClient,
) => {
  const isPurchaseTicket =
    ticket.status === "sold" ||
    ticket.status === "sold_expired" ||
    ticket.location.trim().toUpperCase() === "BIWK";
  const ticketNumber = String(ticket.ticket_number ?? "");
  const pawnAmount = Number(ticket.amount ?? 0);
  const oneTimeFee = Number(ticket.onetime_fee ?? 0);
  const interestAmount = calculation.getBaseIntAmt(pawnAmount);
  const earlyClaimAmount = calculation.getEarlyAmt(pawnAmount, oneTimeFee);
  const amountDue = calculation.getBasePickupAmt(pawnAmount, oneTimeFee);
  const transactionDate = ticket.transaction_datetime;
  const earlyClaimDate = addDays(transactionDate, 7);
  const dueDate = ticket.due_date;
  const clientName = formatClientName(client);
  const cityProvince = formatCityProvince(client);
  const barcode = createPseudoBarcode(ticketNumber);
  const topBrandHtml = isPurchaseTicket
    ? ""
    : '<div class="brand"><span>Money</span><span>Express</span></div>';
  const moneyFieldsHtml = isPurchaseTicket
    ? `<div class="small-row"><span class="label">Purchase Amt:</span><span class="value">${formatMoney(pawnAmount)}</span></div>`
    : `<div class="small-row"><span class="label">Pawn Amt:</span><span class="value">${formatMoney(pawnAmount)}</span></div>
        <div class="small-row"><span class="label">Interest Amt:</span><span class="value">${formatMoney(interestAmount)}</span></div>
        <div class="small-row"><span class="label">Early Claim Amt:</span><span class="value">${formatMoney(earlyClaimAmount)}</span></div>`;
  const additionalDateFieldsHtml = isPurchaseTicket
    ? ""
    : `<div class="small-row"><span class="label">Due Date:</span><span class="value">${formatTicketDate(dueDate)}</span></div>
        <div class="small-row"><span class="label">Amt Due:</span><span class="value">${formatMoney(amountDue)}</span></div>`;
  const ratesHtml = isPurchaseTicket
    ? ""
    : `<div class="rates">
        <span>InterestRate:</span>
        <span>30%</span>
        <span>Early Redemption Rate:</span>
        <span>10%</span>
      </div>
      <div class="terms redemption-note">Early redemption rates are subject to a $5 minimum interest amount</div>`;
  const bottomDatesHtml = isPurchaseTicket
    ? `<div class="bottom-date-row">
          <span class="label">Date:</span>
          <span class="value">${formatTicketDate(transactionDate)}</span>
          <span></span>
          <span></span>
        </div>
        <div class="bottom-date-row">
          <span class="label">Amt Paid:</span>
          <span class="value">${formatMoney(pawnAmount)}</span>
          <span></span>
          <span></span>
        </div>`
    : `<div class="bottom-date-row">
          <span class="label">Date:</span>
          <span class="value">${formatTicketDate(transactionDate)}</span>
          <span></span>
          <span></span>
        </div>
        <div class="bottom-date-row">
          <span class="label">Early Claim:</span>
          <span class="value">${formatTicketDate(earlyClaimDate)}</span>
          <span class="label">Amt Due:</span>
          <span class="value">${formatMoney(earlyClaimAmount)}</span>
        </div>
        <div class="bottom-date-row">
          <span class="label">Due Date:</span>
          <span class="value">${formatTicketDate(dueDate)}</span>
          <span class="label">Amt Due:</span>
          <span class="value">${formatMoney(amountDue)}</span>
        </div>`;
  const bottomTermsHtml = isPurchaseTicket
    ? '<div class="purchase-notice">This article has been purchased by Money Express</div>'
    : `<div class="bottom-terms">
        All pawned goods must be held for a minimum of 2 clear business days<br />
        before they may be redeemed.<br />
        We are not responsible for any items lost, damaged or stolen in our store.<br />
        This article must be redeemed or extended within 30 days or it will be sold.
      </div>`;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Ticket ${escapeHtml(ticketNumber)}</title>
  <style>
    @page {
      size: 3.88in 7.5in;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      font-weight: 900;
    }

    body {
      margin: 0;
      color: #000;
      background: transparent;
      font-family: "Times New Roman", Times, serif;
      font-weight: 900;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 3.88in;
      height: 7.5in;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
    }

    .ticket-content {
      width: 3.88in;
      height: 7.5in;
      padding: 0.08in 0.08in 0.08in 0.05in;
      position: relative;
    }

    @media print {
      .page {
        margin: 0;
      }
    }

    .top-copy {
      height: 4.35in;
      position: relative;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }

    .customer-copy {
      height: 2.99in;
      position: relative;
      padding-top: 0.36in;
    }

    .brand {
      position: absolute;
      top: 0.02in;
      right: 0.08in;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 900;
      font-size: 18px;
      line-height: 0.88;
      text-align: right;
      white-space: nowrap;
    }

    .brand span {
      display: block;
    }

    .barcode {
      height: 0.55in;
      overflow: hidden;
      line-height: 0;
      white-space: nowrap;
    }

    .barcode.top {
      position: absolute;
      top: 0.03in;
      left: 0.08in;
      width: 1.55in;
    }

    .barcode.bottom {
      position: absolute;
      top: 0.12in;
      left: 0.08in;
      width: 1.55in;
    }

    .store-block {
      position: absolute;
      top: 0.1in;
      left: 1.68in;
      width: 2.05in;
      text-align: center;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 900;
      line-height: 1;
    }

    .store-name {
      font-size: 25px;
      margin-bottom: 0.03in;
      white-space: nowrap;
    }

    .store-line {
      font-size: 16px;
    }

    .field-row {
      display: grid;
      grid-template-columns: 0.72in 0.8in 0.9in 1fr;
      column-gap: 0.04in;
      align-items: center;
      min-height: 0.24in;
      font-size: 18px;
      line-height: 1;
      font-weight: 900;
    }

    .field-row.two {
      grid-template-columns: 0.72in 0.8in 0.9in 1fr;
    }

    .field-row.paired-row {
      grid-template-columns: 0.68in 1.01in 0.82in 1.08in;
    }

    .top-copy .field-row {
      min-height: 0.24in;
    }

    .top-copy .field-row .value {
      white-space: nowrap;
    }

    .top-copy .name-row {
      min-height: 0.42in;
      align-items: start;
    }

    .top-copy .name-row .value {
      max-height: 0.42in;
      line-height: 1.05;
      white-space: normal;
    }

    .field-row .label,
    .small-row .label {
      font-weight: 900;
      white-space: nowrap;
    }

    .field-row .value,
    .small-row .value {
      font-weight: 900;
      overflow-wrap: normal;
    }

    .top-fields {
      position: absolute;
      top: 0.59in;
      left: 0.04in;
      right: 0;
    }

    .client-fields {
      position: absolute;
      top: 1.07in;
      left: 0.04in;
      right: 0;
    }

    .money-fields {
      position: absolute;
      top: 2.24in;
      left: 0.04in;
      width: 3in;
    }

    .money-fields .small-row,
    .date-fields .small-row {
      display: grid;
      grid-template-columns: 1.82in 1fr;
      min-height: 0.215in;
      font-size: 18px;
      line-height: 1.03;
      font-weight: 900;
    }

    .date-fields {
      position: absolute;
      top: 2.92in;
      left: 0.04in;
      width: 3.15in;
    }

    .signature {
      position: absolute;
      top: 3.6in;
      left: 0.04in;
      right: 0.28in;
      font-size: 18px;
      line-height: 1;
      font-weight: 900;
      display: grid;
      grid-template-columns: 0.95in 0.22in 1fr;
      align-items: end;
    }

    .signature-line {
      border-bottom: 2px solid #000;
      height: 0.16in;
    }

    .terms {
      position: absolute;
      left: 0.02in;
      right: 0;
      font-size: 10px;
      line-height: 1.14;
      font-weight: 900;
    }

    .terms.top {
      top: 3.81in;
      font-size: 8px;
      line-height: 1.05;
    }

    .rates {
      position: absolute;
      top: 4.18in;
      left: 0.02in;
      right: 0.35in;
      display: grid;
      grid-template-columns: 1.18in 0.55in 1.45in 0.35in;
      column-gap: 0.06in;
      font-size: 7px;
      line-height: 1;
      font-weight: 900;
    }

    .redemption-note {
      top: 4.27in;
      font-size: 6px;
      line-height: 1;
    }

    .bottom-fields {
      position: absolute;
      top: 1.05in;
      left: 0.04in;
      right: 0;
    }

    .bottom-dates {
      position: absolute;
      top: 1.62in;
      left: 0.04in;
      right: 0;
    }

    .bottom-date-row {
      display: grid;
      grid-template-columns: 1.08in 1.21in 0.82in 1fr;
      column-gap: 0.04in;
      min-height: 0.22in;
      font-size: 17px;
      line-height: 1.02;
      font-weight: 900;
    }

    .bottom-date-row .label {
      white-space: nowrap;
    }

    .bottom-terms {
      position: absolute;
      left: 0.02in;
      right: 0;
      bottom: 0.05in;
      font-size: 10px;
      line-height: 1.15;
      font-weight: 900;
    }

    .purchase .money-fields {
      top: 2.24in;
      width: 3.2in;
    }

    .purchase .date-fields {
      top: 2.92in;
    }

    .purchase .signature {
      top: 3.6in;
    }

    .purchase .bottom-dates {
      top: 1.66in;
    }

    .purchase-notice {
      position: absolute;
      left: 0.04in;
      right: 0;
      bottom: 0.36in;
      font-size: 17px;
      line-height: 1.08;
      font-weight: 900;
    }
  </style>
</head>
<body>
  <main class="page">
    <div class="ticket-content${isPurchaseTicket ? " purchase" : ""}">
      <section class="top-copy">
      <div class="barcode top">${barcode}</div>
      ${topBrandHtml}

      <div class="top-fields">
        <div class="field-row paired-row">
          <span class="label">Ticket #</span>
          <span class="value">${escapeHtml(ticketNumber)}</span>
          <span class="label">Location:</span>
          <span class="value">${escapeHtml(ticket.location)}</span>
        </div>
        <div class="field-row">
          <span class="label">Remark:</span>
          <span class="value" style="grid-column: span 3;">${escapeHtml(ticket.description)}</span>
        </div>
      </div>

      <div class="client-fields">
        <div class="field-row paired-row">
          <span class="label">Client #</span>
          <span class="value">${escapeHtml(client?.client_number ?? ticket.client_number)}</span>
          <span class="label">Employee:</span>
          <span class="value">${escapeHtml(ticket.employee_name)}</span>
        </div>
        <div class="field-row name-row">
          <span class="label">Name:</span>
          <span class="value" style="grid-column: span 3;">${escapeHtml(clientName)}</span>
        </div>
        <div class="field-row">
          <span class="label">Address:</span>
          <span class="value" style="grid-column: span 3;">${escapeHtml(client?.address?.toUpperCase() ?? "")}</span>
        </div>
        <div class="field-row">
          <span class="label">City:</span>
          <span class="value" style="grid-column: span 3;">${escapeHtml(cityProvince)}</span>
        </div>
      </div>

      <div class="money-fields">
        ${moneyFieldsHtml}
      </div>

      <div class="date-fields">
        <div class="small-row"><span class="label">Date:</span><span class="value">${formatTicketDate(transactionDate)}</span></div>
        ${additionalDateFieldsHtml}
      </div>

      <div class="signature">
        <span>Signature:</span>
        <span>X</span>
        <span class="signature-line"></span>
      </div>

      <div class="terms top">
        I declare these goods to be free of any encumbrances and are my personal<br />
        belongings. I also understand that the store is not responsible for any item<br />
        lost, damaged or stolen. All pawned goods must be held for a minimum of 2<br />
        clear business days for police checks.
      </div>

      ${ratesHtml}
      </section>

      <section class="customer-copy">
      <div class="barcode bottom">${barcode}</div>
      <div class="store-block">
        <div class="store-name">Money Express</div>
        <div class="store-line">236 20th Street West</div>
        <div class="store-line">Saskatoon, SK</div>
        <div class="store-line">306-665-3232</div>
      </div>

      <div class="bottom-fields">
        <div class="field-row two paired-row">
          <span class="label">Ticket #</span>
          <span class="value">${escapeHtml(ticketNumber)}</span>
          <span class="label">Location:</span>
          <span class="value">${escapeHtml(ticket.location)}</span>
        </div>
        <div class="field-row">
          <span class="label">Remark:</span>
          <span class="value" style="grid-column: span 3;">${escapeHtml(ticket.description)}</span>
        </div>
      </div>

      <div class="bottom-dates">
        ${bottomDatesHtml}
      </div>

      ${bottomTermsHtml}
      </section>
    </div>
  </main>
  <script>
    window.addEventListener("load", () => {
      setTimeout(() => window.print(), 150);
    });
  </script>
</body>
</html>`;
};
