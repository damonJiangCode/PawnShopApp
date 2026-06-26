import type { EyeColor } from "../../../shared/types/eyeColor.ts";
import type { HairColor } from "../../../shared/types/hairColor.ts";
import { clientReferenceRepo } from "./client-reference.repo.ts";
import { clientInput } from "./client.input.ts";

export const clientReferenceService = {
  loadCities: async () => {
    return clientReferenceRepo.loadCities();
  },

  loadHairColors: async () => {
    return clientReferenceRepo.loadHairColors();
  },

  loadAdminHairColors: async (): Promise<HairColor[]> => {
    return clientReferenceRepo.loadAdminHairColors();
  },

  addHairColor: async (color: string): Promise<string> => {
    const normalizedColor = clientInput.normalizeColor(color).toUpperCase();

    if (!normalizedColor) {
      throw new Error("Hair color is required.");
    }

    const savedColor = await clientReferenceRepo.addHairColor(normalizedColor);

    if (!savedColor) {
      throw new Error("That hair color already exists.");
    }

    return savedColor;
  },

  deactivateHairColor: async (color: string): Promise<HairColor> => {
    const deactivatedColor = await clientReferenceRepo.deactivateHairColor(
      clientInput.normalizeColor(color).toUpperCase(),
    );

    if (!deactivatedColor) {
      throw new Error("That active hair color was not found.");
    }

    return deactivatedColor;
  },

  activateHairColor: async (color: string): Promise<HairColor> => {
    const activatedColor = await clientReferenceRepo.activateHairColor(
      clientInput.normalizeColor(color).toUpperCase(),
    );

    if (!activatedColor) {
      throw new Error("That inactive hair color was not found.");
    }

    return activatedColor;
  },

  loadEyeColors: async () => {
    return clientReferenceRepo.loadEyeColors();
  },

  loadAdminEyeColors: async (): Promise<EyeColor[]> => {
    return clientReferenceRepo.loadAdminEyeColors();
  },

  addEyeColor: async (color: string): Promise<string> => {
    const normalizedColor = clientInput.normalizeColor(color).toUpperCase();

    if (!normalizedColor) {
      throw new Error("Eye color is required.");
    }

    const savedColor = await clientReferenceRepo.addEyeColor(normalizedColor);

    if (!savedColor) {
      throw new Error("That eye color already exists.");
    }

    return savedColor;
  },

  deactivateEyeColor: async (color: string): Promise<EyeColor> => {
    const deactivatedColor = await clientReferenceRepo.deactivateEyeColor(
      clientInput.normalizeColor(color).toUpperCase(),
    );

    if (!deactivatedColor) {
      throw new Error("That active eye color was not found.");
    }

    return deactivatedColor;
  },

  activateEyeColor: async (color: string): Promise<EyeColor> => {
    const activatedColor = await clientReferenceRepo.activateEyeColor(
      clientInput.normalizeColor(color).toUpperCase(),
    );

    if (!activatedColor) {
      throw new Error("That inactive eye color was not found.");
    }

    return activatedColor;
  },

  loadIdTypes: async () => {
    return clientReferenceRepo.loadIdTypes();
  },
};
