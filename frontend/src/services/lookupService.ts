import {
  getCities,
  getEyeColors,
  getHairColors,
  getIdTypes,
} from "../api/lookupApi";

const getElectronApi = () => (window as any).electronAPI;

export const loadCities = async (): Promise<{
  provinces: string[];
  citiesByProvince: Record<string, string[]>;
}> => {
  try {
    if (!getElectronApi()?.getCities) {
      return { provinces: [], citiesByProvince: {} };
    }
    return await getCities();
  } catch {
    return { provinces: [], citiesByProvince: {} };
  }
};

export const loadHairColors = async (): Promise<string[]> => {
  try {
    if (!getElectronApi()?.getHairColors) {
      return [];
    }
    return await getHairColors();
  } catch {
    return [];
  }
};

export const loadEyeColors = async (): Promise<string[]> => {
  try {
    if (!getElectronApi()?.getEyeColors) {
      return [];
    }
    return await getEyeColors();
  } catch {
    return [];
  }
};

export const loadIdTypes = async (): Promise<string[]> => {
  try {
    if (!getElectronApi()?.getIdTypes) {
      return [];
    }
    return await getIdTypes();
  } catch {
    return [];
  }
};
