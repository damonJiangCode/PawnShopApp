import React, { useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import { itemService } from "../services/itemService";

const App: React.FC = () => {
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

export default App;
