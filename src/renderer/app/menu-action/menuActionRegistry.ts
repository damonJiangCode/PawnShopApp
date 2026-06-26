import type { ComponentType } from "react";
import EmployeeAdminWindow from "../../modules/employees/admin/EmployeeAdminWindow";
import EyeColorAdminWindow from "../../modules/admin/colors/eye-color/EyeColorAdminWindow";
import HairColorAdminWindow from "../../modules/admin/colors/hair-color/HairColorAdminWindow";
import HolidayAdminWindow from "../../modules/admin/holiday/HolidayAdminWindow";
import LocationAdminWindow from "../../modules/admin/location/LocationAdminWindow";
import ItemSearchWindow from "../../modules/items/menu-actions/ItemSearchWindow";
import BuybackReportWindow from "../../modules/reports/menu-actions/BuybackReportWindow";
import DailyReportWindow from "../../modules/reports/menu-actions/DailyReportWindow";
import InterestReportWindow from "../../modules/reports/menu-actions/InterestReportWindow";
import PoliceXmlWindow from "../../modules/reports/menu-actions/PoliceXmlWindow";
import TicketExpireWindow from "../../modules/tickets/menu-actions/TicketExpireWindow";
import TicketSearchWindow from "../../modules/tickets/menu-actions/TicketSearchWindow";
import TicketStolenWindow from "../../modules/tickets/menu-actions/TicketStolenWindow";

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
