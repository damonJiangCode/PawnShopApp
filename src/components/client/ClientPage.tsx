import React, { useState } from "react";
import CustomerProfile from "./CustomerProfile";
import { Customer } from "../../../shared/models/Customer";

const ClientPage: React.FC<{ customer?: Customer }> = ({ customer }) => (
  <div>
    {customer ? (
      <CustomerProfile customer={customer} />
    ) : (
      <div>No available customer</div>
    )}
  </div>
);

export default ClientPage;
