import assert from "node:assert/strict";
import test from "node:test";
import { mapXmlReportTicket } from "./xml-report.mapper.ts";
import type { XmlReportSourceRow } from "./xml-report.types.ts";

const sourceRow: XmlReportSourceRow = {
  ticket_number: 982211,
  transaction_datetime: new Date(2026, 8, 21, 19, 5),
  due_date: new Date(2026, 9, 21),
  ticket_amount: 21,
  ticket_status: "pawned",
  employee_name: "TASH",
  client_number: 8688,
  first_name: "DARLENE",
  last_name: "DREAVER",
  middle_name: "JEAN",
  date_of_birth: "1968-06-22",
  gender: "FEMALE",
  hair_color: "BLACK",
  eye_color: "BROWN",
  height_cm: 170.2,
  weight_kg: 54.4,
  address: "APT 104 14 ASSINIBOINE DRIVE",
  city: "SASKATOON",
  province: "Saskatchewan",
  postal_code: "S7N0K7",
  phone: "3063844714",
  email: "",
  id_type: "Health Card",
  id_value: "490189806",
  id_type_2: "Driver License",
  id_value_2: "123456789",
  client_image_path: "images/clients/client_8688.png",
  item_number: 1,
  quantity: 1,
  category_name: "Electronics",
  description: "PHONE",
  brand_name: "SAMSUNG",
  model_number: "MODEL",
  serial_number: "SERIAL",
  item_amount: 21,
  item_image_path: "images/items/item_1.jpg",
};

test("maps Canadian metric measurements to whole values", () => {
  const ticket = mapXmlReportTicket([sourceRow]);

  assert.equal(ticket.customer.weight, 54);
  assert.equal(ticket.customer.height, 170);
  assert.equal(ticket.customer.idType2, "Driver License");
  assert.equal(ticket.customer.idNumber2, "123456789");
});

test("maps a Canadian province name to its postal abbreviation", () => {
  const ticket = mapXmlReportTicket([sourceRow]);

  assert.equal(ticket.customer.state, "SK");
});

test("formats the ticket time in the configured Saskatchewan time zone", () => {
  const ticket = mapXmlReportTicket([
    {
      ...sourceRow,
      transaction_datetime: new Date("2026-09-22T00:30:00.000Z"),
    },
  ]);

  assert.equal(ticket.key.ticketDateTime, "2026-09-21 18:30");
});
