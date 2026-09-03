import { lazy, type ComponentType } from "react";

const EmployeeAdminWindow = lazy(
  () => import("../modules/employees/admin/EmployeeAdminWindow"),
);
const EyeColorAdminWindow = lazy(
  () => import("../modules/admin/colors/eye-color/EyeColorAdminWindow"),
);
const HairColorAdminWindow = lazy(
  () => import("../modules/admin/colors/hair-color/HairColorAdminWindow"),
);
const HolidayAdminWindow = lazy(
  () => import("../modules/admin/holiday/HolidayAdminWindow"),
);
const LocationAdminWindow = lazy(
  () => import("../modules/admin/location/LocationAdminWindow"),
);
const ItemSearchWindow = lazy(
  () =>
    import("../modules/items/menu-actions/item-search-window/ItemSearchWindow"),
);
const BuybackReportWindow = lazy(
  () => import("../modules/reports/menu-actions/BuybackReportWindow"),
);
const DailyReportWindow = lazy(
  () => import("../modules/reports/menu-actions/DailyReportWindow"),
);
const InterestReportWindow = lazy(
  () => import("../modules/reports/menu-actions/InterestReportWindow"),
);
const PoliceXmlWindow = lazy(
  () => import("../modules/reports/menu-actions/PoliceXmlWindow"),
);
const TicketExpireWindow = lazy(
  () => import("../modules/tickets/menu-actions/TicketExpireWindow"),
);
const TicketSearchWindow = lazy(
  () => import("../modules/tickets/menu-actions/TicketSearchWindow"),
);
const TicketStolenWindow = lazy(
  () => import("../modules/tickets/menu-actions/TicketStolenWindow"),
);
const PaymentWindow = lazy(
  () => import("../modules/tickets/payment/PaymentWindow"),
);

export type WindowScreenProps = {
  screen: string;
};

export const windowRegistry: Record<
  string,
  ComponentType<WindowScreenProps>
> = {
  payment: PaymentWindow,
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
