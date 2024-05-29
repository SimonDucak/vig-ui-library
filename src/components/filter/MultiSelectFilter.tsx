import {
  Box,
  Button,
  FormControlLabel,
  Popover,
  Checkbox,
  TextField,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { FilterFieldBase, FilterType } from "./Filters";
import { useState } from "react";
import { removeDiacritics } from "../../utils/string";
import { SelectOption } from "./SelectFilter";
import { PopoverTriggerButton, StyledPopoverBody } from "./FieldPopover";
import { MobileRoute } from "../MobileRoute";

export type MultiSelectFilter<T> = FilterFieldBase & {
  type: FilterType.MULTI_SELECT;
  options: SelectOption<T>[];
  onChange: (options: SelectOption<T>[]) => void;
  getValue: () => T[];
};

export interface MultiSelectFilterFieldProps<T> extends MultiSelectFilter<T> {
  outlined?: boolean;
}

function useMultiSelectHook<T>({
  onChange,
  getValue,
  options,
}: MultiSelectFilterFieldProps<T>) {
  const [search, setSearch] = useState("");

  const currentValue: T[] = getValue();

  const [localValue, setLocalValue] = useState<T[]>(getValue());

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const openPopover = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
    setLocalValue(currentValue);
  };

  const open = Boolean(anchorEl);

  const currentSelectedOptions = options.filter((option) =>
    currentValue.includes(option.value)
  );

  const handleChange = (option: SelectOption<T>) => {
    const alredySelected = localValue.includes(option.value);
    const newLocalValue = alredySelected
      ? localValue.filter((value) => value !== option.value)
      : [...localValue, option.value];
    setLocalValue(newLocalValue);
  };

  const applyFilter = () => {
    const newOptions = options.filter((option) =>
      localValue.includes(option.value)
    );
    onChange(newOptions);
    setAnchorEl(null);
  };

  const clearFilter = () => {
    setLocalValue([]);
    onChange([]);
    setAnchorEl(null);
  };

  const filteredOptions = options.filter((option) => {
    const searchWithoutDia = removeDiacritics(search);
    const labelWithoutDia = removeDiacritics(option.label);
    return labelWithoutDia
      .toLowerCase()
      .includes(searchWithoutDia.toLowerCase());
  });

  return {
    search,
    setSearch,
    localValue,
    setLocalValue,
    anchorEl,
    setAnchorEl,
    openPopover,
    closePopover,
    open,
    currentSelectedOptions,
    handleChange,
    clearFilter,
    applyFilter,
    filteredOptions,
  };
}

export function MultiSelectFilterField<T>(
  props: MultiSelectFilterFieldProps<T>
) {
  const theme = useTheme();

  const onlySmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (onlySmallScreen) {
    return <MobileMultiSelectFilterField {...props} />;
  }

  return <DesktopMultiSelectFilterField {...props} />;
}

function DesktopMultiSelectFilterField<T>(
  props: MultiSelectFilterFieldProps<T>
) {
  const theme = useTheme();

  const { outlined, placeholder } = props;

  const {
    search,
    setSearch,
    localValue,
    anchorEl,
    openPopover,
    closePopover,
    open,
    currentSelectedOptions,
    handleChange,
    clearFilter,
    applyFilter,
    filteredOptions,
  } = useMultiSelectHook(props);

  return (
    <>
      <PopoverTriggerButton
        onClick={openPopover}
        placeholder={placeholder}
        value={currentSelectedOptions}
        outlined={outlined}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ minWidth: "240px" }}>
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
            <CheckboxesGroup
              options={filteredOptions}
              localValue={localValue}
              handleChange={handleChange}
            />
          </StyledPopoverBody>

          <Box padding={1} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={applyFilter} size="small">
              Použiť
            </Button>

            <Button onClick={clearFilter} size="small" color="secondary">
              Vymazať
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}

function MobileMultiSelectFilterField<T>(
  props: MultiSelectFilterFieldProps<T>
) {
  const [expanded, setExpanded] = useState(false);

  const { placeholder, options } = props;

  const { localValue, handleChange, filteredOptions } =
    useMultiSelectHook(props);

  const limit = 6;

  const slicedOptions = options.slice(0, limit);

  const restOptions = options.slice(limit);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: (theme) => theme.spacing(2),
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="subtitle2">{placeholder}</Typography>

      <CheckboxesGroup
        options={slicedOptions}
        localValue={localValue}
        handleChange={handleChange}
        wrappedLayout={true}
      />

      {restOptions.length > 0 && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography
            variant="body2"
            p={1}
            onClick={() => setExpanded(true)}
            color="primary"
          >
            <strong>
              <u>Ďalšie možnosti ({restOptions.length})</u>
            </strong>
          </Typography>
        </Box>
      )}

      {expanded && (
        <MobileRoute title={placeholder} onClose={() => setExpanded(false)}>
          <Box p={2}>
            <CheckboxesGroup
              options={filteredOptions}
              localValue={localValue}
              handleChange={handleChange}
            />
          </Box>
        </MobileRoute>
      )}
    </Box>
  );
}

type CheckboxesGroupProps<T> = {
  options: SelectOption<T>[];
  localValue: T[];
  handleChange: (option: SelectOption<T>) => void;
  wrappedLayout?: boolean;
};

function CheckboxesGroup<T>({
  options,
  localValue,
  handleChange,
  wrappedLayout,
}: CheckboxesGroupProps<T>) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        ...(wrappedLayout && {
          flexWrap: "wrap",
          flexDirection: "row",
          gap: 0.2,
        }),
      }}
    >
      {options.map((option, index) => {
        return (
          <FormControlLabel
            key={index + 1}
            control={
              <Checkbox
                size="small"
                checked={localValue.includes(option.value)}
                value={option.value}
                onChange={() => handleChange(option)}
              />
            }
            label={option.label}
          />
        );
      })}
    </Box>
  );
}