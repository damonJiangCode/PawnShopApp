import type {
  LeadsOnlineItem,
  LeadsOnlineProperty,
  LeadsOnlineTicket,
  XmlReportSourceRow,
} from "./xml-report.types.ts";

const reportTimeZone = process.env.APP_TIME_ZONE?.trim() || "America/Regina";
const dateTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: reportTimeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const getLocalDateParts = (date: Date) =>
  Object.fromEntries(
    dateTimeFormatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

const formatLocalDate = (date: Date) => {
  const { year, month, day } = getLocalDateParts(date);
  return `${year}-${month}-${day}`;
};

const formatLocalDateTime = (date: Date) => {
  const { year, month, day, hour, minute } = getLocalDateParts(date);
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

const PROVINCE_CODES: Record<string, string> = {
  ALBERTA: "AB",
  "BRITISH COLUMBIA": "BC",
  MANITOBA: "MB",
  "NEW BRUNSWICK": "NB",
  "NEWFOUNDLAND AND LABRADOR": "NL",
  "NORTHWEST TERRITORIES": "NT",
  "NOVA SCOTIA": "NS",
  NUNAVUT: "NU",
  ONTARIO: "ON",
  "PRINCE EDWARD ISLAND": "PE",
  QUEBEC: "QC",
  SASKATCHEWAN: "SK",
  YUKON: "YT",
};

const mapProvince = (province: string) => {
  const normalized = province.trim().toUpperCase();
  return PROVINCE_CODES[normalized] ?? normalized;
};

const wholeMetricValue = (value: number) => (value > 0 ? Math.round(value) : 0);

const mapSex = (gender: string) => {
  const normalized = gender.trim().toUpperCase();
  if (normalized === "MALE" || normalized === "M") return "M";
  if (normalized === "FEMALE" || normalized === "F") return "F";
  return "";
};

const mapItemType = (categoryName: string): LeadsOnlineItem["itemType"] => {
  const normalized = categoryName.trim().toUpperCase();
  if (normalized.includes("JEWELRY")) return "Jewelry";
  if (normalized.includes("FIREARM")) return "Firearm";
  return "Other";
};

const property = (Name: string, Value: unknown): LeadsOnlineProperty => ({
  Name,
  Value: String(Value),
});

const mapItem = (
  row: XmlReportSourceRow,
  ticketType: LeadsOnlineTicket["key"]["ticketType"],
): LeadsOnlineItem => ({
  make: row.brand_name,
  model: row.model_number,
  serialNumber: row.serial_number,
  description: row.description,
  amount: row.item_amount ?? 0,
  itemType: mapItemType(row.category_name),
  itemStatus: ticketType,
  isVoid: false,
  employee: row.employee_name,
  extraItem: {
    PropertyValue: [property("ITEM_QUANTITY", row.quantity ?? 1)],
  },
});

export const mapXmlReportTicket = (
  rows: XmlReportSourceRow[],
): LeadsOnlineTicket => {
  const source = rows[0];
  const ticketType = source.ticket_status.startsWith("sold") ? "Buy" : "Pawn";
  const customerProperties = [
    property("CUSTOMER_STORE_NUMBER", source.client_number),
  ];

  if (source.middle_name) {
    customerProperties.push(
      property("CUSTOMER_NAME_MIDDLE", source.middle_name),
    );
  }
  if (source.email) {
    customerProperties.push(property("CUSTOMER_EMAIL", source.email));
  }

  return {
    key: {
      ticketType,
      ticketnumber: String(source.ticket_number),
      ticketDateTime: formatLocalDateTime(source.transaction_datetime),
    },
    redeemByDate: ticketType === "Pawn" ? formatLocalDate(source.due_date) : "",
    customer: {
      name: `${source.first_name} ${source.middle_name} ${source.last_name}`
        .replace(/\s+/g, " ")
        .trim(),
      fname: source.first_name,
      lname: source.last_name,
      address1: source.address,
      city: source.city,
      state: mapProvince(source.province),
      postalCode: source.postal_code,
      phone: source.phone,
      idType: source.id_type,
      idNumber: source.id_value,
      ...(source.id_type_2 && source.id_value_2
        ? { idType2: source.id_type_2, idNumber2: source.id_value_2 }
        : {}),
      dob: source.date_of_birth,
      weight: wholeMetricValue(source.weight_kg),
      height: wholeMetricValue(source.height_cm),
      eyeColor: source.eye_color,
      hairColor: source.hair_color,
      sex: mapSex(source.gender),
      extraCustomer: { PropertyValue: customerProperties },
    },
    items: {
      Item: rows
        .filter((row) => row.item_number !== undefined)
        .map((row) => mapItem(row, ticketType)),
    },
    isVoid: false,
    extraTicket: {
      PropertyValue: [property("TICKET_LOAN_AMOUNT", source.ticket_amount)],
    },
  };
};
