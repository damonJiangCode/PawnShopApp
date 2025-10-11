import React, { useState } from "react";
import CustomerProfile from "./client/CustomerProfile";
import IDFields from "./client/customer_structure/IDFields";
import CustomerForm from "./client/customer_structure/CustomerForm";

const ComponentPreview: React.FC = () => {
  return (
    <div>
      <CustomerForm open={true} onSave={() => {}} onClose={() => {}} />
    </div>
  );
};

export default ComponentPreview;
