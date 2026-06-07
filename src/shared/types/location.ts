export interface Location {
  location: string;
  description: string;
  is_active: boolean;
}

export type SaveLocationInput = {
  location: string;
  description: string;
};
