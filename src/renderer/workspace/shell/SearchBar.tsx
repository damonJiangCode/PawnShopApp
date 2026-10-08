import {
  normalizeClientLookup,
  type ClientLookup,
} from "../../../shared/utils/clientLookup";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

interface SearchBarProps {
  onSearch?: (params: { firstName: string; lastName: string }) => void;
  onBirthdaySearch?: (params: { dateOfBirth: string }) => void;
  onLookupSearch?: (lookup: ClientLookup) => void;
  onClear?: () => void;
}

const uppercaseSearchName = (value: string) => value.toUpperCase();

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onBirthdaySearch,
  onLookupSearch,
  onClear,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [lookupKind, setLookupKind] = useState<ClientLookup["kind"] | null>(
    null,
  );
  const [lookupValue, setLookupValue] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [birthdayDialogOpen, setBirthdayDialogOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const validationTargetRef = useRef<"name" | "birthday">("name");
  const lastNameInputRef = useRef<HTMLInputElement>(null);
  const birthdayInputRef = useRef<HTMLInputElement>(null);
  const lookupInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      lastNameInputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName && !trimmedLastName) {
      validationTargetRef.current = "name";
      setValidationMessage("Please enter a first name or last name to search.");
      return;
    }

    onSearch?.({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
    });
    requestAnimationFrame(() => {
      lastNameInputRef.current?.focus();
      lastNameInputRef.current?.select();
    });
  };

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setBirthday("");
    setLookupValue("");
    setLookupError("");
    onClear?.();
    requestAnimationFrame(() => {
      lastNameInputRef.current?.focus();
    });
  };

  const handleOpenBirthdayDialog = () => {
    setMenuAnchor(null);
    setBirthdayDialogOpen(true);
    requestAnimationFrame(() => {
      birthdayInputRef.current?.focus();
    });
  };

  const handleBirthdaySearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!birthday) {
      validationTargetRef.current = "birthday";
      setValidationMessage("Please enter a birthday to search.");
      return;
    }

    setFirstName("");
    setLastName("");
    setBirthdayDialogOpen(false);
    onBirthdaySearch?.({ dateOfBirth: birthday });
  };

  const closeValidationDialog = () => {
    const target = validationTargetRef.current;
    setValidationMessage("");
    requestAnimationFrame(() => {
      if (target === "birthday") {
        birthdayInputRef.current?.focus();
      } else {
        lastNameInputRef.current?.focus();
      }
    });
  };

  const openLookup = (kind: ClientLookup["kind"]) => {
    setMenuAnchor(null);
    setLookupKind(kind);
    setLookupValue("");
    setLookupError("");
  };

  const handleLookupSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lookupKind) return;
    const lookup = normalizeClientLookup({
      kind: lookupKind,
      value: lookupValue,
    });
    if (!lookup.value) {
      setLookupError(
        lookupKind === "id"
          ? "Enter an ID containing letters or numbers."
          : "Enter a phone number containing digits.",
      );
      return;
    }
    setFirstName("");
    setLastName("");
    setBirthday("");
    setLookupKind(null);
    onLookupSearch?.(lookup);
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ flex: "1 1 auto", minWidth: 0 }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <TextField
            inputRef={lastNameInputRef}
            name="lastName"
            size="small"
            label="Last Name"
            value={lastName}
            sx={{ width: { xs: 140, sm: 170, md: 190 } }}
            onChange={(e) => setLastName(uppercaseSearchName(e.target.value))}
          />
          <TextField
            name="firstName"
            size="small"
            label="First Name"
            value={firstName}
            sx={{ width: { xs: 140, sm: 170, md: 190 } }}
            onChange={(e) => setFirstName(uppercaseSearchName(e.target.value))}
          />

          <Button
            type="submit"
            size="small"
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{ whiteSpace: "nowrap" }}
          >
            Search
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            sx={{ whiteSpace: "nowrap" }}
          >
            Clear
          </Button>

          <Tooltip title="More search options">
            <IconButton
              size="small"
              aria-label="More search options"
              aria-controls={menuAnchor ? "client-search-menu" : undefined}
              aria-haspopup="menu"
              aria-expanded={menuAnchor ? "true" : undefined}
              onClick={(event) => setMenuAnchor(event.currentTarget)}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                width: 34,
                height: 34,
              }}
            >
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Menu
        id="client-search-menu"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={handleOpenBirthdayDialog}>
          <ListItemIcon>
            <CakeOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Search by Birthday</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openLookup("id")}>
          <ListItemIcon>
            <BadgeOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Search by ID</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openLookup("phone")}>
          <ListItemIcon>
            <PhoneOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Search by Phone Number</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={lookupKind !== null}
        onClose={() => setLookupKind(null)}
        TransitionProps={{ onEntered: () => lookupInputRef.current?.focus() }}
        fullWidth
        maxWidth="xs"
      >
        <form onSubmit={handleLookupSearch}>
          <DialogTitle>
            Search by {lookupKind === "id" ? "ID" : "Phone Number"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              inputRef={lookupInputRef}
              fullWidth
              margin="dense"
              type={lookupKind === "phone" ? "tel" : "text"}
              label={lookupKind === "id" ? "ID number" : "Phone number"}
              value={lookupValue}
              onChange={(event) => {
                setLookupValue(event.target.value);
                setLookupError("");
              }}
              error={Boolean(lookupError)}
              helperText={
                lookupError ||
                (lookupKind === "id"
                  ? "Enter the full ID. Searches all ID types; ignores case, spaces and punctuation."
                  : "Enter the full phone number, including any stored country code. Formatting is ignored.")
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLookupKind(null)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={birthdayDialogOpen}
        onClose={() => setBirthdayDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <form onSubmit={handleBirthdaySearch}>
          <DialogTitle>Search by Birthday</DialogTitle>
          <DialogContent>
            <TextField
              inputRef={birthdayInputRef}
              type="date"
              label="Birthday"
              value={birthday}
              fullWidth
              margin="dense"
              onChange={(event) => setBirthday(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBirthdayDialogOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={Boolean(validationMessage)}
        onClose={closeValidationDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Search</DialogTitle>
        <DialogContent>{validationMessage}</DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={closeValidationDialog}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SearchBar;
