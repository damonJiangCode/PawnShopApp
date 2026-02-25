export const getCities = async (): Promise<{
  provinces: string[];
  citiesByProvince: Record<string, string[]>;
}> => {
  return (window as any).electronAPI.getCities();
};

export const getHairColors = async (): Promise<string[]> => {
  return (window as any).electronAPI.getHairColors();
};

export const getEyeColors = async (): Promise<string[]> => {
  return (window as any).electronAPI.getEyeColors();
};

export const getIdTypes = async (): Promise<string[]> => {
  return (window as any).electronAPI.getIdTypes();
};
