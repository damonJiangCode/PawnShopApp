import type { ComponentType } from "react";
import EmployeeAdminWindow from "./admin/employee/EmployeeAdminWindow";
import HolidayAdminWindow from "./admin/holiday/HolidayAdminWindow";
import LocationAdminWindow from "./admin/location/LocationAdminWindow";
import ItemSearchWindow from "./item/ItemSearchWindow";
import LayawayAddWindow from "./layaway/LayawayAddWindow";
import LayawayCancelWindow from "./layaway/LayawayCancelWindow";
import LayawayEditWindow from "./layaway/LayawayEditWindow";
import LayawaySearchWindow from "./layaway/LayawaySearchWindow";
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
  "layaway-search": LayawaySearchWindow,
  "layaway-add": LayawayAddWindow,
  "layaway-edit": LayawayEditWindow,
  "layaway-cancel": LayawayCancelWindow,
  "report-daily": DailyReportWindow,
  "report-buyback": BuybackReportWindow,
  "report-interest": InterestReportWindow,
  "report-police-xml": PoliceXmlWindow,
  "admin-employee": EmployeeAdminWindow,
  "admin-holiday": HolidayAdminWindow,
  "admin-location": LocationAdminWindow,
};
