import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  TextField,
} from "@mui/material";
import type { Client, ID } from "../../../../shared/types/Client";
import ClientPhotoCapture from "./fields/ClientPhotoCapture";
import HeightWeightFields from "./fields/HeightWeightFields";
import NameFields from "./fields/NameFields";
import DobGenderColor from "./fields/DobGenderColor";
import AddressFields from "./fields/AddressFields";
import ContactNotesFields from "./fields/ContactNotesFields";
import IDFields from "./fields/IDFields";
import type { IDFieldsRef } from "./fields/IDFields";
import defaultClient from "../../../utils/defaultClient";
import {
  clientService,
  type ClientFormError,
  type ClientNotesAction,
  type SaveClientInput,
} from "../../../services/clientService";
import { resolveFormFieldError } from "../../../utils/formError";

interface ClientAddEditDialogProps {
  clientExisted?: Client;
  open: boolean;
  onSave: (clientUpdated: Client) => void;
  onClose: () => void;
}

interface PendingClientUpdate {
  client: Client;
  identifications: ID[];
  notes_action: ClientNotesAction;
}

type ClientValidationErrors = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  hair_color: string;
  eye_color: string;
  height_cm: string;
  weight_kg: string;
  address: string;
  city: string;
  province: string;
  country: string;
  photo: string;
  identifications: string;
};

const emptyValidationErrors = (): ClientValidationErrors => ({
  first_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "",
  hair_color: "",
  eye_color: "",
  height_cm: "",
  weight_kg: "",
  address: "",
  city: "",
  province: "",
  country: "",
  photo: "",
  identifications: "",
});

