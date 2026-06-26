import React from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { Employee } from "../../../../shared/types/Employee";
import {
  employeeService,
  type EmployeeSearchInput,
} from "../employee.api";
import MenuActionLayout from "../../../shared/menu-action/MenuActionLayout";
import type { MenuActionComponentProps } from "../../../app/menu-action/menuActionRegistry";
import EmployeeAddEditDialog from "./EmployeeAddEditDialog";

const EmployeeAdminWindow: React.FC<MenuActionComponentProps> = () => {
  const lastNameInputRef = React.useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = React.useState<EmployeeSearchInput>({
    last_name: "",
    first_name: "",
  });
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] =
    React.useState<Employee | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<"add" | "edit">("edit");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [loadingEmployees, setLoadingEmployees] = React.useState(false);

  React.useEffect(() => {
    window.resizeTo(1120, 820);

    const frame = requestAnimationFrame(() => {
      lastNameInputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const loadEmployees = React.useCallback(
    async (input: EmployeeSearchInput = {}, showMessage = true) => {
      setLoadingEmployees(true);
      setError("");
      setMessage("");

      try {
        const results = await employeeService.searchEmployees(input);
        setEmployees(results);
        setSelectedEmployee(null);

        if (showMessage) {
          setMessage(`${results.length} employee(s) loaded.`);
        }

        return results;
      } catch (err) {
        console.error(err);
        setEmployees([]);
        setSelectedEmployee(null);
        setError(
          err instanceof Error ? err.message : "Unable to load employees.",
        );
        return [];
      } finally {
        setLoadingEmployees(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    void loadEmployees({}, false);
  }, [loadEmployees]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setSearchInput((prev) => ({ ...prev, [name]: value }));
    setSelectedEmployee(null);
    setError("");
    setMessage("");
  };

  const handleSearch = async () => {
    const normalizedInput = {
      last_name: searchInput.last_name?.trim() ?? "",
      first_name: searchInput.first_name?.trim() ?? "",
    };

    setSearching(true);

    try {
      const results = await loadEmployees(normalizedInput, false);
      const hasFilter = Boolean(
        normalizedInput.last_name || normalizedInput.first_name,
      );

      if (!results.length && hasFilter) {
        setError("No employees matched that search.");
        requestAnimationFrame(() => {
          lastNameInputRef.current?.focus();
        });
        return;
      }

      setMessage(`${results.length} employee(s) found.`);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Unable to search employees.",
      );
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    setSearchInput({ last_name: "", first_name: "" });
    void loadEmployees({}, false);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setDialogMode("add");
    setDialogOpen(true);
  };

  return (
    <MenuActionLayout
      title="Edit Employee"
      description="Search employees by first name and last name, then update employee information."
    >
      <Stack spacing={1.25} sx={{ height: "100%", minHeight: 0, pt: 0.5 }}>
        <Stack spacing={1} sx={{ flexShrink: 0 }}>
          <Box
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSearch();
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "220px 220px auto minmax(0, 1fr) auto",
                gap: 1,
                alignItems: "start",
              }}
            >
              <TextField
                inputRef={lastNameInputRef}
                fullWidth
                size="small"
                name="last_name"
                label="Last Name"
                value={searchInput.last_name}
                onChange={handleInputChange}
                helperText="Partial last name is OK."
                FormHelperTextProps={{ sx: { whiteSpace: "normal" } }}
              />
              <TextField
                fullWidth
                size="small"
                name="first_name"
                label="First Name"
                value={searchInput.first_name}
                onChange={handleInputChange}
                helperText="Partial first name is OK."
                FormHelperTextProps={{ sx: { whiteSpace: "normal" } }}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 0.25 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={searching || loadingEmployees}
                  sx={{ minWidth: 104 }}
                >
                  {searching ? "Searching..." : "Search"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  disabled={searching || loadingEmployees}
                  onClick={handleClear}
                >
                  Clear
                </Button>
              </Stack>
              <Box />
              <Button
                type="button"
                variant="contained"
                color="success"
                disabled={searching || loadingEmployees}
                onClick={handleAddEmployee}
                sx={{ mt: 0.25, justifySelf: "end" }}
              >
                Add Employee
              </Button>
            </Box>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}
          {message && <Alert severity="success">{message}</Alert>}
          {loadingEmployees && (
            <Alert severity="info">Loading employees...</Alert>
          )}
        </Stack>

        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", pr: 0.5 }}>
          {employees.length > 0 && (
            <Stack spacing={0.5}>
              {employees.map((employee) => (
                <Paper
                  key={employee.employee_number}
                  variant="outlined"
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto",
                    columnGap: 1,
                    alignItems: "center",
                    width: "100%",
                    px: 1,
                    py: 0.5,
                    bgcolor: "#eef6ff",
                    boxSizing: "border-box",
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700} noWrap>
                      {employee.first_name} {employee.last_name}
                      {employee.nickname
                        ? ` (${employee.nickname.toUpperCase()})`
                        : ""}
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "120px 120px 140px",
                        columnGap: 2,
                        color: "text.secondary",
                      }}
                    >
                      <Typography variant="caption" noWrap>
                        Employee #{employee.employee_number}
                      </Typography>
                      <Typography variant="caption" noWrap>
                        Gender: {employee.gender || "-"}
                      </Typography>
                      <Typography variant="caption" noWrap>
                        DOB: {employee.date_of_birth || "-"}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 64, justifySelf: "end" }}
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setDialogMode("edit");
                      setDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>

        <EmployeeAddEditDialog
          open={dialogOpen}
          mode={dialogMode}
          initialEmployee={selectedEmployee}
          onClose={() => setDialogOpen(false)}
          onSave={(savedEmployee) => {
            setSelectedEmployee(savedEmployee);
            setEmployees((prev) =>
              dialogMode === "add"
                ? [savedEmployee, ...prev]
                : prev.map((employee) =>
                    employee.employee_number === savedEmployee.employee_number
                      ? savedEmployee
                      : employee,
                  ),
            );
            setMessage(
              `Employee #${savedEmployee.employee_number} ${
                dialogMode === "add" ? "added" : "updated"
              }.`,
            );
          }}
        />
      </Stack>
    </MenuActionLayout>
  );
};

export default EmployeeAdminWindow;
