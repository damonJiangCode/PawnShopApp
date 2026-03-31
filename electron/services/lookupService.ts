import {
  getCities,
  getEyeColors,
  getHairColors,
  getIdTypes,
} from "../db/repo/lookupRepo.ts";

export const fetchIdTypes = async () => getIdTypes();
export const fetchCities = async () => getCities();
export const fetchHairColors = async () => getHairColors();
export const fetchEyeColors = async () => getEyeColors();
