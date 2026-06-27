import React from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type { Employee } from "../../../../shared/types/Employee";
import {
  employeeService,
  type SaveEmployeeInput,
} from "../employee.api";

type EmployeeFormErrors = Record<keyof SaveEmployeeInput, string>;

type EmployeeAddEditDialogProps = {
  open: boolean;
  mode?: "add" | "edit";
  initialEmployee?: Employee | null;
  onClose: () => void;
  onSave?: (employee: Employee) => void;
};

const emptyEmployeeInput = (): SaveEmployeeInput => ({
  first_name: "",
  last_name: "",
  nickname: "",
  date_of_birth: "",
  gender: "",
  password: "",
});

const emptyErrors = (): EmployeeFormErrors => ({
  first_name: "",
  last_name: "",
  nickname: "",
  date_of_birth: "",
  gender: "",
  password: "",
});

const employeeToInput = (employee: Employee): SaveEmployeeInput => ({
  first_name: employee.first_name,
  last_name: employee.last_name,
  nickname: employee.nickname,
  date_of_birth: employee.date_of_birth,
  gender: employee.gender,
  password: employee.password ?? "",
});

const getDateOfBirthError = (dateOfBirth: string) => {
  if (!dateOfBirth.trim()) {
    return "Date of birth is required.";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
    return "Enter a complete date of birth.";
  }

  const parsed = new Date(`${dateOfBirth}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return "Enter a valid date of birth.";
  }

  const normalized = parsed.toISOString().slice(0, 10);

  if (normalized !== dateOfBirth) {
    return "Enter a valid date of birth.";
  }

  return "";
};

const EmployeeAddEditDialog: React.FC<EmployeeAddEditDialogProps> = ({
  open,
  mode = "add",
  initialEmployee,
  onClose,
  onSave,
}) => {
  const lastNameInputRef = React.useRef<HTMLInputElement>(null);
  const [employee, setEmployee] =
    React.useState<SaveEmployeeInput>(emptyEmployeeInput());
  const [errors, setErrors] = React.useState<EmployeeFormErrors>(emptyErrors());
  const [message, setMessage] = React.useState("");
  const [submitError, setSubmitError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    setEmployee(
      mode === "edit" && initialEmployee
        ? employeeToInput(initialEmployee)
        : emptyEmployeeInput(),
    );
    setErrors(emptyErrors());
    setMessage("");
    setSubmitError("");
    setSaving(false);

    const frame = requestAnimationFrame(() => {
      lastNameInputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [initialEmployee, mode, open]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
    setSubmitError("");
  };

  const validate = () => {
    const nextErrors = emptyErrors();

    if (!employee.last_name.trim()) {
      nextErrors.last_name = "Last name is required.";
    }

    if (!employee.first_name.trim()) {
      nextErrors.first_name = "First name is required.";
    }

    nextErrors.date_of_birth = getDateOfBirthError(employee.date_of_birth);

    if (!employee.gender.trim()) {
      nextErrors.gender = "Gender is required.";
    }

    if (!employee.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    setSaving(true);
    setSubmitError("");
    setMessage("");

    try {
      const savedEmployee =
        mode === "edit" && initialEmployee
          ? await employeeService.updateEmployee(
              initialEmployee.employee_number,
              employee,
            )
          : await employeeService.createEmployee(employee);

      if (mode === "add") {
        setEmployee(emptyEmployeeInput());
      }

      setErrors(emptyErrors());
      setMessage(
        `Employee #${savedEmployee.employee_number} ${savedEmployee.first_name} ${savedEmployee.last_name} ${
          mode === "edit" ? "updated" : "saved"
        }.`,
      );
      onSave?.(savedEmployee);
      requestAnimationFrame(() => {
        lastNameInputRef.current?.focus();
      });
    } catch (err) {
      console.error(err);
      setSubmitError(
        err instanceof Error ? err.message : "Unable to save employee.",
      );
    } finally {
      setSaving(false);
    }
  };

  const title = mode === "edit" ? "Edit Employee" : "Add Employee";
  const saveLabel = mode === "edit" ? "Update" : "Add";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.25} sx={{ pt: 0.5 }}>
          {message && <Alert severity="success">{message}</Alert>}
          {submitError && <Alert severity="error">{submitError}</Alert>}

          <Stack direction="row" spacing={1}>
            <TextField
              inputRef={lastNameInputRef}
              name="last_name"
              label="Last Name"
              value={employee.last_name}
              onChange={handleChange}
              error={Boolean(errors.last_name)}
              helperText={errors.last_name || " "}
              required
              fullWidth
              size="small"
            />
            <TextField
              name="first_name"
              label="First Name"
              value={employee.first_name}
              onChange={handleChange}
              error={Boolean(errors.first_name)}
              helperText={errors.first_name || " "}
              required
              fullWidth
              size="small"
            />
          </Stack>

          <TextField
            name="nickname"
            label="Nickname"
            value={employee.nickname}
            onChange={handleChange}
            helperText=" "
            fullWidth
            size="small"
          />

          <Stack direction="row" spacing={1}>
            <TextField
              name="date_of_birth"
              type="date"
              label="Date of Birth"
              value={employee.date_of_birth}
              onChange={handleChange}
              error={Boolean(errors.date_of_birth)}
              helperText={errors.date_of_birth || " "}
              required
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              name="gender"
              label="Gender"
              value={employee.gender}
              onChange={handleChange}
              error={Boolean(errors.gender)}
              helperText={errors.gender || " "}
              required
              fullWidth
              size="small"
            >
              <MenuItem value=""></MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Stack>

          <TextField
            name="password"
            type="password"
            label="Password"
            value={employee.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password || " "}
            required
            fullWidth
            size="small"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Close
        </Button>
        <Button
          variant="contained"
          onClick={() => void handleSave()}
          disabled={saving}
        >
          {saving ? "Saving..." : saveLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeAddEditDialog;
