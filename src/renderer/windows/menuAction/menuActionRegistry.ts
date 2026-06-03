import type { ComponentType } from "react";
import EmployeeAddWindow from "./employee/EmployeeAddWindow";
import EmployeeDeactivateWindow from "./employee/EmployeeDeactivateWindow";
import EmployeeEditWindow from "./employee/EmployeeEditWindow";
import HolidayAddWindow from "./holiday/HolidayAddWindow";
import HolidayRemoveWindow from "./holiday/HolidayRemoveWindow";
import ItemSearchWindow from "./item/ItemSearchWindow";
import LayawayAddWindow from "./layaway/LayawayAddWindow";
import LayawayCancelWindow from "./layaway/LayawayCancelWindow";
import LayawayEditWindow from "./layaway/LayawayEditWindow";
import LayawaySearchWindow from "./layaway/LayawaySearchWindow";
import LocationAddWindow from "./location/LocationAddWindow";
import LocationDeactivateWindow from "./location/LocationDeactivateWindow";
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
  "location-add": LocationAddWindow,
  "location-deactivate": LocationDeactivateWindow,
  "holiday-add": HolidayAddWindow,
  "holiday-remove": HolidayRemoveWindow,
  "employee-add": EmployeeAddWindow,
  "employee-edit": EmployeeEditWindow,
  "employee-deactivate": EmployeeDeactivateWindow,
};
