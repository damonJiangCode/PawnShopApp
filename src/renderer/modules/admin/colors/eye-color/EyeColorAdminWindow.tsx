import React from "react";
import { clientService } from "../../../clients/client.api";
import type { WindowScreenProps } from "../../../../windows/windowRegistry";
import ColorAdminWindow from "../color/ColorAdminWindow";

const EyeColorAdminWindow: React.FC<WindowScreenProps> = () => (
  <ColorAdminWindow
    colorType="Eye"
    loadColors={clientService.loadEyeColorsForAdmin}
    addColor={clientService.addEyeColor}
    activateColor={clientService.activateEyeColor}
    deactivateColor={clientService.deactivateEyeColor}
  />
);

export default EyeColorAdminWindow;
