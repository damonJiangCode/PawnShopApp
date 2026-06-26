import React, { useEffect } from "react";
import { itemService } from "../../modules/items/item.api";
import MainLayout from "./MainLayout";

const MainApp: React.FC = () => {
  useEffect(() => {
    itemService.preloadCategories().catch((err) => {
      console.error("Failed to preload item categories", err);
    });
  }, []);

  return (
    <div>
      <MainLayout />
    </div>
  );
};

export default MainApp;
