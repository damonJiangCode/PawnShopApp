import type { ComponentType } from "react";
import EmployeeAdminWindow from "./admin/employee/EmployeeAdminWindow";
import EyeColorAdminWindow from "./admin/eyeColor/EyeColorAdminWindow";
import HairColorAdminWindow from "./admin/hairColor/HairColorAdminWindow";
import HolidayAdminWindow from "./admin/holiday/HolidayAdminWindow";
import LocationAdminWindow from "./admin/location/LocationAdminWindow";
import ItemSearchWindow from "./item/ItemSearchWindow";
import BuybackReportWindow from "./report/BuybackReportWindow";
import DailyReportWindow from "./report/DailyReportWindow";
import InterestReportWindow from "./report/InterestReportWindow";
import PoliceXmlWindow from "./report/PoliceXmlWindow";
import TicketExpireWindow from "./ticket/TicketExpireWindow";
import TicketSearchWindow from "./ticket/TicketSearchWindow";
import TicketStolenWindow from "./ticket/TicketStolenWindow";

export type MenuActionComponentProps = {
  actionId: string;
};

export const menuActionRegistry: Record<
  string,
  ComponentType<MenuActionComponentProps>
> = {
  "ticket-search": TicketSearchWindow,
  "ticket-expire": TicketExpireWindow,
  "ticket-stolen": TicketStolenWindow,
  "item-search": ItemSearchWindow,
  "report-daily": DailyReportWindow,
  "report-buyback": BuybackReportWindow,
  "report-interest": InterestReportWindow,
  "report-police-xml": PoliceXmlWindow,
  "admin-employee": EmployeeAdminWindow,
  "admin-hair-color": HairColorAdminWindow,
  "admin-eye-color": EyeColorAdminWindow,
  "admin-holiday": HolidayAdminWindow,
  "admin-location": LocationAdminWindow,
};