const ClientAddEditDialog: React.FC<ClientAddEditDialogProps> = (props) => {
  const { clientExisted, open, onSave, onClose } = props;
  const isEditMode = Boolean(clientExisted?.client_number);
  const [client, setClient] = useState<Client>(clientExisted || defaultClient);
  const idRef = useRef<IDFieldsRef>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [employeePassword, setEmployeePassword] = useState("");
  const [pendingUpdate, setPendingUpdate] =
    useState<PendingClientUpdate | null>(null);
  const [savingClient, setSavingClient] = useState(false);
  const [employeePasswordError, setEmployeePasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const lastNameInputRef = useRef<HTMLInputElement>(null);
  const [validationErrors, setValidationErrors] = useState<ClientValidationErrors>(
    emptyValidationErrors(),
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    setClient(clientExisted || defaultClient);
    setPhotoCaptured(Boolean(clientExisted?.image_path));
    setCameraActive(true);
    setShowPasswordDialog(false);
    setEmployeePassword("");
    setPendingUpdate(null);
    setSavingClient(false);
    setEmployeePasswordError("");
    setSubmitError("");
    setValidationErrors(emptyValidationErrors());
  }, [open, clientExisted]);

  const clearValidationError = (field: keyof ClientValidationErrors) => {
    setValidationErrors((prev) =>
      prev[field] ? { ...prev, [field]: "" } : prev,
    );
  };

  useEffect(() => {
    if (!showPasswordDialog) {
      return;
    }

    const timer = setTimeout(() => {
      passwordInputRef.current?.focus();
      passwordInputRef.current?.select();
    }, 100);

    return () => clearTimeout(timer);
  }, [showPasswordDialog]);

  useEffect(() => {
    if (!open || isEditMode || showPasswordDialog) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      lastNameInputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [open, isEditMode, showPasswordDialog]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (submitError) {
      setSubmitError("");
    }
    if (name in emptyValidationErrors()) {
      clearValidationError(name as keyof ClientValidationErrors);
    }
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  async function handleCapture(
    fileName: string,
    base64: string,
  ): Promise<void> {
    try {
      const relPath = await clientService.saveClientImage(fileName, base64);
      setClient((prev) => ({ ...prev, image_path: relPath }));
      setPhotoCaptured(true);
      clearValidationError("photo");
    } catch (error) {
      setPhotoCaptured(false);
      console.error(
        "Failed to save client image (ClientAddEditDialog.tsx):",
        error,
      );
      setSubmitError("Failed to save client image. Please try again.");
      throw error;
    }
  }

  const buildPendingUpdate = (): PendingClientUpdate | null => {
    const nextErrors = emptyValidationErrors();

    if (!client.last_name?.trim()) {
      nextErrors.last_name = "Last name is required.";
    }

    if (!client.first_name?.trim()) {
      nextErrors.first_name = "First name is required.";
    }

    if (!client.date_of_birth) {
      nextErrors.date_of_birth = "Date of birth is required.";
    }

    if (!client.gender?.trim()) {
      nextErrors.gender = "Gender is required.";
    }

    if (!client.hair_color?.trim()) {
      nextErrors.hair_color = "Hair color is required.";
    }

    if (!client.eye_color?.trim()) {
      nextErrors.eye_color = "Eye color is required.";
    }

    if (!client.height_cm || client.height_cm <= 0) {
      nextErrors.height_cm = "Height is required.";
    }

    if (!client.weight_kg || client.weight_kg <= 0) {
      nextErrors.weight_kg = "Weight is required.";
    }

    if (!client.address?.trim()) {
      nextErrors.address = "Address is required.";
    }

    if (!client.city?.trim()) {
      nextErrors.city = "City is required.";
    }

    if (!client.province?.trim()) {
      nextErrors.province = "Province is required.";
    }

    if (!client.country?.trim()) {
      nextErrors.country = "Country is required.";
    }

    if (!isEditMode && !photoCaptured && !client.image_path?.trim()) {
      nextErrors.photo = "Client photo is required.";
    }

    const ids = idRef.current?.getIDs() ?? [];
    const validIds = ids.filter(
      (id) => id.id_type?.trim() && id.id_value?.trim(),
    );

    if (validIds.length < 2) {
      nextErrors.identifications =
        "Please provide at least two valid ID entries.";
    }

    setValidationErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return null;
    }

    const trimmedNotes = client.notes?.trim() ?? "";
    const notesChanged = (clientExisted?.notes ?? "") !== (client.notes ?? "");
    let notes_action: ClientNotesAction = "keep";

    if (!isEditMode && trimmedNotes) {
      notes_action = "append_signature";
    } else if (isEditMode && notesChanged) {
      notes_action = trimmedNotes ? "append_signature" : "clear";
    }

    return {
      client: { ...client, identifications: validIds } as Client,
      identifications: validIds,
      notes_action,
    };
  };

  const saveClientRecord = async (
    payload: SaveClientInput,
    options?: { keepPasswordDialogOpen?: boolean },
  ) => {
    try {
      setSavingClient(true);
      setSubmitError("");
      const savedClient: Client = isEditMode
        ? await clientService.updateClient(payload)
        : await clientService.createClient(payload);

      setShowPasswordDialog(false);
      setEmployeePassword("");
      setEmployeePasswordError("");
      setPendingUpdate(null);
      onSave(savedClient);
    } catch (err) {
      const clientError = err as ClientFormError;
      const nextEmployeePasswordError = resolveFormFieldError(
        "employee_password",
        clientError,
      );

      if (nextEmployeePasswordError) {
        setEmployeePasswordError(nextEmployeePasswordError);
        if (!options?.keepPasswordDialogOpen) {
          setShowPasswordDialog(true);
        }
        return;
      }

      console.error(
        isEditMode ? "Failed to update client:" : "Failed to add client:",
        err,
      );
      setSubmitError(
        isEditMode
          ? "Couldn't update this client right now. Please try again."
          : "Couldn't add this client right now. Please try again.",
      );
    } finally {
      setSavingClient(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const nextPendingUpdate = buildPendingUpdate();

    if (!nextPendingUpdate) {
      return;
    }

    const requiresEmployeePassword =
      nextPendingUpdate.notes_action === "append_signature";

    if (!requiresEmployeePassword) {
      await saveClientRecord(nextPendingUpdate);
      return;
    }

    setPendingUpdate(nextPendingUpdate);
    setEmployeePassword("");
    setEmployeePasswordError("");
    setSubmitError("");
    setShowPasswordDialog(true);
  };

  const handleConfirmEmployeePassword = async () => {
    if (!pendingUpdate) {
      return;
    }

    if (!employeePassword.trim()) {
      setEmployeePasswordError("Enter employee password.");
      return;
    }

    setSubmitError("");
    setEmployeePasswordError("");
    await saveClientRecord(
      {
        ...pendingUpdate,
        employee_password: employeePassword,
      },
      { keepPasswordDialogOpen: true },
    );
  };

  const handleClose = () => {
    setCameraActive(false);
    setPhotoCaptured(false);
    setShowPasswordDialog(false);
    setEmployeePassword("");
    setPendingUpdate(null);
    setEmployeePasswordError("");
    setSubmitError("");
    onClose();
  };

  return (
    <>
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditMode ? "Edit Client" : "Add New Client"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSave} noValidate>
            {submitError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {submitError}
              </Alert>
            )}
            <Box sx={{ display: "flex", gap: 2, py: 1 }}>
              <Box
                sx={{
                  flex: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <NameFields
                  lastNameInputRef={lastNameInputRef}
                  lastName={client.last_name ?? ""}
                  firstName={client.first_name ?? ""}
                  middleName={client.middle_name ?? ""}
                  lastNameError={validationErrors.last_name}
                  firstNameError={validationErrors.first_name}
                  onChange={handleInputChange}
                />

                <DobGenderColor
                  date_of_birth={client.date_of_birth}
                  gender={client.gender}
                  hair_color={client.hair_color}
                  eye_color={client.eye_color}
                  dateOfBirthError={validationErrors.date_of_birth}
                  genderError={validationErrors.gender}
                  hairColorError={validationErrors.hair_color}
                  eyeColorError={validationErrors.eye_color}
                  onChange={handleInputChange}
                />

                <HeightWeightFields
                  height_cm={client.height_cm}
                  weight_kg={client.weight_kg}
                  heightError={validationErrors.height_cm}
                  weightError={validationErrors.weight_kg}
                  onHeightCmChange={(value) => {
                    clearValidationError("height_cm");
                    setClient((prev) => ({ ...prev, height_cm: value }));
                  }}
                  onWeightKgChange={(value) => {
                    clearValidationError("weight_kg");
                    setClient((prev) => ({ ...prev, weight_kg: value }));
                  }}
                  onHeightInputChange={() => clearValidationError("height_cm")}
                  onWeightInputChange={() => clearValidationError("weight_kg")}
                />

                <AddressFields
                  client_address={client.address}
                  client_postal_code={client.postal_code}
                  client_city={client.city ?? ""}
                  client_province={client.province ?? ""}
                  client_country={client.country ?? "Canada"}
                  addressError={validationErrors.address}
                  cityError={validationErrors.city}
                  provinceError={validationErrors.province}
                  countryError={validationErrors.country}
                  onChange={handleInputChange}
                />

                <ContactNotesFields
                  email={client.email ?? ""}
                  phone={client.phone ?? ""}
                  notes={client.notes}
                  onChange={handleInputChange}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(client.pickup_self_only)}
                      onChange={(_event, checked) => {
                        setClient((prev) => ({
                          ...prev,
                          pickup_self_only: checked,
                        }));
                      }}
                      color="error"
                    />
                  }
                  label="Only client can pick up his or her own items"
                  sx={{
                    alignSelf: "flex-start",
                    ml: 0,
                    "& .MuiFormControlLabel-label": {
                      color: "error.main",
                      fontWeight: 700,
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <ClientPhotoCapture
                  client={client}
                  onCapture={handleCapture}
                  active={cameraActive}
                />
                <Alert
                  severity="error"
                  sx={{
                    width: "100%",
                    visibility: validationErrors.photo ? "visible" : "hidden",
                  }}
                >
                  {validationErrors.photo || " "}
                </Alert>
              </Box>
            </Box>

            <Box>
              <IDFields
                ref={idRef}
                ids={client.identifications ?? []}
                error={validationErrors.identifications}
                onIdsChange={() => clearValidationError("identifications")}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button type="button" onClick={handleClose} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={savingClient}>
                {isEditMode ? "Update" : "Add"}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showPasswordDialog}
        onClose={() => {
          if (!savingClient) {
            setShowPasswordDialog(false);
            setEmployeePassword("");
            setEmployeePasswordError("");
            setPendingUpdate(null);
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Employee Password</DialogTitle>
        <DialogContent>
          {submitError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {submitError}
            </Alert>
          )}
          <TextField
            inputRef={passwordInputRef}
            fullWidth
            type="password"
            label="Employee Password"
            value={employeePassword}
            onChange={(event) => {
              setEmployeePassword(event.target.value);
              if (submitError) {
                setSubmitError("");
              }
              if (employeePasswordError) {
                setEmployeePasswordError("");
              }
            }}
            sx={{ mt: 1 }}
            error={Boolean(employeePasswordError)}
            helperText={employeePasswordError || " "}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowPasswordDialog(false);
              setEmployeePassword("");
              setEmployeePasswordError("");
              setPendingUpdate(null);
            }}
            disabled={savingClient}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              void handleConfirmEmployeePassword();
            }}
            variant="contained"
            disabled={savingClient}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClientAddEditDialog;
