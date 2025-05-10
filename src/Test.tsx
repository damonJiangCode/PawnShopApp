import React from "react";
import { Customer } from "../shared/models/Customer";
import ClientAddForm from "./components/drawer/ClientAddForm";

const Test: React.FC = () => {
  const handleSave = (customer: Customer) => {
    console.log("Saved customer:", customer);
  };

  return (
    <div>
      <ClientAddForm
        open={true}
        onClose={() => {
          console.log("closed");
        }}
        onSave={handleSave}
      />
    </div>
  );
};

export default Test;
