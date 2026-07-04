import React from "react";
import { clientService } from "../../../clients/client.api";
import type { WindowHostScreenProps } from "../../../../app/window-host/windowHostRegistry";
import ColorAdminWindow from "../color/ColorAdminWindow";

const EyeColorAdminWindow: React.FC<WindowHostScreenProps> = () => (
  <ColorAdminWindow
    colorType="Eye"
    loadColors={clientService.loadAdminEyeColors}
    addColor={clientService.addEyeColor}
    activateColor={clientService.activateEyeColor}
    deactivateColor={clientService.deactivateEyeColor}
  />
);

export default EyeColorAdminWindow;
