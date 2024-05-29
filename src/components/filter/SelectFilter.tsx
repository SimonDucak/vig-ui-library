import {
  Box,
  Button,
  FormControlLabel,
  Popover,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { FilterFieldBase, FilterType } from "./Filters";
import { useState } from "react";
import { removeDiacritics } from "../../utils/string";
import { PopoverTriggerButton, StyledPopoverBody } from "./FieldPopover";

export type SelectOption<T> = {
  label: string;
  value: T;
};

export type SelectFilter<T> = FilterFieldBase & {
  type: FilterType.SELECT;
  options: SelectOption<T>[];
  onChange: (option: SelectOption<T> | null) => void;
  getValue: () => T | null;
};

export interface SelectFilterFieldProps<T> extends SelectFilter<T> {
  outlined?: boolean;
}

export const SelectFilterField = ({
  outlined,
  onChange,
  getValue,
  options,
  placeholder,
}: SelectFilterFieldProps<any>) => {
  const [search, setSearch] = useState("");

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const value = getValue();

  const selectedOption = options.find((option) => option.value === value);

  const theme = useTheme();

  const handleChange = (option: SelectOption<any> | null) => {
    onChange(option);
    setAnchorEl(null);
  };

  const filteredOptions = options.filter((option) => {
    const searchWithoutDia = removeDiacritics(search);
    const labelWithoutDia = removeDiacritics(option.label);
    return labelWithoutDia
      .toLowerCase()
      .includes(searchWithoutDia.toLowerCase());
  });

  return (
    <>
      <PopoverTriggerButton
        onClick={handleClick}
        placeholder={placeholder}
        value={selectedOption}
        outlined={outlined}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            minWidth: "240px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              padding: theme.spacing(1),
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <TextField
              label={placeholder}
              variant="filled"
              size="small"
              fullWidth
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Box>

          <StyledPopoverBody>
            {filteredOptions.map((option, index) => (
              <FormControlLabel
                key={index + 1}
                control={
                  <Radio
                    size="small"
                    checked={value === option.value}
                    value={option.value}
                    onChange={() => handleChange(option)}
                  />
                }
                label={option.label}
              />
            ))}
          </StyledPopoverBody>

          {!!value && (
            <Box padding={1} display="flex" justifyContent="flex-end">
              <Button
                onClick={() => handleChange(null)}
                size="small"
                color="secondary"
              >
                Vymazať
              </Button>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
};
