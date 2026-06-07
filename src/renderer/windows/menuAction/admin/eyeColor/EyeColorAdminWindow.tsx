import React from "react";
import { clientService } from "../../../../services/clientService";
import type { MenuActionComponentProps } from "../../menuActionRegistry";
import ColorAdminWindow from "../color/ColorAdminWindow";

const EyeColorAdminWindow: React.FC<MenuActionComponentProps> = () => (
  <ColorAdminWindow
    colorType="Eye"
    loadColors={clientService.loadAdminEyeColors}
    addColor={clientService.addEyeColor}
    activateColor={clientService.activateEyeColor}
    deactivateColor={clientService.deactivateEyeColor}
  />
);

export default EyeColorAdminWindow;
