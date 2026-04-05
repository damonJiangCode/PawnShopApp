type ElectronApi = {
  client?: {
    search: (firstName: string, lastName: string) => Promise<unknown>;
    loadCities: () => Promise<unknown>;
    loadHairColors: () => Promise<unknown>;
    loadEyeColors: () => Promise<unknown>;
    loadIdTypes: () => Promise<unknown>;
    create: (payload: unknown) => Promise<unknown>;
    update: (payload: unknown) => Promise<unknown>;
    delete: (clientNumber: number) => Promise<unknown>;
    saveImage: (fileName: string, base64: string) => Promise<unknown>;
    loadImage: (imagePath: string) => Promise<unknown>;
  };
  ticket?: {
    loadByClient: (clientNumber: number) => Promise<unknown>;
    loadLocations: () => Promise<unknown>;
    createPawn: (payload: unknown) => Promise<unknown>;
    createSell: (payload: unknown) => Promise<unknown>;
    update: (payload: unknown) => Promise<unknown>;
  };
  item?: {
    loadByTicket: (ticketNumber: number) => Promise<unknown>;
  };
};

export const getElectronApi = (): ElectronApi | undefined => {
  return (window as any).electronAPI as ElectronApi | undefined;
};
