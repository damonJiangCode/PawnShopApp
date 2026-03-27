import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import type { Client, ID } from "../../../../../shared/types/Client";
import PhotoCapture from "./fields/PhotoCapture";
import HeightWeightFields from "./fields/HeightWeightFields";
import NameFields from "./fields/NameFields";
import DobGenderColor from "./fields/DobGenderColor";
import AddressFields from "./fields/AddressFields";
import ContactNotesFields from "./fields/ContactNotesFields";
import IDFields from "./fields/IDFields";
import type { IDFieldsRef } from "./fields/IDFields";
import defaultClient from "../../../utils/defaultClient";

interface ClientFormProps {
  clientExisted?: Client;
  open: boolean;
  onSave: (clientUpdated: Client) => void;
  onClose: () => void;
}

interface PendingClientUpdate {
  client: Client;
  identifications: ID[];
}

const ClientForm: React.FC<ClientFormProps> = (props) => {
  const { clientExisted, open, onSave, onClose } = props;
  const isEditMode = Boolean(clientExisted?.client_number);
  const [client, setClient] = useState<Client>(clientExisted || defaultClient);
  const [identifications] = useState<ID[]>(client.identifications ?? []);
  const idRef = useRef<IDFieldsRef>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [employeePassword, setEmployeePassword] = useState("");
  const [pendingUpdate, setPendingUpdate] =
    useState<PendingClientUpdate | null>(null);
  const [savingClient, setSavingClient] = useState(false);

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
  }, [open, clientExisted]);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  async function handleCapture(
    fileName: string,
    base64: string,
  ): Promise<void> {
    try {
      const relPath = await (window as any).electronAPI.saveClientImage(
        fileName,
        base64,
      );
      setClient((prev) => ({ ...prev, image_path: relPath }));
      setPhotoCaptured(true);
    } catch (error) {
      setPhotoCaptured(false);
      console.error("Failed to save client image (ClientForm.tsx):", error);
      alert("Failed to save client image (ClientForm.tsx).");
      throw error;
    }
  }

  const buildPendingUpdate = (): PendingClientUpdate | null => {
    const requiredMissing =
      !client.first_name?.trim() ||
      !client.last_name?.trim() ||
      !client.date_of_birth ||
      !client.gender?.trim() ||
      !client.hair_color?.trim() ||
      !client.eye_color?.trim() ||
      !client.height_cm ||
      !client.weight_kg ||
      !client.address?.trim() ||
      !client.city?.trim() ||
      !client.province?.trim() ||
      !client.country?.trim();

    if (requiredMissing) {
      alert("Please fill all required fields before saving.");
      return null;
    }

    if (!isEditMode && !photoCaptured && !client.image_path?.trim()) {
      alert("Please capture a client photo before saving.");
      return null;
    }

    const ids = idRef.current?.getIDs() ?? [];
    const validIds = ids.filter(
      (id) => id.id_type?.trim() && id.id_value?.trim(),
    );

    if (validIds.length < 2) {
      alert("Please provide at least two valid ID entries.");
      return null;
    }

    return {
      client: { ...client, identifications: validIds } as Client,
      identifications: validIds,
    };
  };

  const saveClientRecord = async (payload: PendingClientUpdate) => {
    try {
      setSavingClient(true);
      const savedClient: Client = isEditMode
        ? await (window as any).electronAPI.updateClient(payload)
        : await (window as any).electronAPI.addClient(payload);
      onSave(savedClient);
    } catch (err) {
      console.error(
        isEditMode ? "Failed to update client:" : "Failed to add client:",
        err,
      );
      alert(
        isEditMode
          ? "Failed to update client. Please try again."
          : "Failed to add client. Please try again.",
      );
      throw err;
    } finally {
      setSavingClient(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextPendingUpdate = buildPendingUpdate();

    if (!nextPendingUpdate) {
      return;
    }

    const trimmedNotes = nextPendingUpdate.client.notes?.trim() ?? "";
    const notesChanged =
      (clientExisted?.notes ?? "") !== (nextPendingUpdate.client.notes ?? "");
    const requiresEmployeePassword = isEditMode
      ? notesChanged && Boolean(trimmedNotes)
      : Boolean(trimmedNotes);

    if (!requiresEmployeePassword) {
      if (isEditMode && notesChanged && !trimmedNotes) {
        await saveClientRecord({
          ...nextPendingUpdate,
          client: {
            ...nextPendingUpdate.client,
            notes: "",
          },
        });
        return;
      }

      await saveClientRecord(nextPendingUpdate);
      return;
    }

    setPendingUpdate(nextPendingUpdate);
    setEmployeePassword("");
    setShowPasswordDialog(true);
  };

  const handleConfirmEmployeePassword = async () => {
    if (!pendingUpdate) {
      return;
    }

    if (!employeePassword.trim()) {
      alert("Please enter the employee password.");
      return;
    }

    try {
      setSavingClient(true);
      const employee = await (window as any).electronAPI.verifyEmployeePassword(
        employeePassword,
      );

      if (!employee) {
        alert("No employee found with that password.");
        return;
      }

      const notesChanged =
        (clientExisted?.notes ?? "") !== (pendingUpdate.client.notes ?? "");
      const nextClient = { ...pendingUpdate.client };

      if (notesChanged) {
        const trimmedNotes = nextClient.notes?.trim() ?? "";
        if (!trimmedNotes) {
          nextClient.notes = "";
        } else {
          const formattedDate = new Date().toLocaleDateString("en-CA");
          nextClient.notes = `${trimmedNotes} (${employee.first_name}, ${formattedDate})`;
        }
      }

      const payload = {
        client: nextClient,
        identifications: pendingUpdate.identifications,
      };
      const savedClient: Client = isEditMode
        ? await (window as any).electronAPI.updateClient(payload)
        : await (window as any).electronAPI.addClient(payload);

      setShowPasswordDialog(false);
      setEmployeePassword("");
      setPendingUpdate(null);
      onSave(savedClient);
    } catch (error) {
      console.error(
        "Failed to verify employee password or save client:",
        error,
      );
      alert(
        "Failed to verify employee password or save client. Please try again.",
      );
    } finally {
      setSavingClient(false);
    }
  };

  const handleClose = () => {
    setCameraActive(false);
    setPhotoCaptured(false);
    setShowPasswordDialog(false);
    setEmployeePassword("");
    setPendingUpdate(null);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <>
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditMode ? "Edit Client" : "Add New Client"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSave}>
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
                  lastName={client.last_name ?? ""}
                  firstName={client.first_name ?? ""}
                  middleName={client.middle_name ?? ""}
                  onChange={handleInputChange}
                />

                <DobGenderColor
                  date_of_birth={client.date_of_birth}
                  gender={client.gender}
                  hair_color={client.hair_color}
                  eye_color={client.eye_color}
                  onChange={handleInputChange}
                />

                <HeightWeightFields
                  height_cm={client.height_cm}
                  weight_kg={client.weight_kg}
                  onHeightCmChange={(value) => {
                    setClient((prev) => ({ ...prev, height_cm: value }));
                  }}
                  onWeightKgChange={(value) => {
                    setClient((prev) => ({ ...prev, weight_kg: value }));
                  }}
                />

                <AddressFields
                  client_address={client.address}
                  client_postal_code={client.postal_code}
                  client_city={client.city ?? ""}
                  client_province={client.province ?? ""}
                  client_country={client.country ?? "Canada"}
                  onChange={handleInputChange}
                />

                <ContactNotesFields
                  email={client.email ?? ""}
                  phone={client.phone ?? ""}
                  notes={client.notes}
                  onChange={handleInputChange}
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
                <PhotoCapture
                  client={client}
                  onCapture={handleCapture}
                  active={cameraActive}
                />
              </Box>
            </Box>

            <Box>
              <IDFields ref={idRef} ids={identifications} />
            </Box>

            <Divider sx={{ my: 3 }} />
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
                Save
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
            setPendingUpdate(null);
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Employee Password</DialogTitle>
        <DialogContent>
          <TextField
            inputRef={passwordInputRef}
            fullWidth
            type="password"
            label="Password"
            value={employeePassword}
            onChange={(event) => setEmployeePassword(event.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowPasswordDialog(false);
              setEmployeePassword("");
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

export default ClientForm;
