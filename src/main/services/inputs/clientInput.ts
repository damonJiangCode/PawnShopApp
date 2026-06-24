import type { Client, ID } from "../../../shared/types/Client.ts";
import type {
  ClientNotesAction,
  SaveClientInput,
} from "../../../shared/types/clientPayload.ts";

type NormalizedSaveClientInput = {
  client: Client;
  identifications: ID[];
  employee_password: string;
  notes_action: ClientNotesAction;
};

const normalizeClient = (client: Client): Client => ({
  ...client,
  first_name: client.first_name?.trim() ?? "",
  last_name: client.last_name?.trim() ?? "",
  middle_name: client.middle_name?.trim() ?? "",
  gender: client.gender?.trim() ?? "",
  hair_color: client.hair_color?.trim().toUpperCase() ?? "",
  eye_color: client.eye_color?.trim().toUpperCase() ?? "",
  address: client.address?.trim() ?? "",
  postal_code: client.postal_code?.trim() ?? "",
  city: client.city?.trim() ?? "",
  province: client.province?.trim() ?? "",
  country: client.country?.trim() ?? "",
  email: client.email?.trim() ?? "",
  phone: client.phone?.trim() ?? "",
  notes: client.notes?.trim() ?? "",
  image_path: client.image_path?.trim() ?? "",
});

const normalizeIdentifications = (ids: ID[]): ID[] =>
  (ids ?? [])
    .map((id) => ({
      ...id,
      id_type: id.id_type?.trim() ?? "",
      id_value: id.id_value?.trim() ?? "",
    }))
    .filter((id) => id.id_type && id.id_value);

const validateClient = (client: Client, identifications: ID[]) => {
  const requiredMissing =
    !client.first_name ||
    !client.last_name ||
    !client.date_of_birth ||
    !client.gender ||
    !client.hair_color ||
    !client.eye_color ||
    !client.height_cm ||
    !client.weight_kg ||
    !client.address ||
    !client.city ||
    !client.province ||
    !client.country;

  if (requiredMissing) {
    throw new Error("Please fill all required client fields before saving.");
  }

  if (identifications.length < 2) {
    throw new Error("Please provide at least two valid ID entries.");
  }
};

const normalizeSaveClient = (
  input: SaveClientInput,
): NormalizedSaveClientInput => ({
  client: normalizeClient(input.client),
  identifications: normalizeIdentifications(input.identifications ?? []),
  employee_password: input.employee_password?.trim() ?? "",
  notes_action: input.notes_action ?? "keep",
});

const normalizeColor = (color: string) => color?.trim() ?? "";

const normalizeNameSearch = (firstName: string, lastName: string) => ({
  firstName: firstName?.trim() ?? "",
  lastName: lastName?.trim() ?? "",
});

const normalizeDobSearch = (dateOfBirth: string) => dateOfBirth?.trim() ?? "";

export const clientInput = {
  normalizeSaveClient,
  normalizeColor,
  normalizeNameSearch,
  normalizeDobSearch,
  validateClient,
};
